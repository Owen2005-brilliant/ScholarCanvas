(function initWelcome(namespace) {
  "use strict";
  const { h, t, icon, sectionTitle } = namespace.ui;

  function sourceCard(id, title, description, iconName, selected) {
    return h("label", { class: `setup-choice-card${selected ? " is-selected" : ""}` },
      h("input", { type: "radio", name: "setup-source", value: id, checked: selected, dataset: { action: "choose-source" } }),
      h("span", { class: "setup-choice-card__icon" }, icon(iconName)),
      h("span", { class: "setup-choice-card__body" }, h("strong", { text: title }), h("span", { text: description })),
      h("span", { class: "setup-choice-card__check" }, icon("check"))
    );
  }

  function modeCard(mode, title, description, modules, selected) {
    return h("label", { class: `setup-mode-card setup-mode-card--${mode}${selected ? " is-selected" : ""}` },
      h("input", { type: "radio", name: "setup-mode", value: mode, checked: selected, dataset: { action: "set-mode" } }),
      h("span", { class: "setup-mode-card__top" },
        h("span", { class: "setup-mode-card__mark", text: mode === "student" ? "S" : "R" }),
        h("span", {}, h("strong", { text: title }), h("small", { text: description }))
      ),
      h("span", { class: "setup-mode-card__modules", text: modules })
    );
  }

  function render(state) {
    const language = state.language;
    const hasDraft = namespace.importer.hasDraft();
    return h("div", { class: "setup-step setup-step--welcome" },
      sectionTitle(
        language === "en" ? "Seven calm steps" : "七个清晰步骤",
        language === "en" ? "Make ScholarCanvas unmistakably yours" : "把 ScholarCanvas 变成你的主页",
        language === "en" ? "Choose a starting point, fill in your academic story, preview the real site, and export a ready-to-use configuration — all without uploading anything." : "选择起点、填写学术故事、实时预览真实主页，并导出可直接使用的配置。全过程不会上传你的数据。"
      ),
      h("div", { class: "setup-privacy-note" }, icon("shield"),
        h("div", {}, h("strong", { text: language === "en" ? "Private by design" : "隐私优先" }), h("p", { text: t(namespace.schema.copy.privacy, language) }))
      ),
      hasDraft ? h("div", { class: "setup-resume" },
        h("div", {}, h("strong", { text: language === "en" ? "A saved draft is available" : "发现已保存的草稿" }), h("p", { text: language === "en" ? "Continue where you left off on this browser." : "可继续此浏览器中上次未完成的配置。" })),
        h("button", { class: "setup-text-button", type: "button", dataset: { action: "load-draft" }, text: language === "en" ? "Resume draft" : "恢复草稿" })
      ) : null,
      h("fieldset", { class: "setup-choice-fieldset" },
        h("legend", { text: language === "en" ? "1. Choose a starting point" : "1. 选择起点" }),
        h("div", { class: "setup-choice-grid" },
          sourceCard("minimal", language === "en" ? "Start minimal" : "从最小配置开始", language === "en" ? "Safe placeholders, only recommended sections." : "安全占位内容，仅开启推荐模块。", "plus", state.source === "minimal"),
          sourceCard("current", language === "en" ? "Use current site" : "导入当前主页", language === "en" ? "Continue with the data already in this repository." : "读取当前仓库已有的全部数据。", "refresh", state.source === "current" || state.source === "demo"),
          sourceCard("import", language === "en" ? "Import a draft" : "导入草稿", language === "en" ? "Open a ScholarCanvas setup JSON file." : "打开之前导出的初始化器 JSON。", "upload", false)
        ),
        h("div", { class: "setup-import-action" }, namespace.ui.button(language === "en" ? "Choose setup JSON" : "选择草稿 JSON", { icon: "upload", dataset: { action: "open-draft-file" } }))
      ),
      h("fieldset", { class: "setup-choice-fieldset" },
        h("legend", { text: language === "en" ? "2. Pick a homepage mode" : "2. 选择主页模式" }),
        h("div", { class: "setup-mode-grid" },
          modeCard("student", language === "en" ? "Student Mode" : "学生模式", language === "en" ? "For study, internships, and growing portfolios" : "适合学习、实习与成长型作品集", language === "en" ? "Projects · Experience · Awards · Skills" : "项目 · 经历 · 奖项 · 技能", state.mode === "student"),
          modeCard("researcher", language === "en" ? "Researcher Mode" : "研究者模式", language === "en" ? "For publications and academic activity" : "适合论文与持续学术活动", language === "en" ? "News · Publications · Teaching · Service" : "动态 · 论文 · 教学 · 学术服务", state.mode === "researcher")
        )
      ),
      h("input", { id: "setup-draft-input", class: "setup-hidden-input", type: "file", accept: "application/json,.json", dataset: { fileAction: "import-draft" } })
    );
  }

  namespace.components.welcome = { render };
})(window.SCHOLAR_CANVAS_SETUP);
