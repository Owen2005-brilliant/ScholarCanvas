# ScholarCanvas：面向学生与研究者的双模式开源学术主页模板

> 项目工作名：**ScholarCanvas**<br>
> 项目形态：纯静态、无需后端、无需服务器维护、下载即可使用<br>
> 目标用户：本科生、硕士生、博士生、青年教师与科研人员<br>
> 文档版本：v1.0<br>
> 设计日期：2026-07-31

---

## 1. 项目概述

ScholarCanvas 是一个面向学生与研究者的现代化个人主页模板。它强调：

1. **无需后端**：不依赖数据库、云函数或长期运行的服务器。
2. **下载即可使用**：仓库克隆后可直接打开 `index.html`，也可通过任意静态服务器预览。
3. **双模式设计**：针对“学生/申请者”和“博士/教师/研究者”提供不同的信息结构与视觉风格。
4. **配置驱动**：用户主要修改配置文件，而不是直接编辑复杂 HTML。
5. **中英文支持**：内置双语切换，并允许只填写单语内容。
6. **活泼但不失专业**：保留学术主页的信息密度，同时加入适量动画、微交互和个人表达。
7. **开源友好**：提供清晰文档、示例站点、模板仓库、一键部署与贡献规范。

项目不是简单复刻现有学术主页，而是针对国内学生和年轻研究者的真实需求重新设计。

---

## 2. 产品定位

### 2.1 一句话定位

> 一个面向学生和青年研究者的双语、配置驱动、零后端学术个人主页模板。

### 2.2 核心价值

用户只需要修改几个配置文件、替换图片和简历，即可得到一个完整、响应式、可部署到 GitHub Pages 的个人主页。

### 2.3 主要痛点

现有学术主页模板常见问题：

- 面向资深研究者，默认用户已经有大量论文。
- 需要修改大量 HTML，学生上手困难。
- 对项目、实习、比赛、校园经历支持不足。
- 中英文切换需要自行开发。
- 视觉过于朴素，缺少年轻感和个人表达。
- 一些现代模板依赖复杂构建工具，不适合只想快速上线的用户。
- 论文、项目、奖项数据与页面结构耦合，后期维护困难。

ScholarCanvas 的目标是同时解决这些问题。

---

## 3. 设计原则

### 3.1 信息优先

所有动效和装饰都不能妨碍访客在一分钟内看清：

- 你是谁；
- 你研究什么；
- 你做过什么；
- 你最重要的成果是什么；
- 如何联系你。

### 3.2 两套真正不同的表达路径

学生模式和研究者模式不能只是换颜色，而应在以下方面明显不同：

- 首页首屏重点；
- 模块顺序；
- 卡片密度；
- 视觉语言；
- 默认启用的板块；
- 项目与论文的权重。

### 3.3 配置优于改代码

普通用户的主要修改入口应是：

```text
data/profile.js
data/news.js
data/publications.js
data/projects.js
data/experience.js
data/awards.js
data/site.js
```

不要求用户理解页面 DOM 结构。

### 3.4 静态优先

首个正式版本不使用：

- 后端 API；
- 数据库；
- 登录系统；
- 内容管理后台；
- 服务端渲染；
- 必须联网才能工作的核心功能。

### 3.5 渐进增强

即使某些动画、外部徽章或字体加载失败，主要内容仍然可读。

### 3.6 尊重原创与许可证

可以借鉴其他仓库的产品思路和交互启发，但：

- 不直接复制其 HTML、CSS、JavaScript；
- 不使用其图片、图标、字体文件或其他资产；
- 所有组件重新实现；
- 项目采用清晰的开源许可证；
- README 中注明设计灵感来源，但不声称代码衍生关系。

---

## 4. 目标用户

### 4.1 Student Mode：学生与申请者

典型用户：

- 本科生；
- 保研、留学或求职申请者；
- 硕士生；
- 项目经历丰富、论文尚少的同学；
- 希望兼顾科研与个人成长展示的学生。

重点内容：

1. 个人介绍；
2. 研究兴趣；
3. 精选项目；
4. 教育与实习经历；
5. 论文与成果；
6. 比赛、奖项与活动；
7. 技能与联系方式。

