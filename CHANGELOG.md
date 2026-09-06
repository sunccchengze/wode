# 更新日志

本文件记录 MBTI 探索者（原「狗头军师 goutoujunshi」）对用户体验有影响的主要变化。项目尚未发布正式版本号的变更统一记录在“未发布”章节。

## 未发布 — 2026-09-06（wendang11 迁入 + 数字核验 + 许可证对齐）

### 迁入：前身仓 `wendang11` 的 22 份独有内容

`sunccchengze/wendang11`（「恋爱大师 LoveMaster · 恋爱军师 2.0 · MBTI 精通型」，2026-08-04 建、2026-08-12 停更）由主人决定删除。它与本仓同以 `goutoujunshi` 为底座，是同一条思路更早的一次迭代；本仓 `corpus/sources/SOURCES.md` 的 **A1 证据源**（人格判定书）此前就存在那个仓里，删库会断链。

- **`corpus/sources/A1-sunccchengze-人格判定书.md`**：A1 本体入仓，正文一字未改，加溯源横幅。`SOURCES.md` 的 A1 行与 `corpus/profile/05` 同步更正（按「只追加留痕」，原记录保留 + 追加日期说明）。
- **`references/knowledge/21-MBTI参透手册-2026-08-11.md`**：八功能／16 栈／Shadow／Loop／Grip 恢复表、Step II 20 切面清单、Probability Index、21 条参考来源。与既有 `04-MBTI人格与匹配.md` **互补不重复**（04 是证据纪律，21 是机制与来源）。
- **`references/knowledge/22-三本宝书蒸馏-Jung-Myers-Keirsey.md`**：Jung《心理类型》／Myers《Gifts Differing》／Keirsey《Please Understand Me II》三家对照读法。
- **`references/practical/交往注意事项/`**（16 份 + 导读）：「我（INTJ）与 X 型交往注意事项」，为孙承泽一人定制，换人须重推。
- **`documentation/methods/`**：`恋爱大师10人团队.md`（主人「多视角红队」工作法的方法本体）、`恋爱军师技能总纲.md`、`原始规约/`（turbine `技能库&准则` 的 6 份忠实副本，md5 已逐一核对）+ `NOTICE.md`（版权归属、MIT 许可证全文、已知缺陷）。
- **`assets/web/intj.html`**：431 行自包含 INTJ 图文页，零外链，字节级原样复制。

**没迁的**：`base/goutoujunshi/`（67 文件，是上游 2026-08-17 改许可证之前的旧快照，LICENSE 还是 PolyForm Noncommercial，本仓 `reference-repos/` 那份是 MIT 新版，更优）；`skills-library` submodule（内容本体在 turbine，775 MB 仓仍在，挂进来会撞 128 MB／1 万文件快照上限）；49 张荣誉证书照片与 12.6 MB docx（不在 main 里，且 `SCZ_Archived` 与 `Yingzai2026` 各有一份）。

### 新增：数字核验台账（本次的主要产出）

**`documentation/数字核验台账-wendang11迁入-2026-09-06.md`**：把迁入内容里的 **27 组数字**逐条定级——**A** 一手文献／官方页面（4 条）、**B** 多站一致的二手转述（4 条）、**C** 口径互相打架（4 条）、**D** 众包投票与类型文学（2 组）、**E** 找不到任何出处（5 组）。数字一个没删，但引用规则写死了：A 可直接用，B／C 须写「转引自 X 站，归属 Y 文献」，D 只能当类型文学口径且同屏给反证，**E 不得进入任何对主人的结论**。

核验中的实质发现：

