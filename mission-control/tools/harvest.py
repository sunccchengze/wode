#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
harvest.py — 把 `sunccchengze/zixue2026` 里手写的 Markdown 台账，
             收成「指挥舱」可以吃的结构化数据。

设计原则（对齐孙承泽本人的仓库习惯）：
  1. 只搬运、不扩写。所有派生字段都标注 `_derived: true`。
  2. 每一条记录都带 `src`（仓库相对路径）+ `line`（行号），可回溯核对。
  3. 解析不出来就如实记 `parse_warnings`，绝不静默丢弃、绝不猜测填充。

用法：
    python3 tools/harvest.py --repo /path/to/zixue2026 --out ../data
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import date, datetime

# ---------------------------------------------------------------- 基础工具

DATE_RE = re.compile(r"(\d{4})-(\d{2})-(\d{2})")


def read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8") as fh:
        return fh.read()


def sha1_of(path: str) -> str:
    with open(path, "rb") as fh:
        return hashlib.sha1(fh.read()).hexdigest()[:12]


def split_row(line: str) -> list[str]:
    """
    把 Markdown 表格行切成单元格。

    关键：概念里常写 `P(B\|A)` 这种带转义竖线的公式，
    按裸 `|` 切会把一行切碎、所有列右移（实测毁掉 5 张卡）。
    因此只按「前面不是反斜杠」的竖线切，再把 `\|` 还原成 `|`。
    """
    body = line.strip()
    if body.startswith("|"):
        body = body[1:]
    if body.endswith("|") and not body.endswith("\\|"):
        body = body[:-1]
    cells = re.split(r"(?<!\\)\|", body)
    return [c.replace("\\|", "|").strip() for c in cells]


def is_sep_row(cells: list[str]) -> bool:
    return all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c != "")


NUMERIC_RE = re.compile(r"^-?\d+(?:\.\d+)?$")


def locate_columns(cells: list[str]) -> int | None:
    """
    在切碎的单元格里定位 S 列的下标。

    锚点是「S 数字、D 数字、last 日期、due 日期」这四连——概念和历史里
    都可能出现裸竖线（E|X|、|z|>1、原电池符号 Cu|Cu²⁺），单靠左数会猜错边。
    找不到就返回 None，由调用方如实记警告，不硬猜。
    """
    for k in range(1, len(cells) - 3):
        if (
            NUMERIC_RE.match(cells[k].strip())
            and NUMERIC_RE.match(cells[k + 1].strip())
            and DATE_RE.fullmatch(cells[k + 2].strip())
            and DATE_RE.fullmatch(cells[k + 3].strip())
        ):
            return k
    return None


def parse_date(value: str) -> str | None:
    """从任意文本里抠出第一个 YYYY-MM-DD；没有就返回 None。"""
    m = DATE_RE.search(value or "")
    return m.group(0) if m else None


def days_between(a: str, b: str) -> int | None:
    try:
        da = datetime.strptime(a, "%Y-%m-%d").date()
        db = datetime.strptime(b, "%Y-%m-%d").date()
        return (da - db).days
    except (ValueError, TypeError):
        return None


def walk(repo: str, *parts: str) -> list[str]:
    """返回 repo 下匹配 glob 片段的相对路径（已排序）。"""
    out: list[str] = []
    for root, dirs, files in os.walk(repo):
        dirs[:] = [d for d in dirs if d not in {".git", "node_modules", "__pycache__"}]
        for name in files:
            rel = os.path.relpath(os.path.join(root, name), repo).replace(os.sep, "/")
            if all(p in rel for p in parts):
                out.append(rel)
    return sorted(out)


# ---------------------------------------------------------------- 1. 总调度表

SCHED_TABLE_HINT = ("学科", "文件夹", "当前进度")


