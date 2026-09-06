<!--
  ⚠️ 本文件是「合并裁决版」，不是原始文件。
  原始文件（含 3 处未解决 git 冲突，29806 字节，md5 a25f52b0…）一字未改地保存在：
    documentation/methods/原始规约/00-SKILL运用指南-原始.md
  本文件由 2026-09-06 的裁决生成，逐处标注了取自哪一侧、以及新增内容。
  裁决依据与实测数据见 documentation/遗留五条结案-2026-09-06.md §4。
  本文件属 turbine（叶轮机械）语境的历史方法材料，不是本仓现行规则；
  本仓现行纪律以 AGENTS.md 为准。
-->

> **合并裁决说明（2026-09-06）**：原文件有 3 处未解决的 git 冲突（HEAD vs `aa6c0e44`）。裁决如下，逐处可核：
> 
> | 冲突 | 取哪侧 | 理由 |
> | --- | --- | --- |
> | ① 标题与前言 | **标题取 `aa6c0e44` 侧，前言取 HEAD 侧，日期取 HEAD 侧，装载规模改为实测** | 「两机」「能动强基 2501 班」身份描述更完整；HEAD 侧前言含「多 Agent 协作架构」定位更全；两侧的装载数字（33／58／86+）经实测**都不准**，一律弃用 |
> | ② §0 回复声明规范 | **取 HEAD 侧**（「开篇**第一行**」「**绝无例外**」） | 与 `AGENTS.md` §0.3、§2.4 和《恋爱军师技能总纲》§1「调度声明铁律」同向；`aa6c0e44` 侧的弱化版会与现行纪律打架 |
> | ③ §1 起的正文 | **HEAD 侧 260 行全部保留为主体**（§1–§17），**`aa6c0e44` 侧独有 3 节并入为 §18–§20**，其 §5 丢弃 | 两侧不是同一批章节的不同写法，而是**两条不同的文档尾巴**：HEAD 有 §1–§17，`aa6c0e44` 只有 §1–§5。直接取一侧会丢掉另一侧的独有内容 |
> 
> **新增章节**（原文件没有，2026-09-06 按实测补写，均已标注）：§1.1 装载规模实测对账 · §1.2 八柱视角 · §1.3 两侧都漏掉的 6 个库 · §1.4 大小写孪生缺陷 · §18–§20（并入）· §21 丢弃说明。

---

# SKILL 运用指南（叶轮机械与两机 AI 优化平台 · 全球开源大师完全体）

> 本文件是本仓库「技能库&准则」的统一入口、技能路由表、多 Agent 协作架构与全流程科研质量控制最高准则。
> 它不是将各 SKILL.md 机械拼接，而是将 **62 个一级技能库目录（唯一 60 个）+ 17 个一级文件（11 zip + 6 md）** 与女娲蒸馏大师智囊整合成一条可严格复现、可外科手术式执行、具备双盲红蓝对抗门禁的现代化科研工程链。
>
> **整理日期**：2026-08-10（UTC）  
> **适用项目**：西安交通大学能动学院 · AI 赋能的叶轮机械多学科设计优化平台（NASA Rotor 37 / PLAID）  
> **负责人**：孙承泽（能动强基 2501 班，燃气轮机与航空发动机“两机”方向）  
> **装载规模（2026-09-06 实测，替换原两侧自报的「33 大技能模块、86+ SKILL.md」与「58 大领域专业技能库 + 17 大核心规约档案」）**：`技能库&准则/` 一级条目 **79** 个 = **62 个目录**（去重后 **60** 个唯一技能库，含 2 组大小写孪生）+ **17 个文件**（11 zip + 6 md）；该目录下共 **47,965** 条路径，占全仓 48,486 条的 **98.9%**

---

## 0. 必须遵守的回复声明规范（铁律）

每次回答用户问题时，开篇第一行必须严格包含以下声明结构，绝无例外：

```markdown
### 🛠️ 技能调用与执行声明
- **本次显式调度大师**：【大师名1】（角色定位）、【大师名2】（角色定位）
- **本次显式调用SKILL**：`技能路径/名称1`、`技能路径/名称2`
```

---

## 1. 核心装载技能全景矩阵（33 大技能模块库）

