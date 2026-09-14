#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_harvest.py — 收割器的回归测试。

跑法（在 mission-control/ 下）：
    python3 -m unittest discover -s tests -p 'test_*.py' -v

默认用环境变量 ZIXUE_REPO 指向 zixue2026 的本地克隆；
没有克隆时用 tests/fixtures/ 里的最小样本仓（同样能跑通全部分支）。
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
TOOL = os.path.join(HERE, "..", "tools", "harvest.py")
FIXTURE = os.path.join(HERE, "fixtures", "mini-repo")
REPO = os.environ.get("ZIXUE_REPO", "")

sys.path.insert(0, os.path.join(HERE, "..", "tools"))
import harvest  # noqa: E402


def run_harvest(repo: str, out: str, today: str = "2026-09-14") -> dict:
    proc = subprocess.run(
        [sys.executable, TOOL, "--repo", repo, "--out", out, "--today", today],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        raise AssertionError(f"harvest 退出码 {proc.returncode}\n{proc.stderr}")
    with open(os.path.join(out, "snapshot.json"), encoding="utf-8") as fh:
        return json.load(fh)


class TestCardParsing(unittest.TestCase):
    """卡片表格解析：含反引号包裹、S(days)/S 两种表头、过期计算。"""

    def test_backtick_wrapped_rows_are_parsed(self):
        """东方智慧把整行表格写在反引号里——这类卡必须被收到，不能漏。"""
        cards, _, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        by_disc = {}
        for c in cards:
            by_disc.setdefault(c["discipline"], []).append(c)
        self.assertIn("东方智慧", by_disc, "反引号包裹的账本应被解析")
        self.assertEqual(by_disc["东方智慧"][0]["concept"][:4], "知行合一")

    def test_both_header_spellings_supported(self):
        cards, _, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        spells = set()
        for c in cards:
            if c["discipline"] == "概率论":
                spells.add("S(days)")
            if c["discipline"] == "数理方程":
                spells.add("S")
        self.assertEqual(spells, {"S(days)", "S"}, "两种表头写法都要支持")

    def test_numeric_fields_and_overdue(self):
        cards, _, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        card = next(c for c in cards if c["card_id"] == "1" and c["discipline"] == "概率论")
        self.assertAlmostEqual(card["s"], 3.0)
        self.assertAlmostEqual(card["d"], 3.0)
        self.assertEqual(card["last"], "2026-08-16")
        self.assertEqual(card["due"], "2026-08-19")
        # 09-14 距 08-19 共 26 天
        self.assertEqual(card["overdue_days"], 26)
        self.assertTrue(card["is_due"])

    def test_composite_card_id_preserved(self):
        """工程力学用 01-01 这种复合编号，不能被截成数字。"""
        cards, _, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        ids = {c["card_id"] for c in cards if c["discipline"] == "工程力学"}
        self.assertIn("01-01", ids)

    def test_empty_ledger_is_a_warning_not_a_crash(self):
        cards, topics, warnings = harvest.harvest_cards(FIXTURE, "2026-09-14")
        empties = [t for t in topics if t["card_count"] == 0]
        self.assertTrue(empties, "样本仓里应有一个空账本")
        self.assertTrue(any("空账本" in w for w in warnings))

    def test_readme_in_topics_dir_is_skipped(self):
        _, topics, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        self.assertFalse(any(t["topic"].lower().startswith("readme") for t in topics))


class TestReconciliation(unittest.TestCase):
    """index.md 声称的卡数 vs 明细实数——不一致必须被点名。"""

    def test_zero_vs_zero_is_not_a_mismatch(self):
        with tempfile.TemporaryDirectory() as out:
            snap = run_harvest(FIXTURE, out)
        for r in snap["reconciliation"]:
            if r["index_claims"] == 0 and r["detail_found"] == 0:
                self.assertTrue(r["match"], f"0 对 0 不该判为不一致：{r}")

    def test_real_drift_is_flagged(self):
        with tempfile.TemporaryDirectory() as out:
            snap = run_harvest(FIXTURE, out)
        bad = [r for r in snap["reconciliation"] if not r["match"]]
        self.assertTrue(bad, "样本仓故意留了一处台账漂移，必须被检出")
        self.assertEqual(snap["totals"]["recon_mismatch"], len(bad))


class TestScheduleAndExtras(unittest.TestCase):
    def test_schedule_rows_and_emoji(self):
        rows, warnings = harvest.harvest_schedule(FIXTURE, "2026-09-14")
        self.assertEqual(warnings, [])
        self.assertTrue(rows)
        emojis = {r["status_emoji"] for r in rows}
        self.assertTrue(emojis & {"🟢", "🟡", "🔵"}, f"状态 emoji 应被识别：{emojis}")
        self.assertTrue(rows[0]["folders"], "文件夹列的 `xxx/` 应被抽出")

    def test_masters_parsed_with_models_and_limit(self):
        masters = harvest.harvest_masters(FIXTURE)
        self.assertTrue(masters)
        m = masters[0]
        self.assertTrue(m["name"])
        self.assertTrue(m["lens"], "「· 视角」应被切成 lens")
        self.assertTrue(m["models"], "心智模型条目应被抽出")
        self.assertTrue(m["limit"], "局限段落应被抽出")

    def test_roadmap_units(self):
        units = harvest.harvest_roadmap(FIXTURE)
        self.assertTrue(units)
        self.assertTrue(all(u["no"] >= 1 for u in units))

    def test_preferences_only_from_preference_section(self):
        prefs = harvest.harvest_preferences(FIXTURE)
        self.assertTrue(prefs)
        self.assertTrue(all(p["title"] for p in prefs))

    def test_case_law(self):
        laws = harvest.harvest_case_law(FIXTURE)
        self.assertTrue(laws)
        self.assertTrue(any("判例" in l["tag"] for l in laws))

    def test_next_step_extracted(self):
        nxt = harvest.harvest_next_step(FIXTURE, "概率论")
        self.assertIsNotNone(nxt)
        self.assertTrue(nxt["bullets"])


class TestProvenance(unittest.TestCase):
    """每条记录都要能回溯到文件与行号——这是他仓库的硬规矩。"""

    def test_every_card_has_src_and_line(self):
        cards, _, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        for c in cards:
            self.assertTrue(c["src"], f"卡片缺 src: {c}")
            self.assertIsInstance(c["line"], int)
            self.assertGreater(c["line"], 0)

    def test_sources_actually_exist_on_disk(self):
        cards, topics, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        for rec in cards + topics:
            self.assertTrue(
                os.path.exists(os.path.join(FIXTURE, rec["src"])),
                f"src 指向的文件不存在: {rec['src']}",
            )


class TestEndToEnd(unittest.TestCase):
    def test_cli_writes_both_files_and_totals_add_up(self):
        with tempfile.TemporaryDirectory() as out:
            snap = run_harvest(FIXTURE, out)
            self.assertTrue(os.path.exists(os.path.join(out, "manifest.json")))
            self.assertTrue(os.path.exists(os.path.join(out, "snapshot.json")))
        t = snap["totals"]
        self.assertEqual(t["cards"], len(snap["cards"]))
        self.assertEqual(t["cards_due"], sum(1 for c in snap["cards"] if c["is_due"]))
        self.assertEqual(t["masters"], len(snap["masters"]))
        self.assertEqual(t["topic_files"], len(snap["topics"]))
        self.assertEqual(t["disciplines"], len(snap["disciplines"]))

    def test_missing_repo_returns_error_code(self):
        proc = subprocess.run(
            [sys.executable, TOOL, "--repo", "/nonexistent/path/xyz"],
            capture_output=True,
            text=True,
        )
        self.assertEqual(proc.returncode, 2)


@unittest.skipUnless(REPO and os.path.isdir(REPO), "设 ZIXUE_REPO 指向 zixue2026 克隆才跑")
class TestAgainstRealRepo(unittest.TestCase):
    """对真仓库跑一遍，锁死关键数字（防止解析器悄悄退化）。"""

    def test_real_repo_totals(self):
        with tempfile.TemporaryDirectory() as out:
            snap = run_harvest(REPO, out)
        t = snap["totals"]
        self.assertGreaterEqual(t["cards"], 298, f"真仓库卡片数掉到 {t['cards']}")
        self.assertGreaterEqual(t["disciplines"], 9)
        self.assertGreaterEqual(t["masters"], 28)
        # 每张卡都必须有 concept
        self.assertTrue(all(c["concept"] for c in snap["cards"]))
        # 不允许出现 index 说 0、明细也是 0 却判不一致的假警报
        for r in snap["reconciliation"]:
            if r["index_claims"] == 0 and r["detail_found"] == 0:
                self.assertTrue(r["match"])


if __name__ == "__main__":
    unittest.main(verbosity=2)


class TestEscapedPipes(unittest.TestCase):
    """概念里的 `P(B\\|A)` 不能被当成列分隔符——这个坑实测毁过 5 张真卡。"""

    def test_escaped_pipe_stays_inside_concept(self):
        cards, _, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        card = next((c for c in cards if c["card_id"] == "3" and c["discipline"] == "概率论"), None)
        self.assertIsNotNone(card, "含转义竖线的卡应被解析出来")
        self.assertIn("P(B|A)", card["concept"], f"转义竖线应还原：{card['concept']}")
        # 列不能右移
        self.assertAlmostEqual(card["s"], 3.0, msg=f"S 被挤歪了：{card['s']}")
        self.assertAlmostEqual(card["d"], 2.0, msg=f"D 被挤歪了：{card['d']}")
        self.assertEqual(card["last"], "2026-08-16")
        self.assertEqual(card["due"], "2026-08-19")
        self.assertEqual(card["history"], "G")

    def test_split_row_handles_escaped_and_plain(self):
        self.assertEqual(harvest.split_row("| a | b |"), ["a", "b"])
        self.assertEqual(harvest.split_row(r"| P(B\|A) | 3.0 |"), ["P(B|A)", "3.0"])
        self.assertEqual(harvest.split_row(r"| x\|y\|z | 1 |"), ["x|y|z", "1"])


class TestColumnAnchor(unittest.TestCase):
    """裸竖线可能出现在概念列，也可能出现在历史列——必须两边都能修对。"""

    def test_pipe_in_history_is_not_merged_into_concept(self):
        cards, _, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        card = next((c for c in cards if c["card_id"] == "4" and c["discipline"] == "概率论"), None)
        self.assertIsNotNone(card, "历史列含裸竖线的卡应被解析")
        self.assertEqual(card["concept"], "区域单连通＝无洞；与有界/无界独立")
        self.assertAlmostEqual(card["s"], 4.0, msg="S 被历史列的竖线吃掉了")
        self.assertAlmostEqual(card["d"], 2.0)
        self.assertEqual(card["last"], "2026-09-14")
        self.assertEqual(card["due"], "2026-09-18")
        self.assertIn("|z|>1", card["history"], f"历史列的竖线应拼回：{card['history']}")

    def test_locate_columns_finds_the_anchor(self):
        cells = ["6", "概念A", "概念B", "4.0", "2", "2026-09-14", "2026-09-18", "—", "Good"]
        self.assertEqual(harvest.locate_columns(cells), 3)

    def test_locate_columns_returns_none_without_anchor(self):
        self.assertIsNone(harvest.locate_columns(["1", "只有概念", "没有", "锚点"]))

    def test_repaired_cards_are_flagged_not_silent(self):
        cards, _, warnings = harvest.harvest_cards(FIXTURE, "2026-09-14")
        repaired = [c for c in cards if c.get("repaired")]
        self.assertTrue(repaired, "样本仓里有需要修的卡")
        for c in repaired:
            self.assertTrue(
                any(f"{c['src']}:{c['line']}" in w for w in warnings),
                f"修复必须留痕：{c['src']}:{c['line']} 没进 warnings",
            )

    def test_no_card_loses_its_stability(self):
        """真仓库里出现过整卡 S/last 全空——那是列错位的症状，必须为零。"""
        cards, _, _ = harvest.harvest_cards(FIXTURE, "2026-09-14")
        broken = [c for c in cards if c["s"] is None or c["last"] is None]
        self.assertEqual(broken, [], f"仍有列错位的卡：{[b['uid'] for b in broken]}")
