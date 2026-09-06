# NOTICE · 原始规约的来源、版权与已知缺陷

> 本目录 6 份文件是 `sunccchengze/wendang11` 的 `skills/00-*-原始.md`，2026-09-06 迁入本仓。
> 它们的**真实源头不是 wendang11**，而是 `sunccchengze/turbine-blade-ai-platform` @ `736985ce2d21083849c1af95d7a18bb98cce0d7e` 的 `技能库&准则/`；再往上，其中三份是第三方作品。
> **完整性声明（含一次自纠）**：首轮拷贝我用 Python 文本模式读取，把 CRLF 静默转成了 LF，导致 4 份文件字节数与源不符（而我当时在本文件里已经写下"md5 一致"）。发现后改用**二进制模式重拷**，并逐份复核 md5 与 CRLF 行数。当前状态（**2026-09-06 直接对 turbine @ `736985ce2` 的 `技能库&准则/` 逐份取原文做 md5 比对，不是只对 wendang11**）：**5 份 md5 完全一致**——`Humanizer - 中文版.md` `9fc163fb`、`MULTI_AGENT_ORCHESTRATION.md` `310976cc`、`SKILL运用指南.md` `a25f52b0`（29806 字节）、`内阁决策.md` `53064e2f`、`最高优先级AGENT必须遵守的宪法级文件 - 副本.md` `27aeaeb6`；第 6 份 `Stop-slop.md` 源为 2906 字节 `55d06363`，本仓 3062 字节 `1440d9cb`，**+156 字节全部来自 3 处有意为之的链接补丁**（把仓内不存在的 `references/{phrases,structures,examples}.md` 相对链接改为上游 GitHub 绝对链接）。也就是说 wendang11 是忠实副本，内容缺陷在源头就有。详见 [`../../遗留五条结案-2026-09-06.md`](../../遗留五条结案-2026-09-06.md) §7。

---

## 一、逐份归属

| 本仓文件 | 字节 | 真实源头（已核到一手） | 版权／许可 | 已知缺陷 |
| --- | --- | --- | --- | --- |
| `00-宪法级文件-原始.md` | 2407 | turbine `技能库&准则/最高优先级AGENT必须遵守的宪法级文件 - 副本.md` ← **`multica-ai/andrej-karpathy-skills`**（原 `forrestchang/…`，⭐210,488）的 `CLAUDE.md` **删掉首行标题 `# CLAUDE.md`**（2357 − 12 − 1 = 2344 = 本仓去 CRLF 后字节数） | 作者 **Jiayuan Chang**（X `@jiayuan_jy`）。仓内**无 LICENSE 文件**，但 README §License 与 `skills/karpathy-guidelines/SKILL.md` frontmatter 均自我声明 **MIT**；本仓按 MIT 处理并注明"以仓库自我声明为据" | CRLF 行尾；正文首行前有空行；无标题行（首行已被删）。**内容是对 Karpathy 2025 年末 X 帖（status `2015883857489522876`）的二手提炼，Karpathy 本人未执笔**——「宪法级文件」这个文件名容易让人误读出处 |
| `00-Humanizer-中文版-原始.md` | 19380 | turbine `技能库&准则/Humanizer - 中文版.md` ← **`op7418/Humanizer-zh`**（归藏，⭐16,743）的 `SKILL.md`，**除末尾少一个换行外字节全同**（18897 vs 18898）← 再上游 `blader/humanizer`（⭐43,736），参考 `hardikpandya/stop-slop` | MIT · Copyright (c) 2026 op7418 / 归藏（`op7418/Humanizer-zh`，仓内含 1063 字节 MIT 全文）；Copyright (c) 2025 Siqi Chen（`blader/humanizer`）；Copyright (c) 2025 Hardik Pandya（`stop-slop`） | 文件自带 frontmatter 已注明 `source: 翻译自 blader/humanizer，参考 hardikpandya/stop-slop`，但**未点名真正的译本仓 `op7418/Humanizer-zh`**。CRLF 行尾。**译本授权已解决**（双层上游均 MIT），对外分发时补上 op7418 的署名即可 |
| `00-内阁决策-原始.md` | 10386 | turbine `技能库&准则/内阁决策.md`；**上游不可考** | skill 名 `ai-cabinet-decision-making`。GitHub 代码搜索 `ai-cabinet-decision-making` / `reveal clarity gaps caused by expertise` / `Simulate an AI Cabinet with five roles` **全部 0 命中**，判定为**作者不详的中文社群转贴**（证据：中文引导语 + frontmatter 被**全角方括号**包裹 + 英文正文配中文示例，是渲染页复制回流的典型形态）。**无许可证** | CRLF 行尾。开头两行是主人的中文使用说明，其后才是英文 skill 正文，两者未分隔。**保留为历史材料，不对外分发**（作者不详、无许可证） |
| `00-Stop-slop-原始.md` | **3062**（源 2906，+156 为 3 处链接补丁） | turbine `技能库&准则/Stop-slop.md` ← **`hardikpandya/stop-slop`**（⭐16,844） | MIT · Copyright (c) 2025 Hardik Pandya（https://hvpandya.com） | **是渲染页复制品**：CRLF 行尾、markdown 被反斜杠转义（`\---`、`\#`）、空格写成 `&#x20;`。原文 3 个相对链接 `references/{phrases,structures,examples}.md` 在本仓不存在，**已改写为上游 GitHub 绝对链接**（三个路径均已在 `hardikpandya/stop-slop` 核实存在，+156 字节）。这是本目录唯一被有意改动过的文件 |
| `00-MULTI_AGENT_ORCHESTRATION-原始.md` | 3930 | turbine 同名文件 | **孙承泽自有**（turbine 项目原创，适用项目写明「风电场偏航优化可视化平台与大创答辩工程」） | 语境是叶轮机械科研工程，角色名【老弗】【老卡】【老芒】【老达】【老贝】【老乔】是那个项目的人，不是本仓的 |
| `00-SKILL运用指南-原始.md` | 29806 | turbine 同名文件 | **孙承泽自有** | ⚠️ **含 3 处未解决的 git 冲突（共 9 行标记）**：`<<<<<<< HEAD` / `=======` / `>>>>>>> aa6c0e44 (feat(skills): 全量装载 17 大顶尖开源技能库…)`。三处分别是①标题与前言（8 行 vs 7 行）②§0 回复声明规范（"第一行…绝无例外" vs 弱化版）③§1 技能全景矩阵（**260 行 vs 86 行**）。**turbine 的 `main` 与两个 arena 分支同字节（29806），说明冲突在源头就没解决**，不是搬运造成的。本仓按「历史材料一字不改」原则保留原样。**裁决建议见 §5** |

