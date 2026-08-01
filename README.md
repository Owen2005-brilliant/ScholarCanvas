# ScholarCanvas

ScholarCanvas is a bilingual, configuration-driven academic homepage template for students and researchers. It is entirely static: no backend, database, package manager, or build step is required.

> The bundled profile, institutions, publications, projects, and awards are fictional demo content. Replace them before publishing.

[Open Visual Setup](https://owen2005-brilliant.github.io/ScholarCanvas/setup.html) · [Visual setup guide](docs/visual-setup-guide.md) · [中文文档](README.zh-CN.md) · [Student example](examples/student/README.md) · [Researcher example](examples/researcher/README.md) · [GitHub repository](https://github.com/Owen2005-brilliant/ScholarCanvas)

## Quick start

1. Choose **Use this template** on GitHub to create your own repository.
2. Download or clone your repository.
3. Double-click `setup.html`, or run:

   ```bash
   python3 -m http.server 8000
   ```

   Then open [http://localhost:8000/setup.html](http://localhost:8000/setup.html).
4. In the visual setup:
   - choose Student or Researcher;
   - enter your profile;
   - add projects, publications, and experience;
   - preview the homepage live;
   - download the configuration bundle, or write it directly to a local ScholarCanvas folder.
5. Apply the generated configuration to your repository and check the homepage preview.
6. Push your repository to GitHub.
7. Open **Settings → Pages → Source → GitHub Actions**.
8. Wait for deployment, then visit your personal homepage.

`setup.html` is the recommended path; editing `data/*.js` is the fallback for advanced users. ScholarCanvas needs no backend, Node.js, or database. Everything you enter stays in your browser, and students without publications can turn off the Publications section.

### Manual editing

Advanced users can edit these files directly:

- `data/site.js`
- `data/profile.js`
- `data/projects.js`
- `data/publications.js`
- `data/experience.js`

## Preview

Live demo: [https://owen2005-brilliant.github.io/ScholarCanvas/](https://owen2005-brilliant.github.io/ScholarCanvas/).

![ScholarCanvas Student Mode desktop preview](docs/screenshots/student-mode-desktop.png)

![ScholarCanvas Researcher Mode desktop preview](docs/screenshots/researcher-mode-desktop.png)

<p align="center">
  <img src="docs/screenshots/mobile-preview.png" width="360" alt="ScholarCanvas Student Mode mobile preview">
</p>

The project also includes the visual-direction boards used during implementation:

- [Student Mode concept](docs/design-concepts/student-mode.png)
- [Researcher Mode concept](docs/design-concepts/researcher-mode.png)
- [Visual Setup desktop concept](docs/design-concepts/setup-wizard-desktop.png)
- [Visual Setup mobile concept](docs/design-concepts/setup-wizard-mobile.png)

## Features

- Student Mode with project-first storytelling, a responsive research constellation, experience, activities, and skills.
- Researcher Mode with compact biography, news, selected publications, full publication filters, teaching, and service.
- Instant Chinese/English switching with translation fallback and persisted preference.
- Dedicated light/dark palettes with system preference support.
- Structured `data/*.js` configuration that also works when `index.html` is opened through `file://`.
- Copy email, copy biography, copy BibTeX, expandable news/authors, project dialog, section tracking, and back-to-top controls.
- Keyboard-accessible controls, focus trapping, skip link, live-region announcements, reduced-motion support, and 44px touch targets.
- Self-made SVG demo assets, lazy-loaded content images, no remote fonts, and no runtime network dependency.
- Python configuration validation and official GitHub Pages workflows with no Node.js step.
- A seven-step visual initializer with real homepage preview, automatic search/share metadata, browser-local drafts, safe JSON import, ZIP export, and optional local-folder writing.

## Student and Researcher presets

| Area | Student Mode | Researcher Mode |
| --- | --- | --- |
| First impression | Personal statement and large visual profile | Compact biography and affiliation metadata |
| Primary content | Projects, research interests, experience | News and publications |
| Projects | Image-led cards plus constellation | Dense research rows |
| Publications | Accessible project-like result list | Selected and complete publication sections |
| Visual language | Warm amber/cyan, larger radius, gentle depth | Bronze/slate, fine dividers, compact spacing |
| Footer | Campus Horizon | Research Night |

The mode switch is enabled in the demo. Personal sites can disable it and publish one preset.

## Configuration

All public content lives in classic JavaScript data files so the page can load from disk without `fetch()`:

| File | Purpose |
| --- | --- |
| `data/site.js` | Mode, language/theme controls, enabled sections, SEO, update date |
| `data/profile.js` | Name, biography, affiliation, interests, links, avatar |
| `data/news.js` | Timeline announcements |
| `data/publications.js` | Publications, links, tags, status, BibTeX |
| `data/projects.js` | Project cards, constellation, dialog details |
| `data/experience.js` | Education, internships, research, service |
| `data/awards.js` | Awards and activities |
| `data/skills.js` | Categorized skill labels—never percentage bars |
| `data/teaching.js` | Courses and teaching roles |
| `data/service.js` | Reviewing, organizing, mentoring, and community work |

Set the default preset in `data/site.js`:

```js
window.SCHOLAR_CANVAS.site = {
  mode: "student", // "student" or "researcher"
  defaultLanguage: "zh",
  enableLanguageSwitch: true,
  enableDarkMode: true,
  enableModePreviewSwitch: false,
  defaultTheme: "system"
};
```

Keep the `window.SCHOLAR_CANVAS` namespace and script filenames unchanged. Components tolerate missing optional fields, but validation reports missing required fields and assets.

## Change the profile

Edit `data/profile.js` and replace:

- the bilingual name, identity, tagline, biography, and short biography;
- school, lab, advisor, location, and research interests;
- the demo email and social URLs;
- `assets/avatar/lin-zhixia.svg` with your own image path and descriptive alternative text.

The demo uses `hello@example.com`, which is intentionally not a private address. Empty optional links render as a non-blocking “not configured” toast instead of a broken navigation.

## Add a publication

Append an object to `data/publications.js`:

```js
{
  id: "stable-unique-id",
  title: { zh: "中文标题", en: "English title" },
  authors: [
    { name: "Your Name", self: true },
    { name: "Coauthor" }
  ],
  venue: "Venue 2026",
  year: 2026,
  status: "published",
  selected: true,
  image: "assets/publications/example.webp",
  imageAlt: { zh: "论文视觉摘要", en: "Publication visual abstract" },
  links: {}, // Add only the links you actually have.
  tags: ["HCI", "Visualization"],
  summary: { zh: "一句话摘要。", en: "One-sentence summary." },
  bibtex: "@article{...}"
}
```

Supported statuses are `published`, `accepted`, `preprint`, `under-review`, and `work-in-progress`. Status labels are intentionally explicit to avoid overstating unpublished work.

## Add a project

Append an object to `data/projects.js` with a unique `id`, bilingual `name`, `description`, optional `details`, local image, tags, links, and status. The clear card/list view remains primary. The constellation is progressive enhancement:

- at more than 12 projects it becomes a static list;
- at mobile widths it becomes a static full-width list;
- with reduced motion it stops floating;
- while the page is hidden, continuous motion pauses.

## Bilingual content

User-facing strings can be bilingual objects or plain strings:

```js
{ zh: "中文内容", en: "English content" }
```

The renderer selects the active language, falls back to the configured default language, then uses the first available value. Switching language updates `html[lang]`, the document title, metadata, controls, and JSON-LD without reloading.

## Assets and image optimization

Store assets under `assets/` and use relative paths. Images are lazy-loaded outside the hero. The demo art is original SVG; you may replace it with WebP or AVIF files you own.

Optional WebP conversion requires Pillow:

```bash
python3 -m pip install Pillow
python3 tools/optimize_images.py assets/projects/my-image.png --quality 84
```

The source image is never overwritten unless `--force` is explicitly passed for an existing WebP destination.

## Validation and browser smoke tests

Run configuration and required-file checks:

```bash
python3 tools/validate_config.py
python3 -m compileall -q tools
```

Open `tests/smoke.html` and `tests/setup-smoke.html` directly or through the local server. They display browser assertions for the homepage and the visual setup/export pipeline.

The intentionally invalid fixture can confirm the validator's failure path:

```bash
python3 tools/validate_config.py --check-file tests/config-fixtures/invalid-publication.js
```

That command should exit non-zero.

## Deployment

### GitHub Pages

1. Push the repository to GitHub using `main` as the publishing branch.
2. In **Settings → Pages**, select **GitHub Actions** as the source.
3. Verify `seo.siteUrl`, `robots.txt`, and `sitemap.xml` match the final URL. This repository is configured for `https://owen2005-brilliant.github.io/ScholarCanvas/`.
4. Push again. `.github/workflows/deploy-pages.yml` validates and uploads the repository as a static Pages artifact.

No build output directory is involved. The companion `validate.yml` runs on pushes and pull requests.

### Other static hosts

Upload the repository directory to Cloudflare Pages, Netlify, Vercel static hosting, a university web space, or any Nginx/Apache directory. Do not add a build command.

## Accessibility

ScholarCanvas includes semantic sections, one page heading, visible focus indicators, a skip link, accessible icon labels, live announcements, keyboard-operable controls, a modal focus trap with Escape close, translation-aware labels, reduced-motion behavior, and responsive touch targets. Keep these guarantees when adding components. Automated checks do not replace testing with a keyboard and assistive technology.

## SEO

Static defaults in `index.html` provide a useful fallback. At runtime, `data/site.js` and `data/profile.js` update the title, description, Open Graph/Twitter fields, canonical URL, share image, and JSON-LD Person record. Forks should replace the configured production URL and share image before launch.

## Browser support

The project targets current Chrome, Edge, Firefox, Safari, iOS Safari, and Android Chrome. Core content does not depend on remote assets. Older browsers that lack enhancement APIs still receive the main content and controls.

## Repository tools

- `tools/validate_config.py`: validates files, namespace usage, duplicate IDs, assets, required fields, dates, status values, section keys, and unsafe protocols.
- `tools/update_date.py`: updates `lastUpdated`; pass `--check` for CI-style comparison.
- `tools/optimize_images.py`: optional non-destructive WebP conversion.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md). Contributions must be original, license-compatible, keyboard-accessible, responsive, and free from secrets or private sample data.

## Credits and design provenance

ScholarCanvas was designed from first principles around common academic-homepage needs: clear identity, research communication, accessible navigation, structured publications, and low-maintenance static hosting. It does not copy code or restricted assets from another template. The bundled SVG illustrations and demo content were created for this project.

## Roadmap

Non-MVP ideas deliberately left for later include BibTeX import, optional Markdown, more color presets, RSS/static blog support, an Astro variant, a visual configuration checker, and a component marketplace. v1.0 intentionally has no CMS, login, database, automated Scholar scraping, analytics, comments, or AI assistant.

## License

[MIT](LICENSE) © 2026 ScholarCanvas contributors.
