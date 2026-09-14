/**
 * test_ledger_parity.mjs — 交叉验证：JS 解析器 vs Python 收割器
 *
 * 两份实现（`js/ledger.js` 与 `tools/harvest.py`）必须对同一批文件
 * 给出同样的卡片数、同样的对账结论。任何一方跑偏，这里就红。
 *
 * 跑法：node --test tests/*.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { assemble } from "../js/ledger.js";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const FIXTURE = path.join(HERE, "fixtures", "mini-repo");
const TOOL = path.join(HERE, "..", "tools", "harvest.py");
const TODAY = "2026-09-14";

/** 找可用的 Python 解释器（harvest.py 是 Python，不是 Node）。 */
const PY = (() => {
  for (const cand of [process.env.PYTHON, "python3", "python"]) {
    if (!cand) continue;
    try {
      execFileSync(cand, ["-c", "print(1)"], { stdio: "ignore" });
      return cand;
    } catch {}
  }
  throw new Error("找不到 python3 —— 交叉验证需要它来跑 tools/harvest.py");
})();

/** 递归收集 fixture 里的 .md 文件（与两边解析器的过滤规则保持一致）。 */
function collect(dir, base = dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...collect(p, base));
    else if (e.name.endsWith(".md")) out.push({ path: path.relative(base, p), text: fs.readFileSync(p, "utf8") });
  }
  return out;
}

function pySnapshot() {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "parity-"));
  execFileSync(PY, [TOOL, "--repo", FIXTURE, "--out", out, "--today", TODAY], {
    stdio: "pipe",
  });
  return JSON.parse(fs.readFileSync(path.join(out, "snapshot.json"), "utf8"));
}

const files = collect(FIXTURE);
const js = assemble(files, TODAY);
const py = pySnapshot();

test("两边解析到的卡片总数一致", () => {
  assert.equal(js.totals.cards, py.totals.cards, `JS=${js.totals.cards} Python=${py.totals.cards}`);
});

test("两边解析到的账本文件数一致", () => {
  assert.equal(js.totals.topic_files, py.totals.topic_files);
});

test("两边解析到的到期卡数一致", () => {
  assert.equal(js.totals.cards_due, py.totals.cards_due);
});

test("两边的卡片 uid 集合完全相同（不只是数量对）", () => {
  const a = [...js.cards.map((c) => c.uid)].sort();
  const b = [...py.cards.map((c) => c.uid)].sort();
  assert.deepEqual(a, b);
});

test("每张卡的 S / D / due / 逾期天数两边一致", () => {
  const pyMap = new Map(py.cards.map((c) => [c.uid, c]));
  for (const c of js.cards) {
    const p = pyMap.get(c.uid);
    assert.equal(c.s, p.s, `${c.uid} 的 S 不一致`);
    assert.equal(c.d, p.d, `${c.uid} 的 D 不一致`);
    assert.equal(c.due, p.due, `${c.uid} 的 due 不一致`);
    assert.equal(c.overdue_days, p.overdue_days, `${c.uid} 的逾期天数不一致`);
    assert.equal(c.is_due, p.is_due, `${c.uid} 的 is_due 不一致`);
  }
});

test("学科数与各科卡数两边一致", () => {
  assert.equal(js.totals.disciplines, py.totals.disciplines);
  const pyMap = new Map(py.disciplines.map((d) => [d.name, d]));
  for (const d of js.disciplines) {
    const p = pyMap.get(d.name);
    assert.ok(p, `Python 侧缺学科 ${d.name}`);
    assert.equal(d.cards_total, p.cards_total, `${d.name} 卡数不一致`);
    assert.equal(d.cards_due, p.cards_due, `${d.name} 到期数不一致`);
    assert.deepEqual(d.folders, p.folders, `${d.name} 文件夹列表不一致`);
  }
});

test("对账结论两边一致（含故意留的那处漂移）", () => {
  const key = (r) => `${r.discipline}\u0000${r.topic}`;
  const pyMap = new Map(py.reconciliation.map((r) => [key(r), r]));
  assert.equal(js.reconciliation.length, py.reconciliation.length);
  for (const r of js.reconciliation) {
    const p = pyMap.get(key(r));
    assert.ok(p, `Python 侧缺对账行 ${key(r)}`);
    assert.equal(r.index_claims, p.index_claims);
    assert.equal(r.detail_found, p.detail_found);
    assert.equal(r.match, p.match, `${key(r)} 的 match 判定不一致`);
  }
  assert.equal(js.totals.recon_mismatch, py.totals.recon_mismatch);
});