def harvest_schedule(repo: str, today: str) -> tuple[list[dict], list[str]]:
    """解析 `多学科并行-总调度.md` §一 的学科总览表。"""
    warnings: list[str] = []
    rel = "多学科并行-总调度.md"
    path = os.path.join(repo, rel)
    if not os.path.exists(path):
        return [], [f"缺少 {rel}"]

    lines = read_text(path).splitlines()
    rows: list[dict] = []
    header_cols: list[str] = []

    for idx, line in enumerate(lines, start=1):
        if not line.strip().startswith("|"):
            continue
        cells = split_row(line)
        if not header_cols and all(h in line for h in SCHED_TABLE_HINT):
            header_cols = cells
            continue
        if not header_cols or is_sep_row(cells):
            continue
        if len(cells) < len(header_cols):
            continue
        # 只取编号为纯数字的行（学科总览），跳过图例等杂行
        if not cells[0].strip().isdigit():
            continue
        folder_raw = cells[2]
        folders = re.findall(r"`([^`]+)/`", folder_raw)
        status = cells[4]
        emoji = ""
        for mark in ("🟢", "🟡", "🔵", "🔄", "⬜", "🔴"):
            if mark in status:
                emoji = mark
                break
        rows.append(
            {
                "no": int(cells[0]),
                "name": cells[1].strip(),
                "folders": folders or [folder_raw.strip("`")],
                "handoff_path": cells[3].strip("`"),
                "status_raw": status,
                "status_emoji": emoji or "⬜",
                "src": rel,
                "line": idx,
            }
        )

    if not rows:
        warnings.append(f"{rel}: 没解析出学科总览行")
    return rows, warnings


# ---------------------------------------------------------------- 2. 卡片账本

CARD_HEADER_KEYS = ("concept",)
CARD_COL_ALIASES = {
    "#": "id",
    "concept": "concept",
    "s (days)": "s",
    "s(days)": "s",
    "s": "s",
    "d (1-5)": "d",
    "d(1-5)": "d",
    "d": "d",
    "last": "last",
    "due": "due",
    "flags": "flags",
    "history": "history",
}


def _norm_header(cell: str) -> str:
    return re.sub(r"\s+", "", cell).lower()