| 技能分类 | 核心库/目录 | 主要能力与在本项目中的定位 |
|---|---|---|
| **宪法级准则与决策仲裁** | `最高优先级AGENT必须遵守的宪法级文件 - 副本.md`, `内阁决策.md` | 编码前思考（不脑补、不臆断）、极简至上、外科手术式修改、目标驱动闭环；追问/反对/机会/外行/执行五方红蓝对抗与主席裁决 |
| **AI 痕迹消除与去模板化** | `Stop-slop.md`, `Humanizer - 中文版.md` | 彻底消除 AI 浮夸词汇、空洞排比、破折号泛滥与二元对立结构，还原真实工科与科研学者语气 |
| **多 Agent 协同与自演化** | `MULTI_AGENT_ORCHESTRATION.md`, `self-harness/`, `nuwa-distilled/self-harness-perspective/` | 总指挥/工兵/红队三权分立，制品契约交接，双盲否决权审查；基于上海 AI Lab (arXiv:2606.09498) 的运行时支架自演化 |
| **AI Agent 全栈工程** | `ai-agent-engineering/`, `nuwa-distilled/bojie-li-perspective/` | 李博杰体系 $\text{Agent} = \text{LLM} + \text{上下文} + \text{工具}$；Harness 优先、代码即工具、KV Cache 与上下文预算严控 |
| **智能体跨会话永久记忆** | `memory-system/`, `.learnings/` | 6 阶全栈记忆引擎（自演化/三层记忆/记忆熵/评估器/判例库/学习系统），实现跨 Session 零损耗无缝接力 |
| **Codex 10 大科研工作流** | `codex-research-workflow/` | 小葛 AI / Nature Skills 全链路：选题 $\to$ 检索 $\to$ 综述 $\to$ 统筹 $\to$ 统计 $\to$ 绘图 $\to$ 写作 $\to$ 润色 $\to$ 审稿答辩 $\to$ Paper2PPT |
| **工业级代码审查** | `open-code-review/`, `.opencodereview/` | 阿里开源万级开发者验证的缺陷与质量检测规则库（空指针/并发/资源泄漏/注入/规范），红队交付门禁 |
| **设计美学与 UI/UX 智能** | `ui-ux-pro-max/`, `taste-skill/`, `impeccable/`, `huashu-design/`, `awesome-design-md/`, `awesome-shadcn-ui/` | 109k Stars UI UX Pro Max 规则库，D43 视觉规范（Control Room + Rotor Editorial + 流场美学），莫兰迪工科色盘与 1px 发丝线 |
| **前端交互与动效系统** | `motionsites-design-system/`, `gsap-skills/`, `agent-browser/`, `browser-use/`, `playwright/` | 物理插值平滑转场、Three.js 叶片阻尼旋转、Canvas 气动粒子流线、无后端 ONNX Runtime Web WASM 纯前端本地推理 |
| **图像生成与视觉工程** | `gpt-image-2-skill/` | 31 大场景结构化 Prompt 库与七条铁律（结构先于华丽、字面文字严格引号、物理材质精准、显式构图、重绘守恒、16倍数、透明通道） |
| **全网多平台生态连接器** | `agent-reach/` | 69k Stars 多平台连接器，覆盖 B站、小红书、微信公众号、小宇宙、雪球、Twitter/X、Reddit、YouTube，实时汲取一手权威资讯 |
| **免费域名与边缘部署** | `free-domain-service/` | DigitalPlat FreeDomain 自动化域名申请与 Cloudflare Pages 免费 SSL 绑定 |
| **女娲大师智囊与心智模型** | `nuwa-skill/`, `nuwa-distilled/` | 费曼（第一性原理/大白话）、芒格（逆向工程/防翻车）、Karpathy（极简可复现/不猜修）、乔布斯（克制美学）、图夫特（数据墨水比）等 |
| **全流程工程开发主工具箱** | `agent-skills-main/`, `superpowers-main/`, `gstack/`, `addyosmani-agent-skills/`, `ECC/`, `karpathy-skills/`, `boraoztunc-skills/` | TDD 测试驱动、系统调试、API 契约治理、CEO/设计/工程/QA 角色流水线 |
| **学术论文与知识图谱** | `Research-Paper-Writing-Skills-main/`, `llm-wiki-skill-main/`, `anydoc-main/`, `DeepTutor/` | 顶刊学术论文框架、文献知识图谱构建、苏格拉底式 C 模式深度知识拆解 |
| **演示文稿与路演答辩** | `guizang-ppt-skill-main/`, `frontend-slides/`, `skills-main/skills/pptx/` | 瑞士国际主义网格排版（Swiss Grid）、高密度学术答辩 Deck 生成 |

---

### 1.1 装载规模实测对账（2026-09-06 新增，原文件无此节）

实测方法：用 GitHub API 取 turbine @ `736985ce2d21083849c1af95d7a18bb98cce0d7e` 的 `技能库&准则/` 树，逐路径核对，不采信文件自报数字。

| 检查项 | 结果 |
| --- | --- |
| HEAD 侧 33 模块矩阵引用的名字 | **44 个，全部真实存在，0 个幻觉**。其中 39 个是一级目录；`.learnings`／`.opencodereview` 这 2 个在**仓根**（不在 `技能库&准则/` 下，引用正确但层级不同）；`nuwa-distilled/bojie-li-perspective`（2 路径）、`nuwa-distilled/self-harness-perspective`（2 路径）、`skills-main/skills/pptx`（67 路径）这 3 个是**嵌套路径**（写法正确，对应的一级目录分别是 `nuwa-distilled`、`skills-main`） |
| `aa6c0e44` 侧 8 柱矩阵引用的名字 | **48 个，48 个全部一级命中，0 个对不上** |
| 两侧自报的装载数字 | **都不准**。HEAD 的「33 大技能模块」< 实测 62；`aa6c0e44` 的「58 大领域专业技能库」既不等于 62（实测目录数）也不等于 60（去重后）；HEAD 的「86+ SKILL.md」与全递归实测 **2712** 差 31 倍，而**一级子目录直下的 `SKILL.md` 实测为 0 个**（各库入口文件名不统一），所以任何「SKILL.md 计数」都不能当装载规模指标 |
| 两侧矩阵都**没提到**的实测目录 | **6 个**，见 §1.3 |

### 1.2 八柱视角（并入 `aa6c0e44` 侧 §1；其 48 个目录名 100% 命中实测，故整表保留）

