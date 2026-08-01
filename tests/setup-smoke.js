(function runSetupSmoke(namespace) {
  "use strict";

  async function start() {
    const results = document.getElementById("setup-smoke-results");
    const summary = document.getElementById("setup-smoke-summary");
    let passed = 0;
    let failed = 0;

    function assert(name, condition, detail) {
      const item = document.createElement("li");
      const ok = Boolean(condition);
      item.dataset.result = ok ? "pass" : "fail";
      item.textContent = `${ok ? "PASS" : "FAIL"} — ${name}${detail ? `: ${detail}` : ""}`;
      results.append(item);
      if (ok) passed += 1;
      else failed += 1;
    }

    function safe(name, callback) {
      try { assert(name, callback()); }
      catch (error) { assert(name, false, error.message); }
    }

    async function safeAsync(name, callback) {
      try { assert(name, await callback()); }
      catch (error) { assert(name, false, error.message); }
    }

    const student = namespace.stateUtils.createMinimal("student");
    const researcher = namespace.stateUtils.createMinimal("researcher");
    const validStudent = namespace.stateUtils.deepClone(student);
    validStudent.profile.name = { zh: "测试用户", en: "Test User" };
    validStudent.profile.email = "test@example.com";
    validStudent.site.githubUsername = "test-user";
    validStudent.site.repositoryName = "ScholarCanvas";

    safe("initializer foundation loads in a browser", () => Boolean(namespace.store && namespace.serializer && namespace.exporter && namespace.importer));
    safe("schema defines seven ordered steps", () => namespace.schema.steps.length === 7 && namespace.schema.steps[0].id === "welcome" && namespace.schema.steps[6].id === "review");
    safe("schema defines all eight content modules", () => namespace.schema.sectionKeys.join(",") === "news,publications,projects,experience,awards,skills,teaching,service");
    safe("Student recommendation is project-first", () => student.sections.projects && student.sections.experience && !student.sections.teaching);
    safe("Researcher recommendation includes publications", () => researcher.sections.publications && researcher.sections.news && researcher.sections.service);
    safe("minimal Student profile uses explicit replacement copy", () => student.profile.name.en === "Your Name" && !JSON.stringify(student).includes("林知夏"));
    safe("minimal Researcher includes a publication", () => researcher.content.publications.length === 1);
    safe("minimal Student includes a project", () => student.content.projects.length === 1);
    safe("all content arrays exist", () => namespace.schema.sectionKeys.every((key) => Array.isArray(student.content[key])));
    safe("deepClone does not share nested references", () => { const copy = namespace.stateUtils.deepClone(student); copy.profile.name.zh = "changed"; return student.profile.name.zh !== copy.profile.name.zh; });
    safe("getPath reads nested values", () => namespace.stateUtils.getPath(student, "profile.name.en") === "Your Name");
    safe("setPath writes nested values", () => { const value = {}; namespace.stateUtils.setPath(value, "a.b.c", 3); return value.a.b.c === 3; });
    safe("slugify creates repository-safe ids", () => namespace.stateUtils.slugify("A Visual Project!") === "a-visual-project");
    safe("splitLines removes empty lines", () => namespace.stateUtils.splitLines("a\n\n b ").join(",") === "a,b");
    safe("splitTags supports Chinese commas", () => namespace.stateUtils.splitTags("HCI，AI, UX").length === 3);
    safe("every module creates a usable item", () => namespace.schema.sectionKeys.every((key) => namespace.stateUtils.createItem(key, 0) && typeof namespace.stateUtils.createItem(key, 0) === "object"));
    safe("publication factory contains a self author", () => namespace.stateUtils.createItem("publications", 0).authors.some((author) => author.self));
    safe("current data imports into setup state", () => namespace.stateUtils.fromCurrentConfig(namespace.store.getSourceConfig()).content.projects.length > 0);
    safe("normalized imported state restores missing arrays", () => Array.isArray(namespace.stateUtils.normalizeImportedState({ mode: "student", content: {} }).content.service));
    safe("mode switching preserves existing content", () => { namespace.store.replace(student); const before = namespace.store.get().content.projects.length; namespace.store.setMode("researcher"); return namespace.store.get().content.projects.length === before; });
    safe("language can switch without losing content", () => { const before = namespace.store.get().content.projects.length; namespace.store.update("language", "en"); return namespace.store.get().language === "en" && namespace.store.get().content.projects.length === before; });
    safe("light and dark preferences remain valid state", () => { namespace.store.update("theme", "dark"); const dark = namespace.store.get().theme === "dark"; namespace.store.update("theme", "light"); return dark && namespace.store.get().theme === "light"; });
    safe("preview toolbar exposes desktop, tablet, and mobile widths", () => {
      const toolbar = namespace.components.previewToolbar.render(namespace.store.get());
      const devices = Array.from(toolbar.querySelectorAll('[data-action="preview-device"]')).map((button) => button.dataset.value);
      return devices.join(",") === "desktop,tablet,mobile";
    });
    safe("section toggle records the manual choice", () => { namespace.store.setSection("news", true); return namespace.store.get().sections.news && namespace.store.get().sectionTouched.news; });
    safe("project can be added and removed", () => { namespace.store.replace(student); const before = namespace.store.get().content.projects.length; namespace.store.addItem("projects"); namespace.store.removeItem("projects", before); return namespace.store.get().content.projects.length === before; });
    safe("projects can be reordered", () => { namespace.store.replace(student); namespace.store.addItem("projects"); const first = namespace.store.get().content.projects[0].id; namespace.store.moveItem("projects", 0, 1); return namespace.store.get().content.projects[1].id === first; });
    safe("publication can be added", () => { namespace.store.replace(student); namespace.store.addItem("publications"); return namespace.store.get().content.publications.length === 1; });

    safe("HTTPS URL is accepted", () => namespace.validators.isSafeUrl("https://example.com"));
    safe("mailto URL is accepted", () => namespace.validators.isSafeUrl("mailto:test@example.com"));
    safe("relative asset path is accepted when allowed", () => namespace.validators.isSafeUrl("assets/file.pdf", { allowRelative: true }));
    safe("javascript URL is rejected", () => !namespace.validators.isSafeUrl("javascript:alert(1)", { allowRelative: true }));
    safe("data URL is rejected", () => !namespace.validators.isSafeUrl("data:text/html,bad", { allowRelative: true }));
    safe("site URL requires HTTPS", () => namespace.validators.isValidSiteUrl("https://example.com/site/") && !namespace.validators.isValidSiteUrl("http://example.com"));
    safe("news month requires YYYY-MM", () => namespace.validators.isValidDate("2026-08", "month") && !namespace.validators.isValidDate("2026-13", "month"));
    safe("valid PNG avatar passes", () => namespace.validators.avatarFile(new File(["x"], "avatar.png", { type: "image/png" })).valid);
    safe("invalid avatar type fails", () => !namespace.validators.avatarFile(new File(["x"], "avatar.txt", { type: "text/plain" })).valid);
    safe("oversized avatar fails", () => !namespace.validators.avatarFile(new File([new Uint8Array(5 * 1024 * 1024 + 1)], "avatar.png", { type: "image/png" })).valid);
    safe("valid PDF CV passes", () => namespace.validators.cvFile(new File(["%PDF"], "cv.pdf", { type: "application/pdf" })).valid);
    safe("invalid CV type fails", () => !namespace.validators.cvFile(new File(["x"], "cv.doc", { type: "application/msword" })).valid);
    safe("invalid email produces a field error", () => { const value = namespace.stateUtils.deepClone(validStudent); value.profile.email = "invalid"; return namespace.validators.validateState(value).errors.some((error) => error.path === "profile.email"); });
    safe("invalid GitHub username produces a field error", () => { const value = namespace.stateUtils.deepClone(validStudent); value.site.githubUsername = "bad--name"; return namespace.validators.validateState(value).errors.some((error) => error.path === "site.githubUsername"); });
    safe("duplicate ids are rejected across modules", () => { const value = namespace.stateUtils.deepClone(validStudent); value.content.awards.push({ id: value.content.projects[0].id, title: { zh: "奖", en: "Award" }, date: "2026" }); return namespace.validators.validateState(value).errors.some((error) => error.path.includes("content.awards")); });
    safe("invalid publication status is rejected", () => { const value = namespace.stateUtils.deepClone(researcher); value.content.publications[0].status = "unknown"; return namespace.validators.validateState(value).errors.some((error) => error.path.endsWith("status")); });
    safe("publication requires at least one author", () => { const value = namespace.stateUtils.deepClone(researcher); value.content.publications[0].authors = []; return namespace.validators.validateState(value).errors.some((error) => error.path.endsWith("authors")); });
    safe("enabled empty module creates a warning", () => { const value = namespace.stateUtils.deepClone(validStudent); value.sections.news = true; value.content.news = []; return namespace.validators.validateState(value).warnings.some((warning) => warning.path === "sections.news"); });
    safe("preview payload validator requires every array", () => namespace.validators.validatePreviewPayload(namespace.serializer.buildPayload(validStudent, {})));
    safe("invalid preview message payload is rejected", () => !namespace.validators.validatePreviewPayload({ site: {}, profile: {}, projects: [] }));

    safe("project Pages URL is computed with a trailing slash", () => namespace.serializer.computeSiteUrl({ githubUsername: "test-user", repositoryName: "ScholarCanvas" }) === "https://test-user.github.io/ScholarCanvas/");
    safe("user Pages URL omits repository path", () => namespace.serializer.computeSiteUrl({ githubUsername: "test-user", repositoryName: "test-user.github.io" }) === "https://test-user.github.io/");
    safe("custom URL overrides Pages URL", () => namespace.serializer.computeSiteUrl({ githubUsername: "x", repositoryName: "y", customUrl: "https://portfolio.example/u" }) === "https://portfolio.example/u/");
    safe("serializer output is stable", () => namespace.serializer.toSource({ z: 1, a: { en: "A", zh: "甲" } }) === namespace.serializer.toSource({ z: 1, a: { en: "A", zh: "甲" } }));
    safe("source files retain the public namespace", () => namespace.serializer.sourceFile("projects", []).startsWith("window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {};"));
    safe("profile serializer preserves bilingual Chinese", () => namespace.serializer.buildPayload(validStudent, {}).profile.name.zh === "测试用户");
    safe("publication serializer preserves authors and status", () => { const payload = namespace.serializer.buildPayload(researcher, {}); return payload.publications[0].authors.length > 0 && payload.publications[0].status === "work-in-progress"; });
    safe("serializer preserves double hyphens and Chinese text", () => { const source = namespace.serializer.toSource({ text: "中文 -- preserved" }); return source.includes("中文 -- preserved"); });
    safe("empty optional links are removed", () => !Object.prototype.hasOwnProperty.call(namespace.serializer.cleanLinks({ github: "", demo: "https://example.com" }), "github"));
    safe("text bundle contains all ten data files", () => Object.keys(namespace.serializer.buildTextFiles(validStudent, {})).filter((name) => name.startsWith("data/")).length === 10);
    safe("text bundle contains SEO deployment files", () => { const files = namespace.serializer.buildTextFiles(validStudent, {}); return Boolean(files["robots.txt"] && files["sitemap.xml"] && files["SETUP_RESULT.md"]); });
    safe("robots points to the generated sitemap", () => namespace.serializer.robots("https://example.com/site/").includes("https://example.com/site/sitemap.xml"));
    safe("sitemap contains the canonical URL", () => namespace.serializer.sitemap("https://example.com/site/", "2026-08-01").includes("<loc>https://example.com/site/</loc>"));
    safe("avatar path follows validated MIME type", () => namespace.serializer.avatarExportPath({ avatar: new File(["x"], "portrait.jpeg", { type: "image/jpeg" }) }) === "assets/avatar/profile-avatar.jpg");

    safe("draft document has an explicit format and version", () => { const doc = namespace.importer.draftDocument(validStudent); return doc.format === "scholarcanvas-setup" && doc.version === 1; });
    safe("valid draft JSON parses safely", () => namespace.importer.parseDraft(JSON.stringify(namespace.importer.draftDocument(validStudent))).valid);
    safe("partial draft safely inherits missing defaults", () => {
      const parsed = namespace.importer.parseDraft(JSON.stringify({ format: "scholarcanvas-setup", version: 1, state: { mode: "researcher", profile: { name: { en: "Imported" } } } }));
      return parsed.valid && parsed.state.profile.name.en === "Imported" && parsed.state.profile.links && parsed.state.site.seoTitle.zh;
    });
    safe("invalid JSON does not execute or parse", () => !namespace.importer.parseDraft("{not-json}").valid);
    safe("unrelated JSON is rejected", () => !namespace.importer.parseDraft(JSON.stringify({ version: 1, state: {} })).valid);
    safe("file-system whitelist accepts data files", () => namespace.fileSystem.isAllowedPath("data/profile.js"));
    safe("file-system whitelist accepts generated avatar", () => namespace.fileSystem.isAllowedPath("assets/avatar/profile-avatar.webp"));
    safe("file-system whitelist rejects source code", () => !namespace.fileSystem.isAllowedPath("src/app.js"));
    safe("file-system whitelist rejects traversal", () => !namespace.fileSystem.isAllowedPath("../data/profile.js"));
    await safeAsync("folder writer backs up and writes only approved files", async () => {
      class MemoryFile {
        constructor(name, value) { this.name = name; this.value = value || ""; }
        async getFile() { return new File([this.value], this.name, { type: "text/plain" }); }
        async createWritable() {
          return { write: async (value) => { this.value = value instanceof Blob ? await value.text() : String(value); }, close: async () => {} };
        }
      }
      class MemoryDirectory {
        constructor(name) { this.name = name; this.directories = new Map(); this.files = new Map(); }
        async getDirectoryHandle(name, options) {
          if (!this.directories.has(name) && options && options.create) this.directories.set(name, new MemoryDirectory(name));
          if (!this.directories.has(name)) throw new Error("missing directory");
          return this.directories.get(name);
        }
        async getFileHandle(name, options) {
          if (!this.files.has(name) && options && options.create) this.files.set(name, new MemoryFile(name, ""));
          if (!this.files.has(name)) throw new Error("missing file");
          return this.files.get(name);
        }
      }
      const root = new MemoryDirectory("ScholarCanvas");
      root.files.set("index.html", new MemoryFile("index.html", "<main></main>"));
      ["data", "src", "styles"].forEach((name) => root.directories.set(name, new MemoryDirectory(name)));
      root.directories.get("data").files.set("site.js", new MemoryFile("site.js", "old site"));
      const result = await namespace.fileSystem.applyEntries(root, [{ name: "data/site.js", data: "new site" }, { name: "robots.txt", data: "robots" }]);
      const backupRoot = root.directories.get(".backup");
      const stamped = Array.from(backupRoot.directories.values())[0];
      const backedUp = stamped.directories.get("data").files.get("site.js").value;
      return result.written.length === 2 && root.directories.get("data").files.get("site.js").value === "new site" && backedUp === "old site";
    });
    safe("file:// preview origin allows only null origin", () => namespace.previewBridge.allowedOrigin("null") === (window.location.protocol === "file:"));
    safe("same HTTP origin is accepted", () => window.location.protocol === "file:" || namespace.previewBridge.allowedOrigin(window.location.origin));
    safe("preview update uses the same final serializer payload", () => { namespace.store.replace(validStudent); return namespace.previewBridge.payload().profile.name.en === namespace.serializer.buildPayload(validStudent, {}).profile.name.en; });
    safe("reduced-motion media query is available", () => typeof window.matchMedia === "function" && typeof window.matchMedia("(prefers-reduced-motion: reduce)").matches === "boolean");
    safe("setup layout has a 360px overflow guard", () => Array.from(document.styleSheets).some((sheet) => { try { return Array.from(sheet.cssRules || []).some((rule) => String(rule.cssText).includes("max-width: 390px")); } catch (_error) { return false; } }));
    safe("oversized CV fails validation", () => !namespace.validators.cvFile(new File([new Uint8Array(20 * 1024 * 1024 + 1)], "cv.pdf", { type: "application/pdf" })).valid);

    await safeAsync("localStorage draft saves and clears explicitly", async () => {
      await namespace.importer.saveDraft(validStudent, {});
      const saved = namespace.importer.hasDraft() && (await namespace.importer.loadDraft()).valid;
      await namespace.importer.clearDraft();
      return saved && !namespace.importer.hasDraft();
    });

    await safeAsync("dialog traps keyboard focus and restores the opener", async () => {
      const opener = document.createElement("button");
      opener.textContent = "Open dialog";
      document.body.append(opener);
      opener.focus();
      const promise = namespace.components.confirmationDialog.confirm({ title: "Confirm", description: "Keyboard check", confirmLabel: "Confirm", cancelLabel: "Cancel" });
      await new Promise((resolve) => setTimeout(resolve, 0));
      const dialog = document.querySelector(".setup-dialog-backdrop");
      const confirmButton = dialog.querySelector('[data-action="dialog-confirm"]');
      const cancelButton = dialog.querySelector('[data-action="dialog-cancel"]');
      const initial = document.activeElement === confirmButton;
      confirmButton.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
      const trapped = document.activeElement === cancelButton;
      dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      const result = await promise;
      const restored = document.activeElement === opener;
      opener.remove();
      return initial && trapped && !result && restored;
    });

    await safeAsync("ZIP writer includes every entry name", async () => {
      const entries = await namespace.exporter.buildEntries(validStudent, {});
      const zip = await namespace.exporter.createZipBlob(entries);
      const names = await namespace.exporter.readZipNames(zip);
      return names.length === entries.length && names.includes("data/site.js") && names.includes("SETUP_RESULT.md");
    });
    await safeAsync("avatar and CV are packaged only when selected", async () => {
      const avatar = new File(["avatar"], "avatar.svg", { type: "image/svg+xml" });
      const cv = new File(["%PDF"], "cv.pdf", { type: "application/pdf" });
      const entries = await namespace.exporter.buildEntries(validStudent, { avatar, cv });
      const names = entries.map((entry) => entry.name);
      return names.includes("assets/avatar/profile-avatar.svg") && names.includes("assets/files/cv.pdf");
    });
    await safeAsync("avatar and CV are omitted when not selected", async () => {
      const names = (await namespace.exporter.buildEntries(validStudent, {})).map((entry) => entry.name);
      return !names.some((name) => name.startsWith("assets/avatar/profile-avatar.")) && !names.includes("assets/files/cv.pdf");
    });
    safe("CRC32 matches the standard test vector", () => namespace.exporter.crc32(new TextEncoder().encode("123456789")) === 0xcbf43926);

    document.body.dataset.setupSmokeStatus = failed ? "failed" : "passed";
    document.body.dataset.setupSmokePassed = String(passed);
    document.body.dataset.setupSmokeFailed = String(failed);
    summary.textContent = failed ? `${passed} passed, ${failed} failed.` : `All ${passed} setup assertions passed.`;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