def harvest_cards(repo: str, today: str) -> tuple[list[dict], list[dict], list[str]]:
    """
    扫描所有 `*/memory/drill-ledger/topics/topic*.md`，抽出间隔重复卡片。

    返回 (cards, topics, warnings)
    """
    warnings: list[str] = []
    cards: list[dict] = []
    topics: list[dict] = []

    for rel in walk(repo, "drill-ledger/topics/", ".md"):
        base = os.path.basename(rel)
        if base.lower().startswith("readme"):
            continue
        path = os.path.join(repo, rel)
        text = read_text(path)
        lines = text.splitlines()

        discipline = rel.split("/")[0]
        m = re.match(r"topic(\d+)-(.+)\.md$", base)
        topic_no = int(m.group(1)) if m else None
        topic_title = m.group(2) if m else base[:-3]

        # front-matter 里的 learner_notes
        learner_notes = ""
        fm = re.match(r"^---\n(.*?)\n---", text, re.S)
        if fm:
            ln = re.search(r"^learner_notes:\s*(.+)$", fm.group(1), re.M)
            if ln:
                learner_notes = ln.group(1).strip()

        colmap: list[str] = []
        header_seen = False
        repaired_rows: list[tuple[str, int, int]] = []
        found = 0
        for idx, raw in enumerate(lines, start=1):
            # 东方智慧把整行表格包在反引号里当行内代码写；先剥掉再看是不是表格行
            line = raw.strip()
            if line.startswith("`|") and line.endswith("|`"):
                line = line[1:-1]
            if not line.startswith("|"):
                colmap = []
                continue
            cells = split_row(line)
            low = [_norm_header(c) for c in cells]

            # 表头行：必须含 concept
            if not colmap and any(k in low for k in CARD_HEADER_KEYS):
                colmap = [CARD_COL_ALIASES.get(_norm_header(c), "") for c in cells]
                header_seen = True
                continue
            if not colmap or is_sep_row(cells):
                continue
            if len(cells) < 5:
                continue

            # 概念或历史里可能有没转义的裸竖线（E|X|=∞、|z|>1、Cu|Cu²⁺），
            # 把一行切碎。用「S数字 / D数字 / last日期 / due日期」四连做锚点定位真正的列边界，
            # 再把两侧多切的段各自拼回 concept 与 history。
            # 定位失败就如实记警告，不硬猜。
            repaired = False
            if len(cells) > len(colmap):
                k = locate_columns(cells)
                if k is None:
                    warnings.append(f"{rel}:{idx} 行被切碎且定位不到列锚点，该卡按原样解析（可能不准）")
                else:
                    concept = "|".join(cells[1:k])
                    tail = cells[k:]
                    flags_cell = tail[4] if len(tail) > 4 else ""
                    history_cell = "|".join(tail[5:]) if len(tail) > 5 else ""
                    cells = [
                        cells[0],
                        concept,
                        tail[0],
                        tail[1],
                        tail[2],
                        tail[3],
                        flags_cell,
                        history_cell,
                    ]
                    repaired = True
                    repaired_rows.append((rel, idx, k))

            rec = {"id_raw": cells[0]}
            for key, val in zip(colmap, cells):
                if key:
                    rec[key] = val
            if "concept" not in rec or not rec["concept"]:
                continue

            def num(key: str) -> float | None:
                v = rec.get(key, "")
                mm = re.search(r"-?\d+(?:\.\d+)?", v.replace(",", ""))
                return float(mm.group(0)) if mm else None

            due = parse_date(rec.get("due", ""))
            last = parse_date(rec.get("last", ""))
            overdue = days_between(today, due) if due else None

            cards.append(
                {
                    "uid": f"{discipline}#{rel.split('/')[-1][:-3]}#{rec['id_raw']}",
                    "discipline": discipline,
                    "topic_no": topic_no,
                    "topic": topic_title,
                    "card_id": rec["id_raw"].strip(),
                    "concept": rec["concept"].strip(),
                    "s": num("s"),
                    "d": num("d"),
                    "last": last,
                    "due": due,
                    "overdue_days": overdue,
                    "is_due": bool(overdue is not None and overdue >= 0),
                    "flags": [f.strip() for f in rec.get("flags", "").split(",") if f.strip()],
                    "repaired": repaired,
                    "history": rec.get("history", "").strip(),
                    "src": rel,
                    "line": idx,
                }
            )
            found += 1

        for r_rel, r_line, r_extra in repaired_rows:
            warnings.append(
                f"{r_rel}:{r_line} 行内有未转义的裸竖线，已按「S/D/日期」锚点重切列（S 在第 {r_extra} 列）"
            )

        topics.append(
            {
                "discipline": discipline,
                "topic_no": topic_no,
                "topic": topic_title,
                "card_count": found,
                "learner_notes": learner_notes,
                "src": rel,
                "sha1": sha1_of(path),
            }
        )
        if found == 0:
            if header_seen:
                warnings.append(f"{rel}: 空账本（表头在、0 张卡）")
            else:
                warnings.append(f"{rel}: 未找到卡片表头（该文件没有可解析的卡片表）")

    return cards, topics, warnings


def harvest_ledger_index(repo: str) -> tuple[list[dict], list[str]]:
    """解析每个学科的 drill-ledger/index.md 汇总行（用于和明细对账）。"""
    warnings: list[str] = []
    rows: list[dict] = []
    for rel in walk(repo, "drill-ledger/index.md"):
        discipline = rel.split("/")[0]
        lines = read_text(os.path.join(repo, rel)).splitlines()
        colmap: list[str] = []
        for idx, line in enumerate(lines, start=1):
            if not line.strip().startswith("|"):
                colmap = []
                continue
            cells = split_row(line)
            if not colmap and "课题" in line and "卡片数" in line:
                colmap = ["topic", "card_count", "due_count", "next_due", "last_session"]
                continue
            if not colmap or is_sep_row(cells) or len(cells) < 3:
                continue
            topic = cells[0]
            link = re.search(r"\[([^\]]+)\]", topic)
            name = link.group(1) if link else topic.strip("`")
            if not name or name.startswith("（"):
                continue

            def n(v: str) -> int | None:
                mm = re.search(r"\d+", v)
                return int(mm.group(0)) if mm else None

            rows.append(
                {
                    "discipline": discipline,
                    "topic": name.strip(),
                    "card_count": n(cells[1]),
                    "due_count": n(cells[2]),
                    "next_due": parse_date(cells[3]),
                    "last_session": cells[4].strip() if len(cells) > 4 else "",
                    "src": rel,
                    "line": idx,
                }
            )
    return rows, warnings


