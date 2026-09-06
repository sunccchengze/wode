# NOTICE · 原始规约的来源、版权与已知缺陷

> 本目录 6 份文件是 `sunccchengze/wendang11` 的 `skills/00-*-原始.md`，2026-09-06 迁入本仓。
> 它们的**真实源头不是 wendang11**，而是 `sunccchengze/turbine-blade-ai-platform` @ `736985ce2d21083849c1af95d7a18bb98cce0d7e` 的 `技能库&准则/`；再往上，其中两份是第三方 MIT 作品。
> 2026-09-06 已用 GitHub API 逐一取 turbine 同名文件比 md5，**5 份字节完全一致**，第 6 份（SKILL运用指南）字节数相同（29806）。也就是说 wendang11 是忠实副本，缺陷在源头就有。

---

## 一、逐份归属

| 本仓文件 | 字节 | 真实源头 | 版权／许可 | 已知缺陷 |
| --- | --- | --- | --- | --- |
| `00-Stop-slop-原始.md` | 2906 | turbine `技能库&准则/Stop-slop.md` ← **`hardikpandya/stop-slop`**（⭐16844） | MIT · Copyright (c) 2025 Hardik Pandya（https://hvpandya.com） | **是渲染页复制品**：CRLF 行尾、markdown 被反斜杠转义（`\---`、`\#`）、空格写成 `&#x20;`。原文 3 个相对链接 `references/{phrases,structures,examples}.md` 在本仓不存在，**已改写为上游 GitHub 绝对链接**（三个路径均已在 `hardikpandya/stop-slop` 核实存在）。这是本目录唯一被改动过的文件 |
| `00-Humanizer-中文版-原始.md` | 19380 | turbine `技能库&准则/Humanizer - 中文版.md` ← **`blader/humanizer`**（⭐43736）的中文翻译，参考 `hardikpandya/stop-slop` | MIT · Copyright (c) 2025 Siqi Chen（上游 `blader/humanizer`）；中文译本版权未在文件内声明【待确认】 | 文件自带 frontmatter 已注明 `source: 翻译自 blader/humanizer，参考 hardikpandya/stop-slop`。CRLF 行尾。**未随附译者的版权声明**，若对外分发需回上游确认译本授权 |
| `00-内阁决策-原始.md` | 10386 | turbine `技能库&准则/内阁决策.md` | skill 名 `ai-cabinet-decision-making`；**上游作者与许可证未在文件内声明**【待确认】 | CRLF 行尾。开头两行是主人的中文使用说明（「加载这个 skill，以后我每一次和你讨论决策时，你都要自主调用」），其后才是英文 skill 正文，两者未分隔 |
| `00-宪法级文件-原始.md` | 2407 | turbine `技能库&准则/最高优先级AGENT必须遵守的宪法级文件 - 副本.md` | 「Behavioral guidelines to reduce common LLM coding mistakes」；**上游作者与许可证未声明**【待确认】。文件名带「- 副本」，说明在 turbine 里已是二次复制 | CRLF 行尾；正文首行前有空行；无标题行（直接以正文开始） |
| `00-MULTI_AGENT_ORCHESTRATION-原始.md` | 3930 | turbine 同名文件 | **孙承泽自有**（turbine 项目原创，适用项目写明「风电场偏航优化可视化平台与大创答辩工程」） | 语境是叶轮机械科研工程，角色名【老弗】【老卡】【老芒】【老达】【老贝】【老乔】是那个项目的人，不是本仓的 |
| `00-SKILL运用指南-原始.md` | 29806 | turbine 同名文件 | **孙承泽自有** | ⚠️ **含 9 处未解决的 git 冲突标记**（`<<<<<<< HEAD` / `=======` / `>>>>>>> aa6c0e44 (feat(skills): 全量装载 17 大顶尖开源技能库…)`）。两个冲突版本并存：HEAD 侧自称「33 大技能模块、86+ SKILL.md」，`aa6c0e44` 侧自称「58 大领域专业技能库 + 17 大核心规约档案 + 女娲蒸馏 13 大师智囊团」。**turbine 源头同字节数，说明冲突在源头就没解决**，不是搬运造成的。本仓按「历史材料一字不改」原则保留原样 |

---

## 二、MIT 许可证全文（履行保留义务）

按本仓 `reference-repos/REFERENCE-INDEX.md` 使用边界第 4 条：「直接移植代码或大段表达时，必须补许可证全文与版权声明，不能只留链接」。`00-Stop-slop-原始.md` 与 `00-Humanizer-中文版-原始.md` 属 MIT 上游作品的大段移植，全文如下（两份上游 LICENSE 均为标准 MIT，各 21 行，2026-09-06 从 GitHub API 取原文核对）。

**版权归属**

- Copyright (c) 2025 Hardik Pandya — `hardikpandya/stop-slop`（`00-Stop-slop-原始.md` 的上游）
- Copyright (c) 2025 Siqi Chen — `blader/humanizer`（`00-Humanizer-中文版-原始.md` 的上游）

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

---

## 四、待确认清单（不许当已解决）

| 项 | 状态 |
| --- | --- |
| `ai-cabinet-decision-making`（内阁决策）的上游作者与许可证 | 【待确认】。文件内无声明，需回 turbine 或原始出处查 |
| 「宪法级文件」的上游作者与许可证 | 【待确认】。同上，且文件名带「- 副本」 |
| `Humanizer - 中文版` 译者的版权与授权 | 【待确认】。上游 MIT 已明，译本未声明 |
| `SKILL运用指南` 的 9 处冲突标记该保留哪个版本 | 【待确认】。需主人拍板；在拍板前本仓保留原样，不擅自选边 |
| turbine submodule 钉定分支 `arena/019feb03-turbine-blade-ai-platform` 已 404 | 已核实（2026-09-06 GitHub API）。钉定 commit `736985ce2d21083849c1af95d7a18bb98cce0d7e` 仍存在，可按 commit 取，但不能按分支取 |