- **抓到手册一处硬错**：`21-` §5 写「I/E、T/F 相关性较好，S/N、J/P 较弱」，而 McCrae & Costa (1989) 实测是 E/I↔外倾 r≈0.74（最强）、S/N↔开放 r≈0.72（次强）、**T/F↔宜人 r≈0.44（最弱）**、J/P↔尽责 r≈−0.49。最强和最弱说反了。
- **Probability Index 的定义偏离官方**：官方（themyersbriggs.com）口径是「复测得到同一结果的统计概率」，量的是**稳定性**；手册读成了「你是某偏好的概率」。且它不是 2026 新增，MBTI Global Assessment 约 2023 年已上线；手册写的「16,733 人、20 国」与官方的「23 country/language supplements」不符。
- **MBTI-BENCH 那条是准的**，并补上了完整引用：Li et al., COLING 2025, pp. 5071–5081, ACL Anthology `2025.coling-main.339`。
- **补了一条 wendang11 没引的一手文献**：Kim & Lee (2010), *J Korean Acad Nurs* 40(3):336-, doi:10.4040/jkan.2010.40.3.336，n=62 临床夫妻，MBTI 类型相似性与婚姻满意度、正性情感、冲突调节**均无显著差异**。
- **68%／2.7× 那组依恋数字判 E**：唯一出处是一个 SEO 内容站，它自己转引 Mikulincer & Shaver (2007)，原书里找不到对应表述的公开证据。
- **原始材料内部两处打架**：INFP 与 INFJ 两份 md 里**一个百分比都没有**（92、85 只在 html 排名表里）；INTJ×INTJ 在 md 是 70/100、在 html 排名表是 83。两处照录不改，在导读里逐份标明哪个数出自哪个文件。

### 🔴 破坏性变更：根许可证 PolyForm Noncommercial → MIT

`LICENSE` 与 `LICENSE.zh-CN.md` 改为 **MIT**，与上游 `goutoujunshi`（2026-08-17 已改 MIT）对齐。此前那份非商业许可证是从上游改许可证**之前**的旧快照继承来的，与 README 一直写着的「上游 …，MIT」自相矛盾。新 `LICENSE` 按 MIT 保留义务写明三方版权归属（powerycy / shengjidaguai-china、Hardik Pandya、Siqi Chen）。**影响**：本仓内容从此可商业使用、修改、分发、再许可。

### 纪律澄清（不改旧条目）

`AGENTS.md` §5 追加 **2026-09-06 主人裁定**：「可以有数字，但不要骗我是事实」。第 2 条「不给功能百分比、匹配率等假精确数字」禁的**不是数字，是无校准／无来源的数字冒充测量值**（`references/knowledge/04` 第 153 行原本就把要禁的东西定义为「精准幻觉：…等**无校准**数字」）。落地办法即上面的 A–E 分级。

`AGENTS.md` §3.4 判例库追加两条：① Agent 替主人归纳的纪律被写成「仓库主人的工作手册」，主人本人对其中若干条没有拍板记录——**归纳必须标注是归纳，不是原话**；② 迁入 16 份交往注意事项时把 html 的化学值当成了 md 的数——**表格每一格都要能指回具体某个文件**。

### 兼容性

- **运行时行为契约未变**：`SKILL.md`（125 行／4916 字符，预算 150／5000）**一字未改**，没有挤占预算，也没有新增必需路由。
- 迁入的知识与话术通过既有入口可达：`references/practical/00-导读与使用分级.md` 新增一行、`corpus/sources/SOURCES.md` 新增 M5–M9、`AGENTS.md` §9 文件地图新增 7 条。
- 唯一被改动的迁入文件是 `documentation/methods/原始规约/00-Stop-slop-原始.md`：原文 3 个相对链接（`references/{phrases,structures,examples}.md`）在本仓不存在，改写为上游 `hardikpandya/stop-slop` 的 GitHub 绝对链接（三个路径均已核实存在）。其余 21 份正文一字未改。

## 未发布 — 2026-09-03（正名）

### 🔴 破坏性变更：Skill 更名

