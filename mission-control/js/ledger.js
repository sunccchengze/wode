/**
 * ledger.js — 台账解析器（JS 版）
 *
 * 和 `tools/harvest.py` 是同一套口径的两份实现：Python 那份跑在离线/CI，
 * 这份跑在浏览器里做「同步台账」。两份实现必须由
 * `tests/test_ledger_parity.mjs` 交叉验证，卡数必须一致——
 * 不允许两套口径悄悄跑偏。
 *
 * 纯函数，不碰 DOM，浏览器和 Node 共用。
 */

const DATE_RE = /(\d{4})-(\d{2})-(\d{2})/;

const CARD_COL_ALIASES = {
  "#": "id",
  concept: "concept",
  "s(days)": "s",
  s: "s",
  "d(1-5)": "d",
  d: "d",
  last: "last",
  due: "due",
  flags: "flags",
  history: "history",
};

/**
 * 切分表格行。概念里常有 `P(B\|A)` 这种转义竖线，
 * 按裸 | 切会把行切碎、所有列右移——只按「前面不是反斜杠」的 | 切。
 * 口径必须与 tools/harvest.py 的 split_row 一致（由 parity 测试盯）。
 */
export function splitRow(line) {
  let body = line.trim();
  if (body.startsWith("|")) body = body.slice(1);
  if (body.endsWith("|") && !body.endsWith("\\|")) body = body.slice(0, -1);
  return body.split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, "|").trim());
}

export function isSepRow(cells) {
  return cells.filter((c) => c !== "").every((c) => /^:?-{2,}:?$/.test(c));
}

export function parseDate(v) {
  const m = DATE_RE.exec(v || "");
  return m ? m[0] : null;
}

export function daysBetween(a, b) {
  const da = Date.parse(a + "T00:00:00Z");
  const db = Date.parse(b + "T00:00:00Z");
  if (Number.isNaN(da) || Number.isNaN(db)) return null;
  return Math.round((db - da) / 86400000);
}

const normHeader = (c) => c.replace(/\s+/g, "").toLowerCase();

const NUMERIC_RE = /^-?\d+(?:\.\d+)?$/;

/**
 * 定位 S 列下标：锚点是「S数字、D数字、last日期、due日期」四连。
 * 口径与 tools/harvest.py 的 locate_columns 一致（parity 测试盯着）。
 */
export function locateColumns(cells) {
  for (let k = 1; k < cells.length - 3; k++) {
    if (
      NUMERIC_RE.test(cells[k].trim()) &&
      NUMERIC_RE.test(cells[k + 1].trim()) &&
      /^\d{4}-\d{2}-\d{2}$/.test(cells[k + 2].trim()) &&
      /^\d{4}-\d{2}-\d{2}$/.test(cells[k + 3].trim())
    ) {
      return k;
    }
  }
  return null;
}

/**
 * 解析一个卡账本文件的正文，返回卡片数组。
 * @param {string} text  Markdown 正文
 * @param {string} rel   仓库相对路径（用于 provenance）
 * @param {string} today YYYY-MM-DD
 */
