/**
 * app.js — 指挥舱主程序
 *
 * 数据流：data/snapshot.json（离线收割）或 GitHub 实时同步
 *        → 渲染六个视图 → 刷卡走 scheduler.js → localStorage 存档
 *        → 需要时导出 Markdown 回写台账
 */

import {
  GRADE,
  GRADE_LABEL,
  buildQueue,
  daysBetween,
  isDue,
  review,
} from "./scheduler.js";
import { sync as ghSync, REPO } from "./gh.js";
import { buildWriteback, download } from "./export.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const STORE_KEY = "scz.mission-control.v1";
const today = new Date().toISOString().slice(0, 10);

let SNAP = null;          // 当前台账快照
let CARDS = [];           // 卡（已叠加本地刷卡结果）
let QUEUE = [];           // 本轮队列
let QI = 0;               // 队列游标
let REVIEWED = [];        // 本轮刷过的卡
let TALLY = { 1: 0, 2: 0, 3: 0, 4: 0 };

/* ───────────────────────── 本地存档 ───────────────────────── */

function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveStore(patch) {
  const s = { ...loadStore(), ...patch };
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
  return s;
}

/** 把本地刷过的结果叠加回快照卡片。 */
function applyLocal() {
  const done = loadStore().reviews || {};
  CARDS = SNAP.cards.map((c) => (done[c.uid] ? { ...c, ...done[c.uid] } : { ...c }));
}

function toast(msg, isErr = false) {
  const el = $("#toast");
  el.textContent = msg;
  el.className = "toast show" + (isErr ? " err" : "");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (el.className = "toast"), 3600);
}

/* ───────────────────────── 视图切换 ───────────────────────── */

function showView(name) {
  $$(".tab").forEach((t) => {
    const on = t.dataset.view === name;
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", String(on));
  });
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ───────────────────────── 总览 ───────────────────────── */

function ring(pct, color) {
  const R = 26;
  const C = 2 * Math.PI * R;
  const off = C * (1 - Math.max(0, Math.min(1, pct)));
  return `<svg class="ring" viewBox="0 0 64 64" style="--accent:${color}" aria-hidden="true">
    <circle class="bg" cx="32" cy="32" r="${R}"/>
    <circle class="fg" cx="32" cy="32" r="${R}" stroke-dasharray="${C.toFixed(1)}"
      stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 32 32)"/></svg>`;
}

const ACCENTS = ["#46d9d0", "#5aa9ff", "#f5b544", "#5dd39e", "#c792ea", "#ff8f6b", "#67e8f9", "#a3e635", "#f472b6"];

function renderBridge() {
  const t = SNAP.totals;
  $("#as-of").textContent = SNAP.as_of;
  $("#src-repo").textContent = SNAP.source_repo + (SNAP.sync ? `@${SNAP.sync.ref}` : "");
  $("#stat-cards").textContent = t.cards;
  $("#stat-due").textContent = t.cards_due;
  $("#stat-disc").textContent = t.disciplines;
  $("#stat-masters").textContent = SNAP.masters.length;
  const worst = Math.max(0, ...SNAP.cards.map((c) => c.overdue_days || 0));
  $("#stat-worst").textContent = worst;
  $("#tab-due").textContent = t.cards_due;

  const active = SNAP.disciplines.filter((d) => d.cards_total > 0);
  $("#hero-title").textContent = `${t.cards_due} 张卡在等你`;
  $("#hero-sub").innerHTML =
    `九个学科、<b>${t.topic_files}</b> 个卡账本、<b>${t.cards}</b> 张卡，全部收进来了。` +
    `按基准日 <b>${SNAP.as_of}</b> 算，<b>${t.cards_due}</b> 张已到期，最长的一张逾期 <b>${worst}</b> 天。` +
    (t.recon_mismatch
      ? ` 另外有 <b>${t.recon_mismatch}</b> 处 index.md 与明细卡数对不上——不是你的错觉。`
      : "");

  $("#disc-grid").innerHTML = SNAP.disciplines
    .map((d, i) => {
      const pct = d.cards_total ? d.cards_due / d.cards_total : 0;
      const color = ACCENTS[i % ACCENTS.length];
      const deliv = Object.entries(d.deliverables || {})
        .map(([k, v]) => `<span class="tag">${esc(k)} ${v}</span>`)
        .join("");
      const dupes = (d.master_dupes || []).length
        ? `<span class="tag warn">大师重复 ${d.master_dupes.length}</span>`
        : "";
      const next = d.next_step
        ? `<div class="disc-next"><b>下一步</b> ${esc(d.next_step.bullets[0] || "")}</div>`
        : "";
      return `<article class="disc-card ${d.cards_total ? "" : "empty"}" style="--accent:${color}"
          data-disc="${esc(d.name)}" tabindex="0" role="button"
          aria-label="${esc(d.name)}，${d.cards_due} 张待刷">
        <div class="disc-head">
          <span class="disc-no">${d.no ? String(d.no).padStart(2, "0") : "—"}</span>
          <h3 class="disc-name">${esc(d.name)}</h3>
          <span class="disc-emoji" title="${esc(d.status_raw)}">${d.status_emoji}</span>
        </div>
        <div class="ring-row">
          ${ring(pct, color)}
          <div class="ring-text">
            <b>${d.cards_due}</b> / ${d.cards_total} 张待刷<br>
            ${d.topics_with_cards}/${d.topics_total} 个课题有卡
          </div>
        </div>
        <div class="disc-meta">
          ${d.worst_overdue ? `<span class="tag hot">最长逾期 ${d.worst_overdue} 天</span>` : ""}
          ${d.roadmap_units ? `<span class="tag">路线图 ${d.roadmap_units}</span>` : ""}
          ${d.masters ? `<span class="tag">大师 ${d.masters}</span>` : ""}
          ${deliv}${dupes}
        </div>
        <div class="disc-status">${esc(d.status_raw || "")}</div>
        ${next}
      </article>`;
    })
    .join("");

  $$("#disc-grid .disc-card").forEach((el) => {
    const go = () => {
      $("#queue-filter").value = el.dataset.disc;
      buildAndShow();
      showView("ops");
    };
    el.addEventListener("click", go);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });
  });

  $("#foot-meta").textContent =
    `收割于 ${SNAP.generated_at}` +
    (SNAP.sync ? ` · 实时同步 ${SNAP.sync.fetched}/${SNAP.sync.listed} 文件` : " · 离线快照");
}