- **Skill 由「狗头军师 goutoujunshi」正式更名为「MBTI 探索者 `scz-mbti-explorer`」**，仓库名、Skill 名与内容终于对齐。
- `SKILL.md` 重构为**双入口**：主干是人格探索（先读 `corpus/` 语料，只追问会改变结论的问题），恋爱与关系咨询降级为应用场景之一。按需加载表重排，MBTI 与语料路由置顶。
- `agents/openai.yaml`：`display_name` 改为「MBTI 探索者」，默认提示词改为 `$scz-mbti-explorer`。
- `scripts/validate_skill.py`：name 断言、`$skill` 引用与通过提示同步改名。
- `scripts/memory_store.py`：本地存储目录改为 `scz-mbti-explorer`；**首次调用时自动把旧的 `goutoujunshi` 目录迁移过来**，已同意的关系档案不会丢失；环境变量 `GOUTOUJUNSHI_MEMORY_DIR` 仍作为旧名兼容读入，新名为 `SCZ_MBTI_EXPLORER_MEMORY_DIR`。
- 文档同步正名：README（首页与用法顺序重写）、README_EN、CONTRIBUTING、`documentation/product.md`／`architecture.md`／`automation.md`／`mbti-skill-research.md`。README 顶部保留「源自 `goutoujunshi`（MIT）」的沿革声明。

### 兼容性

- **行为契约未变**：情绪落地／事实拆分／利益判断／明确建议／行动收束五步流程、说话人映射、ChatLab 边界、长期记忆同意机制与安全边界全部保留。
- 45 份关系知识与话术文档原样保留（MIT 上游资产），仍是关系场景的真实能力。
- 需要在 Codex 中用新名调用：`$scz-mbti-explorer`。若旧安装目录名为 `goutoujunshi`，建议重新克隆到 `scz-mbti-explorer`。

## 未发布 — 2026-09-03

### 新增能力

- **孙承泽专属语料库**：新增 `corpus/`，含 `profile/00-孙承泽人物档案.md`（学业坐标、技术自述基线、心智模型 M1–M5、决策启发式 13 条、社交与亲密关系、已知弱点）、`profile/01-MBTI证据账本.md`（5 个候选、26 条证据、4 组相邻类型对决、Big Five 交叉校验、推翻条件）、`profile/02-表达DNA与语言样本.md`、`profile/03-待补充问题队列.md`、`memory/MEMORY.md`、`sources/SOURCES.md`。种子语料来自 `sunccchengze/sunchengze-distilled`（本人授权的活的主本）。
- **语料更新协议**：只追加不删改；`【一手】`/`【档案】`/`〔推断〕`/`【待确认】`分层标注；推断必须给推翻条件；对话结束前追加活记忆；恋爱等敏感材料只作决策模式证据，不冒充本人对外发言。
- **外部参考仓库**：新增 `reference-repos/`，收录 7 个 MBTI／人格分析仓库（5 个 star > 1k），并附 `REFERENCE-INDEX.md` 说明每个仓库能借什么、不能借什么；`scripts/fetch_reference_repos.sh` 按固定 commit 重建被忽略的大体积仓库。
- **初始 MBTI 工作结论**：领先 INTJ（中高置信度），备选 ENTJ > INFJ ≈ ISTJ，INTP 已排除；明确标注为可推翻工作假设，附改判条件。

### 体验改进

- **本人路由**：`SKILL.md` 新增「本人语料库」章节与按需加载路由——涉及本人定型、自我认知或决策风格时先读 `corpus/`，先调用已有证据，只追问会改变结论的问题。
- **仓库体检报告**：新增 `documentation/仓库体检报告.md`，用 diff 上游 `shengjidaguai-china/goutoujunshi` 的物证说明「仓库名与内容不对应」的现状（MBTI 仅占 12.2%），并给出改名派／正名派两套方案。

### 可靠性与边界