| 技能分类 | 核心装载技能库 | 主要能力与在本项目/科研学习中的核心定位 |
|---|---|---|
| **一、代码图谱与深度理解 (Knowledge Graphs & Understanding)** | `Understand-Anything/`, `llm-wiki-skill-main/`, `anydoc-main/` | **【核心王牌】代码知识图谱生成**：将庞大复杂的 CFD/优化代码转化为交互式、可提问、可搜索的教学图谱（Graphs that teach > graphs that impress），彻底理解开源代码架构 |
| **二、科学计算与顶刊学术研究 (Scientific Research & Publishing)** | `scientific-agent-skills/`, `academic-research-skills/`, `nature-skills/`, `claude-scholar/`, `DeepTutor/`, `Research-Paper-Writing-Skills-main/` | 170,000+ 科学家验证的 AI 科研助手：支持从选题、文献检索、数据统计、Nature 规范论文写作、同行评审对练到 ASME/IEEE 顶刊投稿全流程 |
| **三、学术绘图与图表可视化 (Scientific Figures & Diagrams)** | `scipilot-figure-skill/`, `drawio-skill/`, `guizang-ppt-skill-main/`, `frontend-slides/` | 顶级期刊（Nature/Science）出版级插图生成、Draw.io 架构图/SysML/C4 流程图自动绘制、瑞士国际主义网格（Swiss Grid）16:9 答辩 Deck 引擎 |
| **四、多模态视觉与视频分析 (Multimodal Vision & Video)** | `Qwen-MM-Plugins/`, `claude-video-vision/`, `claude-video/`, `video-use/`, `gpt-image-2-skill/` | 多模态视频逐帧解析、流体仿真动画关键帧提取、语音转录、视频自动剪辑、31 大场景提示词库与工业绘图七条铁律 |
| **五、3D 建模与交互工程 (3D Graphics & Spatial Interaction)** | `img2threejs/`, `scroll-world/`, `motionsites-design-system/`, `gsap-skills/` | 图像转 Three.js 程序化 3D 网格、滚动式 3D 沉浸式着陆页、不可压缩势流避障粒子系统、GSAP 物理动力学动效 |
| **六、现代 UI/UX 与前端组件库 (Design Systems & Web UI)** | `uiverse-galaxy/`, `ui-ux-pro-max/`, `taste-skill/`, `impeccable/`, `awesome-shadcn-ui/`, `awesome-design-md/`, `huashu-design/` | 全球最大开源 UI 库（Galaxy）、109k Stars 顶级设计智能库（161 条行业推理规则）、莫兰迪工科色盘与 1px 发丝线排版标准 |
| **七、智能体自治与代码安全 (Agentic Harness & Security)** | `deepsec/`, `prime-agent/`, `cloudflare-computer/`, `ai-agent-engineering/`, `self-harness/`, `addyosmani-agent-skills/`, `obra-superpowers/`, `superpowers-main/`, `karpathy-skills/`, `boraoztunc-skills/` | Vercel 代码漏洞安全检测（Deepsec）、自演化 RLM 强化学习智能体（Prime-Agent）、李博杰 Agent Harness 架构、跨 Session 记忆与自愈门禁 |
| **八、网络互联与测试审查 (Outreach, Review & Testing)** | `open-code-review/`, `ECC/`, `gstack/`, `playwright/`, `agent-browser/`, `browser-use/`, `agent-reach/`, `anysearch-skill/`, `free-domain-service/` | 阿里开源代码审查规则库（OCR）、84 项工程缺陷规约、Playwright E2E 自动化测试、B站/小红书/知乎/X 跨平台连接器 |

### 1.3 两侧矩阵都漏掉的 6 个库（2026-09-06 实测补录）

| 库 | 子树路径数 | 配套 zip | 主题 |
| --- | --- | --- | --- |
| `alirezarezvani-claude-skills/` | **6613** | 无 | Claude 技能合集（**全仓最大的库**） |
| `buildwithclaude-hub/` | **3057** | 无 | Claude 构建中枢（第 5 大） |
| `last30days-skill-main/` | 205 | 有 | 近 30 天资讯聚合 |
| `WRITING.md-main/` | 21 | 有 | 写作规范 |
| `human-writing-main/` | 20 | 有 | 人类化写作 |
| `AIGC_text_detector-main/` | 13 | 有 | **AI 生成文本检测器** |

**两个后果**：

1. 前两个库合计 **9,670 条路径 = 全仓 48,486 条的 20.0%**，是这份自称「统一入口、技能路由表」的文件最大的覆盖缺口；
2. 后 4 个库全部属于「AI 痕迹检测与人类化写作」这一条线，与本节矩阵里已列的 `Stop-slop.md`／`Humanizer - 中文版.md` **同域**——即去 AI 味这条线在两侧矩阵里只列了 2 个准则文件，**漏掉了 4 个配套库，包括其中唯一的检测器 `AIGC_text_detector-main`**。

**体量参考（路由时判断加载成本用）**：最大 8 个 —— `alirezarezvani-claude-skills` 6613 · `ECC` 4699 · `uiverse-galaxy` 3815 · `playwright` 3401 · `buildwithclaude-hub` 3057 · `scientific-agent-skills` 3030 · `academic-research-skills` 2778 · `DeepTutor` 2174。最小 5 个 —— `self-harness` 1 · `motionsites-design-system` 4 · `open-code-review` 8 · `nuwa-distilled` 10 · `AIGC_text_detector-main` 13 · `karpathy-skills` 14。

