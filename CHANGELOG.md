# 更新日志

本文件记录 MBTI 探索者（原「狗头军师 goutoujunshi」）对用户体验有影响的主要变化。项目尚未发布正式版本号的变更统一记录在“未发布”章节。

## 未发布 — 2026-09-06（第二轮：遗留五条结案 + 一手文献复核 + 自纠 4 起）

### 新增：`documentation/遗留五条结案-2026-09-06.md`

主人要求「去网络搜集全维度比较权威的支撑材料，把这五条全部给我一个足以让我满意的答复」。结果：**3 条钉死到一手、1 条给出可执行裁决、1 条部分解决并说清卡在哪**，另查出 4 件不在原清单里但更要紧的事。

- **宪法级文件**：= `multica-ai/andrej-karpathy-skills`（原 `forrestchang/…`，⭐210,488）的 `CLAUDE.md` **删掉首行标题**（2357 − 12 − 1 = 2344，字节数精确对上）。作者 **Jiayuan Chang**（X `@jiayuan_jy`）。**仓内无 LICENSE 文件**（GitHub license 检测返回 `null`），MIT 只是 README 与 SKILL.md frontmatter 的自我声明——按 MIT 处理并如实标注证据缺口。素材源自 Karpathy 2025 年末 X 帖 `status/2015883857489522876`，**Karpathy 本人未执笔**。
- **Humanizer 中文版**：= `op7418/Humanizer-zh`（归藏，⭐16,743，MIT）的 `SKILL.md`，**除末尾少一个换行外字节全同**（18897 vs 18898）。授权链 `blader/humanizer`（Siqi Chen，MIT）→ `op7418`（MIT，自带 LICENSE 全文）→ 本仓，**译者授权问题解决**。
- **内阁决策**：GitHub 代码搜索三个特征串**全部 0 命中**，判定为作者不详的中文社群转贴（证据：中文引导语 + frontmatter 被全角方括号包裹 + 英文正文配中文示例）。**但查到更该知道的事**：主人自己在 `Yingzai2026` 的五席内阁纪要（追问／反对／机会／外行人／执行）会议时间 **2026-08-02**，比 turbine 技能库被 wendang11 钉定的 **2026-08-11 早 9 天**——**这份文件不是方法的来源，而是方法的事后表述**。处置：保留为历史材料，不对外分发。
- **`SKILL运用指南` 冲突**：先更正计数——是 **3 处冲突（9 行标记）**，不是先前写的「9 处」。实测 turbine `技能库&准则/`：一级条目 **79** 个 = **62 个目录**（去重后唯一 **60** 个，含 2 组大小写孪生）+ **17 个文件**（11 zip + 6 md）；全递归 `SKILL.md` **2712** 个，而一级子目录直下的 `SKILL.md` **0** 个（各库入口文件名不统一）。**两侧装载数字都不准**：「33 大技能模块」偏少、「58 大领域专业技能库」偏少、「86+ SKILL.md」差 **31 倍**；只有传入侧的「17 大核心规约档案」恰好对上实测 17 个一级文件。裁决**已执行**：HEAD 侧 260 行保留为 §1–§17 主体、传入侧独有 3 节并入 §18–§20、§0 取 HEAD 侧、装载数字全弃用改实测，产物 **`documentation/methods/SKILL运用指南-合并裁决版.md`**（38,419 字节／456 行／`##` 级标题 22 个／残留冲突标记 **0**）；原始冲突版一字未改。**逐行验证不空口宣称**：HEAD §2–§17 共 **237 行逐行原样**、§1 矩阵 20 行原样、传入侧独有内容抽样 6 行全中、弱化版 `git pull origin arena…`（无 `--ff-only`）全文仅作为引用出现 1 次。
- **模块名对账：两侧都没有虚构库名**。HEAD 侧引用 **44 个名字全部真实存在**（39 个一级目录 + `.learnings`／`.opencodereview` 2 个仓根隐藏目录 + `nuwa-distilled/bojie-li-perspective`／`nuwa-distilled/self-harness-perspective`／`skills-main/skills/pptx` 3 个嵌套路径）；传入侧引用 **48 个名字，48 个全部一级命中**。差别在覆盖面，不在真实性。
- **顺带查出两个原文件没提的缺陷**：① **大小写孪生目录**——`Qwen-MM-Plugins/`↔`qwen-mm-plugins/`（tree sha 同为 `77106837…`，各 1165 路径）、`Understand-Anything/`↔`understand-anything/`（同为 `45df30b2…`，各 590 路径），**1,755 条路径是纯冗余孪生副本**（占技能库 3.7%、全仓 3.6%；全仓重名组数实测正好 1,755，说明没有第三处）。Windows 文件系统大小写不敏感（git 默认 `core.ignorecase=true`），这 1,755 对路径**无法同时 checkout**，工作树会**永久处于脏状态**——而该文件 §16 的执行协议恰恰是让主人在 Windows 上 `cd /d D:\turbine-blade-ai-platform && git pull --ff-only`。修法：删任一份（tree sha 相同不丢内容），62→60 目录、47,965→46,210 路径。② **两侧矩阵合计漏掉 6 个真实存在的库**——`alirezarezvani-claude-skills`（**6613 路径，全仓第一**）、`buildwithclaude-hub`（**3057，全仓第五**）合计 **9,670 路径 = 全仓的 20.0%**，是这份自称「统一入口、技能路由表」的文件最大覆盖缺口；另 4 个（`last30days-skill-main` 205／`WRITING.md-main` 21／`human-writing-main` 20／`AIGC_text_detector-main` 13）全属「AI 痕迹检测与人类化写作」一条线，与矩阵已列的 `Stop-slop.md`／`Humanizer - 中文版.md` 同域，**其中包括这条线唯一的检测器**。