- **验证器隔离**：`scripts/validate_skill.py` 增加 `VENDORED_PARTS` 白名单，链接与占位符检查跳过 `reference-repos/`，避免第三方仓库的断链导致本仓校验失败。
- **许可证治理**：两个未声明许可证的参考仓库（`evolving_personality`、`wordware-ai/twitter`）只作公开事实观察，不复制内容，沿用 `mbti-skill-research.md` 既有规则。
- **体积控制**：ACGTI、Machine-Mindset、evolving_personality 三个大体积仓库不进 Git，改由脚本按需重建。

### 兼容性

- 没有需要用户迁移的破坏性变更。
- `corpus/` 与 `reference-repos/` 均不属于运行时安装白名单（`SKILL.md`、`agents/`、`references/`、`scripts/`、`assets/`）。

## 未发布 — 2026-08-11

### 新增能力

- **可反证的MBTI类型分析**：新增四维与八功能证据边界、2–6个候选类型、证据账本、自适应场景访谈、常见相邻类型对决、Big Five交叉校验、第二名与反证条件；不从几句话生成假精确分数。
- **MBTI沟通与成长训练**：把人格偏好翻译成可测试的沟通表达、冲突协商和八种信息处理能力练习；成长用于扩展能力范围，不宣称把用户换成另一人格类型。
- **MBTI案例审计工具**：`scripts/mbti_case.py`可初始化和校验本地证据案例，并审查报告是否缺少备选、证据、关键对决、不确定性或非临床边界；工具不自动计算类型。
- **可撤销长期记忆**：用户首次明确同意后，可自动维护有限的用户、对象、关系与关键事件档案；支持查看状态、按需召回、暂停、撤销最近更新、忘记对象和清空全部记忆。
- **聊天记录与截图分析**：长聊天分析会先锁定双方说话人映射，再区分可见原文、转述、合理推测和未知信息，降低左右气泡或多人转发导致的归因错误。
- **可选 ChatLab 适配**：能够分析用户已经提供或导入的数据，并以有限范围检索、统计和消息编号引用证据；不会声称可以直接导出微信、QQ 等聊天软件记录。

### 体验改进

- **恢复老版军师主干**：普通关系咨询继续完成情绪落地、事实拆分、利益判断、明确建议与理由，以及行动、观察窗口和停止条件。
- **恢复老版首次咨询方式**：非紧急且没有完整档案时使用紧凑问卷，收集用户与对象的 MBTI、主观评分、关系经过、目标和情绪；未知可以留空。
- **恢复老版即时回复节奏**：用户问“这句怎么回”时先给自然、简短、可复制的首选话术，再补发送时机、主要代价和积极／含糊／无回应分支。
- **保持老版人格与推进逻辑**：MBTI 只作为档案线索并由真实行为校正；没有明确拒绝、不适或现实危险时至少帮助用户主动一次，退出、冲突或持续缺乏投入时不强行推进。

### 可靠性与边界

- **有限记忆而非无限档案**：记忆使用有限字段、有限事件和按需召回；没有记录或字段缺失时明确回答“不知道”，不从名字、MBTI 或旧案例补事实。
- **安全边界轻量化**：核心底线集中在关系性明确拒绝、强迫、跟踪、威胁、诈骗、家暴和即时生命危险；拒绝仅针对具体时间或方式时不自动推断为整段关系的拒绝。
- **轻量按需加载**：核心 Skill 保持短小，只按当前任务加载必要的亲密关系、MBTI、长期记忆或 ChatLab 资料，避免把完整知识库塞进每次回答。
- **验证与隔离加强**：更新结构、上下文预算和运行时检查；记忆的状态、授权、写入、召回与撤销使用隔离存储验证，避免测试数据进入真实档案。

### 兼容性

- 没有需要用户迁移的破坏性变更。
- 未同意长期记忆的用户仍可正常使用全部即时咨询能力。
- ChatLab 是可选能力；未安装时仍可使用粘贴文本、上传截图或手动转述进行分析。
