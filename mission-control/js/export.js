/**
 * export.js — 把刷卡结果写回成台账 Markdown
 *
 * 目标：格式和他手写的一模一样，直接贴回
 * `zixue2026/<学科>/memory/drill-ledger/topics/topicNN-*.md` 就能用。
 * 口径锁死：S 保留 1 位小数、D 是 1–5、日期 YYYY-MM-DD、history 逗号分隔。
 */

import { GRADE_LABEL } from "./scheduler.js";

const pad = (v, n) => String(v).padEnd(n);

/** 一张卡渲染成一行表格。列宽按内容自适应，保证竖线对齐。 */
export function renderCardRow(c, widths) {
  const cells = [
    c.card_id || "",
    c.concept || "",
    fmtS(c.s),
    fmtD(c.d),
    c.last || "",
    c.due || "",
    (c.flags || []).join(","),
    c.history || "",
  ];
  return "| " + cells.map((v, i) => pad(v, widths[i])).join(" | ") + " |";
}

const fmtS = (v) => (v == null || Number.isNaN(Number(v)) ? "" : Number(v).toFixed(1));
const fmtD = (v) => (v == null || Number.isNaN(Number(v)) ? "" : String(Number(v).toFixed(1)).replace(/\.0$/, ""));

const HEADER = ["#", "concept", "S(days)", "D(1-5)", "last", "due", "flags", "history"];

/** 一个课题的完整卡片表。 */
export function renderTopicTable(cards) {
  const rows = cards.map((c) => [
    c.card_id || "",
    c.concept || "",
    fmtS(c.s),
    fmtD(c.d),
    c.last || "",
    c.due || "",
    (c.flags || []).join(","),
    c.history || "",
  ]);
  const widths = HEADER.map((h, i) =>
    Math.max(displayWidth(h), ...rows.map((r) => displayWidth(r[i])))
  );
  const line = (cells) => "| " + cells.map((v, i) => pad(v, widths[i] + displayWidth(v) - displayWidth(v))).join(" | ") + " |";

  const out = [];
  out.push("| " + HEADER.map((h, i) => pad(h, widths[i])).join(" | ") + " |");
  out.push("|" + widths.map((w) => "-".repeat(w + 2)).join("|") + "|");
  for (const r of rows) out.push("| " + r.map((v, i) => pad(v, widths[i])).join(" | ") + " |");
  return out.join("\n");
}

/** 中日韩字符按 2 个显示宽度算，否则竖线对不齐。 */
export function displayWidth(s) {
  let w = 0;
  for (const ch of String(s ?? "")) {
    const cp = ch.codePointAt(0);
    w +=
      (cp >= 0x1100 && cp <= 0x115f) ||
      (cp >= 0x2e80 && cp <= 0xa4cf) ||
      (cp >= 0xac00 && cp <= 0xd7a3) ||
      (cp >= 0xf900 && cp <= 0xfaff) ||
      (cp >= 0xfe30 && cp <= 0xfe6f) ||
      (cp >= 0xff00 && cp <= 0xff60) ||
      (cp >= 0xffe0 && cp <= 0xffe6)
        ? 2
        : 1;
  }
  return w;
}

/**
 * 生成本轮回写的 Markdown。
 * @param {Array} reviewed 本轮刷过的卡（含 review 之后的 s/d/last/due/flags/history）
 * @param {object} meta { asOf, ref, sourceRepo }
 */
export function buildWriteback(reviewed, meta = {}) {
  if (!reviewed.length) return "（本轮还没有刷卡记录）";

  const byFile = new Map();
  for (const c of reviewed) {
    if (!byFile.has(c.src)) byFile.set(c.src, []);
    byFile.get(c.src).push(c);
  }

  const L = [];
  L.push("<!-- 由「指挥舱」生成 · 刷卡回写 -->");
  L.push(`<!-- 基准日 ${meta.asOf || "?"} · 源仓 ${meta.sourceRepo || "sunccchengze/zixue2026"} · ${meta.ref || "本地快照"} -->`);
  L.push(`<!-- 共 ${reviewed.length} 张卡 / ${byFile.size} 个账本文件 · 调度器 FSRS-4.5 -->`);
  L.push("");
  L.push("> 用法：把每个文件对应的表格整段替换回原文件的 `## Cards` 小节。");
  L.push("> 只动了刷过的行；没刷的卡不在下面，别整表覆盖。");
  L.push("");

  for (const [src, cards] of byFile) {
    L.push("---");
    L.push("");
    L.push(`### \`${src}\``);
    L.push("");
    L.push(renderTopicTable(cards));
    L.push("");
  }

  L.push("---");
  L.push("");
  L.push("## 本轮明细");
  L.push("");
  L.push("| 卡 | 评分 | S 旧→新 | D 旧→新 | due 旧→新 | R |");
  L.push("|---|---|---|---|---|---|");
  for (const c of reviewed) {
    L.push(
      `| ${c.concept.slice(0, 34)}${c.concept.length > 34 ? "…" : ""} ` +
        `| ${GRADE_LABEL[c.lastGrade] || "?"} ` +
        `| ${fmtS(c.prevS)}→${fmtS(c.s)} ` +
        `| ${fmtD(c.prevD)}→${fmtD(c.d)} ` +
        `| ${c.prevDue || "—"}→${c.due} ` +
        `| ${c.retrievability ?? "—"} |`
    );
  }
  L.push("");
  return L.join("\n");
}

/** 触发浏览器下载。 */
export function download(filename, text) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
