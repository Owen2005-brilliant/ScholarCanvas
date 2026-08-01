(function initTheme(namespace) {
  "use strict";

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function initialTheme(site) {
    const stored = namespace.i18n.safeStorageGet("scholarCanvas.theme");
    if (stored === "light" || stored === "dark") return stored;
    const configured = site && site.defaultTheme;
    if (configured === "light" || configured === "dark") return configured;
    return systemTheme();
  }

  function apply(theme, persist) {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === "dark" ? "#0d1724" : (namespace.state && namespace.state.mode === "researcher" ? "#fafaf9" : "#fffdf8");
    if (namespace.state) namespace.state.theme = next;
    if (persist) namespace.i18n.safeStorageSet("scholarCanvas.theme", next);
    return next;
  }

  function toggle() {
    return apply(namespace.state && namespace.state.theme === "dark" ? "light" : "dark", true);
  }

  function watchSystem() {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      const stored = namespace.i18n.safeStorageGet("scholarCanvas.theme");
      if (!stored && namespace.site && namespace.site.defaultTheme === "system") apply(event.matches ? "dark" : "light", false);
    };
    if (media.addEventListener) media.addEventListener("change", handleChange);
  }

  namespace.theme = { initialTheme, apply, toggle, watchSystem };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