### 4.2 Researcher Mode：博士、教师与研究人员

典型用户：

- 博士生；
- 博士后；
- 青年教师；
- 实验室成员；
- 论文与学术服务较多的研究者。

重点内容：

1. Biography；
2. News；
3. Publications；
4. Research；
5. Teaching；
6. Academic Service；
7. Talks；
8. Students；
9. Awards；
10. Contact。

---

## 5. 双模式信息架构

## 5.1 Student Mode 默认顺序

1. Hero / About
2. Current Focus
3. Featured Projects
4. Research Interests
5. Experience
6. Publications
7. Awards & Activities
8. Skills
9. Contact / Footer

### Student Mode 特征

- 项目优先于论文；
- 首屏允许加入一句个人宣言；
- 采用更明亮、更亲和的色彩；
- 允许展示体育、音乐、志愿服务等个人经历；
- 项目图片、Demo 和 GitHub 链接更突出；
- 内容密度适中，移动端阅读舒适。

---

## 5.2 Researcher Mode 默认顺序

1. Hero / Biography
2. News
3. Selected Publications
4. All Publications
5. Research Projects
6. Teaching
7. Service
8. Talks / Students
9. Awards
10. Contact / Footer

### Researcher Mode 特征

- 论文优先；
- 更高的信息密度；
- 更克制的色彩和动画；
- 论文筛选、作者、会议、链接信息更完整；
- 支持 Selected Publications 与完整列表分离；
- 适合较长的学术履历。

---

## 5.3 模式配置

用户通过 `data/site.js` 设置：

```js
window.SCHOLAR_CANVAS_SITE = {
  mode: "student", // "student" | "researcher"
  defaultLanguage: "zh",
  enableLanguageSwitch: true,
  enableDarkMode: true,
  enableModePreviewSwitch: false
};
```

说明：

- `mode` 决定默认布局、模块顺序与视觉预设。
- `enableModePreviewSwitch` 仅用于模板 Demo，普通用户默认关闭。
- 页面内容数据可以被两种模式复用，不要求维护两份信息。

---

## 6. 页面模块设计

## 6.1 Hero / About

### 功能

- 头像；
- 中英文姓名；
- 学校、学院、身份；
- 一句话定位；
- 个人简介；
- 研究兴趣标签；
- Email、CV、GitHub、Scholar、LinkedIn 等链接；
- “复制邮箱”；
- “复制简短个人简介”；
- 中英文切换；
- 深浅色切换。

### Student Mode 设计

- 左侧介绍、右侧头像或插画；
- 背景可有轻量渐变、网格或漂浮小图标；
- 一句话定位可更有个性；
- 研究兴趣以彩色标签展示；
- 可显示 “Currently working on...” 小卡片。

### Researcher Mode 设计

- 更接近传统学术主页；
- 白底或低对比背景；
- 头像尺寸较小；
- Biography 信息密度更高；
- 快速链接集中排列；
- 可显示当前职位、导师或实验室信息。

---

## 6.2 News

### 数据字段

```js
{
  date: "2026-07",
  text: {
    zh: "论文被某会议接收。",
    en: "Our paper was accepted by ..."
  },
  type: "paper", // paper | award | project | career | other
  highlight: true,
  link: ""
}
```

### 交互

- 时间轴；
- 默认显示最近 5 条；
- “展开更多 / 收起”；
- 不同类型使用不同小图标；
- 最新消息可轻微高亮；
- 动画只在首次进入视口时触发。

### 模式差异

- Student Mode：可包含实习、比赛、活动、升学等动态。
- Researcher Mode：默认突出论文、基金、学术服务、职位变化。

---

## 6.3 Publications

### 数据字段

```js
{
  id: "crossbridge-2026",
  title: {
    zh: "CrossBridge：面向冷启动跨域推荐的……",
    en: "CrossBridge: ..."
  },
  authors: [
    { name: "Chenyang Zhang", self: true },
    { name: "Author B" }
  ],
  venue: "ICDM 2026",
  year: 2026,
  status: "under-review",
  selected: true,
  image: "assets/publications/crossbridge.webp",
  links: {
    paper: "",
    code: "",
    project: "",
    dataset: "",
    model: "",
    poster: "",
    slides: ""
  },
  tags: ["Recommendation", "Cold Start", "LLM"],
  summary: {
    zh: "一句话介绍。",
    en: "One-sentence summary."
  }
}
```

