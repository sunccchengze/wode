# methods · 方法论层（从 wendang11 迁入）

> 本目录放**方法本体**：主人那套「多视角红队 + 去 AI 味 + 双盲否决 + 分层记忆」的原始规约与转化版本。
> 迁入日期 2026-09-06，来源 `sunccchengze/wendang11`（LoveMaster · 恋爱军师 2.0，2026-08-12 停更）。
> 完整迁入记录与风险核对：[`../wendang11迁入与归档核对-2026-09-06.md`](../wendang11迁入与归档核对-2026-09-06.md)

---

## 一、本目录有什么

| 文件 | 是什么 | 在本仓怎么用 |
| --- | --- | --- |
| [`恋爱军师技能总纲.md`](恋爱军师技能总纲.md) | 把 turbine 的核心规约**改造**成恋爱军师语境的总纲（10 节）：调度声明铁律、宪法级准则、内阁五方红蓝对抗、Stop-slop 中文 8 条、多 Agent 双盲否决、6 阶记忆、女娲蒸馏、证据分级 E0–E4、安全边界、Think→Spec→Implement→Verify | **可用**。是 `AGENTS.md` 的前身版；第 2／4／9 节与 AGENTS.md 重合，冲突以 AGENTS.md 为准 |
| [`恋爱大师10人团队.md`](恋爱大师10人团队.md) | 「女娲蒸馏」产出的 10 个稳定提问视角（【镜】【枢】【锚】【纹】【谜】【野】【言】【忆】【衡】【界】）+ 技能路由表 + 团队自测 8 条 | **可用**。这是主人「多视角红队」工作法的本体，AGENTS.md §7 只提了一句「AI 内阁」，方法细节在这里 |
| [`原始规约/`](原始规约/) | 6 份**未改造的原始文件**：SKILL运用指南、内阁决策、Stop-slop、Humanizer 中文版、MULTI_AGENT_ORCHESTRATION、宪法级文件 | **历史材料，不要直接加载**。来源、版权与已知缺陷见 [`原始规约/NOTICE.md`](原始规约/NOTICE.md) |

## 二、为什么放在 `documentation/` 而不是 `references/`

`references/` 是本仓 skill 的**运行时内容**（`scripts/validate_skill.py` 会校验它的路径与链接）。本目录是**方法论档案**，回答的是「本仓这套规矩从哪儿来」，不是每次咨询都要加载的参考。

按 `AGENTS.md` §8 指令层级，`documentation/` 属第 5 层：「是备选视角，不是自动生效的全局规则」。

## 三、和其他仓的关系

- **上游**：`sunccchengze/turbine-blade-ai-platform` @ `736985ce2d21083849c1af95d7a18bb98cce0d7e` 的 `技能库&准则/`（775 MB，仍在）。本目录 6 份原始文件与它 md5 一致。
- **平行版本**：`sunccchengze/Yingzai2026` 的 `技能库&准则/` 也有同名文件，但**是不同版本**（`SKILL运用指南.md` 8636B vs turbine 29806B；`内阁决策.md` 10542B vs 10386B）。若要对比演化，去那儿取。
- **本仓现行版**：[`../../AGENTS.md`](../../AGENTS.md)（工作铁律）、[`../../BRANCH-SAFETY.md`](../../BRANCH-SAFETY.md)（Git 规程，同源于 turbine）、[`../../corpus/profile/04-决策监护协议.md`](../../corpus/profile/04-决策监护协议.md)。