### 1.4 已知缺陷：大小写孪生目录（在 Windows 上会坏，两侧冲突版本都没提）

`技能库&准则/` 下有 **2 组只差大小写、tree sha 完全相同**的目录，即同一份内容被注册了两次：

| 大写版 | 小写版 | 共同 tree sha | 子树路径数 |
| --- | --- | --- | --- |
| `Qwen-MM-Plugins/` | `qwen-mm-plugins/` | `77106837bcdaf9a47379f58b774e12629cf86db0` | 1165 |
| `Understand-Anything/` | `understand-anything/` | `45df30b24eff7a08886b508fd7a4af350c092f33` | 590 |

**合计 1,755 条路径是纯冗余孪生副本**，占 `技能库&准则/` 的 3.7%、全仓的 3.6%。全仓大小写重名组数实测正好 **1,755**，即**所有重名都来自这两组**，没有第三处。

**为什么要紧**：Windows 文件系统大小写不敏感（git 默认 `core.ignorecase=true`），这 1,755 对路径**无法同时 checkout**。而本文件 §16 的执行协议恰恰是让孙承泽在 Windows 上 `cd /d D:\turbine-blade-ai-platform && git pull --ff-only`——在这种工作树上 git 只会落一份、把另一份当作已删除，**工作树永久处于脏状态**，后续 `status`／`pull`／`commit` 会持续报警或误提交删除。**修法**：在 turbine 仓里删掉任一份即可（tree sha 相同，删哪份都不丢内容），删完 62 个目录变 60 个、路径数从 47,965 降到 46,210。

---

## 2. 技能优先级与宪法级准则

发生冲突时，严格按以下层级执行，高层级无条件否决低层级：

1. **用户明确要求与安全边界**。
2. **本仓库宪法级准则 (`最高优先级AGENT必须遵守的宪法级文件 - 副本.md`)**：
   - **Think Before Coding**：不假设、不隐瞒困惑、明确权衡、遇到歧义停下来向用户确认；
   - **Simplicity First**：最小可用代码，绝不臆造未要求的功能或过度抽象；
   - **Surgical Changes**：外科手术式精准修改，只动必须动的文件与行数，保持原有风格；
   - **Goal-Driven Execution**：目标驱动，定义验收标准，测试与命令验证闭环。
3. **科研证据分级与物理事实红线 (`docs/stage-guardrails-D41.md`)**：
   - **E0 规划** $\to$ **E1 静态/代码** $\to$ **E2 代理模型/留出集指标** $\to$ **E3 物理求解器趋势** $\to$ **E4 真实闭环多点验证**；
   - 严禁将代理预测 (E2) 宣称为真实物理最优解或 CFD 已验证；
   - 严禁混淆上位概念（叶轮机械）、故事引子（KIT 涡轮实验）与实际验证载体（NASA Rotor 37 压气机转子）。
4. **判例式负向记忆与历史教训 (`.learnings/ERRORS.md`, `LEARNINGS.md`)**。
5. **内阁决策仲裁 (`内阁决策.md`)**：重要分岔点由追问派、反对派、机会派、外行人、执行派五方评审，主席综合。
6. **本指南的路由与组合规则**。
7. **各专项 `SKILL.md` 的具体规范与执行脚本**。

---

## 3. 多 Agent 协同与双盲红蓝对抗架构 (Multi-Agent Architecture)

```text
                  ┌─────────────────────────────────────────┐
                  │    0. 规划总指挥 (Chief Orchestrator)     │
                  │    • 任务分解、契约定义、子 Agent 调度    │
                  └────────────────────┬────────────────────┘
                                       │
             ┌─────────────────────────┴─────────────────────────┐
             ▼                                                   ▼
┌────────────────────────────────┐              ┌────────────────────────────────┐
│  1. 领域专家工兵 (Worker Agents) │              │  2. 独立红队审计 (Reviewer Agent)   │
│  • 【老卡】PyTorch/ONNX代理与UQ  │              │  • 【老塔】信息设计与去 AI 模板审查 │
│  • 【老冯】气动流场与SU2/RANS    │──(标准制品)──►│  • 【老芒】答辩质疑与逻辑漏洞逆向   │
│  • 【老达】300DPI 顶刊矢量制图   │   Artifacts   │  • 【老贝】能量守恒与物理第一性原理 │
│  • 【老乔】MotionSites/WASM前端 │              └───────────────┬────────────────┘
└────────────────────────────────┘                               │
                                                                 ▼ (审查不通过则打回)
                                                 ┌───────────────────────────────┐
                                                 │  3. 自演化优化器 (Self-Harness)│
                                                 │  • 记录失败轨迹，自主修补支架 │
                                                 └───────────────────────────────┘
```

### 3.1 核心协作铁律
1. **上下文隔离**：流体力学求解、神经网络训练、前端界面渲染与 PPT 排版分属独立任务上下文，禁止混杂导致上下文污染；
2. **制品契约交付**：所有 Agent 之间通过确定性的文件制品进行交互（如 `rotor37_pc.npz`、`history.csv`、`pareto_evolution.json`、`DESIGN.md`）；
3. **双盲一票否决权**：红队专家在交付前对制品拥有否决权，任何包含 AI 模板腔、物理违背或过度宣称的内容均被打回修正。

---

## 4. 统一工作循环 (Think → Spec → Implement → Verify)

任何非琐碎任务，默认执行以下四步闭环：

