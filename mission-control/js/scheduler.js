/**
 * scheduler.js — 间隔重复调度器（FSRS-4.5 精简实现）
 *
 * 为什么用 FSRS：`zixue2026` 的 drill-ledger 每张卡存的就是
 *   `S (days)` 稳定性 + `D (1-5)` 难度 + `last` + `due`
 * 这正是 FSRS 的两个核心状态量。用同一套公式，App 里刷完的卡
 * 才能把新的 S / D / due 原样写回 Markdown 台账，不产生第二套口径。
 *
 * 本文件是纯 ES module，不碰 DOM —— 浏览器和 Node 测试共用同一份实现。
 */

/** 评分档位：与 Anki/FSRS 一致，也对应台账 history 里的 Again/Hard/Good/Easy。 */
export const GRADE = { AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4 };

export const GRADE_LABEL = { 1: "Again", 2: "Hard", 3: "Good", 4: "Easy" };

/** FSRS-4.5 默认权重 w0..w16（只用到本实现需要的部分）。 */
export const W = {
  w0: 0.4, // 初始稳定性 · Again
  w1: 0.6, // 初始稳定性 · Hard
  w2: 2.4, // 初始稳定性 · Good
  w3: 5.8, // 初始稳定性 · Easy
  w4: 4.93, // 初始难度基准
  w5: 0.94, // 难度对评分的敏感度
  w6: 0.86, // 难度均值回归强度
  w7: 0.01, // 均值回归权重
  w8: 1.49, // 成功复习增益底数
  w9: 0.14, // 稳定性自衰减指数
  w10: 0.92, // 遗忘度对增益的放大
  w11: 1.16, // 失败后稳定性基数
  w12: 0.06, // 失败后难度惩罚指数
  w13: 0.29, // 失败后稳定性指数
  w14: 2.07, // 失败后遗忘度放大
  w15: 0.11, // Hard 惩罚
  w16: 2.82, // Easy 加成
};

/** 权重表守卫：传进来的不是对象就退回默认表，绝不静默算出 undefined。 */
function weights(w) {
  return w && typeof w === "object" && Number.isFinite(w.w4) ? w : W;
}

/** 新卡初始难度 D0(grade) = w4 − (grade − 3) · w5，夹紧到 [1, 10]。 */
export function initialDifficulty(grade, wIn = W) {
  const w = weights(wIn);
  const d0 = w.w4 - (grade - 3) * w.w5;
  return clamp(d0, 1, 10);
}

/** 新卡初始稳定性 S0(grade) = w[grade−1]。 */
export function initialStability(grade, wIn = W) {
  const w = weights(wIn);
  const table = [w.w0, w.w1, w.w2, w.w3];
  const idx = Math.min(3, Math.max(0, grade - 1));
  return table[idx];
}

/**
 * 幂律遗忘曲线的可提取度：R(t) = (1 + t/(9S))^(-1)
 * t = 距上次复习的天数，S = 稳定性。R 随 t 单调下降，S 越大下降越慢。
 */
export function retrievability(elapsedDays, stability) {
  const s = Math.max(0.01, stability);
  const t = Math.max(0, elapsedDays);
  return 1 / (1 + t / (9 * s));
}

/** 台账 D 是 1–5，FSRS 内部是 1–10。两个方向都提供，保证可逆。 */
export const dTo5 = (d10) => clamp(Math.round((d10 / 2) * 10) / 10, 1, 5);
export const dTo10 = (d5) => clamp(d5 * 2, 1, 10);

/**
 * 复习后难度更新：D' = w7·D0(3) + (1−w7)·(D − w6·(grade−3))
 * grade>3 降难度，grade<3 升难度；均值回归把它往中档拉。
 */
export function nextDifficulty(d10, grade, wIn = W) {
  const w = weights(wIn);
  const delta = d10 - w.w6 * (grade - 3);
  const d = w.w7 * initialDifficulty(GRADE.GOOD, w) + (1 - w.w7) * delta;
  return clamp(d, 1, 10);
}

/**
 * 答对后的稳定性：
 * S'_r = S · ( e^{w8} · (11−D) · S^{−w9} · (e^{w10(1−R)} − 1) · hardPenalty · easyBonus + 1 )
 */
export function nextStabilitySuccess(s, d10, r, grade, wIn = W) {
  const w = weights(wIn);
  const hardPenalty = grade === GRADE.HARD ? w.w15 : 1;
  const easyBonus = grade === GRADE.EASY ? w.w16 : 1;
  const factor =
    Math.exp(w.w8) *
    (11 - d10) *
    Math.pow(Math.max(0.01, s), -w.w9) *
    (Math.exp(w.w10 * (1 - r)) - 1) *
    hardPenalty *
    easyBonus;
  return Math.max(0.1, s * (factor + 1));
}

