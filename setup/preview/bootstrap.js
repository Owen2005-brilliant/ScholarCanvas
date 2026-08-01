(function initSetupPreview(namespace) {
  "use strict";

  let pending = null;
  let runtimeObjectUrls = [];
  const standalone = new URLSearchParams(window.location.search).get("standalone") === "1";
  const handoffToken = standalone ? new URLSearchParams(window.location.search).get("handoff") || "" : "";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function allowedOrigin(origin) {
    if (window.location.protocol === "file:") return origin === "null";
    return origin === window.location.origin;
  }

  function messageHost() {
    return standalone ? window.opener : window.parent;
  }

  function isValidMessage(event) {
    return Boolean(
      event &&
      event.source === messageHost() &&
      allowedOrigin(event.origin) &&
      event.data &&
      event.data.type === "SCHOLAR_CANVAS_PREVIEW_UPDATE" &&
      event.data.version === 1 &&
      (!standalone || event.data.handoffToken === handoffToken) &&
      window.SCHOLAR_CANVAS_SETUP &&
      window.SCHOLAR_CANVAS_SETUP.validators &&
      window.SCHOLAR_CANVAS_SETUP.validators.validatePreviewPayload(event.data.payload)
    );
  }

  function revokeRuntimeObjectUrls() {
    runtimeObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    runtimeObjectUrls = [];
  }

  function validRuntimeFile(file, kind) {
    if (!(file instanceof File)) return null;
    const result = kind === "avatar" ? window.SCHOLAR_CANVAS_SETUP.validators.avatarFile(file) : window.SCHOLAR_CANVAS_SETUP.validators.cvFile(file);
    return result.valid ? file : null;
  }

  function applyRuntimeFiles(value, files) {
    revokeRuntimeObjectUrls();
    const runtimeFiles = files && typeof files === "object" ? files : {};
    const avatar = validRuntimeFile(runtimeFiles.avatar, "avatar");
    const cv = validRuntimeFile(runtimeFiles.cv, "cv");
    if (avatar) {
      const avatarUrl = URL.createObjectURL(avatar);
      runtimeObjectUrls.push(avatarUrl);
      value.profile.avatar = avatarUrl;
    }
    if (cv) {
      const cvUrl = URL.createObjectURL(cv);
      runtimeObjectUrls.push(cvUrl);
      value.profile.links = value.profile.links || {};
      value.profile.links.cv = cvUrl;
    }
  }

  function applyPayload(payload, files) {
    if (!window.SCHOLAR_CANVAS_SETUP.validators.validatePreviewPayload(payload)) return false;
    const value = clone(payload);
    applyRuntimeFiles(value, files);
    ["site", "profile", "news", "publications", "projects", "experience", "awards", "skills", "teaching", "service"].forEach((key) => {
      namespace[key] = value[key];
    });
    if (!namespace.state || !namespace.renderer) {
      pending = { payload, files };
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
    const host = messageHost();
    if (applyPayload(event.data.payload, event.data.files) && host) {
      host.postMessage({ type: "SCHOLAR_CANVAS_PREVIEW_APPLIED", version: 1, handoffToken: standalone ? handoffToken : undefined }, window.location.protocol === "file:" ? "*" : window.location.origin);
      if (standalone) window.setTimeout(() => { window.opener = null; }, 0);
    }
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
    if (pending) applyPayload(pending.payload, pending.files);
    const host = messageHost();
    if (host) host.postMessage({ type: standalone ? "SCHOLAR_CANVAS_STANDALONE_PREVIEW_READY" : "SCHOLAR_CANVAS_PREVIEW_READY", version: 1, handoffToken: standalone ? handoffToken : undefined }, window.location.protocol === "file:" ? "*" : window.location.origin);
  }, { once: true });
  window.addEventListener("beforeunload", revokeRuntimeObjectUrls, { once: true });

  window.SCHOLAR_CANVAS_PREVIEW = { allowedOrigin, isValidMessage, applyPayload };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