### 一手文献复核：4 组数字从 B/C 级升为 A 级

- **Pittenger (2005)** *Consulting Psychology Journal* 57(3):210–221, doi:10.1037/1065-9293.57.3.210 —— **全文已读**。「约 50% 变型」是**误读**：50% 指 5 周内**≥1 个量表**变化（McCarley & Carskadon 1983，Pittenger 只是转引）；**换四字母类型的真数字是 35%（4 周，Myers et al. 1998）**；分维度漂移 EI 32%／SN 25%／TF 29%／JP 30%；每量表 SEM ≥20。
- **McCrae & Costa (1989)** *Journal of Personality* 57(1):17–40, doi:10.1111/j.1467-6494.1989.tb00759.x（267 男 + 201 女，19–93 岁）—— **原文 PDF 已读**。① **「39–76% 变型」的真身找到了**：原文「**31%–61% 复测（5 周–6 年）得到相同四字母型**」，倒推即 39%–69%，**"76"是二手站把 69 讹成的**。② 相关系数原文口径是「**around .7**」（替代量表实测 EI↔E −.58／−.62、SN↔O .56／.54、TF↔A .46／.32、JP↔C −.29／−.28）；先前引的 `.74/.72/.44/−.49` 是二手渲染，**强弱排序的更正仍成立**（E/I、S/N 强，T/F、J/P 弱），但精确值不再照抄。③ 原文三条**前提级否证**：类型「merely summarize four additive main effects」、「**INTJs differ from ENTJs only in the ways that introverts differ from extraverts**」、功能主导的断言「**not supported by data**」、「**no good evidence that the JP scale has any bearing at all**」、Keirsey 的人口占比估算「**surely an unwarranted reification**」、且「**none of the MBTI indices is related to peer-rated Neuroticism**」。
- **Marioles, Strickert & Hammer (1996)** *Journal of Psychological Type* **36**:16–27（St. Mary's University，426 对夫妻，7 年）—— **完整引用确认存在**，但**手册把结论讲反了**：原文**支持同型相吸**，并给出女性嫁 INTP 33%／INFP 31%／ISFP 22% 不满意。「预测力可忽略、仅比随机略好」是 `mbtitypeguide.com` 的编辑加工（同站另一处还把样本写成 250 对，自相矛盾）。**两篇一手文献方向相反**（Marioles 同型相吸 vs Kim & Lee 2010 无显著差异），诚实总结是「证据混合、效应小且不一致」。
- **依恋「68%／2.7×」判死** —— 任何依恋文献里都不存在这两个数。换上 8 条**真实可引**的锚点：Mickelson, Kessler & Shaver (1997) 全国样本 59% 安全型；**Li & Chan (2012) 元分析 73 项研究／21,600+ 被试**（焦虑与回避均与满意度负相关）；Banse (2004) 德国已婚样本 72%；离婚者样本安全型仅 52.5%；Davila & Bradbury；EFT 干预 70–75% 恢复、d=0.93；Waters et al. (2000) 20 年纵向 72% 维持。
- **INTJ 常模拿到两套官方口径**（手册原书付费，判 B/C）：美国代表性样本 **2.1%**（男 3.3%／女 0.8%，第 3 稀有）vs 最新全球样本 **2.6%**（男 3.0%／女 2.2%，第 4 稀有，**ENTJ 1.8% 最稀有**）。intj.html 的「与 INFJ 并列最稀有」**不成立**（两套数据里 ENTJ 都比 INTJ 稀有），「2–4%」的上限 4% 无依据。