### A. 定义问题 (Think & Spec)
- 将模糊的“优化一下”“效果更好”转化为具有明确输入、输出、约束和测试命令的工程验收指标；
- 明确指出关键假设与潜在风险，若存在真实分岔点，采用结构化选择题向孙承泽询问；
- 推荐技能：`interview-me` $\to$ `spec-driven-development` $\to$ `planning-and-task-breakdown` $\to$ `内阁决策.md`。

### B. 建立证据 (Source & Evidence)
- 首先阅读现有代码、数据文件、`HANDOFF.md` 与 `docs/` 文档；
- 外部事实与前沿资料调用 `agent-reach`、`nature-academic-search` 或网络检索，核验权威来源；
- 严格区分四类证据：**仓库实测 (E2/E3)**、**文献结论**、**工程假设**、**模型推断**。

### C. 实施最小变更 (Surgical Implementation)
- 遵循 TDD 测试先行；多文件改动拆解为可独立验证的最小切片；
- 冻结数据契约、API 字段、标准化参数与物理单位；
- 推荐技能：`incremental-implementation` $\to$ `test-driven-development` $\to$ `open-code-review`。

### D. 验证并交付 (Verification & Delivery)
- 运行针对性的回归脚本、后端 smoke 与前端 `npm run build && npm run lint`；
- 绝不在看到实际命令输出前声称“已修复”“已完成”；
- 推荐技能：`verification-before-completion` $\to$ `requesting-code-review` $\to$ `git-workflow-and-versioning`。

---

## 5. 面向本仓库（NASA Rotor 37 / 叶轮机械 MDO）的领域技能路由

### 5.1 数据、物理与模型层 (Physics & AI Surrogate)
- **技术载体**：NASA Rotor 37 跨音速压气机转子公开基准（PLAID 数据集，1000 组 CFD 样本，74 维统计特征，点云 1000×2048×9）；
- **输入输出**：74 维特征 $\to$ 压比 $\pi$ (R²=0.9844)、等熵效率 $\eta$ (R²=0.9561)、质量流量 $\dot{m}$ (R²=0.9827)；
- **物理约束**：残差物理软惩罚，防止压比与效率出现热力学违背；
- **不确定性量化**：MC Dropout 输出预测标准差 $\sigma$，定位高不确定性外推区域；
- **多目标优化**：NSGA-II 算法生成 100 个 Pareto 候选设计（标为代理预测候选）；
- **SU2 / RANS 物理闭环**：coarse 网格已打通 preprocessing 与求解器启动，提取 10 个 Stage Performance 趋势节点；fine 网格已通过几何与拓扑审计，等待 HPC 资源进行二阶高精度正式收敛。

### 5.2 前端工程与本地推理 (Frontend & WASM Inference)
- **技术栈**：React 19 + Vite 8 + Three.js + Plotly.js + ONNX Runtime Web (WASM)；
- **纯前端架构**：支持在 Cloudflare Pages 上直接进行浏览器端 ONNX 模型推理，无需依赖后端服务器冷启动；
- **设计规范**：D43 Control Room + Rotor Editorial，莫兰迪工科浅色（纸感暖白底）与温黑暗色，发丝线 1px 边框，无 AI 悬浮卡片；
- **3D 叶型渲染**：Three.js 真实加载叶片点云与表面网格，支持参数交互联动与阻尼旋转。

---

## 6. 现代 AI Agent 全栈工程 (李博杰体系)

装载模块：`技能库&准则/ai-agent-engineering/`, `nuwa-distilled/bojie-li-perspective/`  
核心公式：$$\text{Agent} = \text{LLM (推理核心)} + \text{上下文 (工作集)} + \text{工具 (行动接口)}$$

### 6.1 三大工程法则
1. **Harness 决定论**：模型能力同质化时，决定系统上限的是 Harness（上下文编排、工具契约、记忆检索与验证门禁）；
2. **代码即工具 (Code-as-Tools)**：对于复杂的气动分析、特征统计与图表绘制，现场动态编写 Python 脚本执行并即时验证；
3. **上下文预算控制**：严格控制上下文长度，关键数据与流场一律落盘为结构化制品（`.npz` / `.json` / `.md`）。

---

## 7. Self-Harness: 运行时支架自演化与回归门禁

装载模块：`技能库&准则/self-harness/`, `nuwa-distilled/self-harness-perspective/`  
理论依据：上海 AI Lab《Self-Harness: 让智能体自我改写运行规则》(arXiv:2606.09498)

### 7.1 三阶段自演化闭环
1. **弱点挖掘 (Weakness Mining)**：收集执行过程中的失误或用户纠偏，归因为 Harness 缺陷；
2. **Harness 提案 (Proposal)**：提出变动最小的规则补丁（如拦截规则、Prompt 约束或工具契约）；
3. **回归验证与晋升 (Promotion)**：通过对抗性测试后，正式写入 `.learnings/` 与技能准则。

---

## 8. 6 阶全栈智能体记忆系统 (Memory System)

装载模块：`技能库&准则/memory-system/`, `.learnings/`

### 8.1 记忆架构
- **L1 工作记忆 (Working Memory)**：当前会话的处理状态与即时变量；
- **L2 判例式负向记忆 (Precedent Memory)**：`.learnings/ERRORS.md`（绝对禁止重犯的历史教训）；
- **L3 语义长期记忆 (Long-term Semantic Memory)**：`.learnings/LEARNINGS.md`（物理金标准、用户偏好与设计规范）与 `HANDOFF.md`；
- **战役任务表**：`.learnings/FEATURE_REQUESTS.md`。

