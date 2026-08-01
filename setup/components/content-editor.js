(function initContentEditor(namespace) {
  "use strict";
  const { h, t, sectionTitle } = namespace.ui;

  function render(state) {
    const language = state.language;
    const enabled = namespace.schema.sectionKeys.filter((key) => state.sections[key]);
    const modules = enabled.length ? enabled : namespace.schema.sectionKeys;
    const active = modules.includes(state.activeModule) ? state.activeModule : modules[0];
    if (active !== state.activeModule) state.activeModule = active;
    return h("div", { class: "setup-step setup-step--content" },
      sectionTitle(language === "en" ? "Step 4" : "第 4 步", language === "en" ? "Build your academic story" : "编写你的学术故事", language === "en" ? "Add, reorder, duplicate, and refine each entry. Disabled modules keep their content safely." : "新增、排序、复制并完善每条内容；已关闭模块的内容仍会安全保留。"),
      h("div", { class: "setup-module-tabs", role: "tablist", "aria-label": language === "en" ? "Content modules" : "内容模块" }, modules.map((key) => h("button", {
        type: "button",
        role: "tab",
        class: active === key ? "is-active" : "",
        "aria-selected": String(active === key),
        dataset: { action: "select-module", module: key }
      }, h("span", { text: t(namespace.schema.sectionLabels[key], language) }), h("small", { text: String((state.content[key] || []).length) })))),
      namespace.components.repeaterEditor.render(state, active)
    );
  }

  namespace.components.contentEditor = { render };
})(window.SCHOLAR_CANVAS_SETUP);
