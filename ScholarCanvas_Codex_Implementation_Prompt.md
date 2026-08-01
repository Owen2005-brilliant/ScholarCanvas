# Codex 执行指令：实现 ScholarCanvas v1.0

你是一名资深前端工程师、开源项目维护者和无障碍设计工程师。请在当前工作区从零实现一个完整的开源学术个人主页模板项目，项目工作名为 **ScholarCanvas**。

请先完整阅读同目录下的设计文档：

```text
ScholarCanvas_Open_Source_Design.md
```

然后严格按照下面要求执行。不要只生成设计稿、伪代码或空壳组件，必须完成一个可以直接运行、可以部署、可以开源的 v1.0 实现。

---

## 一、总体目标

实现一个：

- 面向学生与研究者；
- 支持 Student Mode 和 Researcher Mode；
- 中英文双语；
- 支持深浅色；
- 配置驱动；
- 无后端；
- 无数据库；
- 无必须安装的前端依赖；
- 克隆后双击 `index.html` 即可使用；
- 可部署到 GitHub Pages；
- 具有适量活泼交互；
- 代码、文档和示例完整；

的学术个人主页模板。

---

## 二、硬性技术约束

### 必须使用

- HTML5；
- CSS3；
- 原生 JavaScript；
- 可选 Python 工具脚本；
- GitHub Actions。

### 禁止使用

- React；
- Vue；
- Angular；
- Svelte；
- Next.js；
- Nuxt；
- Astro；
- jQuery；
- Tailwind CDN；
- Bootstrap；
- Node.js 构建步骤；
- 后端 API；
- 数据库；
- 服务端渲染；
- 运行时必须联网的核心功能。

### 关键要求

1. 用户双击 `index.html` 时页面必须可用。
2. 不得通过 `fetch()` 读取本地 JSON。
3. 配置数据使用 `data/*.js`，挂载到统一命名空间：

```js
window.SCHOLAR_CANVAS
```

4. 页面主要结构由 JavaScript 渲染，但要保留合理的无 JavaScript 提示。
5. 不复制任何已存在仓库的代码、图片和素材，所有组件从零实现。
6. 不使用需要许可证不明的第三方素材。
7. 默认图标优先使用自制 SVG 或内联 SVG。
8. 不要将任何 API Token 写入代码。

---

## 三、仓库结构

至少创建以下结构：