### intj.html 逐行精读完成（抽出 418 行纯文本全读）

新增 **`assets/web/README.md`**：21 条断言分级审计——**9 条站得住 / 2 条与一手文献直接冲突（+1 附带）/ 6 条类型文学 / 4 条无来源**。

- **追到一个源头**：「**Fe 诡匠**」= John Beebe 八维原型的 **Trickster 位**（INTJ 第 7 功能），A1 人格判定书在用它，此前一直没追到出处，现在确认**是正确使用不是生造**。
- **这页做得好的地方**（不否定）：Beebe 配置正确、「Keirsey ≠ 功能模型」的裁定有价值、「同一四字母内部差异可能大于型间差异」**有 McCrae & Costa 一手支撑**、末尾边界声明合格、自陈来源是"公开书摘"诚实、「低中高阶」自标非官方。
- **两条前提级冲突**：整页立论「八功能栈才是户型，四字母只是门牌」与「INTJ vs INFJ 机制迥异」，被 McCrae & Costa (1989) 正面否证；功能栈的排序规则（JP+EI 决定主导）原文明说「not supported by data」。
- **不得当事实引用**：§09「INTJ 关系数据」整块（一个来源名都没给）；§12 图 03 Big Five 剖面（无样本量无量表名，其中**「神经质 45」根本无法从 MBTI 推出**，因 MBTI 不测神经质）；§09 的「426 对…仅比随机略好」。
- **HTML 一字未改**（历史材料），审计结论写进 README 与台账。

### 自纠 6 起（已全部修好并留痕，见 `AGENTS.md` §3.4）

1. **CRLF 被静默改写**：首轮用 Python 文本模式拷贝 6 份原始规约，CRLF → LF（Humanizer 少 483 字节、内阁决策少 368、宪法级少 63、Stop-slop 少 136），**而当时 NOTICE 里已写下"md5 一致"**。改二进制模式重拷并逐份复核，现 **5 份与源字节完全一致**，Stop-slop 仅含 3 处链接补丁 +156 字节；22 份内容文件"去横幅后逐字节对账"**22/22 通过**。
2. **误拷一个重复文件**：批量脚本按目录全量遍历，把 `恋爱军师技能总纲.md` 一起拷进了 `原始规约/`，生成一个没有来源横幅的重复文件。已删除（正主在 `documentation/methods/`）。
3. **我自己的判语错了**：先前断言「官方写 23 country/language supplements，与手册的『20 国』不符」——**23 是 supplements／samples 数，不是国家数**（官方：「23 samples in 19 languages from 20 countries」），手册的「20 国」是对的。**以纠错者姿态说错话比原文写错更容易骗人**，已在台账与手册横幅公开更正。
4. **计数单位说错**：「9 处冲突标记」实为 **3 处冲突 × 3 行标记**。
5. **算错装载规模**：先前写「一级条目 62 个，其中 zip 11 个 → 实体目录 51 个」——那 11 个 zip 是 **blob**，不在 62 个**目录**里，是拿文件数减目录数的**类别错误**。实测正确值为 **79 = 62 目录 + 17 文件**，去重后唯一技能库 **60** 个。已在结案报告 §4、`NOTICE.md` §5.1、本 CHANGELOG、README 就地更正；**上一条 commit `de443c4` 的 message 无法改写，故在此声明**。教训：对两次独立查询得到的数字做算术前，先确认它们是不是同一个集合。
6. **裁决本身错过一次**：先前判「§1 取 HEAD 侧」，理由是「信息量是传入侧 86 行的 3 倍」。完整拆开两侧后发现冲突 ③ **不是同一批章节的两种写法，而是两条不同的文档尾巴**（HEAD 有 §1–§17，传入侧只有 §1–§5，其中明星技能解析／专家调度路由表／零 AI 味规范 3 节 HEAD 完全没有），照原裁决执行会丢掉这些内容。**行数多的一侧不等于覆盖了另一侧**。