---

## 二、上游版权声明（履行保留义务）

按本仓 `reference-repos/REFERENCE-INDEX.md` 使用边界第 4 条：「直接移植代码或大段表达时，必须补许可证全文与版权声明，不能只留链接」。以下三份 MIT 作品的 LICENSE 均为标准 MIT（各 21 行，2026-09-06 从 GitHub API 取原文核对）。

**版权归属**

- Copyright (c) 2025 Hardik Pandya — `hardikpandya/stop-slop`（`00-Stop-slop-原始.md` 的上游；亦被 `blader/humanizer` 参考）
- Copyright (c) 2025 Siqi Chen — `blader/humanizer`（`00-Humanizer-中文版-原始.md` 的英文原版上游）
- Copyright (c) 2026 op7418 / 归藏 — `op7418/Humanizer-zh`（`00-Humanizer-中文版-原始.md` 的**直接字节来源**）
- Jiayuan Chang（X `@jiayuan_jy`）— `multica-ai/andrej-karpathy-skills`（`00-宪法级文件-原始.md` 的直接来源）。**声明 MIT 但仓内无 LICENSE 文件**，本仓按自我声明处理并如实标注证据缺口
- 提炼素材来源：Andrej Karpathy 的 X 帖 `https://x.com/karpathy/status/2015883857489522876`（非本文字的作者）
- `00-内阁决策-原始.md`：**作者不详，无许可证**，见 §1

**许可证正文**

