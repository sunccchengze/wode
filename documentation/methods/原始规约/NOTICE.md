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
| `SKILL运用指南` 的冲突标记该保留哪个版本 | ✅ **已给裁决**（先前写成「9 处」是数了标记行数，实际 **3 处冲突**）。见 §5。**合并版文件尚未生成**，需主人点头 |
| turbine submodule 钉定分支 `arena/019feb03-turbine-blade-ai-platform` 已 404 | ✅ 已核实（2026-09-06 GitHub API）。钉定 commit `736985ce2d21083849c1af95d7a18bb98cce0d7e` 仍存在，可按 commit 取，但不能按分支取 |

---

## 五、`SKILL运用指南` 冲突的裁决建议

**实测数据**（2026-09-06 从 turbine @ `736985ce2` 的 `技能库&准则/` 直接数）：一级条目 **62** 个，其中 zip 压缩包 **11** 个 → 实体技能库目录 **51** 个；全递归 `SKILL.md` **2712** 个（绝大多数在克隆进来的第三方仓内部）；一级子目录**直下**的 `SKILL.md` **0** 个（各库入口文件名不统一）。

所以两侧的装载数字**都不准**：HEAD 侧「33 大技能模块」偏少，传入侧「58 大领域专业技能库」偏多，「86+ SKILL.md」与实测差 30 倍。

**四条裁决**：

1. **§1 矩阵取 HEAD 侧（260 行）**——信息量是传入侧 86 行的 3 倍，逐条列出可当路由表；传入侧收拢成「The 8 Skill Pillars」后具体库名与定位丢失，不符合该文件自我定位的"统一入口/技能路由表"。
2. **标题与身份描述取传入侧**——「叶轮机械**与两机**」「能动强基 2501 班」比只写"叶轮机械"完整，也与本仓 `AGENTS.md` §1 记录的方向一致。
3. **§0 声明规范取 HEAD 侧**（"开篇**第一行**""**绝无例外**"）——与本仓 `AGENTS.md` §0.3、§2.4 和 `../恋爱军师技能总纲.md` §1「调度声明铁律」同向，弱化版会与现行纪律打架。
4. **两侧装载数字全部弃用，改为实测值**：`51 个实体技能库目录 + 11 个 zip（合计 62 个一级条目）`，并注明 2712 个 `SKILL.md` 绝大多数属第三方仓内部，不能当本仓装载规模。

**为何尚未生成合并文件**：原始文件必须保持字节不动（历史材料），而合并要在 260 行表里逐行取舍，我尚未逐行核对那 33 个模块名与 turbine 实际 51 个目录是否一一对应。主人点头后即可执行，且会顺带做一次 33 模块名 ↔ 51 实测目录的对账（能查出 HEAD 侧矩阵是否列了已不存在的东西）。