```text
.
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
│       ├── skills.js
│       ├── teaching.js
│       ├── service.js
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

可以增加必要文件，但不要删除核心结构。

---

## 四、配置系统

### 1. `data/site.js`

至少支持：

```js
window.SCHOLAR_CANVAS.site = {
  mode: "student",
  defaultLanguage: "zh",
  enableLanguageSwitch: true,
  enableDarkMode: true,
  enableModePreviewSwitch: true,
  defaultTheme: "system",
  accentColor: "#F59E0B",
  sections: {
    news: true,
    publications: true,
    projects: true,
    experience: true,
    awards: true,
    skills: true,
    teaching: true,
    service: true
  },
  seo: {
    title: {},
    description: {},
    keywords: [],
    siteUrl: "",
    shareImage: ""
  },
  lastUpdated: "2026-07-31"
};
```

### 2. 其他数据文件

使用设计文档中的字段结构，提供完整虚构示例。

要求：

- 示例人物必须明确为虚构；
- 不冒充真实论文；
- 不包含真实私人联系方式；
- 每个模块至少提供 3 条有代表性的示例；
- Student 和 Researcher 模式都能复用数据；
- 所有用户可见文本支持 `{ zh, en }`；
- 数据缺失时组件不能崩溃。

---

## 五、双模式布局

### Student Mode

视觉方向：

- 温暖；
- 明亮；
- 轻科技；
- 青春；
- 适量圆角和卡片；
- 项目优先；
- 可展示活动和技能。

默认模块顺序：

1. Hero
2. Current Focus
3. Featured Projects
4. Research Interests
5. Experience
6. Publications
7. Awards & Activities
8. Skills
9. Contact / Footer

### Researcher Mode

视觉方向：

- 克制；
- 学术；
- 稳重；
- 高信息密度；
- 论文优先；
- 较弱阴影和更明确分隔线。

默认模块顺序：

1. Hero / Biography
2. News
3. Selected Publications
4. Publications
5. Research Projects
6. Teaching
7. Service
8. Awards
9. Contact / Footer

模式差异必须不仅是配色变化，还包括：

- 模块顺序；
- 卡片密度；
- Hero 排版；
- 项目呈现；
- 论文强调程度；
- 字体和间距。

---

## 六、必须实现的页面模块

### Hero

包含：

- 头像；
- 中英文姓名；
- 身份；
- 学校；
- 简介；
- 研究兴趣；
- Email；
- CV；
- GitHub；
- Scholar；
- 复制邮箱；
- 复制简介；
- 语言切换；
- 深浅色切换。

### News

- 时间轴；
- 默认显示 5 条；
- 展开/收起；
- 类型标识；
- 最新消息轻量高亮。

### Publications

- 缩略图；
- 标题；
- 作者；
- 当前用户姓名加粗；
- 会议；
- 年份；
- 状态；
- Selected 高亮；
- 标签筛选；
- 标签数量；
- 作者过长折叠；
- Paper、Code、Project、Dataset、Model、Slides 等链接；
- BibTeX 复制。

### Projects

实现两个视图：

1. 清晰的项目卡片；
2. 原创的 Research Constellation 趣味视图。

Research Constellation 要求：

- 项目显示为星点和文字；
- 缓慢漂移；
- 鼠标有轻量视差；
- 点击高亮相关标签；
- 超过 12 个项目时降级为卡片；
- 移动端降级；
- `prefers-reduced-motion` 下关闭动画；
- 不使用 Canvas 大型粒子库；
- 性能稳定。

### Experience

- 时间轴；
- 支持教育、实习、研究、学生工作；
- 不同模式有不同密度。

### Awards

- Student：分组卡片或徽章墙；
- Researcher：简洁列表。

### Skills

- 标签式；
- 不使用百分比进度条；
- 支持分类。

### Teaching / Service

- 可通过配置关闭；
- Researcher Mode 中默认启用；
- Student Mode 中可简化展示。

### Footer

创建两套原创页脚视觉：

- Student：Campus Horizon；
- Researcher：Research Night。

使用自制 SVG 或 CSS 图形，不使用外部图片。

---

## 七、必须实现的交互

1. 复制邮箱；
2. 复制个人简介；
3. 复制 BibTeX；
4. Toast；
5. 论文标签筛选；
6. News 展开/收起；
7. 作者展开/收起；
8. 项目详情 Modal；
9. 当前章节高亮导航；
10. 返回顶部；
11. 深浅色切换；
12. 中英文切换；
13. Demo 模式切换；
14. 图片懒加载；
15. 滚动进入动画；
16. `prefers-reduced-motion` 支持；
17. 页面不可见时暂停持续动画。

不要加入：

- 音频；
- 自动播放视频；
- 滚动劫持；
- 高频粒子；
- 影响阅读的光标特效；
- 强制加载外部字体。

---

## 八、可访问性要求

必须完成：

- 语义化 HTML；
- 正确 Heading 层级；
- 所有图片有 `alt`；
- 键盘可以操作全部按钮和链接；
- 可见 Focus；
- Modal 焦点陷阱；
- Escape 关闭 Modal；
- `aria-live` Toast；
- 筛选结果变化通知；
- 对比度达到 WCAG AA；
- 触摸目标至少 44px；
- HTML `lang` 随语言切换；
- `prefers-reduced-motion`；
- 跳转到主要内容的 Skip Link。

---

## 九、安全与代码质量

1. 不对配置文本直接使用不安全的 `innerHTML`。
2. 创建 DOM 时优先使用 `createElement` 与 `textContent`。
3. 允许的少量富文本必须使用严格白名单解析。
4. 外部链接使用：

```html
target="_blank" rel="noopener noreferrer"
```

5. 不使用 `eval`、`new Function`。
6. 不使用内联事件处理器。
7. 不产生重复 DOM ID。
8. 配置缺失有默认值。
9. 代码加必要注释，但不要过度注释。
10. 组件函数尽量保持单一职责。

---

## 十、国际化

实现统一函数：

```js
t(value, language, fallbackLanguage)
```

支持：

```js
{
  zh: "中文",
  en: "English"
}
```

以及普通字符串。

要求：

- 切换语言不刷新；
- 偏好存储在 `localStorage`；
- 更新标题；
- 更新 meta description；
- 更新按钮文字；
- 不完整翻译自动回退；
- 没有翻译时不能出现 `[object Object]`。

---

## 十一、主题系统

实现：

- `student`；
- `researcher`；
- `light`；
- `dark`。

使用 CSS Variables，不要在 JavaScript 中写大量具体颜色。

用户设置优先级：

1. 手动设置；
2. localStorage；
3. 系统；
4. 配置默认值。

---

## 十二、SEO

实现：

- 动态页面标题；
- Meta Description；
- Open Graph；
- Twitter Card；
- Canonical；
- JSON-LD Person；
- Favicon；
- 合理的 Heading；
- `robots.txt`；
- `sitemap.xml` 示例。

因为页面可以直接打开，静态默认 meta 必须提供合理示例；运行时再按配置更新。

---

## 十三、Python 工具

### `tools/validate_config.py`

至少检查：

- 文件是否存在；
- JavaScript 配置基本格式；
- 重复 ID；
- 图片路径；
- 必填字段；
- 日期格式；
- 无效 publication 状态；
- 重复 section；
- 常见空链接；
- 不安全协议。

不要求完整 JavaScript 解析器，可以针对模板约定做可靠检查。运行后以非零退出码表示失败。

### `tools/update_date.py`

更新 `data/site.js` 中的 `lastUpdated`。

### `tools/optimize_images.py`

- 可选依赖 Pillow；
- 未安装时输出友好说明；
- 支持压缩 JPG/PNG；
- 输出 WebP；
- 不覆盖原文件，除非显式参数。

---

## 十四、GitHub Actions

### `validate.yml`

在 Push 和 Pull Request 时：

- 运行 Python 配置校验；
- 检查关键文件存在；
- 检查 HTML 中无明显重复 ID；
- 不依赖 Node.js。

### `deploy-pages.yml`

- 使用 GitHub Pages 官方方式；
- 发布仓库静态文件；
- 部署前执行校验；
- 不需要构建产物目录；
- 提供 README 配置说明。

---

## 十五、文档要求

### README.md

英文为主，包含：

- Hero 截图占位；
- 在线 Demo 占位；
- Features；
- Student / Researcher 对比；
- Quick Start；
- Configuration；
- Add Publications；
- Add Projects；
- Bilingual；
- Deployment；
- Accessibility；
- Browser Support；
- License；
- Credits；
- Roadmap。

### README.zh-CN.md

内容完整，不是简单几句话。

### CONTRIBUTING.md

包含：

- 开发方式；
- 分支规范；
- Commit 规范；
- 代码风格；
- PR 检查清单；
- 不接受直接复制第三方代码；
- 新组件必须满足可访问性要求。

### 其他

创建：

- MIT LICENSE；
- Code of Conduct；
- Security Policy；
- Issue Templates；
- Pull Request Template。

---

## 十六、示例站点

`examples/student/` 和 `examples/researcher/` 中至少提供：

- 对应配置文件副本；
- README；
- 页面截图占位说明；
- 如何切换到该示例。

主页面可以通过 `enableModePreviewSwitch: true` 实时预览两种模式。

---

## 十七、测试与验收

至少执行以下自测：

1. 双击 `index.html`；
2. Python 静态服务器；
3. Student Mode；
4. Researcher Mode；
5. 中文；
6. 英文；
7. Light；
8. Dark；
9. 360px 移动宽度；
10. 键盘导航；
11. Reduce Motion；
12. 配置字段缺失；
13. 空论文列表；
14. 空项目列表；
15. 12 个以上项目；
16. 无网络环境；
17. 外部链接；
18. Modal 开关；
19. 筛选；
20. GitHub Pages 工作流语法。

创建 `tests/smoke.html`，提供基础的浏览器内断言，并在页面上清晰显示通过/失败。

---

## 十八、完成后的输出要求

完成代码后：

1. 运行所有可运行检查；
2. 修复发现的问题；
3. 输出最终目录树；
4. 总结已经实现的功能；
5. 说明如何本地预览；
6. 说明如何修改个人信息；
7. 说明如何切换双模式；
8. 说明如何部署 GitHub Pages；
9. 列出仍未实现的非 MVP 功能；
10. 不要声称测试通过，除非实际运行过。

---

## 十九、工作方式

请按以下顺序工作，不要一次性草率生成所有文件：

1. 阅读设计文档；
2. 建立目录和基础配置；
3. 完成渲染架构；
4. 完成两种模式；
5. 完成主要模块；
6. 完成交互；
7. 完成可访问性；
8. 完成工具与 Actions；
9. 完成文档；
10. 运行测试和修复。

如果工作区已经存在文件：

- 先检查；
- 不覆盖用户已有内容；
- 在必要时备份；
- 说明改动。

最终结果必须是一个真正能用的开源模板，而不是展示性原型。
