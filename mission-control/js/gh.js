/**
 * gh.js — 从 GitHub 直接拉 zixue2026 的最新台账（浏览器端）
 *
 * 走公开 API，不需要登录：
 *   1) GET /git/trees/{ref}?recursive=1  → 一次拿到全量文件清单
 *   2) 只挑台账相关的 .md，从 raw.githubusercontent.com 取正文
 *   3) 交给 js/ledger.js 解析
 *
 * 未登录时 GitHub 限流 60 次/小时；这里把清单请求压到 1 次，
 * 正文请求数 ≈ 台账文件数（约 60–80），并在失败时如实报错，不假装成功。
 */

import { assemble } from "./ledger.js";

export const REPO = "sunccchengze/zixue2026";
const RAW = "https://raw.githubusercontent.com";
const API = "https://api.github.com";

/** 只同步这些文件——其余的（论文 PDF、课件、生图）不进浏览器。 */
const WANTED = [
  "多学科并行-总调度.md",
  "drill-ledger/topics/",
  "drill-ledger/index.md",
  "大师天团/",
  "科研式学习路线图.md",
  "memory/LEARNINGS.md",
  "memory/ERRORS.md",
  "memory/HANDOFF.md",
];

const wanted = (p) => WANTED.some((w) => p.endsWith(w) || p.includes(w));

/** 解析 GitHub 错误响应，给人话。 */
async function toError(res) {
  let detail = "";
  try {
    const j = await res.json();
    detail = j.message || "";
  } catch {}
  if (res.status === 403 && /rate limit/i.test(detail)) {
    return new Error("GitHub API 限流了（未登录 60 次/小时）。稍后再试，或继续用本地快照。");
  }
  return new Error(`GitHub 请求失败 ${res.status}${detail ? "：" + detail : ""}`);
}

/** 拿默认分支名。 */
export async function defaultBranch(repo = REPO) {
  const res = await fetch(`${API}/repos/${repo}`);
  if (!res.ok) throw await toError(res);
  const j = await res.json();
  return j.default_branch || "main";
}

/** 列出仓库里全部台账相关文件路径。 */
export async function listLedgerFiles(ref = "main", repo = REPO) {
  const res = await fetch(`${API}/repos/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`);
  if (!res.ok) throw await toError(res);
  const j = await res.json();
  if (j.truncated) {
    throw new Error("仓库文件树被 GitHub 截断了，台账可能不全。请用 tools/harvest.py 离线收割。");
  }
  return (j.tree || [])
    .filter((t) => t.type === "blob" && t.path.endsWith(".md"))
    .map((t) => t.path)
    .filter((p) => wanted(p) && !/(^|\/)README\.md$/i.test(p));
}

/** 并发拉正文，带节流与逐项失败上报。 */
async function fetchTexts(paths, ref, repo, onProgress) {
  const out = [];
  const CONCURRENCY = 6;
  let cursor = 0;
  let done = 0;
  const failed = [];

  async function worker() {
    while (cursor < paths.length) {
      const i = cursor++;
      const p = paths[i];
      try {
        const res = await fetch(`${RAW}/${repo}/${ref}/${encodeURI(p)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        out.push({ path: p, text: await res.text() });
      } catch (e) {
        failed.push(`${p}（${e.message}）`);
      }
      done++;
      if (onProgress) onProgress(done, paths.length);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return { out, failed };
}

/**
 * 完整同步：拉清单 → 拉正文 → 解析成 snapshot。
 * @param {object} opts { repo, ref, today, onProgress, signal }
 */
export async function sync(opts = {}) {
  const repo = opts.repo || REPO;
  const today = opts.today || new Date().toISOString().slice(0, 10);
  const ref = opts.ref || (await defaultBranch(repo));

  const paths = await listLedgerFiles(ref, repo);
  if (!paths.length) throw new Error("仓库里没找到任何台账文件，路径或分支对不上。");

  const { out, failed } = await fetchTexts(paths, ref, repo, opts.onProgress);
  if (!out.length) throw new Error(`所有台账文件都拉取失败。示例：${failed[0] || "未知"}`);

  const snap = assemble(out, today, { repo, head: ref });
  snap.sync = {
    ref,
    fetched: out.length,
    listed: paths.length,
    failed,
    at: new Date().toISOString(),
  };
  return snap;
}