/* ───────────────────────── 刷题 ───────────────────────── */

function buildQueueNow() {
  const limit = parseInt($("#queue-limit").value, 10);
  const filter = $("#queue-filter").value;
  const pool = filter ? CARDS.filter((c) => c.discipline_name === filter) : CARDS;
  QUEUE = buildQueue(pool, today, limit);
  QI = 0;
  REVIEWED = [];
  TALLY = { 1: 0, 2: 0, 3: 0, 4: 0 };
}

function renderQueueList() {
  $("#queue-list").innerHTML = QUEUE.length
    ? QUEUE.map((c, i) =>
        `<li class="${i === QI ? "now" : ""} ${i < QI ? "done" : ""}">${esc(
          (c.concept || "").slice(0, 26)
        )}${c.concept.length > 26 ? "…" : ""}</li>`
      ).join("")
    : `<li>队列空了。</li>`;
}

function renderTally() {
  const done = REVIEWED.length;
  $("#tally").innerHTML = [1, 2, 3, 4]
    .map(
      (g) =>
        `<div class="t-${GRADE_LABEL[g].toLowerCase()}"><b>${TALLY[g]}</b><small>${GRADE_LABEL[g]}</small></div>`
    )
    .join("");
  $("#ops-progress").textContent = QUEUE.length
    ? `第 ${Math.min(QI + 1, QUEUE.length)} / ${QUEUE.length} 张 · 已刷 ${done} 张`
    : "队列已清空";
}

