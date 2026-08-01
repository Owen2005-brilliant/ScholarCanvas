(function initApp(namespace) {
  "use strict";

  function initialMode() {
    const configured = namespace.site && namespace.site.mode === "researcher" ? "researcher" : "student";
    if (!namespace.site || !namespace.site.enableModePreviewSwitch) return configured;
    const stored = namespace.i18n.safeStorageGet("scholarCanvas.previewMode");
    return stored === "student" || stored === "researcher" ? stored : configured;
  }

  function render() {
    namespace.renderer.renderPage();
  }

  function setLanguage(language) {
    namespace.state.language = language === "en" ? "en" : "zh";
    namespace.i18n.safeStorageSet("scholarCanvas.language", namespace.state.language);
    render();
  }

  function toggleLanguage() {
    setLanguage(namespace.state.language === "zh" ? "en" : "zh");
  }

  function setMode(mode) {
    namespace.state.mode = mode === "researcher" ? "researcher" : "student";
    if (namespace.site.enableModePreviewSwitch) namespace.i18n.safeStorageSet("scholarCanvas.previewMode", namespace.state.mode);
    namespace.state.publicationTag = "all";
    namespace.state.projectTag = "";
    render();
    window.scrollTo({ top: 0, behavior: namespace.accessibility.prefersReducedMotion() ? "auto" : "smooth" });
  }

  function toggleMode() {
    setMode(namespace.state.mode === "student" ? "researcher" : "student");
  }

  function toggleTheme() {
    namespace.theme.toggle();
    render();
  }

  function bootstrap() {
    namespace.site = namespace.site || {};
    namespace.profile = namespace.profile || {};
    namespace.news = Array.isArray(namespace.news) ? namespace.news : [];
    namespace.publications = Array.isArray(namespace.publications) ? namespace.publications : [];
    namespace.projects = Array.isArray(namespace.projects) ? namespace.projects : [];
    namespace.experience = Array.isArray(namespace.experience) ? namespace.experience : [];
    namespace.awards = Array.isArray(namespace.awards) ? namespace.awards : [];
    namespace.skills = Array.isArray(namespace.skills) ? namespace.skills : [];
    namespace.teaching = Array.isArray(namespace.teaching) ? namespace.teaching : [];
    namespace.service = Array.isArray(namespace.service) ? namespace.service : [];

    namespace.state = {
      language: namespace.i18n.initialLanguage(namespace.site),
      mode: initialMode(),
      theme: namespace.theme.initialTheme(namespace.site),
      publicationTag: "all",
      projectTag: "",
      expandedNews: false,
      expandedAuthors: new Set()
    };

    namespace.theme.apply(namespace.state.theme, false);
    namespace.theme.watchSystem();
    namespace.interactions.bindGlobal();
    render();
  }

  namespace.app = { bootstrap, render, setLanguage, toggleLanguage, setMode, toggleMode, toggleTheme };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  else bootstrap();
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