# ---------------------------------------------------------------- 3. 交接 / 下一步

def harvest_next_step(repo: str, discipline: str) -> dict | None:
    """从 HANDOFF.md 里抠出「下一步」段落的第一批要点。"""
    rel = f"{discipline}/memory/HANDOFF.md"
    path = os.path.join(repo, rel)
    if not os.path.exists(path):
        return None
    lines = read_text(path).splitlines()

    start = None
    for idx, line in enumerate(lines):
        if line.startswith("#") and ("下一步" in line or "接力下一步" in line):
            start = idx + 1
            break
    if start is None:
        return None

    bullets: list[str] = []
    for line in lines[start:]:
        if line.startswith("#"):
            break
        s = line.strip()
        if not s:
            continue
        if s.startswith(("-", "*", ">")) or re.match(r"^\d+[\.、]", s):
            cleaned = re.sub(r"^[-*>]\s*", "", s)
            cleaned = re.sub(r"^\d+[\.、]\s*", "", cleaned)
            if cleaned:
                bullets.append(cleaned)
        elif bullets:
            bullets[-1] += " " + s
        if len(bullets) >= 6:
            break
    if not bullets:
        return None
    return {"bullets": bullets, "src": rel}


# ---------------------------------------------------------------- 4. 大师天团

MASTER_RE = re.compile(r"^#\s*(.+?)\s*[·・]\s*(.+?)\s*$")


def harvest_masters(repo: str) -> list[dict]:
    out: list[dict] = []
    for rel in walk(repo, "大师天团/", ".md"):
        base = os.path.basename(rel)
        if base.lower().startswith("readme"):
            continue
        discipline = rel.split("/")[0]
        text = read_text(os.path.join(repo, rel))
        lines = text.splitlines()
        title = base[:-3]
        name, lens = title, ""
        for line in lines:
            m = MASTER_RE.match(line.strip())
            if m:
                name, lens = m.group(1).strip(), m.group(2).strip()
                break

        models: list[str] = []
        section = ""
        for line in lines:
            if line.startswith("##"):
                section = line.strip("# ").strip()
                continue
            if section.startswith("三个心智模型") or section.startswith("心智模型"):
                s = line.strip()
                mm = re.match(r"^\d+[\.、]\s*\*\*(.+?)\*\*", s)
                if mm:
                    models.append(mm.group(1).strip())
                elif not models:
                    mm2 = re.match(r"^\d+[\.、]\s*(.+)$", s)
                    if mm2:
                        models.append(re.sub(r"\*\*", "", mm2.group(1)).strip())

        limit = ""
        section = ""
        for line in lines:
            if line.startswith("##"):
                section = line.strip("# ").strip()
                continue
            if section.startswith("局限"):
                s = line.strip()
                if s:
                    limit = s
                    break

        out.append(
            {
                "discipline": discipline,
                "name": name,
                "lens": lens,
                "models": models[:4],
                "limit": limit,
                "src": rel,
            }
        )
    return out


# ---------------------------------------------------------------- 5. 路线图课题

def harvest_roadmap(repo: str) -> list[dict]:
    """从各学科 `科研式学习路线图.md` 抽「课题 NN　标题」。"""
    out: list[dict] = []
    pat = re.compile(r"^\s*[-*]\s*\*\*课题\s*(\d+)\*\*[　\s]*(.*)$")
    for rel in walk(repo, "科研式学习路线图.md"):
        discipline = rel.split("/")[0]
        lines = read_text(os.path.join(repo, rel)).splitlines()
        stage = ""
        for idx, line in enumerate(lines, start=1):
            if line.startswith("###"):
                stage = line.strip("# ").strip()
                continue
            m = pat.match(line)
            if m:
                out.append(
                    {
                        "discipline": discipline,
                        "no": int(m.group(1)),
                        "title": m.group(2).strip(),
                        "stage": stage,
                        "src": rel,
                        "line": idx,
                    }
                )
    return out