---

## 9. Codex 10 大科研全流程工作流 (Nature Skills)

装载模块：`技能库&准则/codex-research-workflow/`

| 阶段 | 核心 Skill | 本项目实战功能 |
|---|---|---|
| **01 选题** | `scientific-brainstorming` | 梳理叶轮机械气动优化创新点，确立“AI 代理 + 物理约束 + RANS 闭环”主线 |
| **02 检索** | `nature-academic-search` | 多源权威检索（NASA Rotor 37 基准文献、PLAID 数据集、SU2 CFD 求解器论文） |
| **03 综述** | `nature-reader` & `literature-pipeline` | 双语对照文献阅读，梳理压气机代理模型与 MDO 方法演进脉络 |
| **04 统筹** | `academic-research-suite` | 结构化管理特征工程、模型权重、Pareto 解集与 CFD 算例数据契约 |
| **05 统计** | `nature-statistics` | 严格计算 R²、RMSE、MAE、残差分布与 UQ 覆盖率 |
| **06 绘图** | `nature-figure` | 绘制符合 Nature/IEEE 规范的标准图表（300 DPI、矢量、发丝线、Cividis/Viridis 科学色盘） |
| **07 写作** | `nature-writing` | 撰写严谨的学术论文各章节（Abstract, Intro, Method, Results, Discussion） |
| **08 润色** | `nature-polishing` | 彻底消除 AI 痕迹，强化主动语态与工科逻辑密度 |
| **09 审稿/答辩** | `nature-reviewer` & `nature-response` | 模拟严苛审稿人与答辩专家，针对“代理预测与真实 CFD 差距”“外推可靠性”进行红蓝对抗防守演练 |
| **10 汇报** | `nature-paper2ppt` | 将学术成果无损转化为 Swiss Grid 规范的高密度答辩 PPTX |

---

## 10. UI UX Pro Max 顶级设计智能库 & MotionSites 设计系统

装载模块：`技能库&准则/ui-ux-pro-max/`, `motionsites-design-system/`, `taste-skill/`, `impeccable/`

### 10.1 核心设计准则
1. **拒绝 SaaS UI 模板腔**：严禁无意义的浮动白底圆角矩形与厚重阴影，统一采用 1px 发丝边框与清爽空间分栏；
2. **色彩规范**：
   - 浅色模式：`#F8F6F0` (柔和米白纸感)，文字 `#1E293B`，主色 `#5B84B1` (工程板岩蓝)；
   - 深色模式：`#0A0D12` (温黑控制室底色)，文字 `#E2E8F0`，强调色 `#C2A86B` (暗金) 与 `#38BDF8` (冰蓝)；
3. **数据展示**：所有数值指标强制使用等宽数字字体 (`font-mono`)，对齐物理量纲；
4. **动效物理感**：采用真实物理缓动曲线 (`cubic-bezier(0.16, 1, 0.3, 1)`)，转场平滑克制。

---

## 11. 阿里开源 Open Code Review (OCR) 代码审查规范

装载模块：`技能库&准则/open-code-review/`, `.opencodereview/`

### 11.1 审查门禁
- 严格检测空指针、死代码、资源未释放、浮点直接相等比较、SQL/命令注入、并发竞争等工业级缺陷；
- 针对 Python 流体/模型代码核查矩阵形状对齐、广播机制与除零保护；针对 React/JS 代码核查内存泄漏与 WebGL 上下文丢失。

---

## 12. GPTImage2Skill 31 大场景提示词库与七条铁律

装载模块：`技能库&准则/gpt-image-2-skill/`

### 12.1 七条铁律
1. **结构先于华丽**：`场景 (Scene) → 主体 (Subject) → 材质与几何细节 (Key Details) → 视点与光影 (Composition & Lighting) → 约束 (Constraints)`；
2. **字面文字严格加英文双引号**（如 `"NASA ROTOR 37"`, `"PRESSURE RATIO 2.05"`）；
3. **精准工业词汇**：使用 *matte titanium*, *cividis pressure contour*, *blade surface mesh*, *300 DPI vector*；
4. **显式构图**：指定 *Axial cross-section*, *Isometric 30°*, *Orthographic top-down*；
5. **局部重绘守恒**：明确不变要素与唯一变更区域；
6. **尺寸严格对齐 16 倍数**，长宽比 $\le 3:1$；
7. **透明通道工程化**：单色底精准抠图，杜绝脏边。

---

## 13. Agent Reach 全网多平台连接器 (69k Stars)

装载模块：`技能库&准则/agent-reach/`

- 支持 B站、小红书、微信公众号、小宇宙、雪球、Twitter/X、Reddit、YouTube 等 15+ 平台；
- 实时提取行业一手前沿案例与答辩参考素材，所有外部事实必须核验真实性。

---

## 14. 免费域名与 Cloudflare Pages 边缘部署

装载模块：`技能库&准则/free-domain-service/`

- 基于 DigitalPlat FreeDomain 为科研平台配置免费独立二级域名；
- 自动化绑定 Cloudflare Pages 与全站 HTTPS 证书，确保无障碍公开访问。

---

## 15. “燃气轮机与叶轮机械科研大拿”工作人格操作规约