export function parseTopicFile(text, rel, today) {
  const lines = text.split("\n");
  const cards = [];
  let colmap = [];
  let headerSeen = false;
  const repairedRows = [];

  const base = rel.split("/").pop();
  const discipline = rel.split("/")[0];
  const m = /^topic(\d+)-(.+)\.md$/.exec(base);
  const topicNo = m ? parseInt(m[1], 10) : null;
  const topicTitle = m ? m[2] : base.replace(/\.md$/, "");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    // 东方智慧把整行表格包在反引号里当行内代码写
    if (line.startsWith("`|") && line.endsWith("|`")) line = line.slice(1, -1);
    if (!line.startsWith("|")) {
      colmap = [];
      continue;
    }
    let cells = splitRow(line); // let：裸竖线重切列时要重新赋值
    const low = cells.map(normHeader);

    if (colmap.length === 0 && low.some((k) => k === "concept")) {
      colmap = cells.map((c) => CARD_COL_ALIASES[normHeader(c)] || "");
      headerSeen = true;
      continue;
    }
    if (colmap.length === 0 || isSepRow(cells) || cells.length < 5) continue;

    // 概念或历史里可能有未转义的裸竖线（E|X|、|z|>1、Cu|Cu²⁺），把行切碎。
    // 用「S数字 / D数字 / last日期 / due日期」四连做锚点重切列，两侧各自拼回。
    let repaired = false;
    if (cells.length > colmap.length) {
      const k = locateColumns(cells);
      if (k === null) {
        repairedRows.push({ rel, line: i + 1, anchor: null });
      } else {
        const tail = cells.slice(k);
        cells = [
          cells[0],
          cells.slice(1, k).join("|"),
          tail[0], tail[1], tail[2], tail[3],
          tail.length > 4 ? tail[4] : "",
          tail.length > 5 ? tail.slice(5).join("|") : "",
        ];
        repaired = true;
        repairedRows.push({ rel, line: i + 1, anchor: k });
      }
    }

    const rec = { id_raw: cells[0] };
    cells.forEach((val, idx) => {
      const key = colmap[idx];
      if (key) rec[key] = val;
    });
    if (!rec.concept) continue;

    const num = (key) => {
      const mm = /-?\d+(?:\.\d+)?/.exec((rec[key] || "").replace(/,/g, ""));
      return mm ? parseFloat(mm[0]) : null;
    };
    const due = parseDate(rec.due || "");
    // 口径必须与 Python 的 days_between(today, due) 一致：正数 = 已逾期。
    // JS 的 daysBetween(a,b) = b - a，因此参数顺序反过来写。
    const overdue = due ? daysBetween(due, today) : null;

    cards.push({
      uid: `${discipline}#${base.replace(/\.md$/, "")}#${rec.id_raw.trim()}`,
      discipline,
      topic_no: topicNo,
      topic: topicTitle,
      card_id: rec.id_raw.trim(),
      concept: rec.concept.trim(),
      s: num("s"),
      d: num("d"),
      last: parseDate(rec.last || ""),
      due,
      overdue_days: overdue,
      is_due: overdue !== null && overdue >= 0,
      flags: (rec.flags || "").split(",").map((f) => f.trim()).filter(Boolean),
      repaired,
      history: (rec.history || "").trim(),
      src: rel,
      line: i + 1,
    });
  }

  return { cards, headerSeen, topicNo, topicTitle, discipline, repairedRows };
}