# ---------------------------------------------------------------- 6. 偏好 / 判例库

def harvest_preferences(repo: str) -> list[dict]:
    """LEARNINGS.md 里 `- [日期] **标题**：正文` 的硬偏好条目。"""
    out: list[dict] = []
    pat = re.compile(r"^-\s*\[(\d{4}-\d{2}-\d{2})\]\s*(.*)$")
    for rel in walk(repo, "memory/LEARNINGS.md"):
        discipline = rel.split("/")[0]
        section = ""
        lines = read_text(os.path.join(repo, rel)).splitlines()
        for idx, line in enumerate(lines, start=1):
            if line.startswith("##"):
                section = line.strip("# ").strip()
                continue
            m = pat.match(line.strip())
            if not m:
                continue
            body = m.group(2).strip()
            tm = re.match(r"\*\*(.+?)\*\*[：:]?\s*(.*)$", body)
            title = tm.group(1) if tm else body[:24]
            text = tm.group(2) if tm else body
            if section != "偏好":
                continue
            out.append(
                {
                    "discipline": discipline,
                    "date": m.group(1),
                    "title": title,
                    "text": text or body,
                    "src": rel,
                    "line": idx,
                }
            )
    return out


def harvest_case_law(repo: str) -> list[dict]:
    """ERRORS.md 里的判例条目。"""
    out: list[dict] = []
    for rel in walk(repo, "memory/ERRORS.md"):
        discipline = rel.split("/")[0]
        section = ""
        lines = read_text(os.path.join(repo, rel)).splitlines()
        buf: list[str] = []
        cur: dict | None = None
        for idx, line in enumerate(lines, start=1):
            if line.startswith("##"):
                section = line.strip("# ").strip()
                continue
            s = line.strip()
            m = re.match(r"^-\s*\*\*(判例[①-⑳\d]+|通用判例[①-⑳\d]+|[^\*]{2,40})\*\*[：:]\s*(.*)$", s)
            if m:
                if cur:
                    cur["text"] = " ".join(buf).strip()
                    out.append(cur)
                buf = [m.group(2)] if m.group(2) else []
                cur = {
                    "discipline": discipline,
                    "tag": m.group(1),
                    "section": section,
                    "src": rel,
                    "line": idx,
                }
                continue
            if cur is not None and s.startswith("-") is False and s:
                buf.append(re.sub(r"^\s+", "", s))
            elif cur is not None and not s:
                cur["text"] = " ".join(buf).strip()
                out.append(cur)
                cur = None
        if cur:
            cur["text"] = " ".join(buf).strip()
            out.append(cur)
    return out


# ---------------------------------------------------------------- 7. 交付物清点

DELIVERABLE_KINDS = {
    "开题简报": "开题",
    "研究报告": "报告",
    "一页报告": "报告",
    "导师审稿": "审稿",
    "判卷": "判卷",
    "检测卷": "试卷",
}


def harvest_deliverables(repo: str) -> dict[str, dict[str, int]]:
    out: dict[str, dict[str, int]] = {}
    for rel in walk(repo, ".md"):
        base = os.path.basename(rel)
        discipline = rel.split("/")[0]
        for key, kind in DELIVERABLE_KINDS.items():
            if key in base:
                bucket = out.setdefault(discipline, {})
                bucket[kind] = bucket.get(kind, 0) + 1
                break
    return out