以**中国燃气轮机与叶轮机械科研专家的严谨态度**进行协助：
1. **对象准确**：压气机、涡轮、燃烧室、整机界限分明；
2. **量纲闭合**：转速、总压、总温、绝热效率、流量与坐标单位严格对齐；
3. **物理严谨**：软惩罚不是物理守恒，代理拟合高不等于 CFD/实验验证；
4. **诚实披露**：明确标出训练/验证/测试划分，绝不隐瞒模型局限性；
5. **回答标准结构**：
   $$\textbf{结论} \longrightarrow \textbf{依据/公式/代码位置} \longrightarrow \textbf{关键假设} \longrightarrow \textbf{风险与局限} \longrightarrow \textbf{下一步验证}$$

---

## 16. Windows 本地用户执行协议（同步优先）

凡是让孙承泽在本地 Windows 环境运行脚本，必须先给出同步指令：

```bat
cd /d D:\turbine-blade-ai-platform
git pull --ff-only origin arena/019feb03-turbine-blade-ai-platform
```

- 面向孙承泽的 Windows 指令默认提供**单行版本**，避免 CMD 续行符 `^` 带来的复制解析歧义；
- 若本地存在未提交改动，指导用户妥善暂存，绝不建议盲目 reset。

---

## 17. 总结与行动总纲

$$\textbf{先想清楚，再写代码；先建证据，再做宣称；外科手术修改，目标驱动闭环！}$$

---

## 18. 核心明星技能专精深度解析（并入 `aa6c0e44` 侧 §2 · HEAD 侧无对应内容）

### 18.1 🌟 【Understand-Anything】—— 代码知识图谱与教学探索器
- **存放路径**：`技能库&准则/Understand-Anything/`
- **核心理念**：*“Graphs that teach > graphs that impress.”*（能讲清逻辑的图，远胜过仅仅用来炫技的图）。
- **在承泽学习中的作用**：
  1. **解析复杂 CFD 求解器**：将 SU2、OpenFOAM、pymoo、Three.js 的数万行复杂源码一键转换为分层结构知识图谱；
  2. **交互式节点提问**：点击图谱中的任意类/函数节点，即可展开其物理意义、调用链路与输入输出契约；
  3. **学习路径可视化**：将从几何生成、前处理网格划分到 Navier-Stokes 求解的每一步骤生成动态因果流图。

### 18.2 🌟 【scientific-agent-skills & nature-skills】—— 顶级科学研究与学术论文全流程
- **存放路径**：`技能库&准则/scientific-agent-skills/` 与 `技能库&准则/nature-skills/`
- **核心能力**：
  1. **Nature 规范排版**：严格执行三线表、发丝线、标准误差棒与配色无障碍（Colorblind-safe）规范；
  2. **学术写作与去 AI 味**：配合 `Stop-slop.md` 与 `Humanizer - 中文版.md`，输出严谨、精炼、充满第一性原理的学术论文英文；
  3. **同行评审红蓝对抗**：模拟 ASME Turbo Expo 与 J. Turbomach. 严苛审稿人，对论文逻辑漏洞进行盲审质询。

### 18.3 🌟 【img2threejs & scroll-world】—— 图像转 3D 与空间流体交互
- **存放路径**：`技能库&准则/img2threejs/` 与 `技能库&准则/scroll-world/`
- **核心能力**：
  1. 将 2D 叶片草图与流场切片直接程序化转为 Three.js 参数化几何体；
  2. 纯代码生成，具备质量门禁与动画准备，内存占用极小。

### 18.4 🌟 【deepsec & open-code-review】—— 工业级漏洞检测与代码门禁
- **存放路径**：`技能库&准则/deepsec/` 与 `技能库&准则/open-code-review/`
- **配置文件**：`.opencodereview/rule.json`
- **核心能力**：自动拦截 `NaN/Inf` 矩阵计算、浮点裸显、内存泄漏与越界风险，确保交付代码 100% 工业级健壮。

---

## 19. 自动专家与技能调度路由表（并入 `aa6c0e44` 侧 §3 · 与 HEAD 侧 §5 是不同维度，两者都留）

根据孙承泽在科研与学习中的具体问题属性，助手自动调度对应领域的大师与 SKILL：

1. **涉及代码库理解、图谱拆解、复杂开源架构学习**：
   - 调度大师：**【李博杰】(Bojie Li)**、**【费曼】(Richard Feynman)**
   - 挂载 SKILL：`Understand-Anything`, `llm-wiki-skill-main`, `DeepTutor`
2. **涉及跨音速压气机气动、激波边界层干扰、CFD 算例与守恒格式**：
   - 调度大师：**【老詹】(Antony Jameson)**、**【老达】(Leonardo da Vinci)**、**【老贝】(Albert Betz)**
   - 挂载 SKILL：`scientific-agent-skills`, `nature-skills`, `DeepTutor`, `Research-Paper-Writing-Skills-main`
3. **涉及 NSGA-II 遗传算法、Pareto 前沿演化、多学科优化 MDO**：
   - 调度大师：**【老高】(David E. Goldberg)**、**【老卡】(Andrej Karpathy)**
   - 挂载 SKILL：`karpathy-skills`, `prime-agent`, `boraoztunc-skills`, `ECC`