### 展示功能

- 论文缩略图；
- 标题、作者、会议和年份；
- 当前用户姓名加粗；
- Selected Publications 高亮；
- 论文标签过滤；
- 自动统计标签数量；
- 支持 Code、Paper、Project、Dataset、Model、Poster、Slides；
- 支持作者过长时折叠；
- 支持 BibTeX 复制按钮；
- 可选 GitHub Star 徽章，但不作为核心依赖；
- 移动端变为上下布局。

### 状态样式

- Published；
- Accepted；
- Preprint；
- Under Review；
- Work in Progress。

不得使用容易造成误导的夸张视觉，应清晰标注论文状态。

---

## 6.4 Projects

项目展示提供两种组件，由模式自动选择，也允许用户覆盖。

### A. Project Cards

适合 Student Mode。

字段：

```js
{
  name: "LineGuard",
  description: {
    zh: "面向无人机输电线路巡检的边缘智能系统。",
    en: "An edge AI system for UAV-based powerline inspection."
  },
  image: "assets/projects/lineguard.webp",
  tags: ["Computer Vision", "Edge AI"],
  featured: true,
  links: {
    github: "",
    demo: "",
    report: ""
  },
  status: "active"
}
```

功能：

- 横向精选项目卡片；
- 支持点击弹窗查看详情；
- 可展示在线状态点；
- 支持项目标签；
- 支持 Demo、GitHub、Report 链接；
- 图片懒加载。

### B. Research Constellation

适合首页的趣味展示，也可作为可选组件。

这是对“旋转项目标签云”思路的原创重构：

- 项目以星点和标签组成“研究星座”；
- 轻微缓慢漂移，而非持续高速旋转；
- 鼠标移动时产生轻量视差；
- 点击项目后高亮相关研究方向；
- 移动端自动降级为静态标签列表；
- `prefers-reduced-motion` 下禁用动画；
- 项目数量超过 12 时自动切换为普通网格。

这一组件必须是增强项，不能替代清晰的项目列表。

---

## 6.5 Experience

支持：

- 教育经历；
- 实习；
- 实验室；
- 科研项目；
- 学生工作；
- 志愿经历。

### Student Mode

使用纵向时间轴，每段经历可显示：

- 机构；
- 角色；
- 时间；
- 地点；
- 2–4 条成果；
- Logo。

### Researcher Mode

教育经历可缩短；重点显示：

- Position；
- Affiliation；
- Research appointments；
- Visiting experience。

---

## 6.6 Awards & Activities

Student Mode 中作为重点模块：

- 奖学金；
- 比赛；
- 校园荣誉；
- 体育；
- 音乐；
- 艺术；
- 社团经历。

视觉上可使用“徽章墙”或分组卡片，但避免像游戏成就页面一样喧宾夺主。

Researcher Mode 中默认简化为 Awards & Honors 列表。

---

## 6.7 Skills

主要面向 Student Mode。

支持分类：

- Programming；
- Frameworks；
- Research；
- Tools；
- Languages。

技能不显示不可信的百分比进度条。推荐使用：

- 标签；
- 熟悉程度文字；
- 最近使用场景；
- 项目关联。

---

## 6.8 Teaching / Service / Talks / Students

主要面向 Researcher Mode，可独立启用或关闭。

### Teaching

- 课程名称；
- 角色；
- 学期；
- 课程链接；
- 教学材料。

### Service

- Reviewer；
- Program Committee；
- Organizer；
- Student service；
- Open-source community。

### Talks

- 标题；
- 活动；
- 日期；
- Slides；
- Video。

### Students

- 姓名；
- 身份；
- 研究方向；
- 个人主页；
- 指导时间。

---

## 6.9 Footer

Footer 不直接复制其他项目的山景设计，重新设计为可替换主题。

默认提供：

### Student Preset：Campus Horizon

