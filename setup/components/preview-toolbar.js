(function initPreviewToolbar(namespace) {
  "use strict";
  const { h, icon } = namespace.ui;

  function compactButton(label, value, current, action, extra) {
    return h("button", { type: "button", class: current === value ? "is-active" : "", "aria-pressed": String(current === value), title: label, dataset: Object.assign({ action, value }, extra || {}) }, h("span", { text: label }));
  }

  function render(state) {
    const language = state.language;
    return h("div", { class: "setup-preview-toolbar", "aria-label": language === "en" ? "Preview controls" : "预览控制" },
      h("div", { class: "setup-preview-toolbar__group" },
        compactButton(language === "en" ? "Student" : "学生", "student", state.mode, "preview-mode"),
        compactButton(language === "en" ? "Researcher" : "研究者", "researcher", state.mode, "preview-mode")
      ),
      h("div", { class: "setup-preview-toolbar__group" },
        compactButton("中", "zh", state.language, "preview-language"),
        compactButton("EN", "en", state.language, "preview-language")
      ),
      h("div", { class: "setup-preview-toolbar__group" },
        compactButton(language === "en" ? "Light" : "浅色", "light", state.site.defaultTheme, "preview-theme"),
        compactButton(language === "en" ? "Dark" : "深色", "dark", state.site.defaultTheme, "preview-theme"),
        compactButton(language === "en" ? "System" : "系统", "system", state.site.defaultTheme, "preview-theme")
      ),
      h("div", { class: "setup-preview-toolbar__group setup-preview-toolbar__devices" },
        compactButton(language === "en" ? "Desktop" : "桌面", "desktop", state.previewDevice, "preview-device"),
        compactButton(language === "en" ? "Tablet" : "平板", "tablet", state.previewDevice, "preview-device"),
        compactButton(language === "en" ? "Mobile" : "手机", "mobile", state.previewDevice, "preview-device")
      ),
      h("button", { type: "button", class: "setup-preview-toolbar__icon", title: language === "en" ? "Refresh preview" : "刷新预览", "aria-label": language === "en" ? "Refresh preview" : "刷新预览", dataset: { action: "refresh-preview" } }, icon("refresh"))
    );
  }

  namespace.components.previewToolbar = { render };
})(window.SCHOLAR_CANVAS_SETUP);
