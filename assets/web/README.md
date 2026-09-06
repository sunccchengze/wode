# assets/web · 迁入网页资产

## intj.html

`sunccchengze/wendang11` 的 `web/intj.html`，2026-09-06 迁入。**33,864 字节，零外链、零外部字体、零 CDN**，可离线直接打开；本仓用 `python3 -m http.server` 起本地预览。

**内容**：「INTJ 完全剖析 · 建筑师 / Mastermind」，16 个章节，由 wendang11 的"恋爱大师 10 人团队"（【镜】【枢】【锚】【纹】【谜】【野】【言】【忆】【衡】【界】）联合产出，知识源为 `references/knowledge/21-MBTI参透手册-2026-08-11.md` 与 `22-三本宝书蒸馏`。

**字节状态**：**一字未改**。这是历史材料，审计结论写在下面和台账里，不写进 HTML。

---

## ⚠️ 逐行精读审计（2026-09-06，抽出 418 行纯文本全读）

**完整报告**：[`../../documentation/遗留五条结案-2026-09-06.md`](../../documentation/遗留五条结案-2026-09-06.md) §6
**数字分级**：[`../../documentation/数字核验台账-wendang11迁入-2026-09-06.md`](../../documentation/数字核验台账-wendang11迁入-2026-09-06.md) §8

21 条断言分四类：**9 条站得住 / 2 条与一手文献直接冲突（+1 条附带）/ 6 条类型文学 / 4 条无来源**。

### 引用这页前必须知道的 3 件事

**1. 整页的前提被一手文献正面否证。** §02 写「四字母只是门牌，**八功能栈才是户型**」，§11 写「INTJ vs INFJ 机制迥异」。而 McCrae & Costa (1989, *Journal of Personality* 57(1):17–40) **原文**说：

> there is **no evidence that MBTI types represent unique configurations, they merely summarize four additive main effects**. **INTJs differ from ENTJs only in the ways that introverts differ from extraverts**; EI does not interact with the other indices to form qualitatively new combinations.

**2. 功能栈的排序规则，原文明说没有数据支持。** Ni 主导→Te 辅助→Fi 第三→Se 劣势 这个顺序，依赖"JP + EI 决定哪个功能主导"这套推演。原文：

> the assertions about the **dominance of particular preferences in inner and outer life** are based solely on Jungian theory and on the use of the JP and EI scales to determine the dominant function, and are **not supported by data**. There is **no good evidence that the JP scale has any bearing at all** on the relative importance of thinking or perceiving.

**3. §06「占比约 2–4%，与 INFJ 并列最稀有」两处不准。** 两套官方口径：美国代表性样本 INTJ **2.1%**（男 3.3%／女 0.8%，第 3 稀有，INFJ 1.5% 最稀有）；最新 MBTI Manual 全球样本 INTJ **2.6%**（男 3.0%／女 2.2%，第 4 稀有，**ENTJ 1.8% 最稀有**）。**两套数据里 ENTJ 都比 INTJ 稀有**，新口径里 INFJ 也比 INTJ 稀有，所以「与 INFJ 并列最稀有」不成立；「2–4%」的上限 4% 无依据；女性区间 0.8–1.5% 只对得上旧口径（新口径 2.2%，差近 3 倍）。

### 这页做得好的地方（不要一并否定）

- **Beebe 八维原型用得对**：Hero=Ni、Parent=Te、Child=Fi、Inferior=Se；阴影 Opposing=Ne、Critical Parent=Ti、**Trickster=Fe**、Demon=Si。**「Fe 诡匠」这个术语的真实出处就是 Beebe 的 Trickster 位**——A1 人格判定书在用它，此前一直没追到源头，现在追到了，是正确使用不是生造。
- **「Keirsey ≠ 功能模型」的裁定是对的**，而且是这页最有价值的一句话。
- **「同一四字母内部差异可能大于型间差异」有一手支撑**（McCrae & Costa 原文批评 MBTI 二分「failing to note the large differences … **within type**」）。
- **末尾边界声明合格**：非心理测量金标准、重测信度有限、所有匹配数据作趋势参考、不作诊断招聘与"该不该在一起"的判决。
- **自陈来源是"公开书摘"而非原著**，诚实。
- **「低中高阶」明确标注不属于官方 MBTI**，诚实。

### 不得当事实引用的部分

| 位置 | 内容 | 裁定 |
| --- | --- | --- |
| §09「INTJ 关系数据」 | 42%／31%／76%／68%／84%／1.9×／61%／73%／81%／1.7× | **E 级**。标称"多来源调查"，**一个来源名都没给**。整齐的两位数百分比 + 倍数是典型 SEO／AI 生成形态 |
| §12 图 03 Big Five 剖面 | E 12／A 55／**N 45**／C 73／O 75，SLOAN 近似 RCOAI | **无样本量、无量表名、无出处**。其中 **N 45 根本无法从 MBTI 推出**——McCrae & Costa 原文「**none of the MBTI indices is related to peer-rated Neuroticism**」，且把"MBTI 缺少神经质因子"列为其最显眼缺陷。其余四项**方向**与原文一致，可当方向示意，不可当均值 |
| §09「426 对夫妻 7 年…仅比随机略好」 | Marioles et al. (1996) | **结论被讲反**。该文（*Journal of Psychological Type* **36**:16–27）真实结论是**支持同型相吸**，并给出女性嫁 INTP 33%／INFP 31%／ISFP 22% 不满意。「仅比随机略好」是内容站的改写 |
| §09 化学排名全表 + INTJ×INTJ 70/100 | personality-database 众包口径 | **D 级**，页面自己标了"趋势参考"。且 70/100 与同页排名表里 INTJ×INTJ 的 83 **自相矛盾** |
| §06 代表人物 10 人 | Musk、Newton、Zuckerberg、Michelle Obama、Tesla、Nolan、Nietzsche、Hawking、Hillary Clinton、Jay-Z | **D 级粉丝打型**。已标"非官方认证"算诚实，但内部不自洽：Michelle Obama 与 Hillary Clinton 在同批社群里更常被归为 ESTJ／ENTJ |
| §01「重测 39–76% 变型」 | — | **"76"不存在**。真身是「31%–61% 复测（5 周–6 年）得到相同四字母型」（McCrae & Costa 1989 转引 MBTI Manual），倒推即 39%–69% |
| §13 发展路线年龄分段 | 0–12／13–22／23–35／36–55／55+ | 个体化理论与功能依次浮现是 MBTI 类型发展理论的通行说法，但**这套具体年龄分段是社群约定，不是实证分期** |
| §16「低阶像 ENTP 一样生活以激活阴面四维」「A 是发展完善态」 | 中文 MBTI 圈说法 | **无任何出版来源** |

### 本仓的立场（早就写对了，这页写过头了）

功能栈**作为沟通隐喻与自我觉察工具可用**，这与 [`../../references/knowledge/04-MBTI人格与匹配.md`](../../references/knowledge/04-MBTI人格与匹配.md) 的既有立场一致（八功能是"访谈假设而非读心术"）。**但不能当实证机制宣称**——尤其不能宣称"类型之间存在独特配置"或"功能栈排序有数据支持"，这两条 McCrae & Costa (1989) 已直接否证。