- 轻量校园天际线；
- 纸飞机或星星元素；
- “Keep Exploring” 类似精神，但使用原创文案；
- 联系按钮；
- 最后更新时间。

### Researcher Preset：Research Night

- 深色渐变；
- 抽象节点与连线；
- ORCID / Scholar / GitHub；
- 更新时间与许可证说明。

所有插画均使用项目自制 SVG，不依赖第三方受限素材。

---

## 7. 交互设计

## 7.1 需要保留的亮点思路

参考常见优秀学术主页的体验，ScholarCanvas 实现以下原创交互：

1. 复制邮箱；
2. 复制个人简介；
3. Toast 提示；
4. 论文标签筛选；
5. 作者列表折叠；
6. News 展开/收起；
7. 章节导航；
8. 返回顶部；
9. 项目详情弹窗；
10. 项目星座；
11. 深浅色模式；
12. 中英文切换；
13. 图片 Hover 对比；
14. 平滑滚动；
15. 最后更新时间。

## 7.2 章节导航

桌面端：

- 右侧固定为“星轨导航”；
- 每个章节对应一个小圆点；
- 当前章节高亮；
- 鼠标悬停显示名称；
- Footer 进入视口时自动隐藏，避免遮挡。

移动端：

- 顶部折叠菜单；
- 不显示固定侧边导航。

## 7.3 Toast

用于：

- 邮箱复制成功；
- 个人简介复制成功；
- BibTeX 复制成功；
- 链接不可用提示。

要求：

- 不阻塞操作；
- 2 秒后自动消失；
- 支持键盘操作；
- 使用 `aria-live`。

## 7.4 动画规范

- 页面加载动画不超过 500ms；
- 不使用大面积滚动劫持；
- 不使用自动播放音频；
- 不使用高频粒子动画；
- 动画应在离开视口时暂停；
- 尊重 `prefers-reduced-motion`；
- 低性能设备自动降级。

---

## 8. 视觉系统

## 8.1 Student Mode

关键词：

- 青春；
- 温暖；
- 清晰；
- 轻科技；
- 有一点手账和校园感。

默认配色建议：

```css
--accent: #F59E0B;
--accent-soft: #FEF3C7;
--secondary: #38BDF8;
--text: #1F2937;
--muted: #6B7280;
--surface: #FFFFFF;
--background: #FFFDF8;
```

视觉特点：

- 圆角 12–18px；
- 柔和阴影；
- 卡片边框；
- 少量贴纸式标签；
- 项目图片占比更大；
- 允许自定义强调色。

## 8.2 Researcher Mode

关键词：

- 克制；
- 学术；
- 精确；
- 稳重；
- 高信息密度。

默认配色建议：

```css
--accent: #9A6A22;
--accent-soft: #F5EEDF;
--secondary: #334155;
--text: #111827;
--muted: #64748B;
--surface: #FFFFFF;
--background: #FAFAF9;
```

视觉特点：

- 圆角更小；
- 阴影更弱；
- 分隔线更明显；
- 论文排版紧凑；
- 字体层级清晰；
- 图片作为辅助而非主角。

---

## 9. 技术方案

## 9.1 核心技术栈

第一版采用：

- HTML5；
- CSS3；
- 原生 JavaScript；
- 无前端框架；
- 无 Node.js 必需依赖；
- 无后端；
- 无数据库；
- GitHub Pages 部署；
- 可选 Python 工具脚本。

### 选择理由

- 下载后可以直接打开；
- 学术用户容易理解；
- 部署成本最低；
- 不受框架版本升级影响；
- 页面加载快；
- 便于 Codex 修改；
- 适合长期维护。

---

## 9.2 数据配置方案

为保证 `file://` 直接打开可用，不使用运行时 `fetch()` 读取 JSON。

采用普通 JavaScript 数据文件：

```html
<script src="data/site.js"></script>
<script src="data/profile.js"></script>
<script src="data/news.js"></script>
<script src="data/publications.js"></script>
<script src="data/projects.js"></script>
<script src="data/experience.js"></script>
<script src="data/awards.js"></script>
<script src="src/app.js"></script>
```

配置文件将数据挂载到全局只读命名空间：

```js
window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {};
window.SCHOLAR_CANVAS.profile = {
  // ...
};
```