/** 解析 drill-ledger/index.md 汇总行。 */
export function parseLedgerIndex(text, rel) {
  const rows = [];
  let colmap = [];
  text.split("\n").forEach((raw, i) => {
    const line = raw.trim();
    if (!line.startsWith("|")) {
      colmap = [];
      return;
    }
    const cells = splitRow(line);
    if (colmap.length === 0 && line.includes("课题") && line.includes("卡片数")) {
      colmap = ["topic", "card_count", "due_count", "next_due", "last_session"];
      return;
    }
    if (colmap.length === 0 || isSepRow(cells) || cells.length < 3) return;
    const link = /\[([^\]]+)\]/.exec(cells[0]);
    const name = (link ? link[1] : cells[0].replace(/`/g, "")).trim();
    if (!name || name.startsWith("（")) return;
    const n = (v) => {
      const mm = /\d+/.exec(v);
      return mm ? parseInt(mm[0], 10) : null;
    };
    rows.push({
      discipline: rel.split("/")[0],
      topic: name,
      card_count: n(cells[1]),
      due_count: n(cells[2]),
      next_due: parseDate(cells[3]),
      last_session: cells[4] ? cells[4].trim() : "",
      src: rel,
      line: i + 1,
    });
  });
  return rows;
}

const SCHEDULE_HINTS = ["学科", "文件夹", "当前进度"];

/** 解析 `多学科并行-总调度.md` 的学科总览表。 */
export function parseSchedule(text, rel) {
  const rows = [];
  let cols = [];
  text.split("\n").forEach((raw, i) => {
    const line = raw.trim();
    if (!line.startsWith("|")) return;
    const cells = splitRow(line);
    if (cols.length === 0 && SCHEDULE_HINTS.every((h) => line.includes(h))) {
      cols = cells;
      return;
    }
    if (cols.length === 0 || isSepRow(cells) || cells.length < cols.length) return;
    if (!/^\d+$/.test(cells[0].trim())) return;
    const folders = [...cells[2].matchAll(/`([^`]+)\/`/g)].map((m) => m[1]);
    const status = cells[4];
    const emoji = ["🟢", "🟡", "🔵", "🔄", "⬜", "🔴"].find((e) => status.includes(e)) || "⬜";
    rows.push({
      no: parseInt(cells[0], 10),
      name: cells[1].trim(),
      folders: folders.length ? folders : [cells[2].replace(/`/g, "").trim()],
      handoff_path: cells[3].replace(/`/g, "").trim(),
      status_raw: status,
      status_emoji: emoji,
      src: rel,
      line: i + 1,
    });
  });
  return rows;
}

const MASTER_RE = /^#\s*(.+?)\s*[·・]\s*(.+?)\s*$/;

/** 解析大师天团文件。 */
export function parseMaster(text, rel) {
  const lines = text.split("\n");
  const base = rel.split("/").pop();
  let name = base.replace(/\.md$/, "");
  let lens = "";
  for (const line of lines) {
    const m = MASTER_RE.exec(line.trim());
    if (m) {
      name = m[1].trim();
      lens = m[2].trim();
      break;
    }
  }

  const models = [];
  let section = "";
  let limit = "";
  let section2 = "";
  for (const line of lines) {
    if (line.startsWith("##")) {
      section = line.replace(/^#+\s*/, "").trim();
      continue;
    }
    if (section.includes("心智模型")) {
      const s = line.trim();
      const mm = /^\d+[.、]\s*\*\*(.+?)\*\*/.exec(s);
      if (mm) models.push(mm[1].trim());
      else if (!models.length) {
        const mm2 = /^\d+[.、]\s*(.+)$/.exec(s);
        if (mm2) models.push(mm2[1].replace(/\*\*/g, "").trim());
      }
    }
  }
  for (const line of lines) {
    if (line.startsWith("##")) {
      section2 = line.replace(/^#+\s*/, "").trim();
      continue;
    }
    if (section2.startsWith("局限") && line.trim()) {
      limit = line.trim();
      break;
    }
  }

  return {
    discipline: rel.split("/")[0],
    name,
    lens,
    models: models.slice(0, 4),
    limit,
    src: rel,
  };
}

/** 解析路线图课题。 */
export function parseRoadmap(text, rel) {
  const out = [];
  let stage = "";
  const pat = /^\s*[-*]\s*\*\*课题\s*(\d+)\*\*[　\s]*(.*)$/;
  text.split("\n").forEach((line, i) => {
    if (line.startsWith("###")) {
      stage = line.replace(/^#+\s*/, "").trim();
      return;
    }
    const m = pat.exec(line);
    if (m) {
      out.push({
        discipline: rel.split("/")[0],
        no: parseInt(m[1], 10),
        title: m[2].trim(),
        stage,
        src: rel,
        line: i + 1,
      });
    }
  });
  return out;
}

/** 解析 HANDOFF 的「下一步」。 */
export function parseNextStep(text, rel) {
  const lines = text.split("\n");
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#") && (lines[i].includes("下一步") || lines[i].includes("接力下一步"))) {
      start = i + 1;
      break;
    }
  }
  if (start < 0) return null;
  const bullets = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("#")) break;
    const s = line.trim();
    if (!s) continue;
    if (/^[-*>]/.test(s) || /^\d+[.、]/.test(s)) {
      const cleaned = s.replace(/^[-*>]\s*/, "").replace(/^\d+[.、]\s*/, "");
      if (cleaned) bullets.push(cleaned);
    } else if (bullets.length) {
      bullets[bullets.length - 1] += " " + s;
    }
    if (bullets.length >= 6) break;
  }
  return bullets.length ? { bullets, src: rel } : null;
}

/** 从 LEARNINGS.md 抽「偏好」节。 */
export function parsePreferences(text, rel) {
  const out = [];
  let section = "";
  const pat = /^-\s*\[(\d{4}-\d{2}-\d{2})\]\s*(.*)$/;
  text.split("\n").forEach((raw, i) => {
    const line = raw.trim();
    if (line.startsWith("##")) {
      section = line.replace(/^#+\s*/, "").trim();
      return;
    }
    const m = pat.exec(line);
    if (!m || section !== "偏好") return;
    const body = m[2].trim();
    const tm = /^\*\*(.+?)\*\*[：:]?\s*(.*)$/.exec(body);
    out.push({
      discipline: rel.split("/")[0],
      date: m[1],
      title: tm ? tm[1] : body.slice(0, 24),
      text: tm ? tm[2] || body : body,
      src: rel,
      line: i + 1,
    });
  });
  return out;
}

/** 从 ERRORS.md 抽判例。 */
export function parseCaseLaw(text, rel) {
  const out = [];
  let section = "";
  let buf = [];
  let cur = null;
  const flush = () => {
    if (cur) {
      cur.text = buf.join(" ").trim();
      out.push(cur);
    }
  };
  text.split("\n").forEach((raw, i) => {
    const line = raw.trim();
    if (line.startsWith("##")) {
      section = line.replace(/^#+\s*/, "").trim();
      return;
    }
    const m = /^-\s*\*\*(判例[①-⑳\d]+|通用判例[①-⑳\d]+|[^*]{2,40})\*\*[：:]\s*(.*)$/.exec(line);
    if (m) {
      flush();
      buf = m[2] ? [m[2]] : [];
      cur = { discipline: rel.split("/")[0], tag: m[1], section, src: rel, line: i + 1 };
      return;
    }
    if (cur && !line.startsWith("-") && line) buf.push(line.trim());
    else if (cur && !line) {
      flush();
      cur = null;
    }
  });
  flush();
  return out;
}

/**
 * 把一堆 { path, text } 组装成和 Python 版同构的 snapshot。
 * @param {Array<{path:string,text:string}>} files
 * @param {string} today
 */
export function assemble(files, today, meta = {}) {
  const warnings = [];
  const byPath = new Map(files.map((f) => [f.path, f.text]));

  const cards = [];
  const topics = [];
  const ledgerIndex = [];
  const masters = [];
  const roadmap = [];
  const preferences = [];
  const caseLaw = [];
  let schedule = [];

  for (const { path, text } of files) {
    if (path.endsWith("多学科并行-总调度.md")) {
      schedule = parseSchedule(text, path);
    } else if (path.includes("drill-ledger/topics/") && path.endsWith(".md")) {
      if (path.split("/").pop().toLowerCase().startsWith("readme")) continue;
      const r = parseTopicFile(text, path, today);
      cards.push(...r.cards);
      topics.push({
        discipline: r.discipline,
        topic_no: r.topicNo,
        topic: r.topicTitle,
        card_count: r.cards.length,
        src: path,
      });
      for (const rr of r.repairedRows) {
        warnings.push(
          rr.anchor === null
            ? `${rr.rel}:${rr.line} 行被切碎且定位不到列锚点，该卡按原样解析（可能不准）`
            : `${rr.rel}:${rr.line} 行内有未转义的裸竖线，已按「S/D/日期」锚点重切列（S 在第 ${rr.anchor} 列）`
        );
      }
      if (!r.cards.length) {
        warnings.push(
          r.headerSeen
            ? `${path}: 空账本（表头在、0 张卡）`
            : `${path}: 未找到卡片表头（该文件没有可解析的卡片表）`
        );
      }
    } else if (path.endsWith("drill-ledger/index.md")) {
      ledgerIndex.push(...parseLedgerIndex(text, path));
    } else if (path.includes("大师天团/") && path.endsWith(".md")) {
      if (path.split("/").pop().toLowerCase().startsWith("readme")) continue;
      masters.push(parseMaster(text, path));
    } else if (path.endsWith("科研式学习路线图.md")) {
      roadmap.push(...parseRoadmap(text, path));
    } else if (path.endsWith("memory/LEARNINGS.md")) {
      preferences.push(...parsePreferences(text, path));
    } else if (path.endsWith("memory/ERRORS.md")) {
      caseLaw.push(...parseCaseLaw(text, path));
    }
  }

  // ---- 学科聚合（与 Python 版同规则）----
  const folderToName = new Map();
  const byName = new Map();
  for (const row of schedule) {
    if (!byName.has(row.name)) {
      byName.set(row.name, {
        name: row.name, folders: [], no: row.no,
        status_raw: row.status_raw, status_emoji: row.status_emoji,
        src: row.src, line: row.line,
      });
    }
    const d = byName.get(row.name);
    for (const f of row.folders) {
      if (!d.folders.includes(f)) d.folders.push(f);
      folderToName.set(f, row.name);
    }
  }
  const score = (f) =>
    cards.filter((c) => c.discipline === f).length +
    topics.filter((t) => t.discipline === f).length;

  for (const d of byName.values()) {
    d.folders.sort((a, b) => score(b) - score(a) || a.localeCompare(b));
    d.folder = d.folders[0] || d.name;
  }
  const allFolders = new Set([...cards.map((c) => c.discipline), ...topics.map((t) => t.discipline)]);
  for (const f of [...allFolders].sort()) {
    if (!folderToName.has(f)) {
      byName.set(f, {
        name: f, folders: [f], folder: f, no: null,
        status_emoji: "⬜", status_raw: "（总调度表未登记）", unlisted: true,
      });
      folderToName.set(f, f);
    }
  }

  for (const c of cards) {
    const d = byName.get(folderToName.get(c.discipline) || c.discipline);
    d.cards_total = (d.cards_total || 0) + 1;
    if (c.is_due) d.cards_due = (d.cards_due || 0) + 1;
    if (c.overdue_days != null) d.worst_overdue = Math.max(d.worst_overdue || 0, c.overdue_days);
  }

  const nextSteps = new Map();
  for (const { path, text } of files) {
    if (!path.endsWith("memory/HANDOFF.md")) continue;
    const ns = parseNextStep(text, path);
    if (ns) nextSteps.set(path.split("/")[0], ns);
  }

  const disciplines = [...byName.values()].map((d) => {
    d.cards_total = d.cards_total || 0;
    d.cards_due = d.cards_due || 0;
    d.worst_overdue = d.worst_overdue || 0;
    const fam = d.folders;
    d.topics_total = topics.filter((t) => fam.includes(t.discipline)).length;
    d.topics_with_cards = topics.filter((t) => fam.includes(t.discipline) && t.card_count > 0).length;
    d.roadmap_units = roadmap.filter((r) => fam.includes(r.discipline)).length;
    const seen = new Set();
    const dupes = [];
    for (const m of masters) {
      if (!fam.includes(m.discipline)) continue;
      if (seen.has(m.name)) dupes.push(m.name);
      else seen.add(m.name);
    }
    d.masters = seen.size;
    d.master_dupes = [...new Set(dupes)].sort();
    for (const f of fam) if (nextSteps.has(f)) { d.next_step = nextSteps.get(f); break; }
    return d;
  });
  disciplines.sort((a, b) => (a.no || 99) - (b.no || 99) || a.folder.localeCompare(b.folder));

  for (const c of cards) c.discipline_name = folderToName.get(c.discipline) || c.discipline;
  for (const t of topics) t.discipline_name = folderToName.get(t.discipline) || t.discipline;

  // ---- 对账 ----
  const detail = new Map();
  for (const t of topics) {
    const k = `${t.discipline}\u0000${t.topic}`;
    detail.set(k, (detail.get(k) || 0) + t.card_count);
  }
  const reconciliation = ledgerIndex.map((row) => {
    let got = detail.get(`${row.discipline}\u0000${row.topic}`);
    if (got === undefined) {
      for (const [k, n] of detail) {
        const [disc, topic] = k.split("\u0000");
        if (disc === row.discipline && (topic.includes(row.topic) || row.topic.includes(topic))) {
          got = n;
          break;
        }
      }
    }
    const found = got === undefined ? 0 : got;
    return {
      discipline: row.discipline,
      topic: row.topic,
      index_claims: row.card_count,
      detail_found: found,
      match: row.card_count === found,
      src: row.src,
    };
  });

  return {
    generated_at: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    as_of: today,
    source_repo: meta.repo || "sunccchengze/zixue2026",
    source_head: meta.head || "live",
    totals: {
      disciplines: disciplines.length,
      topic_files: topics.length,
      cards: cards.length,
      cards_due: cards.filter((c) => c.is_due).length,
      cards_overdue: cards.filter((c) => (c.overdue_days || -1) > 0).length,
      masters: masters.length,
      roadmap_units: roadmap.length,
      preferences: preferences.length,
      case_law: caseLaw.length,
      recon_mismatch: reconciliation.filter((r) => !r.match).length,
    },
    disciplines,
    cards,
    topics,
    ledger_index: ledgerIndex,
    masters,
    roadmap,
    preferences,
    case_law: caseLaw,
    reconciliation,
    parse_warnings: warnings,
  };
}