```text
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 三、这些文件在本仓的定位

**它们是历史材料，不是本仓现行规则。**

按 `AGENTS.md` §8 指令层级，本仓现行纪律是 `AGENTS.md` + `corpus/README.md`；这 6 份是它们的**前身来源**，用来回答「本仓那套规矩是从哪儿来的」。冲突时以 `AGENTS.md` 为准。

真正在本仓**可用**的转化版本是这两份（已把上述原始规约改造成 MBTI 探索者语境）：

- [`../恋爱军师技能总纲.md`](../恋爱军师技能总纲.md)：调度声明铁律、宪法级准则、内阁五方红蓝对抗、Stop-slop 中文 8 条、双盲否决、6 阶记忆、证据分级 E0–E4
- [`../恋爱大师10人团队.md`](../恋爱大师10人团队.md)：10 个稳定提问视角 + 技能路由表

**不要做的事**：不要把这 6 份原始文件当 skill 直接加载。`00-Stop-slop` 与 `00-宪法级文件` 是带转义符的复制品，`00-SKILL运用指南` 带未解决冲突标记，`00-MULTI_AGENT_ORCHESTRATION` 的角色是叶轮机械项目的人。要用的话用上面两份转化版。

**关于「AI 内阁」方法的归属**：`00-内阁决策-原始.md` 的五角色（First Principles / Opposition / Opportunity / Outsider / Executor + Chair）与你自己在 `sunccchengze/Yingzai2026` 的五席内阁（追问派／反对派／机会派／外行人／执行派）一一对应，而那份纪要的会议时间是 **2026-08-02**，比 turbine 技能库被 wendang11 钉定的 **2026-08-11** 早 9 天。**按现有证据，这份文件不是你方法的来源，而是方法的一个事后表述。** 要引用五席方法，引你自己的纪要和 `../恋爱军师技能总纲.md` §3（创造性转化版，权属清楚）。

---

## 四、原先的待确认清单：结案

> 上一版此处是 5 条【待确认】。2026-09-06 按主人指令做了全维度权威核验，逐条结案。完整证据与可复现命令见 [`../../遗留五条结案-2026-09-06.md`](../../遗留五条结案-2026-09-06.md)。

| 项 | 结案 |
| --- | --- |
| 「宪法级文件」的上游作者与许可证 | ✅ **钉死**。= `multica-ai/andrej-karpathy-skills` 的 `CLAUDE.md` 删首行。作者 Jiayuan Chang。MIT 为仓库自我声明，**仓内无 LICENSE 文件**（GitHub license 检测返回 `null`）——这是证据缺口，已如实标注 |
| `Humanizer - 中文版` 译者的版权与授权 | ✅ **钉死**。= `op7418/Humanizer-zh` 的 `SKILL.md`，除末尾换行外字节全同。双层上游（op7418 MIT → blader/humanizer MIT）均授权明确，译本仓自带 MIT 全文 |
| `ai-cabinet-decision-making`（内阁决策）的上游作者与许可证 | ✅ **查清为不可考**。公开 GitHub 三个特征串 0 命中；形态指向中文社群转贴；无许可证。**处置：保留为历史材料，不对外分发** |
| `SKILL运用指南` 的冲突标记该保留哪个版本 | ✅ **裁决已执行**（先前写成「9 处」是数了标记行数，实际 **3 处冲突**）。产物 [`../SKILL运用指南-合并裁决版.md`](../SKILL运用指南-合并裁决版.md)，逐行验证见 §5.3；原始冲突版一字未改 |
| turbine submodule 钉定分支 `arena/019feb03-turbine-blade-ai-platform` 已 404 | ✅ 已核实（2026-09-06 GitHub API）。钉定 commit `736985ce2d21083849c1af95d7a18bb98cce0d7e` 仍存在，可按 commit 取，但不能按分支取 |

---

## 五、`SKILL运用指南` 冲突：裁决**已执行**，产物在同目录上一层

**合并版**：[`../SKILL运用指南-合并裁决版.md`](../SKILL运用指南-合并裁决版.md)（38,419 字节／456 行／`## ` 级标题 22 个（§0–§21）／**残留冲突标记 0 个**）。
**原始冲突版一字未改**，仍在本目录 `00-SKILL运用指南-原始.md`（29,806 字节，md5 `a25f52b0…`，与 turbine 源全同）。
完整裁决理由、对账数据与逐行验证结果见 [`../../遗留五条结案-2026-09-06.md`](../../遗留五条结案-2026-09-06.md) §4。

### 5.1 实测装载规模（2026-09-06，GitHub API 直取 turbine @ `736985ce2` 的 `技能库&准则/`）

> ⚠️ **更正**：本节先前写「一级条目 62 个，其中 zip 11 个 → 实体技能库目录 51 个」。**这是错的**——那 11 个 zip 是 blob，不在 62 个目录里，属于拿文件数减目录数的类别错误。正确值如下表。

| 指标 | 实测 | 两侧自报的数字 |
| --- | --- | --- |
| 一级条目合计 | **79** | — |
| 目录（实体技能库） | **62**；去重后唯一 **60**（含 2 组大小写孪生） | HEAD「33 大技能模块」偏少；传入「58 大领域专业技能库」也偏少 |
| 文件 | **17** = 11 zip + 6 md | 传入「17 大核心规约档案」= **实测 17 个一级文件，这条说对了** |
| 全递归 `SKILL.md` | **2712** | HEAD「86+ SKILL.md」差 **31 倍** |
| 一级子目录**直下**的 `SKILL.md` | **0** | 各库入口文件名不统一，任何「SKILL.md 计数」都不能当装载规模指标 |
| `技能库&准则/` 下总路径 | **47,965**（占全仓 48,486 的 **98.9%**） | — |

### 5.2 裁决（四条）