function renderCard() {
  const face = $("#card-face");
  if (QI >= QUEUE.length) {
    $("#c-disc").textContent = "收工";
    $("#c-topic").textContent = "";
    $("#c-overdue").textContent = "";
    $("#c-concept").textContent = REVIEWED.length
      ? `这一轮 ${REVIEWED.length} 张刷完了。Again 的那些明天还会回来——这是设计，不是惩罚。`
      : "当前筛选下没有到期的卡。换个学科，或者把上限调大。";
    $("#c-meta").innerHTML = "";
    $("#c-actions").hidden = true;
    renderQueueList();
    renderTally();
    refreshExport();
    return;
  }

  const c = QUEUE[QI];
  face.style.animation = "none";
  void face.offsetWidth;
  face.style.animation = "";

  $("#c-disc").textContent = c.discipline_name || c.discipline;
  $("#c-topic").textContent = c.topic || "";
  $("#c-overdue").textContent =
    c.overdue_days > 0 ? `逾期 ${c.overdue_days} 天` : c.due ? `今日到期` : "未排程";
  $("#c-concept").textContent = c.concept;

  const bits = [];
  if (c.s != null) bits.push(`S ${Number(c.s).toFixed(1)}d`);
  if (c.d != null) bits.push(`D ${c.d}`);
  if (c.last) bits.push(`上次 ${c.last}`);
  if (c.due) bits.push(`原 due ${c.due}`);
  if (c.flags && c.flags.length) bits.push(`标记 ${c.flags.join("/")}`);
  if (c.history) bits.push(`历史 ${c.history}`);
  bits.push(`<span style="opacity:.6">${esc(c.src)}:${c.line}</span>`);
  $("#c-meta").innerHTML = bits.map((b) => `<span>${b}</span>`).join("");

  $("#c-actions").hidden = false;
  renderQueueList();
  renderTally();
}

function grade(g) {
  if (QI >= QUEUE.length) return;
  const c = QUEUE[QI];
  const before = { prevS: c.s, prevD: c.d, prevDue: c.due };
  const out = review(c, g, today);
  const merged = { ...out, ...before, lastGrade: g };

  const idx = CARDS.findIndex((x) => x.uid === c.uid);
  if (idx >= 0) CARDS[idx] = { ...CARDS[idx], ...merged };

  const store = loadStore();
  store.reviews = { ...(store.reviews || {}), [c.uid]: merged };
  store.reviewedAt = new Date().toISOString();
  saveStore(store);

  REVIEWED.push(merged);
  TALLY[g]++;
  QI++;
  renderCard();
  refreshExport();
  refreshDueBadge();
}

function refreshDueBadge() {
  const n = CARDS.filter((c) => isDue(c, today)).length;
  $("#tab-due").textContent = n;
}

function buildAndShow() {
  buildQueueNow();
  renderCard();
}

/* ───────────────────────── 回写预览 ───────────────────────── */

function refreshExport() {
  const md = buildWriteback(REVIEWED, {
    asOf: SNAP.as_of,
    ref: SNAP.sync ? SNAP.sync.ref : "本地快照",
    sourceRepo: SNAP.source_repo,
  });
  $("#export-pre").textContent = md;
  $("#export-count").textContent = `本轮改了 ${REVIEWED.length} 张卡`;
  return md;
}

/* ───────────────────────── 地图 ───────────────────────── */

function renderMap() {
  const byDisc = new Map();
  for (const u of SNAP.roadmap) {
    if (!byDisc.has(u.discipline)) byDisc.set(u.discipline, []);
    byDisc.get(u.discipline).push(u);
  }
  const nameOf = (folder) => {
    const d = SNAP.disciplines.find((x) => x.folders.includes(folder));
    return d ? d.name : folder;
  };

  const blocks = [];
  for (const d of SNAP.disciplines) {
    const units = d.folders.flatMap((f) => byDisc.get(f) || []);
    const doneTopics = new Set(
      SNAP.topics.filter((t) => t.card_count > 0 && d.folders.includes(t.discipline)).map((t) => t.topic_no)
    );
    const activeNo = units.find((u) => !doneTopics.has(u.no))?.no;

    blocks.push(`<section class="map-disc">
      <h3>${esc(d.name)}</h3>
      <p class="map-sub">${d.roadmap_units} 个课题 · ${doneTopics.size} 个已开卡 ·
        源 <code>${esc((units[0] || {}).src || "—")}</code></p>
      <div class="units">
        ${
          units.length
            ? units
                .map(
                  (u) =>
                    `<span class="unit ${doneTopics.has(u.no) ? "done" : u.no === activeNo ? "active" : ""}"
                       title="${esc(u.title)}">${String(u.no).padStart(2, "0")} ${esc(u.title.slice(0, 40))}</span>`
                )
                .join("")
            : `<span class="tag">该学科路线图里没有「课题 NN」条目</span>`
        }
      </div>
    </section>`);
  }
  $("#map-wrap").innerHTML = blocks.join("");
}

