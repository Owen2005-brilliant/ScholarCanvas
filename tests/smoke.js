(function runSmokeTests(namespace) {
  "use strict";

  function start() {
    const results = document.getElementById("smoke-results");
    const summary = document.getElementById("smoke-summary");
    const originals = {
      profile: namespace.profile,
      publications: namespace.publications,
      projects: namespace.projects
    };
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

    function safeTest(name, callback) {
      try {
        const value = callback();
        assert(name, value === true || Boolean(value));
      } catch (error) {
        assert(name, false, error.message);
      }
    }

    namespace.state = {
      language: "zh",
      mode: "student",
      theme: "light",
      publicationTag: "all",
      projectTag: "",
      expandedNews: false,
      expandedAuthors: new Set()
    };
    namespace.theme.apply("light", false);
    namespace.interactions.bindGlobal();

    safeTest("i18n selects the current language", () => namespace.i18n.t({ zh: "中文", en: "English" }, "en", "zh") === "English");
    safeTest("i18n falls back without rendering [object Object]", () => namespace.i18n.t({ zh: "回退" }, "en", "zh") === "回退");
    safeTest("unsafe URL protocols are rejected", () => namespace.dom.isSafeUrl("javascript:alert(1)") === false);
    safeTest("reduced-motion preference is detected through matchMedia", () => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = (query) => ({ matches: query.includes("prefers-reduced-motion"), media: query });
      const detected = namespace.accessibility.prefersReducedMotion();
      window.matchMedia = originalMatchMedia;
      return detected === true;
    });

    namespace.renderer.renderPage();
    safeTest("Student Mode renders the primary profile", () => document.querySelector("#about h1")?.textContent === "林知夏");
    safeTest("Student Mode uses project-first section order", () => Array.from(document.querySelectorAll("main section[id]")).slice(0, 4).map((node) => node.id).join(",") === "about,projects,interests,experience");

    namespace.state.mode = "researcher";
    namespace.renderer.renderPage();
    safeTest("Researcher Mode uses publication-first section order", () => Array.from(document.querySelectorAll("main section[id]")).slice(0, 4).map((node) => node.id).join(",") === "about,news,selected-publications,publications");
    safeTest("Researcher Mode renders Teaching and Service", () => Boolean(document.getElementById("teaching") && document.getElementById("service")));
    namespace.state.expandedNews = true;
    namespace.renderer.renderPage();
    safeTest("Expanded News renders every configured item", () => document.querySelectorAll("#news .news-item").length === namespace.news.length);
    namespace.state.expandedNews = false;

    namespace.state.mode = "student";
    namespace.publications = [];
    namespace.projects = [];
    namespace.renderer.renderPage();
    safeTest("Empty publication and project arrays render safe empty states", () => document.querySelectorAll(".empty-state").length >= 3);

    namespace.projects = Array.from({ length: 13 }, (_, index) => ({
      ...originals.projects[index % originals.projects.length],
      id: `fixture-project-${index}`,
      featured: false
    }));
    namespace.publications = originals.publications;
    namespace.renderer.renderPage();
    safeTest("More than 12 projects use the static constellation fallback", () => document.querySelector('.constellation-fallback[data-fallback="true"]') !== null);

    namespace.profile = { name: { zh: "最小配置", en: "Minimal Profile" }, fictional: true };
    namespace.projects = [];
    namespace.publications = [];
    namespace.renderer.renderPage();
    safeTest("Missing optional profile fields do not crash rendering", () => document.querySelector("#about h1")?.textContent === "最小配置");

    namespace.profile = originals.profile;
    namespace.projects = originals.projects;
    namespace.publications = originals.publications;
    namespace.state.language = "en";
    namespace.state.mode = "student";
    namespace.renderer.renderPage();
    safeTest("English rendering updates the document language", () => document.documentElement.lang === "en");
    safeTest("Every rendered image has an alt attribute", () => Array.from(document.querySelectorAll("#app img")).every((image) => image.hasAttribute("alt")));
    safeTest("External links use noopener noreferrer", () => Array.from(document.querySelectorAll('#app a[target="_blank"]')).every((link) => link.rel.includes("noopener") && link.rel.includes("noreferrer")));
    safeTest("Core scripts, styles, and images have no remote source", () => Array.from(document.querySelectorAll('script[src], link[rel="stylesheet"][href], img[src]')).every((node) => !/^https?:/i.test(node.getAttribute("src") || node.getAttribute("href") || "")));
    safeTest("Rendered DOM has no duplicate IDs", () => {
      const ids = Array.from(document.querySelectorAll("[id]")).map((node) => node.id).filter(Boolean);
      return new Set(ids).size === ids.length;
    });

    document.body.dataset.smokeStatus = failed ? "failed" : "passed";
    document.title = "ScholarCanvas browser smoke tests";
    summary.textContent = failed ? `${passed} passed, ${failed} failed.` : `All ${passed} browser assertions passed.`;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