| 冲突 | 取哪侧 | 理由 |
| --- | --- | --- |
| ① 标题与前言 | 标题取**传入侧**、前言与整理日期取 **HEAD 侧**、装载规模**两侧都弃用改实测** | 「两机」「能动强基 2501 班」身份更完整；HEAD 前言含「多 Agent 协作架构」定位更全；两侧装载数字均与实测不符 |
| ② §0 声明规范 | 取 **HEAD 侧**（「开篇**第一行**」「**绝无例外**」） | 与本仓 `AGENTS.md` §0.3／§2.4、`../恋爱军师技能总纲.md` §1「调度声明铁律」同向；弱化版会与现行纪律打架 |
| ③ 正文 | **HEAD 侧 260 行全部保留为 §1–§17 主体**，**传入侧独有 3 节并入为 §18–§20**，传入侧 §5 丢弃 | **两侧不是同一批章节的两种写法，而是两条不同的文档尾巴**（HEAD 有 §1–§17，传入侧只有 §1–§5）。取一侧必丢内容。传入侧 §5「Windows 同步协议」与 HEAD §16 讲同一件事，而 §16 更严（`git pull --ff-only`、单行命令避免 CMD `^` 歧义、不盲目 reset），故丢弃并留差异记录 |
| 新增 | **§1.1 实测对账 · §1.2 八柱视角 · §1.3 漏掉的 6 个库 · §1.4 大小写孪生缺陷 · §21 丢弃说明** | 原文件没有、但按实测必须补 |

### 5.3 完整性逐行验证（不空口宣称"原样保留"）

| 核验项 | 结果 |
| --- | --- |
| HEAD §1 矩阵 20 行逐行原样 | ✅ |
| HEAD §2–§17 共 **237 行**逐行原样 | ✅ 全部一致 |
| §0 取 HEAD 侧、未混入传入侧弱化版 | ✅ |
| 传入侧独有内容已进入 §18–§20 | ✅ 抽样 6 行全中 |
| 传入侧 §5 已丢弃（无 `--ff-only` 的 `git pull origin arena…` 仅在 §21 引用说明里出现 1 次） | ✅ |
| 残留冲突标记 | ✅ **0** |
| §20 的重叠判定 | ✅ 在 HEAD 侧 260 行做关键词计数：`Emoji` **0 次**、`水平对齐` **0 次**、`数据墨水` **1 次**（仅 §1 矩阵的女娲大师行，无成文条款）、`Swiss` 2 次、`发丝` 4 次 → 传入侧「禁 Emoji」「双栏水平对齐」是 HEAD 完全没有的独有条款 |

### 5.4 顺带查出的两个缺陷（两侧冲突版本都没提，已写进合并版 §1.3／§1.4）

**① 大小写孪生目录，Windows 上会坏**：`Qwen-MM-Plugins/` 与 `qwen-mm-plugins/`（tree sha 同为 `77106837…`，各 1165 路径）、`Understand-Anything/` 与 `understand-anything/`（tree sha 同为 `45df30b2…`，各 590 路径）。**tree sha 完全相同**，即同一份内容注册两次，**1,755 条路径是纯冗余孪生副本**（占技能库 3.7%、全仓 3.6%）；全仓大小写重名组数实测正好 1,755，说明没有第三处。Windows 大小写不敏感（git 默认 `core.ignorecase=true`），这 1,755 对路径**无法同时 checkout**，而本文件 §16 的协议恰恰是让孙承泽在 Windows 上 `git pull`——工作树会永久脏。修法：删任一份（tree sha 相同，不丢内容），62 → 60 目录、47,965 → 46,210 路径。

**② 两侧矩阵合计漏掉 6 个真实存在的库**：`alirezarezvani-claude-skills/`（**6613 路径，全仓第一**）、`buildwithclaude-hub/`（**3057，全仓第五**）、`last30days-skill-main/`（205）、`WRITING.md-main/`（21）、`human-writing-main/`（20）、`AIGC_text_detector-main/`（13）。前两个合计 **9,670 路径 = 全仓的 20.0%**；后 4 个全属「AI 痕迹检测与人类化写作」一条线，与矩阵已列的 `Stop-slop.md`／`Humanizer - 中文版.md` 同域，**其中包括这条线唯一的检测器**。

**③ 但两侧都没有虚构库名**：HEAD 侧引用 44 个名字**全部真实存在**（39 个一级目录 + `.learnings`／`.opencodereview` 2 个仓根隐藏目录 + `nuwa-distilled/bojie-li-perspective`／`nuwa-distilled/self-harness-perspective`／`skills-main/skills/pptx` 3 个嵌套路径）；传入侧引用 48 个名字**48 个全部一级命中**。
