# ScholarCanvas Visual Setup Guide

The visual setup wizard turns the existing `data/*.js` configuration into a seven-step, browser-only workflow. Open [`setup.html`](../setup.html) locally, or use the hosted [Visual Setup](https://owen2005-brilliant.github.io/ScholarCanvas/setup.html). No account, backend, package install, or build command is involved.

## 1. Choose a starting point and mode

Choose **Start minimal** for explicit replacement placeholders, **Use current site** to load the repository's existing v1.0 configuration, or **Import a draft** to reopen a setup JSON file. Student Mode recommends Projects, Experience, Awards, and Skills. Researcher Mode recommends News, Publications, Projects, Awards, Teaching, and Service. Changing modes does not delete content or manually selected sections.

## 2. Fill in the profile

Enter bilingual identity, affiliation, biography, short biography, interests, and optional external links. Required fields are labelled and validated near the control, with a linked error summary when advancing.

Use the file picker to add an avatar (PNG, JPG, WebP, or SVG, maximum 5MB) and an optional CV (PDF, maximum 20MB). Files are never uploaded. The selected avatar appears in the live preview and both files are packaged only when you export or explicitly write to a folder.

## 3. Choose sections and edit content

Turn any of the eight modules on or off. Disabled content stays in the setup state. The content editor supports add, delete, duplicate, move up, move down, and collapse for every module. Publications include a nested author editor with ordering and a “this is me” marker. Advanced paths, links, images, and BibTeX stay in a quieter expandable area.

## 4. Appearance, preview, and website URL

Choose the initial language, Light/Dark/System theme, and an accent color. The live preview is the real ScholarCanvas renderer inside an isolated iframe; setup data is serialized and sent through a versioned, origin-checked `postMessage` protocol. Switch Student/Researcher, Chinese/English, desktop/mobile, or refresh the preview from its toolbar.

For GitHub Pages, enter the GitHub username and repository name. `username.github.io` produces a root URL; other repositories produce `https://username.github.io/repository/`. A complete custom HTTPS URL overrides the Pages URL. Canonical, robots, sitemap, Open Graph, and JSON-LD inputs use the same generated address.

## 5. Save or move a draft

**Save draft in this browser** writes setup JSON to `localStorage` and selected files to IndexedDB only after confirmation. **Export draft** downloads `scholarcanvas-setup.json`; **Import draft** parses JSON as data and never runs it as code. **Clear local draft** removes the saved state and browser-stored files after confirmation.

Browser storage is tied to the current origin. A draft saved from `file://` is separate from one saved on GitHub Pages or a local HTTP server. Export a JSON draft when moving between those locations.

## 6. Export a configuration bundle

**Download ScholarCanvas configuration bundle** creates `scholarcanvas-config.zip` in the browser. It contains ten `data/*.js` files, `robots.txt`, `sitemap.xml`, `SETUP_RESULT.md`, and the selected avatar/CV when present. The built-in ZIP writer uses the uncompressed ZIP format, has no third-party dependency, and yields between files to keep the interface responsive.

Extract the bundle and replace the matching paths in your ScholarCanvas repository. Then run `python3 tools/validate_config.py` if Python is available. Python is a maintainer validation aid; the homepage and initializer do not require it.

## 7. Write directly to a folder

Current Chrome and Edge can show **Choose a ScholarCanvas folder and apply configuration** through the File System Access API. Select the repository root containing `index.html`, `data/`, `src/`, and `styles/`. Before writing, the wizard displays the exact file list. Existing files are copied to `.backup/setup-YYYYMMDD-HHMMSS/`, and a strict whitelist prevents changes outside generated data, SEO files, avatar, and CV.

Safari and Firefox do not currently expose this API. The ZIP path remains fully available and the wizard displays the fallback message instead of disabling setup.

## 8. Publish with GitHub Pages

Commit the replaced files, push to GitHub, and choose **Settings → Pages → GitHub Actions**. The existing deployment workflow validates and publishes the static repository. Confirm the generated URL, `robots.txt`, and `sitemap.xml` after deployment.

## Privacy and security

- No profile data, files, credentials, tokens, analytics, or OAuth requests are sent anywhere.
- Draft import uses `JSON.parse`; the wizard contains no `eval`, `new Function`, or imported script execution.
- Links reject unsafe protocols, preview messages validate source/origin/type/version/payload, and folder writes use an explicit path whitelist.
- Object URLs are revoked when avatar files are replaced or cleared.

## Browser compatibility

Current Chrome and Edge support the complete workflow, including optional folder writing. Current Safari and Firefox support editing, live preview, browser drafts, JSON import/export, and ZIP downloads. Direct folder writing gracefully falls back to ZIP when unavailable. The layout is designed for 360px and wider screens, keyboard navigation, visible focus, reduced motion, and screen-reader announcements.

## Frequently asked questions

**Can I keep editing `data/*.js`?** Yes. The public schema and homepage renderer are unchanged.

**Why is my local draft missing on another URL?** Browser storage is isolated per origin. Export the draft JSON and import it at the new location.

**Does turning off a module delete it?** No. The content stays in the draft and can be enabled again.

**Why is folder writing disabled?** Your browser does not expose the File System Access API. Download the ZIP and replace the files manually.

**Can the wizard import arbitrary JavaScript?** No. It can read the trusted repository scripts already loaded by the page and its own JSON draft format. It never evaluates imported text.