优点：

- 双击 `index.html` 即可预览；
- 不需要构建；
- 不受本地文件跨域限制；
- 用户只需修改结构化数据。

---

## 9.3 推荐仓库结构

```text
scholar-canvas/
├── index.html
├── README.md
├── README.zh-CN.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
│
├── data/
│   ├── site.js
│   ├── profile.js
│   ├── news.js
│   ├── publications.js
│   ├── projects.js
│   ├── experience.js
│   ├── awards.js
│   ├── skills.js
│   ├── teaching.js
│   └── service.js
│
├── src/
│   ├── app.js
│   ├── renderer.js
│   ├── i18n.js
│   ├── theme.js
│   ├── interactions.js
│   ├── accessibility.js
│   └── components/
│       ├── hero.js
│       ├── news.js
│       ├── publications.js
│       ├── projects.js
│       ├── experience.js
│       ├── awards.js
│       └── footer.js
│
├── styles/
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── student.css
│   ├── researcher.css
│   ├── dark.css
│   └── responsive.css
│
├── assets/
│   ├── avatar/
│   ├── publications/
│   ├── projects/
│   ├── icons/
│   ├── illustrations/
│   └── files/
│       └── cv.pdf
│
├── examples/
│   ├── student/
│   └── researcher/
│
├── tools/
│   ├── validate_config.py
│   ├── update_date.py
│   └── optimize_images.py
│
├── tests/
│   ├── smoke.html
│   └── config-fixtures/
│
└── .github/
    ├── workflows/
    │   ├── deploy-pages.yml
    │   └── validate.yml
    ├── ISSUE_TEMPLATE/
    └── PULL_REQUEST_TEMPLATE.md
```

---

## 9.4 渲染方式

`index.html` 只保留：

- 基础 meta；
- SEO；
- 样式和脚本引用；
- 页面根节点；
- 无 JavaScript 时的提示。

页面模块由 `src/renderer.js` 根据配置生成。

示例：

```html
<main id="app"></main>
```

```js
renderPage({
  mode: SCHOLAR_CANVAS.site.mode,
  profile: SCHOLAR_CANVAS.profile,
  publications: SCHOLAR_CANVAS.publications
});
```

---

## 9.5 可选 Python 工具

这些工具不是使用模板的必需条件。

### `validate_config.py`

检查：

- 必填字段；
- 重复 ID；
- 图片路径；
- 无效链接格式；
- 语言字段缺失；
- publication 状态；
- 日期格式。

### `update_date.py`

在 GitHub Actions 中自动更新网站最后修改时间。

### `optimize_images.py`

将图片转换为 WebP 并压缩，保留原图。

---

## 10. 国际化设计

## 10.1 语言格式

所有可展示文本允许：

```js
{
  zh: "中文内容",
  en: "English content"
}
```

也允许单字符串：

```js
"Language-independent content"
```

渲染函数规则：

1. 优先当前语言；
2. 当前语言缺失时回退到默认语言；
3. 默认语言也缺失时使用第一个可用文本；
4. 不因翻译缺失导致模块报错。

## 10.2 切换行为

- 切换后立即更新页面，不刷新；
- 语言偏好保存在 `localStorage`；
- HTML `lang` 属性同步更新；
- 页面标题和 meta description 同步更新；
- 按钮有可访问名称。

---

## 11. 深浅色模式

模式来源顺序：

1. 用户手动选择；
2. `localStorage`；
3. 系统 `prefers-color-scheme`；
4. 项目默认配置。

深色模式不是简单反色，需要单独设计：

- 图片边框；
- 卡片表面；
- 链接颜色；
- 论文高亮；
- Toast；
- Modal；
- Footer。

---

## 12. 响应式设计

断点建议：

```css
@media (max-width: 1024px) {}
@media (max-width: 768px) {}
@media (max-width: 480px) {}
```

### 移动端要求

- Hero 变为上下结构；
- 联系链接自动换行；
- 论文卡片上下布局；
- 项目卡片可横向滚动或单列；
- 固定侧边导航隐藏；
- 模态框不超出视口；
- 触摸目标至少 44px；
- 不发生横向页面溢出；
- 项目星座降级。

