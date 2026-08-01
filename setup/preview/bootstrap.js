(function initSetupPreview(namespace) {
  "use strict";

  let pending = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function allowedOrigin(origin) {
    if (window.location.protocol === "file:") return origin === "null";
    return origin === window.location.origin;
  }

  function isValidMessage(event) {
    return Boolean(
      event &&
      event.source === window.parent &&
      allowedOrigin(event.origin) &&
      event.data &&
      event.data.type === "SCHOLAR_CANVAS_PREVIEW_UPDATE" &&
      event.data.version === 1 &&
      window.SCHOLAR_CANVAS_SETUP &&
      window.SCHOLAR_CANVAS_SETUP.validators &&
      window.SCHOLAR_CANVAS_SETUP.validators.validatePreviewPayload(event.data.payload)
    );
  }

  function applyPayload(payload) {
    if (!window.SCHOLAR_CANVAS_SETUP.validators.validatePreviewPayload(payload)) return false;
    const value = clone(payload);
    ["site", "profile", "news", "publications", "projects", "experience", "awards", "skills", "teaching", "service"].forEach((key) => {
      namespace[key] = value[key];
    });
    if (!namespace.state || !namespace.renderer) {
      pending = value;
      return true;
    }
    namespace.state.mode = value.site.mode === "researcher" ? "researcher" : "student";
    namespace.state.language = value.site.defaultLanguage === "en" ? "en" : "zh";
    namespace.state.theme = value.site.defaultTheme === "dark" ? "dark" : value.site.defaultTheme === "light" ? "light" : namespace.theme.initialTheme(value.site);
    namespace.state.publicationTag = "all";
    namespace.state.projectTag = "";
    namespace.state.expandedNews = false;
    namespace.state.expandedAuthors = new Set();
    namespace.theme.apply(namespace.state.theme, false);
    namespace.renderer.renderPage();
    return true;
  }

  function onMessage(event) {
    if (!isValidMessage(event)) return;
    if (applyPayload(event.data.payload)) window.parent.postMessage({ type: "SCHOLAR_CANVAS_PREVIEW_APPLIED", version: 1 }, window.location.protocol === "file:" ? "*" : window.location.origin);
  }

  window.addEventListener("message", onMessage);
  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ block: "start", behavior: namespace.accessibility && namespace.accessibility.prefersReducedMotion() ? "auto" : "smooth" });
  });
  document.addEventListener("DOMContentLoaded", () => {
    if (pending) applyPayload(pending);
    window.parent.postMessage({ type: "SCHOLAR_CANVAS_PREVIEW_READY", version: 1 }, window.location.protocol === "file:" ? "*" : window.location.origin);
  }, { once: true });

  window.SCHOLAR_CANVAS_PREVIEW = { allowedOrigin, isValidMessage, applyPayload };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