### 同步更新

新增 **`documentation/methods/SKILL运用指南-合并裁决版.md`**（冲突已解决的可读版，38,419 字节）与 **`assets/web/README.md`**（intj.html 逐行审计）。

`documentation/methods/原始规约/NOTICE.md`（归属表全部改为一手已核版 + 新增 §5 冲突裁决）、`documentation/数字核验台账-…-2026-09-06.md`（新增 §1.5–§1.7、§8，改写 §7 诚实清单，更正 §1.2③）、`references/knowledge/21-MBTI参透手册-2026-08-11.md`（横幅从 3 处修正扩到 **6 处** + 依恋数字判死提示）、`references/practical/00-导读与使用分级.md`（新增 intj.html 入口与 McCrae 前提提醒）、`AGENTS.md` §3.4（追加 4 条判例）。

---

## 未发布 — 2026-09-06（wendang11 迁入 + 数字核验 + 许可证对齐）

### 迁入：前身仓 `wendang11` 的 22 份独有内容

`sunccchengze/wendang11`（「恋爱大师 LoveMaster · 恋爱军师 2.0 · MBTI 精通型」，2026-08-04 建、2026-08-12 停更）由主人决定删除。它与本仓同以 `goutoujunshi` 为底座，是同一条思路更早的一次迭代；本仓 `corpus/sources/SOURCES.md` 的 **A1 证据源**（人格判定书）此前就存在那个仓里，删库会断链。

- **`corpus/sources/A1-sunccchengze-人格判定书.md`**：A1 本体入仓，正文一字未改，加溯源横幅。`SOURCES.md` 的 A1 行与 `corpus/profile/05` 同步更正（按「只追加留痕」，原记录保留 + 追加日期说明）。
- **`references/knowledge/21-MBTI参透手册-2026-08-11.md`**：八功能／16 栈／Shadow／Loop／Grip 恢复表、Step II 20 切面清单、Probability Index、21 条参考来源。与既有 `04-MBTI人格与匹配.md` **互补不重复**（04 是证据纪律，21 是机制与来源）。
- **`references/knowledge/22-三本宝书蒸馏-Jung-Myers-Keirsey.md`**：Jung《心理类型》／Myers《Gifts Differing》／Keirsey《Please Understand Me II》三家对照读法。
- **`references/practical/交往注意事项/`**（16 份 + 导读）：「我（INTJ）与 X 型交往注意事项」，为孙承泽一人定制，换人须重推。
- **`documentation/methods/`**：`恋爱大师10人团队.md`（主人「多视角红队」工作法的方法本体）、`恋爱军师技能总纲.md`、`原始规约/`（turbine `技能库&准则` 的 6 份忠实副本，md5 已逐一核对）〔**2026-09-06 追加更正**：写下这句时该核对**并不成立**——首轮拷贝把 CRLF 静默转成了 LF；已改二进制模式重拷并复核，现 5 份与源字节全同、Stop-slop 仅含链接补丁 +156 字节。按「只追加留痕」原则保留原句，详见本节上方"自纠 4 起"〕+ `NOTICE.md`（版权归属、MIT 许可证全文、已知缺陷）。
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
