/**
 * test_scheduler.mjs — 调度器回归测试
 *
 * 跑法（在 mission-control/ 下）：
 *     node --test tests/
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  GRADE,
  GRADE_LABEL,
  W,
  addDays,
  buildQueue,
  clamp,
  dTo10,
  dTo5,
  daysBetween,
  initialDifficulty,
  initialStability,
  intervalFromStability,
  isDue,
  nextDifficulty,
  nextStabilityLapse,
  nextStabilitySuccess,
  retrievability,
  review,
} from "../js/scheduler.js";

const TODAY = "2026-09-14";

test("幂律遗忘曲线：t=0 时 R=1，且随 t 单调下降", () => {
  assert.equal(retrievability(0, 3), 1);
  const a = retrievability(1, 3);
  const b = retrievability(3, 3);
  const c = retrievability(30, 3);
  assert.ok(a > b && b > c, `R 应单调下降：${a} > ${b} > ${c}`);
  // t = 9S 时 R 恰为 0.5（幂律曲线的定义点）
  assert.ok(Math.abs(retrievability(27, 3) - 0.5) < 1e-9, "t=9S 时 R 应为 0.5");
});

test("稳定性越大，遗忘越慢", () => {
  assert.ok(retrievability(5, 10) > retrievability(5, 1), "S 大的卡应更记得住");
});

test("初始难度按评分分档，且夹在 [1,10]", () => {
  assert.ok(initialDifficulty(GRADE.EASY) < initialDifficulty(GRADE.AGAIN));
  for (const g of [1, 2, 3, 4]) {
    const d = initialDifficulty(g);
    assert.ok(d >= 1 && d <= 10, `D0(${g})=${d} 越界`);
  }
});

test("初始稳定性 Easy > Good > Hard > Again", () => {
  const s = [1, 2, 3, 4].map((g) => initialStability(g));
  assert.ok(s[0] < s[1] && s[1] < s[2] && s[2] < s[3], `S0 未递增：${s}`);
});

test("D 口径 1–5 ↔ 1–10 双向可逆（台账口径不能丢）", () => {
  for (const d5 of [1, 2, 2.5, 3, 4, 5]) {
    assert.equal(dTo5(dTo10(d5)), d5, `d5=${d5} 往返不一致`);
  }
  assert.equal(clamp(dTo10(0), 1, 10), 1);
  assert.equal(clamp(dTo10(9), 1, 10), 10);
});

test("难度：答对降、答错升、长期往中档回归", () => {
  const d = dTo10(3); // 中档
  assert.ok(nextDifficulty(d, GRADE.EASY) < d, "Easy 应降低难度");
  assert.ok(nextDifficulty(d, GRADE.AGAIN) > d, "Again 应提高难度");
  // 连续 Easy 不会把难度压到 0
  let x = d;
  for (let i = 0; i < 40; i++) x = nextDifficulty(x, GRADE.EASY);
  assert.ok(x >= 1, `难度触底：${x}`);
  let y = d;
  for (let i = 0; i < 40; i++) y = nextDifficulty(y, GRADE.AGAIN);
  assert.ok(y <= 10, `难度爆表：${y}`);
});

test("打脸链路：答错后稳定性必须缩短", () => {
  const s = 5;
  const sf = nextStabilityLapse(s, dTo10(3), retrievability(5, s));
  assert.ok(sf < s, `答错后 S 应下降：${sf} < ${s}`);
  assert.ok(sf > 0, "S 不能为负");
});

test("答对后稳定性增长，且 Easy 增幅 > Good > Hard", () => {
  const s = 3;
  const r = retrievability(3, s);
  const d = dTo10(3);
  const hard = nextStabilitySuccess(s, d, r, GRADE.HARD);
  const good = nextStabilitySuccess(s, d, r, GRADE.GOOD);
  const easy = nextStabilitySuccess(s, d, r, GRADE.EASY);
  assert.ok(hard < good && good < easy, `增幅未递增：${hard} < ${good} < ${easy}`);
  assert.ok(good > s, "答对后 S 应上升");
});

test("review()：Good 后 due 推远、S 上升、history 追加", () => {
  const card = { s: 3.0, d: 3, last: "2026-08-16", due: "2026-08-19", flags: [], history: "G" };
  const out = review(card, GRADE.GOOD, TODAY);
  assert.ok(out.s > card.s, `S 应上升：${out.s} > ${card.s}`);
  assert.equal(out.last, TODAY);
  assert.ok(out.due > TODAY, `due 应在今天之后：${out.due}`);
  assert.ok(out.history.includes("Good"), `history 应含 Good：${out.history}`);
  assert.equal(out.flags.includes("cw"), false, "答对不该挂 cw");
});

test("review()：Again 挂 cw 标记、due 收缩、againCount 累加", () => {
  const card = { s: 4.0, d: 3, last: "2026-09-01", due: "2026-09-05", flags: [], history: "" };
  const out = review(card, GRADE.AGAIN, TODAY);
  assert.ok(out.s < card.s, `S 应下降：${out.s} < ${card.s}`);
  assert.ok(out.flags.includes("cw"), "答错应挂 cw（自信错）标记");
  assert.equal(out.againCount, 1);
  assert.ok(out.interval <= 1, `Again 的间隔应是 1 天内：${out.interval}`);
});

test("leech 判定：累计 4 次 Again 才挂账（对齐台账规则）", () => {
  let card = { s: 3.0, d: 3, last: "2026-09-01", due: "2026-09-02", flags: [], history: "" };
  for (let i = 0; i < 3; i++) card = review(card, GRADE.AGAIN, addDays(TODAY, i));
  assert.equal(card.isLeech, false, "3 次不该是 leech");
  card = review(card, GRADE.AGAIN, addDays(TODAY, 3));
  assert.equal(card.isLeech, true, "4 次应挂 leech");
  assert.ok(card.flags.includes("leech"));
});

test("review() 不改动入参（纯函数）", () => {
  const card = Object.freeze({ s: 3, d: 3, last: "2026-08-16", due: "2026-08-19", flags: [], history: "" });
  const out = review(card, GRADE.GOOD, TODAY);
  assert.equal(card.s, 3);
  assert.notEqual(out, card);
});

test("新卡（无 S/D）也能安全排程", () => {
  const out = review({ flags: [], history: "" }, GRADE.GOOD, TODAY);
  assert.ok(out.s > 0 && Number.isFinite(out.s));
  assert.ok(out.d >= 1 && out.d <= 5);
  assert.ok(out.due >= TODAY);
});

test("intervalFromStability：S 越大间隔越长，且下限 1 天", () => {
  assert.equal(intervalFromStability(0.05), 1);
  assert.ok(intervalFromStability(10) > intervalFromStability(1));
  assert.equal(intervalFromStability(1), 1, "S=1 → 9*(1/0.9-1)=1 天");
});

test("isDue：到期/逾期算到期，未来不算", () => {
  assert.equal(isDue({ due: TODAY }, TODAY), true);
  assert.equal(isDue({ due: "2026-09-01" }, TODAY), true);
  assert.equal(isDue({ due: "2026-09-20" }, TODAY), false);
  assert.equal(isDue({}, TODAY), true, "没排程的卡视为到期");
});

test("buildQueue：只取到期卡，遵守 limit，且同课题不连刷超过 2 张", () => {
  const mk = (topic, due, s) => ({ topic, due, s, flags: [], history: "" });
  const cards = [
    ...Array.from({ length: 5 }, (_, i) => mk("课题01", "2026-08-2" + (i + 1), 1)),
    ...Array.from({ length: 5 }, (_, i) => mk("课题02", "2026-08-2" + (i + 1), 2)),
    mk("课题03", "2026-12-01", 1), // 未到期，不该进队
  ];
  const q = buildQueue(cards, TODAY, 8);
  assert.equal(q.length, 8, `队列长度应为 8，实为 ${q.length}`);
  assert.ok(!q.some((c) => c.topic === "课题03"), "未到期的卡不该出现");
  for (let i = 0; i + 2 < q.length; i++) {
    const win = q.slice(i, i + 3);
    assert.ok(
      win.filter((c) => c.topic === win[0].topic).length < 3,
      `连续 3 张同课题卡：${win.map((c) => c.topic)}`
    );
  }
});

test("buildQueue：逾期越久越靠前", () => {
  const q = buildQueue(
    [
      { topic: "新", due: "2026-09-13", s: 1, flags: [], history: "" },
      { topic: "陈", due: "2026-07-01", s: 1, flags: [], history: "" },
    ],
    TODAY,
    2
  );
  assert.equal(q[0].topic, "陈", "逾期 75 天的卡应排第一");
});

test("日期工具：跨年、闰日、天数差", () => {
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2026-02-28", 1), "2026-03-01");
  assert.equal(addDays("2024-02-28", 1), "2024-02-29", "闰年应进 2/29");
  assert.equal(daysBetween("2026-08-19", "2026-09-14"), 26);
  assert.equal(daysBetween("2026-09-14", "2026-08-19"), -26);
});

test("台账口径兼容：GRADE_LABEL 与 history 里的写法一致", () => {
  assert.equal(GRADE_LABEL[1], "Again");
  assert.equal(GRADE_LABEL[3], "Good");
  assert.equal(GRADE_LABEL[4], "Easy");
});

test("权重表未被误改（锁死 FSRS-4.5 默认值）", () => {
  assert.equal(W.w2, 2.4);
  assert.equal(W.w8, 1.49);
  assert.equal(W.w16, 2.82);
});
