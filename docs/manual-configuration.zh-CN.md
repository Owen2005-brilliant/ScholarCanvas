# ScholarCanvas 手动配置指南

> 普通用户通常不需要阅读本页，推荐使用[可视化初始化器](https://owen2005-brilliant.github.io/ScholarCanvas/setup.html)。本页面面向需要手动修改配置、批量处理或二次开发的高级用户。

[返回中文 README](../README.zh-CN.md) · [可视化初始化指南](visual-setup-guide.zh-CN.md) · [English Guide](manual-configuration.md)

## 修改前须知

ScholarCanvas 从 `data/` 目录读取经典 JavaScript 文件。每个文件都在共享的 `window.SCHOLAR_CANVAS` 对象下创建或更新一个属性。请保留命名空间、属性名、文件名、逗号、括号和引号。

```js
window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {};

window.SCHOLAR_CANVAS.profile = {
  // 个人资料字段
};
```

建议在单独的 Git 分支中修改，并保留上一份可用配置。主页不需要构建；保存文件后刷新 `index.html` 即可查看结果。

## 配置文件

| 文件 | 内容 |
| --- | --- |
| `data/site.js` | 模式、语言、主题、启用模块、正式地址、搜索/分享信息、更新时间 |
| `data/profile.js` | 姓名、身份、简介、单位、研究兴趣、联系方式和头像 |
| `data/news.js` | 带日期的动态 |
| `data/publications.js` | 论文、作者、发表场所、状态、链接、标签和 BibTeX |
| `data/projects.js` | 项目卡片、简介、图片、标签、链接和状态 |
| `data/experience.js` | 教育、科研、实习、工作和服务经历 |
| `data/awards.js` | 奖项、奖学金、竞赛和活动 |
| `data/skills.js` | 技能分组和标签 |
| `data/teaching.js` | 课程和教学角色 |
| `data/service.js` | 审稿、组织、指导和社区服务 |

## 通用数据规则

### 中英文字段

需要随语言切换的内容应使用双语对象：

```js
{ zh: "中文内容", en: "English content" }
```

组织简称、年份、代码标签或 URL 等不随语言变化的值可以使用普通字符串。如果缺少一种翻译，ScholarCanvas 会依次回退到默认语言和第一个可用值。

### ID、数组和链接

- News、Publications、Projects、Experience、Awards、Skills、Teaching 和 Service 中的每一项都需要稳定且唯一的 `id`。
- 即使没有内容，也要保留数组，例如 `window.SCHOLAR_CANVAS.publications = [];`。
- 使用完整的 `https://` 链接、支持位置的 `mailto:` 链接，或安全的相对资源路径。
- 不要使用 `javascript:`、可执行 HTML 或不可信嵌入内容。
- 本地路径应相对于仓库根目录，并使用 `/`，例如 `assets/projects/my-project.webp`。

## 站点设置和显示模块

在 `data/site.js` 中选择正式发布的模式和显示模块：

```js
window.SCHOLAR_CANVAS.site = {
  mode: "student", // "student" 或 "researcher"
  defaultLanguage: "zh", // "zh" 或 "en"
  enableLanguageSwitch: true,
  enableDarkMode: true,
  enableModePreviewSwitch: false,
  defaultTheme: "system", // "light"、"dark" 或 "system"
  accentColor: "#F59E0B",
  sections: {
    news: true,
    publications: false,
    projects: true,
    experience: true,
    awards: true,
    skills: true,
    teaching: false,
    service: false
  },
  // 继续保留下文介绍的 seo 和 lastUpdated 字段。
};
```

`enableModePreviewSwitch` 适合示例站点。正式个人主页通常将它设为 `false`，只发布选定的一种模式。

## 个人资料

编辑 `data/profile.js` 并替换所有虚构内容。主要字段包括：

- `name`、`identity`、`school`、`affiliation`、`lab`、`advisor` 和 `location`；
- `tagline`、`bio` 和支持复制的 `shortBio`；
- `email`、`avatar` 和准确描述图片的 `avatarAlt`；
- `currentFocus` 与 `interests` 数组；
- GitHub、Google Scholar、ORCID、LinkedIn、CV 和个人网站等可选 `links`。

真实个人主页应设置 `fictional: false`。不使用的可选链接应删除，不要保留示例地址。

```js
window.SCHOLAR_CANVAS.profile = {
  fictional: false,
  name: { zh: "你的姓名", en: "Your Name" },
  identity: { zh: "你的身份", en: "Your Role" },
  school: { zh: "你的学校", en: "Your University" },
  affiliation: { zh: "你的院系", en: "Your Department" },
  tagline: { zh: "一句个人介绍", en: "A short personal statement" },
  bio: { zh: "完整中文简介", en: "Full English biography" },
  shortBio: { zh: "简短中文简介", en: "Short English biography" },
  email: "you@example.com",
  avatar: "assets/avatar/profile-avatar.webp",
  avatarAlt: { zh: "你的头像", en: "Portrait of Your Name" },
  interests: [],
  links: {}
};
```

## 论文

编辑 `data/publications.js`。如果没有论文，可以保留空数组，并在 `data/site.js` 中关闭 Publications。

```js
window.SCHOLAR_CANVAS.publications = [
  {
    id: "paper-short-name-2026",
    title: { zh: "中文论文标题", en: "English Paper Title" },
    authors: [
      { name: "Your Name", self: true },
      { name: "Coauthor Name" }
    ],
    venue: "Conference or Journal",
    year: 2026,
    status: "published",
    selected: true,
    image: "assets/publications/paper-image.webp",
    imageAlt: { zh: "论文视觉摘要", en: "Visual summary of the paper" },
    links: { paper: "https://example.com/paper", code: "https://github.com/example/repo" },
    tags: ["HCI", "Visualization"],
    summary: { zh: "一句中文摘要。", en: "A one-sentence English summary." },
    bibtex: "@article{...}"
  }
];
```

支持的论文状态包括 `published`、`accepted`、`preprint`、`under-review` 和 `work-in-progress`。只在代表自己的作者项上设置 `self: true`，并准确描述尚未发表的成果。

## 项目

编辑 `data/projects.js`。每个项目可以同时提供卡片简介和更长的详情：

```js
window.SCHOLAR_CANVAS.projects = [
  {
    id: "my-project",
    name: { zh: "项目名称", en: "Project Name" },
    description: { zh: "一句话简介", en: "One-sentence summary" },
    details: { zh: "项目详情", en: "Longer project details" },
    image: "assets/projects/my-project.webp",
    imageAlt: { zh: "项目界面截图", en: "Screenshot of Project Name" },
    tags: ["Research", "Open Source"],
    featured: true,
    links: { github: "https://github.com/example/project" },
    status: "active"
  }
];
```

发布后尽量保持 `id` 稳定，使链接和页面内部状态保持可预测。只使用自己有权发布的图片和链接。

## 经历、奖项、技能、教学和服务

这些文件都使用相同的顶层数组结构：

| 文件 | 主要字段 |
| --- | --- |
| `data/experience.js` | `id`、`type`、`organization`、`role`、`period`、`location`、`highlights` |
| `data/awards.js` | `id`、`title`、`organization`、`year`、`category` |
| `data/skills.js` | `id`、`category`、`items` |
| `data/teaching.js` | `id`、`course`、`role`、`term` |
| `data/service.js` | `id`、`type`、`activity`、`period` |

面向读者的文字使用双语对象，`highlights` 和 `items` 保持数组。删除不需要的示例项，不要在真实个人主页中保留虚构成就。

`data/news.js` 中每条动态使用 `id`、`YYYY-MM` 格式的 `date`、双语 `text`、简短 `type`，以及可选的 `highlight: true`。

## 图片和本地文件

- 将文件存放在 `assets/` 下，并使用相对路径。
- 有意义的图片应填写描述性替代文本；纯装饰图片使用空替代文本。
- 优先使用自己拥有或获准使用的 PNG、JPG、WebP、AVIF 或 SVG。
- 文件名尽量使用小写并保持稳定，避免空格。
- 确认每个引用文件真实存在且大小写一致，因为 GitHub Pages 路径区分大小写。
- 将 CV 放在 `assets/files/` 下，并通过 `profile.links.cv` 链接。

可选图片优化和其他维护工具请阅读 [CONTRIBUTING.md](../CONTRIBUTING.md)。

## 搜索和分享信息

可视化初始化器会自动生成这些值。手动配置时，请将它们保留在 `data/site.js` 的 `seo` 对象中：

```js
seo: {
  title: {
    zh: "你的姓名｜学术主页",
    en: "Your Name | Academic Homepage"
  },
  description: {
    zh: "中文搜索结果简介。",
    en: "English search result description."
  },
  keywords: ["your name", "research area", "academic homepage"],
  siteUrl: "https://username.github.io/repository/",
  shareImage: "assets/illustrations/share-card.svg"
},
lastUpdated: "2026-08-01"
```

正式 HTTPS 主页地址应以 `/` 结尾，并与 `robots.txt`、`sitemap.xml` 中的地址保持一致。`lastUpdated` 必须使用 `YYYY-MM-DD`。

## 空内容和关闭模块

空内容与关闭模块彼此相关，但不是同一设置：

```js
window.SCHOLAR_CANVAS.publications = [];
```

```js
sections: {
  publications: false
}
```

不适合自己的模块应关闭。保留空数组可以避免以后重新打开模块时再次出现旧示例内容。

## 常见配置错误

- 删除 `window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {};`，或修改赋值使用的属性名。
- 缺少逗号、引号、大括号或数组括号。
- 在多个内容项中重复使用同一个 `id`。
- 在真实主页中遗留示例个人资料、链接、论文或奖项。
- 使用不支持的论文状态，或使用不符合 `YYYY-MM` 的 News 日期。
- 引用了不存在或大小写不一致的本地图片。
- 使用操作系统绝对路径，而不是仓库相对路径。
- 在需要 HTTPS 的位置使用 `http://`、`javascript:` 或其他不安全 URL。
- 清空数据文件时没有重新赋值为空数组。
- 更新 `siteUrl` 后忘记同步 `robots.txt` 和 `sitemap.xml`。

校验命令、浏览器 Smoke Test、维护脚本、GitHub Actions 与贡献要求请阅读 [CONTRIBUTING.md](../CONTRIBUTING.md)。