/**
 * 答错后的稳定性（遗忘重学）：
 * S'_f = w11 · D^{−w12} · ((S+1)^{w13} − 1) · e^{w14(1−R)}
 * 一定小于原 S —— 打脸之后要缩短间隔，这是「打脸链路」的数学表达。
 */
export function nextStabilityLapse(s, d10, r, wIn = W) {
  const w = weights(wIn);
  const sf =
    w.w11 *
    Math.pow(Math.max(1, d10), -w.w12) *
    (Math.pow(s + 1, w.w13) - 1) *
    Math.exp(w.w14 * (1 - r));
  return clamp(sf, 0.1, Math.max(0.1, s));
}

export function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

/** 间隔取整：FSRS 用 round(S · 9 · (1/0.9 − 1)) 反解「R 降到 0.9 时的天数」，下限 1 天。 */
export function intervalFromStability(s, targetR = 0.9) {
  const days = s * 9 * (1 / targetR - 1);
  return Math.max(1, Math.round(days));
}

/** ISO 日期 + n 天。 */
export function addDays(iso, n) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromIso, toIso) {
  const a = Date.parse(fromIso + "T00:00:00Z");
  const b = Date.parse(toIso + "T00:00:00Z");
  return Math.round((b - a) / 86400000);
}

/**
 * 刷一张卡，返回新的卡状态。
 *
 * @param {object} card  { s, d, last, due, flags, history, againCount }
 *                       d 用台账的 1–5 口径
 * @param {number} grade GRADE.*
 * @param {string} today YYYY-MM-DD
 */
export function review(card, grade, today) {
  const g = Math.round(clamp(grade, 1, 4));
  const prevS = Number(card.s) > 0 ? Number(card.s) : initialStability(GRADE.GOOD);
  const prevD5 = Number(card.d) > 0 ? Number(card.d) : 3;
  const d10 = dTo10(prevD5);

  const elapsed = card.last ? Math.max(0, daysBetween(card.last, today)) : 0;
  const r = retrievability(elapsed, prevS);

  let nextS;
  if (g === GRADE.AGAIN) {
    nextS = nextStabilityLapse(prevS, nextDifficulty(d10, g), r);
  } else {
    nextS = nextStabilitySuccess(prevS, nextDifficulty(d10, g), r, g);
  }
  const nextD10 = nextDifficulty(d10, g);
  const nextD5 = dTo5(nextD10);

  const interval = g === GRADE.AGAIN ? Math.max(1, Math.round(Math.min(1, nextS))) : intervalFromStability(nextS);

  const againCount = (card.againCount || 0) + (g === GRADE.AGAIN ? 1 : 0);
  const flags = new Set(card.flags || []);
  if (g === GRADE.AGAIN) flags.add("cw");
  if (againCount >= 4) flags.add("leech");

  const note = card.historyNote ? `（${card.historyNote}）` : "";
  const hist = [...(card.history ? String(card.history).split(/[,，]\s*/) : [])].filter(Boolean);
  hist.push(`${GRADE_LABEL[g]}${note}`);

  return {
    ...card,
    s: round1(nextS),
    d: round1(nextD5),
    last: today,
    due: addDays(today, interval),
    interval,
    retrievability: round3(r),
    flags: [...flags],
    againCount,
    isLeech: againCount >= 4,
    history: hist.slice(-6).join(","),
  };
}

/** 一张卡现在该不该出现：到期，或从未排程。 */
export function isDue(card, today) {
  if (!card.due) return true;
  return daysBetween(card.due, today) >= 0;
}

/**
 * 组一次刷题队列：到期卡优先（按逾期天数倒序），
 * 同一课题的卡不连续出现超过 2 张，避免同一知识点连刷产生错觉。
 */
export function buildQueue(cards, today, limit = 20) {
  const due = cards
    .filter((c) => isDue(c, today))
    .map((c) => ({ c, over: c.due ? daysBetween(c.due, today) : 0 }))
    .sort((a, b) => b.over - a.over || (a.c.s || 0) - (b.c.s || 0));

  const out = [];
  const pool = [...due];
  const recent = [];
  while (out.length < limit && pool.length) {
    let idx = pool.findIndex(
      (e) => recent.filter((t) => t === e.c.topic).length < 2
    );
    if (idx === -1) idx = 0;
    const [picked] = pool.splice(idx, 1);
    out.push(picked.c);
    recent.push(picked.c.topic);
    if (recent.length > 3) recent.shift();
  }
  return out;
}

const round1 = (v) => Math.round(v * 10) / 10;
const round3 = (v) => Math.round(v * 1000) / 1000;
