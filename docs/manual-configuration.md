# ScholarCanvas Manual Configuration Guide

> Most users do not need this page. The recommended workflow is [Visual Setup](https://owen2005-brilliant.github.io/ScholarCanvas/setup.html). This guide is for advanced users who need to edit configuration files manually, make batch changes, or extend ScholarCanvas.

[Back to README](../README.md) · [Visual Setup guide](visual-setup-guide.md) · [中文指南](manual-configuration.zh-CN.md)

## Before editing

ScholarCanvas reads classic JavaScript files from `data/`. Each file creates or updates one property under the shared `window.SCHOLAR_CANVAS` object. Keep the namespace, property name, filename, commas, brackets, and quotation marks intact.

```js
window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {};

window.SCHOLAR_CANVAS.profile = {
  // Profile fields
};
```

Work on a separate Git branch and keep a copy of the last working configuration. The homepage does not require a build step; refresh `index.html` after saving a file.

## Configuration files

| File | Content |
| --- | --- |
| `data/site.js` | Mode, language, theme, enabled sections, public URL, search/share metadata, update date |
| `data/profile.js` | Name, identity, biography, affiliation, interests, contact links, avatar |
| `data/news.js` | Dated announcements |
| `data/publications.js` | Papers, authors, venue, status, links, tags, BibTeX |
| `data/projects.js` | Project cards, descriptions, images, tags, links, status |
| `data/experience.js` | Education, research, internships, employment, and service experience |
| `data/awards.js` | Awards, scholarships, competitions, and activities |
| `data/skills.js` | Skill groups and labels |
| `data/teaching.js` | Courses and teaching roles |
| `data/service.js` | Reviewing, organizing, mentoring, and community service |

## Shared data rules

### Bilingual text

Use a bilingual object for content that should change with the language switch:

```js
{ zh: "中文内容", en: "English content" }
```

Plain strings are suitable for language-independent values such as organization abbreviations, years, code labels, or URLs. If one translation is missing, ScholarCanvas falls back to the configured default language and then the first available value.

### IDs, arrays, and links

- Every item in News, Publications, Projects, Experience, Awards, Skills, Teaching, and Service needs a stable, unique `id`.
- Keep collection values as arrays, including when they are empty: `window.SCHOLAR_CANVAS.publications = [];`.
- Use complete `https://` links, `mailto:` links where supported, or safe relative asset paths.
- Do not use `javascript:`, executable HTML, or untrusted embedded content.
- Keep local paths relative to the repository root and use `/`, for example `assets/projects/my-project.webp`.

## Site settings and visible sections

Edit `data/site.js` to choose the published mode and the sections that appear:

```js
window.SCHOLAR_CANVAS.site = {
  mode: "student", // "student" or "researcher"
  defaultLanguage: "en", // "zh" or "en"
  enableLanguageSwitch: true,
  enableDarkMode: true,
  enableModePreviewSwitch: false,
  defaultTheme: "system", // "light", "dark", or "system"
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
  // Keep the seo and lastUpdated fields described below.
};
```

`enableModePreviewSwitch` is useful for a demo. A personal homepage will usually set it to `false` and publish one selected mode.

## Profile

Edit `data/profile.js` and replace all fictional content. Important fields include:

- `name`, `identity`, `school`, `affiliation`, `lab`, `advisor`, and `location`;
- `tagline`, `bio`, and the copyable `shortBio`;
- `email`, `avatar`, and descriptive `avatarAlt` text;
- `currentFocus` and the `interests` array;
- optional `links` such as GitHub, Google Scholar, ORCID, LinkedIn, CV, and personal website.

Set `fictional: false` for a real profile. Remove optional links you do not use instead of keeping demo destinations.

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

## Publications

Edit `data/publications.js`. Use an empty array and disable Publications in `data/site.js` if you do not have papers to list.

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

Supported publication statuses are `published`, `accepted`, `preprint`, `under-review`, and `work-in-progress`. Mark only your own author entry with `self: true`, and describe unpublished work accurately.

## Projects

Edit `data/projects.js`. Each project can include a short card description and a longer dialog description:

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

Keep the `id` stable after publishing so links and internal state remain predictable. Use only images and links that you are allowed to publish.

## Experience, awards, skills, teaching, and service

These files use the same top-level array pattern:

| File | Main fields |
| --- | --- |
| `data/experience.js` | `id`, `type`, `organization`, `role`, `period`, `location`, `highlights` |
| `data/awards.js` | `id`, `title`, `organization`, `year`, `category` |
| `data/skills.js` | `id`, `category`, `items` |
| `data/teaching.js` | `id`, `course`, `role`, `term` |
| `data/service.js` | `id`, `type`, `activity`, `period` |

Use bilingual objects for reader-facing text. `highlights` and `items` remain arrays. Delete demo entries you do not need; do not leave fictional achievements on a real homepage.

News entries in `data/news.js` use `id`, a `date` in `YYYY-MM` format, bilingual `text`, a short `type`, and optional `highlight: true`.

## Images and local files

- Store your files under `assets/` and use relative paths.
- Use descriptive alternative text for meaningful images and an empty alternative for purely decorative images.
- Prefer web-friendly PNG, JPG, WebP, AVIF, or SVG files that you own or have permission to use.
- Keep filenames lowercase and stable; avoid spaces when practical.
- Confirm that every referenced file exists with matching capitalization, because GitHub Pages paths are case-sensitive.
- Put a CV under `assets/files/` and link it from `profile.links.cv`.

Optional image optimization and other maintenance tools are documented in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Search and sharing metadata

Visual Setup generates these values automatically. For manual editing, keep them in the `seo` object inside `data/site.js`:

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

Use the final HTTPS homepage URL with a trailing `/`. Keep `robots.txt` and `sitemap.xml` on the same production URL. `lastUpdated` must use `YYYY-MM-DD`.

## Empty content and disabled sections

An empty collection and a disabled section are related but separate:

```js
window.SCHOLAR_CANVAS.publications = [];
```

```js
sections: {
  publications: false
}
```

Disable sections that do not apply to you. Keeping an empty array prevents old demo items from appearing if a section is enabled again later.

## Common configuration mistakes

- Removing `window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {};` or changing the assigned property name.
- Missing commas, quotation marks, braces, or array brackets.
- Reusing an `id` in more than one item.
- Leaving demo profile data, links, publications, or awards in a real site.
- Using an unsupported publication status or a News date outside `YYYY-MM`.
- Referencing a local image that does not exist or whose capitalization differs.
- Using an operating-system absolute path instead of a repository-relative path.
- Using `http://`, `javascript:`, or another unsafe URL where HTTPS is expected.
- Emptying a data file without assigning an empty array.
- Updating `siteUrl` but forgetting `robots.txt` and `sitemap.xml`.

For validation commands, browser Smoke tests, maintenance scripts, GitHub Actions, and contribution requirements, read [CONTRIBUTING.md](../CONTRIBUTING.md).