/* ───────────────────────── 大师 ───────────────────────── */

function renderCouncil() {
  const uniq = [];
  const seen = new Set();
  for (const m of SNAP.masters) {
    const k = `${m.discipline}\u0000${m.name}`;
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(m);
  }
  $("#council-grid").innerHTML = uniq
    .map(
      (m, i) => `<article class="master" data-i="${i}" tabindex="0" role="button">
        <div class="m-disc">${esc(m.discipline)}</div>
        <h4>${esc(m.name)}</h4>
        <p>${esc(m.lens)}</p>
      </article>`
    )
    .join("");

  $$("#council-grid .master").forEach((el) => {
    const open = () => {
      $$("#council-grid .master").forEach((x) => x.classList.remove("sel"));
      el.classList.add("sel");
      const m = uniq[+el.dataset.i];
      const box = $("#master-detail");
      box.hidden = false;
      box.innerHTML = `<h3>${esc(m.name)}</h3>
        <p class="md-lens">${esc(m.lens)} · ${esc(m.discipline)}</p>
        ${m.models.length ? `<h5>心智模型</h5><ol>${m.models.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` : ""}
        ${m.limit ? `<h5>局限</h5><p class="md-limit">${esc(m.limit)}</p>` : ""}
        <p class="md-src">源文件 ${esc(m.src)}</p>`;
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    el.addEventListener("click", open);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

/* ───────────────────────── 台账核对 ───────────────────────── */

function renderLedger() {
  const t = SNAP.totals;
  const warn = SNAP.parse_warnings || [];
  const bad = (SNAP.reconciliation || []).filter((r) => !r.match);

  $("#ledger-summary").innerHTML = [
    ["cards", "卡片总数", ""],
    ["topic_files", "卡账本文件", ""],
    ["cards_due", "已到期", "bad"],
    ["recon_mismatch", "对账不一致", bad.length ? "bad" : "ok"],
  ]
    .map(([k, label, cls]) => `<div class="sum-chip ${cls}"><b>${t[k]}</b><small>${label}</small></div>`)
    .concat([`<div class="sum-chip ${warn.length ? "warn" : "ok"}"><b>${warn.length}</b><small>空账本/告警</small></div>`])
    .join("");

  $("#recon-count").textContent = bad.length;
  $("#recon-body").innerHTML = bad.length
    ? bad
        .map(
          (r) => `<tr class="bad"><td>${esc(r.discipline)}</td><td>${esc(r.topic)}</td>
            <td>${r.index_claims}</td><td>${r.detail_found}</td>
            <td class="delta">${r.index_claims - r.detail_found > 0 ? "+" : ""}${r.index_claims - r.detail_found}</td></tr>`
        )
        .join("")
    : `<tr><td colspan="5" style="color:var(--green)">全部对得上。</td></tr>`;

  $("#warn-count").textContent = warn.length;
  $("#warn-list").innerHTML = warn.length
    ? warn.map((w) => `<li>${esc(w)}</li>`).join("")
    : `<li>无告警。</li>`;
}

/* ───────────────────────── 偏好 / 判例 ───────────────────────── */

function renderMe() {
  $("#pref-grid").innerHTML = SNAP.preferences
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map(
      (p) => `<article class="pref"><h4>${esc(p.title)}</h4><p>${esc(p.text)}</p>
        <div class="p-meta">${esc(p.date)} · ${esc(p.discipline)} · ${esc(p.src)}:${p.line}</div></article>`
    )
    .join("");

  $("#law-grid").innerHTML = SNAP.case_law
    .map(
      (l) => `<article class="law"><h4>${esc(l.tag)}</h4><p>${esc(l.text)}</p>
        <div class="l-meta">${esc(l.discipline)} · ${esc(l.section || "")} · ${esc(l.src)}:${l.line}</div></article>`
    )
    .join("");
}

/* ───────────────────────── 同步 ───────────────────────── */

async function doSync() {
  const btn = $("#btn-sync");
  btn.disabled = true;
  const label = btn.querySelector("span");
  const old = label.textContent;
  try {
    label.textContent = "拉清单…";
    SNAP = await ghSync({
      today,
      onProgress: (done, all) => {
        label.textContent = `拉取 ${done}/${all}`;
      },
    });
    applyLocal();
    saveStore({ snapshot: SNAP });
    renderAll();
    const f = SNAP.sync.failed.length;
    toast(
      `已同步 ${SNAP.sync.ref}：${SNAP.sync.fetched}/${SNAP.sync.listed} 个文件，${SNAP.totals.cards} 张卡` +
        (f ? `，${f} 个拉取失败` : "")
    );
    if (f) console.warn("同步失败的文件：", SNAP.sync.failed);
  } catch (e) {
    toast(e.message || "同步失败", true);
    console.error(e);
  } finally {
    btn.disabled = false;
    label.textContent = old;
  }
}

/* ───────────────────────── 启动 ───────────────────────── */

function renderAll() {
  renderBridge();
  renderMap();
  renderCouncil();
  renderLedger();
  renderMe();
  const sel = $("#queue-filter");
  const cur = sel.value;
  sel.innerHTML =
    `<option value="">全部学科</option>` +
    SNAP.disciplines
      .filter((d) => d.cards_total > 0)
      .map((d) => `<option value="${esc(d.name)}">${esc(d.name)}（${d.cards_due}/${d.cards_total}）</option>`)
      .join("");
  sel.value = cur && [...sel.options].some((o) => o.value === cur) ? cur : "";
  buildAndShow();
  refreshExport();
}

async function boot() {
  // 优先用本地缓存的上次同步结果，其次离线快照
  const cached = loadStore().snapshot;
  if (cached && cached.cards) {
    SNAP = cached;
  } else {
    const res = await fetch("data/snapshot.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`读不到 data/snapshot.json（HTTP ${res.status}）`);
    SNAP = await res.json();
  }
  SNAP.parse_warnings = SNAP.parse_warnings || (await fetch("data/manifest.json").then((r) => r.json()).then((m) => m.parse_warnings).catch(() => []));
  applyLocal();
  renderAll();

  $$(".tab").forEach((t) => t.addEventListener("click", () => showView(t.dataset.view)));
  $("#btn-start-drill").addEventListener("click", () => {
    buildAndShow();
    showView("ops");
  });
  $("#btn-goto-ledger").addEventListener("click", () => showView("ledger"));
  $("#btn-sync").addEventListener("click", doSync);
  $("#btn-rebuild").addEventListener("click", () => {
    buildAndShow();
    toast("队列已重组");
  });
  $("#queue-limit").addEventListener("change", buildAndShow);
  $("#queue-filter").addEventListener("change", buildAndShow);

  $("#c-actions").addEventListener("click", (e) => {
    const b = e.target.closest(".grade");
    if (b) grade(+b.dataset.grade);
  });

  $("#btn-copy").addEventListener("click", async () => {
    const md = refreshExport();
    try {
      await navigator.clipboard.writeText(md);
      toast("已复制到剪贴板");
    } catch {
      toast("浏览器拒绝写剪贴板，用下载吧", true);
    }
  });
  $("#btn-download").addEventListener("click", () => {
    download(`drill-writeback-${today}.md`, refreshExport());
    toast("已下载");
  });

  document.addEventListener("keydown", (e) => {
    // e.target 可能是 document（焦点在 body 上），它没有 .matches
    if (typeof e.target?.matches === "function" && e.target.matches("input,select,textarea")) return;
    if (e.key === "Escape") return showView("bridge");
    if (!$("#view-ops").classList.contains("active")) {
      if (e.key === " ") {
        e.preventDefault();
        buildAndShow();
        showView("ops");
      }
      return;
    }
    if (e.key === " ") {
      e.preventDefault();
      if (QI >= QUEUE.length) buildAndShow();
      else renderCard();
      return;
    }
    if (["1", "2", "3", "4"].includes(e.key)) {
      e.preventDefault();
      grade(+e.key);
    }
  });
}

boot().catch((e) => {
  console.error(e);
  $("#hero-title").textContent = "台账没读进来";
  $("#hero-sub").textContent = e.message || String(e);
  toast("启动失败：" + (e.message || e), true);
});