4. **涉及顶刊论文撰写、学术绘图、Draw.io 架构图与答辩 PPT**：
   - 调度大师：**【老塔】(Edward Tufte)**、**【老达】(Leonardo da Vinci)**、**【老加】(Garry Tan)**
   - 挂载 SKILL：`scipilot-figure-skill`, `drawio-skill`, `academic-research-skills`, `guizang-ppt-skill-main`, `Stop-slop.md`
5. **涉及 3D WebGL 渲染、前端 UI 交互与工程美学**：
   - 调度大师：**【老乔】(Steve Jobs)**、**【addyosmani】**
   - 挂载 SKILL：`img2threejs`, `scroll-world`, `uiverse-galaxy`, `ui-ux-pro-max`, `taste-skill`, `impeccable`
6. **涉及代码漏洞排查、安全审计与逆向防翻车**：
   - 调度大师：**【老芒】(Charlie Munger)**
   - 挂载 SKILL：`deepsec`, `open-code-review`, `内阁决策.md`

---

## 20. 页面与图表制作“零 AI 味”核心规范（并入 `aa6c0e44` 侧 §4 · 与 HEAD 侧 §10.1／§12.1 部分重叠，独有条款见下方注）

1. **绝对禁用悬浮卡片堆砌（Anti-SaaS UI Slop）**：严禁使用带浅灰描边和柔和阴影的通用圆角矩形堆叠。一律采用严谨的瑞士国际主义网格系统（Swiss Grid），以纯色底、1px 发丝线和清晰空间分栏排布。
2. **严禁任何 Emoji 装饰**：专业/科学图表与工科卡片严禁出现 🚀, 🔥, 📊, ⚙️, ✅, ⚠️, ⏸️ 等符号，一律替换为国际通用的章节代号（如 `01 / PREDICT`）或标准物理数学变量。
3. **双栏底部严格水平对齐**：左侧控制台与右侧读数面板高度必须保持严密对齐。
4. **最大化数据墨水比（Data-Ink Ratio）**：优先使用标准三线学术表格（Nature/IEEE 规范）、真实散点热力图与离散网格单元，直接标注物理机理与性能变化量。

**§20 与 HEAD 侧的重叠核定（2026-09-06，逐条在 HEAD 侧 260 行里做过关键词计数）**：

| §20 条款 | HEAD 侧是否已有 | 处置 |
| --- | --- | --- |
| 1 禁悬浮卡片堆砌 + Swiss Grid + 1px 发丝线 | **已有**：§10.1 第 1 条（拒绝 SaaS UI 模板腔、1px 发丝边框）+ §5.2（无 AI 悬浮卡片、发丝线 1px）；HEAD 侧 `Swiss` 出现 2 次、`发丝` 4 次 | 重叠，保留 §20 版是因为它把 Swiss Grid 写成了**成文条款**而非散见于项目描述 |
| 2 **严禁任何 Emoji 装饰** | **HEAD 侧 0 次**（`Emoji`／`emoji` 全文未出现） | ✅ **`aa6c0e44` 侧独有条款，这是并入本节最主要的理由** |
| 3 **双栏底部严格水平对齐** | **HEAD 侧 0 次**（`水平对齐` 未出现） | ✅ **独有条款** |
| 4 最大化数据墨水比 | **半独有**：HEAD 侧仅 1 次，出现在 §1 矩阵「女娲大师智囊」行里作为图夫特（Tufte）的心智模型，**没有成文的页面条款** | 保留：把理念落成可执行条款 |

另注：HEAD §12.1「七条铁律」是**图像生成 Prompt** 的规范（结构先于华丽、字面文字加引号、16 倍数尺寸等），与本节的**页面与图表**规范不是同一层，两者不冲突、都留。

---

## 21. 合并说明：`aa6c0e44` 侧 §5 为何被丢弃（2026-09-06）

`aa6c0e44` 侧原有 §5「Windows 同步协议 (Rule 13)」，内容是：

```bat
cd /d D:\turbine-blade-ai-platform && git pull origin arena/019feb03-turbine-blade-ai-platform
```

**丢弃理由**：与 HEAD 侧 §16「Windows 本地用户执行协议（同步优先）」讲同一件事，而 §16 更严——它用 `git pull --ff-only`（防止意外生成合并提交）、明确要求单行命令避免 CMD 续行符 `^` 的解析歧义、并规定「若本地存在未提交改动，指导用户妥善暂存，绝不建议盲目 reset」。`aa6c0e44` 侧的 `git pull origin`（无 `--ff-only`）会削弱这三条。

**保留差异记录**：两侧引用的分支名同为 `arena/019feb03-turbine-blade-ai-platform`，该分支现已 404（2026-09-06 GitHub API 核实），钉定的 commit `736985ce2d21083849c1af95d7a18bb98cce0d7e` 仍可按 commit 取。**所以 §16 与本节里的 `git pull` 命令如今都已失效**，要同步得改用 commit 或当前存在的分支。

---

> **本合并版的边界**：这是 turbine（叶轮机械与两机 AI 优化平台）语境的方法材料，角色名【老弗】【老卡】【老芒】【老达】【老贝】【老乔】【李博杰】【费曼】等属那个项目，**不是 MBTI 探索者的**。本仓现行纪律以 [`../../AGENTS.md`](../../AGENTS.md) 为准；本仓可用的转化版是 [`../恋爱军师技能总纲.md`](恋爱军师技能总纲.md) 与 [`../恋爱大师10人团队.md`](恋爱大师10人团队.md)。