# ScholarCanvas

ScholarCanvas 是一个面向学生与研究者的双语、配置驱动学术个人主页模板。它是纯静态项目：不需要后端、数据库、包管理器或构建步骤，下载后直接打开 `index.html` 即可使用。

> 仓库中的人物、学校、论文、项目与奖项均为虚构示例。发布前请完整替换。

[English README](README.md) · [学生示例](examples/student/README.md) · [研究者示例](examples/researcher/README.md) · [GitHub 仓库](https://github.com/Owen2005-brilliant/ScholarCanvas)

## 预览

GitHub Pages 部署目标：[https://owen2005-brilliant.github.io/ScholarCanvas/](https://owen2005-brilliant.github.io/ScholarCanvas/)。该地址是否可访问取决于最新 Pages 工作流是否成功完成。

![ScholarCanvas Student Mode 桌面预览](docs/screenshots/student-mode-desktop.png)

![ScholarCanvas Researcher Mode 桌面预览](docs/screenshots/researcher-mode-desktop.png)

<p align="center">
  <img src="docs/screenshots/mobile-preview.png" width="360" alt="ScholarCanvas Student Mode 移动端预览">
</p>

项目也保留了实现时使用的两套视觉方向图：

- [Student Mode 视觉方向](docs/design-concepts/student-mode.png)
- [Researcher Mode 视觉方向](docs/design-concepts/researcher-mode.png)

## 主要功能

- Student Mode：项目优先、研究星座、经历、荣誉活动与技能展示。
- Researcher Mode：紧凑 Biography、News、精选论文、完整论文筛选、Teaching 与 Service。
- 中英文即时切换，翻译缺失时自动回退，并保存语言偏好。
- 经过单独设计的浅色/深色主题，支持系统配色偏好。
- 所有内容由 `data/*.js` 驱动，在 `file://` 下也无需 `fetch()`。
- 支持复制邮箱、简介与 BibTeX，News/作者折叠，项目详情 Modal，章节跟踪和返回顶部。
- 支持键盘、Skip Link、焦点陷阱、`aria-live`、减少动态偏好和至少 44px 的触摸目标。
- 示例资产均为项目自制 SVG；无外部字体，无运行时联网依赖。
- 自带 Python 配置校验与官方 GitHub Pages 工作流，不使用 Node.js。

## 两种模式的真正差异

| 维度 | Student Mode | Researcher Mode |
| --- | --- | --- |
| 首屏 | 个人宣言、大尺寸视觉资料 | 紧凑传记、单位与实验室信息 |
| 内容优先级 | 项目、研究兴趣、经历 | 动态、精选论文、完整论文 |
| 项目 | 大图卡片与研究星座 | 高密度研究项目行 |
| 论文 | 适合学生阅读的成果列表 | Selected 与 All Publications 分离 |
| 视觉 | 暖橙/天蓝、大圆角、轻阴影 | 铜色/岩灰、细分隔线、紧凑间距 |
| 页脚 | Campus Horizon | Research Night |

Demo 默认允许实时切换模式。正式个人站点可关闭预览开关，只发布一种模式。

## 30 秒开始

1. 下载或克隆仓库。
2. 双击 `index.html`。
3. 编辑 `data/profile.js`，刷新页面。
4. 替换 `data/` 下其他虚构内容与 `assets/` 中的示例图。
5. 发布前运行 `python3 tools/validate_config.py`。

也可以启动本地静态服务器：

```bash
python3 -m http.server 8080
```

打开 `http://localhost:8080/`。整个项目没有安装命令和构建命令。

## 配置文件

| 文件 | 用途 |
| --- | --- |
| `data/site.js` | 模式、语言/主题开关、模块开关、SEO、更新时间 |
| `data/profile.js` | 姓名、简介、学校、研究兴趣、头像和外部链接 |
| `data/news.js` | 时间轴动态 |
| `data/publications.js` | 论文、标签、状态、链接和 BibTeX |
| `data/projects.js` | 项目卡片、星座与 Modal 详情 |
| `data/experience.js` | 教育、实习、科研与志愿经历 |
| `data/awards.js` | 奖项与活动 |
| `data/skills.js` | 技能分类，不使用不可信百分比 |
| `data/teaching.js` | 教学课程与角色 |
| `data/service.js` | 审稿、组织、指导与社区服务 |

在 `data/site.js` 中设置默认模式：

```js
window.SCHOLAR_CANVAS.site = {
  mode: "student", // "student" 或 "researcher"
  defaultLanguage: "zh",
  enableLanguageSwitch: true,
  enableDarkMode: true,
  enableModePreviewSwitch: false,
  defaultTheme: "system"
};
```

请保留 `window.SCHOLAR_CANVAS` 命名空间和文件名。可选字段缺失不会让组件崩溃；校验工具会报告缺少的必填字段和图片。

## 修改个人信息

在 `data/profile.js` 中替换：

- 双语姓名、身份、宣言、简介与短简介；
- 学校、实验室、导师、地点和研究兴趣；
- 示例邮箱与社交链接；
- 头像路径和准确的替代文本。

示例邮箱 `hello@example.com` 不是私人地址。未填写的可选链接不会跳转到错误页面，而会显示“不存在配置”的非阻塞 Toast。

## 添加论文

向 `data/publications.js` 追加对象。核心字段包括唯一 `id`、双语标题、作者数组、venue、year、status、是否 selected、本地图片、链接、标签、摘要与 BibTeX。

作者本人写成：

```js
{ name: "Your Name", self: true }
```

支持的论文状态：

- `published`
- `accepted`
- `preprint`
- `under-review`
- `work-in-progress`

页面会明确展示状态，避免把审稿中或未完成成果误写为已发表。

## 添加项目

向 `data/projects.js` 追加包含唯一 `id`、双语名称、简介、详情、本地图片、标签、链接和状态的对象。清晰的卡片/列表始终是主要视图；研究星座只是渐进增强：

- 项目超过 12 个时改为静态列表；
- 手机端改为全宽静态列表；
- `prefers-reduced-motion` 下停止漂移；
- 页面不可见时暂停持续动画。

## 中英文格式

所有可见文本既可以是普通字符串，也可以是：

```js
{ zh: "中文内容", en: "English content" }
```

渲染顺序为：当前语言 → 默认语言 → 第一个可用值。切换语言不会刷新页面，同时更新 `html[lang]`、标题、Meta、按钮和 JSON-LD，不会出现 `[object Object]`。

## 图片与优化

把自有素材放在 `assets/` 中并使用相对路径。Hero 以外的内容图片使用懒加载。示例图均为原创 SVG，也可以替换为有权使用的 WebP/AVIF。

可选的 WebP 工具依赖 Pillow：

```bash
python3 -m pip install Pillow
python3 tools/optimize_images.py assets/projects/my-image.png --quality 84
```

工具默认不覆盖原图，也不会覆盖已存在的 WebP；只有显式传入 `--force` 才会替换目标文件。

## 校验与 Smoke 测试

```bash
python3 tools/validate_config.py
python3 -m compileall -q tools
```

直接打开或通过静态服务器访问 `tests/smoke.html`，页面会显示浏览器内断言，覆盖：双模式顺序、i18n 回退、配置字段缺失、空论文/项目列表、超过 12 个项目、安全链接、图片 alt、外链 `rel` 与 DOM 重复 ID。

可以验证失败路径：

```bash
python3 tools/validate_config.py --check-file tests/config-fixtures/invalid-publication.js
```

这个命令应返回非零退出码，因为 fixture 故意包含重复 ID、错误状态和不安全协议。

## 部署 GitHub Pages

1. 把仓库推送到 GitHub，发布分支使用 `main`。
2. 打开 **Settings → Pages**，Source 选择 **GitHub Actions**。
3. 确认 `data/site.js`、`robots.txt` 与 `sitemap.xml` 使用真实站点地址；本仓库已配置为 `https://owen2005-brilliant.github.io/ScholarCanvas/`。
4. 再次推送。`.github/workflows/deploy-pages.yml` 会先校验，再通过 GitHub Pages 官方 Actions 发布整个静态目录。

工作流不生成 `dist/`，也不依赖 Node.js。`validate.yml` 会在 Push 与 Pull Request 时独立执行。

Cloudflare Pages、Netlify、Vercel 静态托管、学校个人空间或 Nginx/Apache 也都可直接上传当前目录，不要填写构建命令。

## 可访问性

当前实现包含语义章节、单一 H1、清晰 Heading 层级、可见 Focus、Skip Link、图标按钮名称、实时状态通知、完整键盘操作、Modal 焦点陷阱和 Escape 关闭、双语可访问名称、减少动态适配与移动触摸目标。新增组件时不得破坏这些保证。自动化检查不能替代键盘和屏幕阅读器人工测试。

## SEO

`index.html` 提供静态默认 Meta。运行时根据 `data/site.js` 与 `data/profile.js` 更新标题、描述、Open Graph、Twitter Card、Canonical、分享图片和 JSON-LD Person。Fork 后上线前应替换正式站点 URL 与分享图片。

## 浏览器支持

目标为最新版 Chrome、Edge、Firefox、Safari、iOS Safari 与 Android Chrome。核心内容不依赖外部资源；缺少增强 API 的浏览器仍可读取主要内容并操作基本控件。

## 开源与贡献

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)、[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 与 [SECURITY.md](SECURITY.md)。贡献代码和素材必须原创或许可证兼容，支持键盘和响应式布局，且不能包含 Token、私人信息或未经授权的资产。

ScholarCanvas 从学生与青年研究者常见的信息需求出发重新设计，没有复制其他模板的代码或受限素材。仓库中的 SVG 和虚构内容均为本项目制作。

## 暂未实现的非 MVP 功能

BibTeX 导入、可选 Markdown、更多主题、RSS/静态 Blog、Astro 版本、可视化配置检查器与社区组件市场计划放在后续版本。v1.0 不包含 CMS、登录、数据库、Scholar 自动抓取、分析统计、评论或 AI 助手。

## 许可证

[MIT](LICENSE) © 2026 ScholarCanvas contributors.
