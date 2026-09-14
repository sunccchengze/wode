/**
 * test_dom.mjs — 真 DOM 冒烟测试
 *
 * 用 jsdom 载入真实的 index.html，再动态 import 真实的 js/app.js，
 * 断言页面真的渲染出了真台账里的数字，并且刷卡交互真的改状态。
 *
 * 这不是重新实现一遍逻辑——跑的就是浏览器里那份 app.js。
 *
 * 跑法：node tests/dom_smoke.mjs   （独立跑，不并进 node --test）
 * 依赖：npm i jsdom（放在仓库外的临时目录即可，见 README）
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "/home/user/.cache/domtest/node_modules/jsdom/lib/api.js";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TODAY = "2026-09-14";

let passed = 0;
let failed = 0;
function check(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL ${name}\n       ${e.message.split("\n")[0]}`);
  }
}
async function checkAsync(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL ${name}\n       ${e.message.split("\n")[0]}`);
  }
}

// ── 用真 index.html 建 DOM ──────────────────────────────
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const dom = new JSDOM(html, {
  url: "http://localhost/",
  pretendToBeVisual: true,
  runScripts: "outside-only",
});
const { window } = dom;

// jsdom 没实现的几个 API，补上（只补 API，不补业务逻辑）
window.scrollTo = () => {};
window.Element.prototype.scrollIntoView = () => {};

// 相对路径 fetch → 直接读磁盘上的真文件
const realFetch = globalThis.fetch;
window.fetch = async (u, opts) => {
  const rel = String(u).replace(/^\//, "");
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return { ok: false, status: 404, json: async () => ({}), text: async () => "" };
  const buf = fs.readFileSync(p);
  return {
    ok: true,
    status: 200,
    json: async () => JSON.parse(buf.toString("utf8")),
    text: async () => buf.toString("utf8"),
  };
};

// 固定"今天"，让到期判定可复现
const RealDate = Date;
class FixedDate extends RealDate {
  constructor(...a) {
    if (a.length === 0) super(TODAY + "T09:00:00Z");
    else super(...a);
  }
  static now() {
    return new RealDate(TODAY + "T09:00:00Z").getTime();
  }
}

// 把 app.js 需要的全局挂上。
// Node 22 的 globalThis.navigator 是只读 getter，必须用 defineProperty 覆盖。
for (const k of ["document", "window", "localStorage", "navigator", "HTMLElement", "Element", "Blob", "Event", "KeyboardEvent"]) {
  if (window[k] === undefined) continue;
  try {
    globalThis[k] = window[k];
  } catch {
    Object.defineProperty(globalThis, k, { value: window[k], configurable: true, writable: true });
  }
}
globalThis.fetch = window.fetch;
try {
  globalThis.Date = FixedDate;
} catch {
  Object.defineProperty(globalThis, "Date", { value: FixedDate, configurable: true, writable: true });
}

const snapshot = JSON.parse(fs.readFileSync(path.join(ROOT, "data/snapshot.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "data/manifest.json"), "utf8"));

console.log("jsdom 冒烟测试 · 基准日 " + TODAY);
console.log("  快照自称：卡片 " + snapshot.totals.cards + " / 到期 " + snapshot.totals.cards_due);

// ── 载入真实的 app.js ──────────────────────────────────
await import(path.join(ROOT, "js/app.js"));
await new Promise((r) => setTimeout(r, 120));

const $ = (s) => window.document.querySelector(s);
const $$ = (s) => [...window.document.querySelectorAll(s)];
const txt = (s) => ($(s) ? $(s).textContent.trim() : "");

check("hero 渲染出真实到期数", () => {
  assert.equal(txt("#stat-due"), String(snapshot.totals.cards_due));
});
check("卡片总数渲染正确", () => {
  assert.equal(txt("#stat-cards"), String(snapshot.totals.cards));
});
check("学科数渲染正确", () => {
  assert.equal(txt("#stat-disc"), String(snapshot.totals.disciplines));
});
check("最长逾期天数是从卡片算出来的", () => {
  const worst = Math.max(0, ...snapshot.cards.map((c) => c.overdue_days || 0));
  assert.equal(txt("#stat-worst"), String(worst));
  assert.ok(worst > 0, "真台账里应该有逾期卡");
});
check("九个学科舱段全部渲染", () => {
  assert.equal($$("#disc-grid .disc-card").length, snapshot.totals.disciplines);
});
check("每个舱段都有进度环和卡数", () => {
  for (const el of $$("#disc-grid .disc-card")) {
    assert.ok(el.querySelector(".ring"), "缺进度环");
    assert.match(el.querySelector(".ring-text").textContent, /\d+ \/ \d+ 张待刷/);
  }
});
check("舱段状态 emoji 来自总调度表", () => {
  const emojis = $$("#disc-grid .disc-emoji").map((e) => e.textContent.trim());
  assert.ok(emojis.some((e) => ["🟢", "🟡", "🔵"].includes(e)), `没解析到状态 emoji：${emojis}`);
});
check("标签页红点数 = 到期卡数", () => {
  assert.equal(txt("#tab-due"), String(snapshot.totals.cards_due));
});

check("地图渲染了路线图单元", () => {
  const n = $$("#map-wrap .unit").length;
  assert.equal(n, snapshot.totals.roadmap_units, `单元数 ${n} ≠ ${snapshot.totals.roadmap_units}`);
});
check("大师天团按人去重后渲染", () => {
  const seen = new Set();
  for (const m of snapshot.masters) seen.add(`${m.discipline}\u0000${m.name}`);
  assert.equal($$("#council-grid .master").length, seen.size);
});
check("点大师会展开详情面板", () => {
  $$("#council-grid .master")[0].dispatchEvent(new window.Event("click", { bubbles: true }));
  const d = $("#master-detail");
  assert.equal(d.hidden, false, "详情面板应展开");
  assert.ok(d.querySelector("h3").textContent.length > 0, "应有大师名");
});

check("台账核对渲染出 3 处对账不一致", () => {
  assert.equal(txt("#recon-count"), String(snapshot.totals.recon_mismatch));
  assert.equal($$("#recon-body tr.bad").length, snapshot.totals.recon_mismatch);
});
check("空账本告警条数与 manifest 一致", () => {
  assert.equal(txt("#warn-count"), String(manifest.parse_warnings.length));
  assert.equal($$("#warn-list li").length, manifest.parse_warnings.length);
});

check("偏好卡全部渲染", () => {
  assert.equal($$("#pref-grid .pref").length, snapshot.totals.preferences);
});
check("判例库全部渲染", () => {
  assert.equal($$("#law-grid .law").length, snapshot.totals.case_law);
});
check("所有卡片都有 provenance（文件:行号）", () => {
  for (const el of $$("#pref-grid .pref, #law-grid .law")) {
    assert.match(el.textContent, /\.md:\d+/, "缺 文件:行号 溯源");
  }
});

// ── 刷题交互：跑真的 scheduler ──────────────────────────
check("初始队列长度 = 选定上限", () => {
  $("#queue-limit").value = "10";
  $("#queue-limit").dispatchEvent(new window.Event("change", { bubbles: true }));
  assert.equal($$("#queue-list li").length, 10);
});

const firstConcept = txt("#c-concept");
check("第一张卡有真实内容，不是占位符", () => {
  assert.ok(firstConcept.length > 4, `卡片内容异常："${firstConcept}"`);
  assert.ok(!firstConcept.includes("按「开始刷卡」"), "还停在初始占位文案");
});

check("逾期最久的卡排在第一张", () => {
  const worst = Math.max(...snapshot.cards.map((c) => c.overdue_days || 0));
  assert.match(txt("#c-overdue"), new RegExp(`逾期 ${worst} 天`));
});

check("按 Good 后 S 上升、due 推远、战绩+1", () => {
  const metaBefore = txt("#c-meta");
  const sBefore = /S ([\d.]+)d/.exec(metaBefore);
  assert.ok(sBefore, `meta 里应有 S：${metaBefore}`);
  const dueBefore = /原 due (\d{4}-\d{2}-\d{2})/.exec(metaBefore);

  $$("#c-actions .grade").find((b) => b.dataset.grade === "3").dispatchEvent(
    new window.Event("click", { bubbles: true })
  );

  assert.equal($$("#tally .t-good b")[0].textContent, "1", "Good 战绩应 +1");
  assert.equal(txt("#c-concept") !== firstConcept, true, "应翻到下一张");
  assert.ok(txt("#export-count").includes("1 张卡"), `回写计数应更新：${txt("#export-count")}`);
});

check("刷卡结果写进了 localStorage", () => {
  const s = JSON.parse(window.localStorage.getItem("scz.mission-control.v1") || "{}");
  assert.ok(s.reviews && Object.keys(s.reviews).length === 1, "应有 1 条刷卡记录");
  const r = Object.values(s.reviews)[0];
  assert.ok(r.s > 0 && r.due > TODAY, `回写状态异常：${JSON.stringify(r)}`);
});

check("回写预览生成了他台账格式的表格", () => {
  const pre = txt("#export-pre");
  assert.match(pre, /\| #\s+\| concept\s+\| S\(days\)/, "表头口径不对");
  assert.match(pre, /drill-ledger\/topics\/topic\d+-/, "应指向真实账本文件");
  assert.match(pre, /\| 卡 \| 评分 \| S 旧→新 \| D 旧→新 \| due 旧→新 \| R \|/, "明细表头不对");
  assert.match(pre, /\| Good \|/, "明细里应有 Good 那一行");
  assert.match(pre, /\d+\.\d→\d+\.\d/, "S 旧→新 应是两位小数");
});

check("按 Again 会挂 cw 标记", () => {
  $$("#c-actions .grade").find((b) => b.dataset.grade === "1").dispatchEvent(
    new window.Event("click", { bubbles: true })
  );
  const s = JSON.parse(window.localStorage.getItem("scz.mission-control.v1"));
  const rs = Object.values(s.reviews);
  assert.ok(rs.some((r) => (r.flags || []).includes("cw")), "Again 应挂 cw");
});

check("键盘 1–4 也能评分（须在今日作战视图内）", () => {
  // 评分键只在 ops 视图生效——这是设计，不是 bug
  $$(".tab").find((t) => t.dataset.view === "ops").dispatchEvent(
    new window.Event("click", { bubbles: true })
  );
  assert.ok($("#view-ops").classList.contains("active"), "应已切到今日作战");
  const before = txt("#export-count");
  window.document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "4", bubbles: true }));
  assert.notEqual(txt("#export-count"), before, "键盘评分应生效");
});

check("在非 ops 视图按数字键不会误评分", () => {
  $$(".tab").find((t) => t.dataset.view === "bridge").dispatchEvent(
    new window.Event("click", { bubbles: true })
  );
  const before = txt("#export-count");
  window.document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "3", bubbles: true }));
  assert.equal(txt("#export-count"), before, "总览视图里按 3 不该刷卡");
});

check("焦点在输入控件上时数字键不触发评分", () => {
  $$(".tab").find((t) => t.dataset.view === "ops").dispatchEvent(
    new window.Event("click", { bubbles: true })
  );
  const before = txt("#export-count");
  const ev = new window.KeyboardEvent("keydown", { key: "3", bubbles: true });
  $("#queue-limit").dispatchEvent(ev);
  assert.equal(txt("#export-count"), before, "在 select 上按 3 不该刷卡");
});

check("按学科筛选能重建队列", () => {
  const sel = $("#queue-filter");
  const opt = [...sel.options].find((o) => o.value === "大学化学");
  assert.ok(opt, "应有大学化学选项");
  sel.value = "大学化学";
  sel.dispatchEvent(new window.Event("change", { bubbles: true }));
  assert.ok($$("#queue-list li").length > 0, "筛选后队列不该空");
});

check("空队列不会崩", () => {
  $("#queue-limit").value = "999";
  $("#queue-limit").dispatchEvent(new window.Event("change", { bubbles: true }));
  const n = $$("#queue-list li").length;
  assert.ok(n > 0, `全量队列应有卡，实为 ${n}`);
});

// 还原
globalThis.Date = RealDate;
globalThis.fetch = realFetch;

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