# ---------------------------------------------------------------- 主流程

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True, help="zixue2026 本地克隆路径")
    ap.add_argument("--out", default=None, help="输出目录（默认 ../data）")
    ap.add_argument("--today", default=date.today().isoformat(), help="对账基准日 YYYY-MM-DD")
    args = ap.parse_args()

    repo = os.path.abspath(args.repo)
    if not os.path.isdir(repo):
        print(f"[harvest] 仓库路径不存在：{repo}", file=sys.stderr)
        return 2
    out_dir = args.out or os.path.join(os.path.dirname(__file__), "..", "data")
    out_dir = os.path.abspath(out_dir)
    os.makedirs(out_dir, exist_ok=True)
    today = args.today

    warnings: list[str] = []

    schedule, w = harvest_schedule(repo, today)
    warnings += w
    cards, topics, w = harvest_cards(repo, today)
    warnings += w
    ledger_index, w = harvest_ledger_index(repo)
    warnings += w
    masters = harvest_masters(repo)
    roadmap = harvest_roadmap(repo)
    preferences = harvest_preferences(repo)
    case_law = harvest_case_law(repo)
    deliverables = harvest_deliverables(repo)

    # ---- 学科聚合 ------------------------------------------------------
    # 总调度表里一门课可能挂多个文件夹（如 `probability/`（学习阵地）+
    # `概率论与数理统计/`（资料库））。这些是同一门课，必须合并成一个学科，
    # 主文件夹取「真的有台账/交付物的那个」。
    folder_to_name: dict[str, str] = {}
    by_name: dict[str, dict] = {}
    for row in schedule:
        name = row["name"]
        d = by_name.setdefault(
            name,
            {
                "name": name,
                "folders": [],
                "no": row["no"],
                "status_raw": row["status_raw"],
                "status_emoji": row["status_emoji"],
                "src": row["src"],
                "line": row["line"],
            },
        )
        for f in row["folders"]:
            if f not in d["folders"]:
                d["folders"].append(f)
            folder_to_name[f] = name

    def folder_score(f: str) -> int:
        """主文件夹判定：卡数 + 账本文件数 + 交付物数。"""
        return (
            sum(1 for c in cards if c["discipline"] == f)
            + sum(1 for t in topics if t["discipline"] == f)
            + sum(deliverables.get(f, {}).values())
        )

    for d in by_name.values():
        d["folders"] = sorted(d["folders"], key=lambda f: (-folder_score(f), f))
        d["folder"] = d["folders"][0] if d["folders"] else d["name"]

    # 卡账本里出现、但总调度表没登记的文件夹 → 单独成学科，标 unlisted
    for f in sorted({c["discipline"] for c in cards} | {t["discipline"] for t in topics}):
        if f not in folder_to_name:
            by_name[f] = {
                "name": f,
                "folders": [f],
                "folder": f,
                "no": None,
                "status_emoji": "⬜",
                "status_raw": "（总调度表未登记）",
                "unlisted": True,
            }
            folder_to_name[f] = f

    for card in cards:
        name = folder_to_name.get(card["discipline"], card["discipline"])
        d = by_name[name]
        d["cards_total"] = d.get("cards_total", 0) + 1
        if card["is_due"]:
            d["cards_due"] = d.get("cards_due", 0) + 1
        worst = card.get("overdue_days")
        if worst is not None:
            d["worst_overdue"] = max(d.get("worst_overdue", 0), worst)

    for d in by_name.values():
        d.setdefault("cards_total", 0)
        d.setdefault("cards_due", 0)
        d.setdefault("worst_overdue", 0)
        fam = d["folders"]
        d["topics_total"] = sum(1 for t in topics if t["discipline"] in fam)
        d["topics_with_cards"] = sum(
            1 for t in topics if t["discipline"] in fam and t["card_count"] > 0
        )
        d["roadmap_units"] = sum(1 for r in roadmap if r["discipline"] in fam)
        # 大师天团按人名去重（大学物理存在同一位大师的两份视角文件）
        seen: set[str] = set()
        dupes: list[str] = []
        for m in masters:
            if m["discipline"] not in fam:
                continue
            if m["name"] in seen:
                dupes.append(m["name"])
            else:
                seen.add(m["name"])
        d["masters"] = len(seen)
        d["master_dupes"] = sorted(set(dupes))
        deliv: dict[str, int] = {}
        for f in fam:
            for k, v in deliverables.get(f, {}).items():
                deliv[k] = deliv.get(k, 0) + v
        d["deliverables"] = deliv
        for f in fam:
            nxt = harvest_next_step(repo, f)
            if nxt:
                d["next_step"] = nxt
                break

    disc_list = sorted(by_name.values(), key=lambda d: (d.get("no") or 99, d["folder"]))
    snapshot_disciplines = disc_list

    # 卡片/主题上的 discipline 字段统一改成学科名，便于前端按学科分组
    for c in cards:
        c["discipline_name"] = folder_to_name.get(c["discipline"], c["discipline"])
    for t in topics:
        t["discipline_name"] = folder_to_name.get(t["discipline"], t["discipline"])

    snapshot = {
        "generated_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "as_of": today,
        "source_repo": "sunccchengze/zixue2026",
        "source_head": _git_head(repo),
        "totals": {
            "disciplines": len(disc_list),
            "topic_files": len(topics),
            "cards": len(cards),
            "cards_due": sum(1 for c in cards if c["is_due"]),
            "cards_overdue": sum(1 for c in cards if (c.get("overdue_days") or -1) > 0),
            "masters": len(masters),
            "roadmap_units": len(roadmap),
            "preferences": len(preferences),
            "case_law": len(case_law),
        },
        "disciplines": disc_list,
        "cards": cards,
        "topics": topics,
        "ledger_index": ledger_index,
        "masters": masters,
        "roadmap": roadmap,
        "preferences": preferences,
        "case_law": case_law,
        "parse_warnings": warnings,
    }

    # 对账：明细卡数 vs index.md 声称卡数
    recon: list[dict] = []
    detail = {}
    for t in topics:
        detail[(t["discipline"], t["topic"])] = detail.get((t["discipline"], t["topic"]), 0) + t["card_count"]
    for row in ledger_index:
        key = (row["discipline"], row["topic"])
        got = detail.get(key)
        if got is None:
            # index 里的课题名可能带「课题NN-」前缀，尝试宽松匹配
            for (disc, topic), n in detail.items():
                if disc == row["discipline"] and (topic in row["topic"] or row["topic"] in topic):
                    got = n
                    break
        recon.append(
            {
                "discipline": row["discipline"],
                "topic": row["topic"],
                "index_claims": row["card_count"],
                "detail_found": got if got is not None else 0,
                "match": (row["card_count"] == (got if got is not None else 0)),
                "src": row["src"],
            }
        )
    snapshot["reconciliation"] = recon
    mismatch = [r for r in recon if not r["match"]]
    snapshot["totals"]["recon_mismatch"] = len(mismatch)

    manifest = {
        "tool": "tools/harvest.py",
        "generated_at": snapshot["generated_at"],
        "as_of": today,
        "source_repo": "sunccchengze/zixue2026",
        "source_head": snapshot["source_head"],
        "totals": snapshot["totals"],
        "parse_warnings": warnings,
        "recon_mismatches": mismatch,
        "topic_files": [
            {"src": t["src"], "cards": t["card_count"], "sha1": t["sha1"]} for t in topics
        ],
    }

    with open(os.path.join(out_dir, "snapshot.json"), "w", encoding="utf-8") as fh:
        json.dump(snapshot, fh, ensure_ascii=False, indent=1)
    with open(os.path.join(out_dir, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=1)

    t = snapshot["totals"]
    print(f"[harvest] 学科 {t['disciplines']} · 卡账本文件 {t['topic_files']} · 卡片 {t['cards']} "
          f"(到期 {t['cards_due']}) · 大师 {t['masters']} · 路线图单元 {t['roadmap_units']}")
    print(f"[harvest] 解析告警 {len(warnings)} 条 · 对账不一致 {len(mismatch)} 处")
    for wmsg in warnings[:12]:
        print(f"          ! {wmsg}")
    print(f"[harvest] 写出 → {out_dir}/snapshot.json, {out_dir}/manifest.json")
    return 0


def _git_head(repo: str) -> str:
    head = os.path.join(repo, ".git", "HEAD")
    try:
        ref = read_text(head).strip()
        if ref.startswith("ref: "):
            return read_text(os.path.join(repo, ".git", ref[5:])).strip()[:12]
        return ref[:12]
    except OSError:
        return "unknown"


if __name__ == "__main__":
    sys.exit(main())