---

## 13. 可访问性

最低要求：

- 语义化 HTML；
- 正确 Heading 层级；
- 所有图片有 `alt`；
- 键盘可访问；
- 清晰 Focus 样式；
- 对比度符合 WCAG AA；
- Modal 有焦点陷阱与 Escape 关闭；
- Toast 使用 `aria-live`；
- 动画尊重减少动态偏好；
- 图标按钮有文本标签或 `aria-label`；
- 筛选结果变化可被辅助技术感知。

---

## 14. SEO 与分享

`data/site.js` 支持：

- 页面标题；
- 描述；
- 关键词；
- 站点 URL；
- 分享图片；
- 作者；
- 语言；
- Google Scholar、ORCID、GitHub 等身份链接。

页面生成：

- Open Graph；
- Twitter Card；
- JSON-LD Person；
- Canonical URL；
- Sitemap（可选静态文件）；
- Robots.txt。

---

## 15. 部署方式

## 15.1 直接打开

用户下载仓库后：

```text
双击 index.html
```

即可看到完整示例站点。

## 15.2 本地静态服务器

```bash
python3 -m http.server 8080
```

## 15.3 GitHub Pages

提供工作流：

- 推送到 `main`；
- 自动校验配置；
- 发布当前仓库静态文件；
- 不执行复杂构建。

## 15.4 其他平台

由于是纯静态文件，也可部署到：

- Cloudflare Pages；
- Netlify；
- Vercel；
- 学校个人主页空间；
- 任意 Nginx/Apache 静态目录。

README 不应要求用户必须使用某个平台。

---

## 16. 开源设计

## 16.1 许可证

建议采用：

```text
MIT License
```

允许用户使用、修改和分发，同时要求保留许可证和版权声明。

## 16.2 仓库模板化

GitHub 仓库开启：

```text
Template repository
```

用户可以点击 “Use this template” 创建自己的主页仓库。

## 16.3 文档

至少包含：

- 英文 README；
- 中文 README；
- 30 秒快速开始；
- 如何切换模式；
- 如何修改资料；
- 如何添加论文；
- 如何添加项目；
- 如何部署；
- 常见问题；
- 配置字段参考；
- 截图与在线 Demo；
- 贡献指南；
- 许可证说明。

## 16.4 示例站点

提供两套独立示例：

1. `Student Demo`
2. `Researcher Demo`

示例使用虚构人物和虚构内容，避免误导以及个人隐私问题。

---

## 17. 默认示例内容原则

- 所有姓名、机构、论文和奖项均明确标注为虚构；
- 不使用真实论文链接冒充示例作者成果；
- 可以使用项目自身的演示仓库链接；
- 示例头像使用项目自制抽象 SVG；
- README 明确提醒用户替换信息；
- 不保留私人邮箱和电话；
- 不在源码中写入 API Token。

---

## 18. MVP 范围

第一版必须完成：

### 基础能力

- [ ] 纯静态运行；
- [ ] 下载后直接打开；
- [ ] Student / Researcher 双模式；
- [ ] 中英文切换；
- [ ] 深浅色模式；
- [ ] 配置驱动；
- [ ] 响应式布局；
- [ ] GitHub Pages 自动部署。

### 模块

- [ ] Hero；
- [ ] News；
- [ ] Publications；
- [ ] Projects；
- [ ] Experience；
- [ ] Awards；
- [ ] Skills；
- [ ] Teaching；
- [ ] Service；
- [ ] Footer。

### 交互

- [ ] 复制邮箱；
- [ ] 复制简介；
- [ ] Toast；
- [ ] 论文筛选；
- [ ] News 折叠；
- [ ] 作者折叠；
- [ ] 项目详情 Modal；
- [ ] 章节导航；
- [ ] 返回顶部；
- [ ] 减少动态适配。

### 文档

- [ ] README；
- [ ] 中文 README；
- [ ] LICENSE；
- [ ] CONTRIBUTING；
- [ ] 两套 Demo；
- [ ] 配置字段说明。

---

## 19. 非 MVP 内容

第一版暂不实现：