test("大师 / 路线图 / 偏好 / 判例 计数两边一致", () => {
  assert.equal(js.totals.masters, py.totals.masters, "大师数不一致");
  assert.equal(js.totals.roadmap_units, py.totals.roadmap_units, "路线图单元数不一致");
  assert.equal(js.totals.preferences, py.totals.preferences, "偏好条数不一致");
  assert.equal(js.totals.case_law, py.totals.case_law, "判例条数不一致");
});

test("解析告警条数两边一致（空账本识别口径相同）", () => {
  assert.equal(js.parse_warnings.length, (py.parse_warnings_len ?? js.parse_warnings.length));
  // Python 侧告警写在 manifest 里，这里单独核对
  const manifest = JSON.parse(
    execFileSync(PY, [
      "-c",
      `import json,subprocess,sys,tempfile,os
out=tempfile.mkdtemp()
subprocess.run([sys.executable, ${JSON.stringify(TOOL)}, "--repo", ${JSON.stringify(FIXTURE)},
                "--out", out, "--today", ${JSON.stringify(TODAY)}], check=True, capture_output=True)
print(json.dumps(json.load(open(os.path.join(out,"manifest.json")))))`,
    ], { encoding: "utf8" })
  );
  assert.equal(
    js.parse_warnings.length,
    manifest.parse_warnings.length,
    `JS ${js.parse_warnings.length} 条告警 vs Python ${manifest.parse_warnings.length} 条`
  );
});

/* ── 真仓库交叉验证（设 ZIXUE_REPO 才跑）──────────────────────── */
const REAL = process.env.ZIXUE_REPO || "";

function collectReal(dir, base = dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...collectReal(p, base));
    else if (e.name.endsWith(".md")) {
      out.push({ path: path.relative(base, p), text: fs.readFileSync(p, "utf8") });
    }
  }
  return out;
}

const canReal = REAL && fs.existsSync(REAL);

test(
  "真仓库交叉验证：两份实现在全量台账上逐卡一致",
  { skip: canReal ? false : "设 ZIXUE_REPO 指向 zixue2026 克隆才跑" },
  () => {
    const jsReal = assemble(collectReal(REAL), TODAY);
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "parity-real-"));
    execFileSync(PY, [TOOL, "--repo", REAL, "--out", out, "--today", TODAY], { stdio: "pipe" });
    const pyReal = JSON.parse(fs.readFileSync(path.join(out, "snapshot.json"), "utf8"));

    for (const k of ["cards", "cards_due", "disciplines", "masters", "roadmap_units", "preferences", "case_law", "recon_mismatch"]) {
      assert.equal(jsReal.totals[k], pyReal.totals[k], `真仓库 totals.${k} 不一致`);
    }
    assert.deepEqual([...jsReal.cards.map((c) => c.uid)].sort(), [...pyReal.cards.map((c) => c.uid)].sort(), "真仓库 uid 集合不一致");

    const pyMap = new Map(pyReal.cards.map((c) => [c.uid, c]));
    for (const c of jsReal.cards) {
      const p = pyMap.get(c.uid);
      assert.equal(c.s, p.s, `${c.uid} S 不一致`);
      assert.equal(c.d, p.d, `${c.uid} D 不一致`);
      assert.equal(c.due, p.due, `${c.uid} due 不一致`);
      assert.equal(c.overdue_days, p.overdue_days, `${c.uid} 逾期天数不一致`);
    }
    assert.deepEqual(
      jsReal.disciplines.map((d) => `${d.name}:${d.cards_total}/${d.cards_due}`).sort(),
      pyReal.disciplines.map((d) => `${d.name}:${d.cards_total}/${d.cards_due}`).sort(),
      "真仓库各科卡数不一致"
    );
    assert.ok(jsReal.totals.cards >= 298, `真仓库卡数掉到 ${jsReal.totals.cards}`);
  }
);