- 在线编辑器；
- 登录系统；
- 数据库；
- CMS；
- Google Scholar 自动抓取；
- GitHub OAuth；
- 服务器端代理；
- 评论系统；
- 博客后台；
- 实时访问统计；
- 自动翻译；
- AI 聊天助手；
- 多用户托管平台。

这些功能会显著增加维护成本，不符合零后端定位。

---

## 20. 后续路线图

## v1.1

- BibTeX 转配置工具；
- 图片优化工具；
- 更多色彩预设；
- ORCID；
- Talks 与 Students 增强；
- RSS 或静态 Blog。

## v1.2

- 可选 Markdown 内容；
- 可选 Astro 版本；
- 更多主题；
- 配置可视化校验页面；
- 社区组件市场。

## v2.0

在不破坏纯静态核心的前提下，评估：

- 浏览器内可视化配置编辑；
- 一键导出静态站点；
- 主题插件机制。

---

## 21. 质量要求

### 性能

- 首屏不加载所有项目大图；
- 使用 WebP/AVIF；
- 图片懒加载；
- 动画离开视口后暂停；
- 不引入大型依赖。

### 浏览器

至少支持：

- 最新 Chrome；
- 最新 Edge；
- 最新 Firefox；
- 最新 Safari；
- iOS Safari；
- Android Chrome。

### 代码

- 无全局变量污染，除 `window.SCHOLAR_CANVAS` 配置命名空间；
- 模块职责清晰；
- 无内联事件处理器；
- 无重复 DOM ID；
- 不使用 `eval`；
- 不使用不安全的 `innerHTML` 拼接用户输入；
- 外部链接使用合适的 `rel`；
- 所有配置缺失都有合理回退。

---

## 22. 验收标准

项目满足以下条件才可发布 v1.0：

1. 克隆仓库后双击 `index.html` 可正常显示；
2. 两种模式均有完整示例；
3. 修改姓名、头像、项目和论文不需要编辑组件代码；
4. 中英文切换不会丢失布局；
5. 深浅色模式正常；
6. 手机端无横向溢出；
7. 所有交互支持键盘；
8. 禁用 JavaScript 时至少能显示基础说明；
9. GitHub Pages 工作流可成功部署；
10. 配置校验工具能检测常见错误；
11. 无真实个人隐私或无授权素材；
12. Lighthouse 建议目标：
    - Performance ≥ 90；
    - Accessibility ≥ 95；
    - Best Practices ≥ 95；
    - SEO ≥ 90。

---

## 23. 推荐开发顺序

### Phase 1：基础骨架

- 仓库结构；
- 配置数据；
- 渲染器；
- 两种模式；
- 基础 CSS；
- 响应式。

### Phase 2：核心模块

- Hero；
- News；
- Publications；
- Projects；
- Experience；
- Awards。

### Phase 3：核心交互

- i18n；
- Dark Mode；
- 筛选；
- 折叠；
- Toast；
- Modal；
- 导航。

### Phase 4：开源化

- README；
- 两套 Demo；
- GitHub Actions；
- License；
- Contribution；
- Issue 模板。

### Phase 5：质量收尾

- 可访问性；
- 性能；
- 浏览器测试；
- 配置校验；
- 视觉打磨；
- 截图和发布说明。

---

## 24. 项目叙事

对外介绍可以使用：

> ScholarCanvas is a bilingual, configuration-driven academic homepage template designed for students and researchers. It requires no backend or complex build process. Users can switch between a lively student portfolio and a publication-focused researcher profile, customize structured data files, and deploy directly to GitHub Pages.

中文介绍：

> ScholarCanvas 是一个面向学生和研究者的双语、配置驱动学术主页模板。它无需后端和复杂构建流程，支持活泼的学生作品集模式与论文优先的研究者模式，用户修改结构化配置后即可直接部署到 GitHub Pages。

---

## 25. 最终建议

项目首个版本应坚持三个边界：

1. **先把纯静态体验做好，不做后端。**
2. **先把双模式做出真正差异，不追求组件数量。**
3. **先让普通学生十分钟内完成修改和发布，再考虑高级自动化。**

真正的竞争力不是动画最多，而是：

> 既好看、又容易改、还能长期维护。
