(function initExportPanel(namespace) {
  "use strict";
  const { h, t, icon, button, sectionTitle, errorSummary } = namespace.ui;

  function row(label, value, status) {
    return h("div", { class: "setup-review-row" }, h("span", { class: `setup-review-row__status setup-review-row__status--${status || "ok"}` }, icon(status === "warning" ? "warning" : "check")), h("div", {}, h("small", { text: label }), h("strong", { text: value })));
  }

  function render(state, validation) {
    const language = state.language;
    const activeSections = namespace.schema.sectionKeys.filter((key) => state.sections[key]);
    const itemCount = namespace.schema.sectionKeys.reduce((sum, key) => sum + (state.content[key] || []).length, 0);
    const runtimeFiles = namespace.store.getRuntimeFiles();
    const result = validation || namespace.validators.validateState(state);
    const fileSystemSupported = namespace.fileSystem.supported();
    return h("div", { class: "setup-step setup-step--export" },
      sectionTitle(language === "en" ? "Step 7" : "第 7 步", language === "en" ? "Review once, then take your site with you" : "最后检查，然后带走你的主页", language === "en" ? "Export is always available as a ZIP. Supported browsers may also write only approved files into a ScholarCanvas folder after confirmation." : "始终可下载 ZIP；受支持的浏览器还可在确认后，仅将允许的文件写入 ScholarCanvas 文件夹。"),
      errorSummary(result.errors, language),
      h("div", { class: "setup-review-grid" },
        row(language === "en" ? "Homepage mode" : "主页模式", state.mode === "student" ? "Student" : "Researcher"),
        row(language === "en" ? "Public URL" : "公开地址", namespace.serializer.computeSiteUrl(state.site)),
        row(language === "en" ? "Enabled sections" : "已开启模块", activeSections.map((key) => t(namespace.schema.sectionLabels[key], language)).join(" · ") || (language === "en" ? "None" : "无"), activeSections.length ? "ok" : "warning"),
        row(language === "en" ? "Content" : "内容", language === "en" ? `${itemCount} entries` : `${itemCount} 项`),
        row(language === "en" ? "Avatar" : "头像", runtimeFiles.avatar ? runtimeFiles.avatar.name : state.profile.avatar),
        row(language === "en" ? "CV" : "简历", runtimeFiles.cv ? runtimeFiles.cv.name : (language === "en" ? "Not included" : "未包含"), runtimeFiles.cv ? "ok" : "warning")
      ),
      result.warnings.length ? h("details", { class: "setup-warning-list" }, h("summary", { text: language === "en" ? `${result.warnings.length} notes` : `${result.warnings.length} 条提示` }), h("ul", {}, result.warnings.map((warning) => h("li", { text: t(warning.message, language) })))) : null,
      h("section", { class: `setup-export-card${result.valid ? " is-ready" : ""}` },
        h("div", { class: "setup-export-card__icon" }, icon(result.valid ? "check" : "warning")),
        h("div", { class: "setup-export-card__body" },
          h("h2", { text: result.valid ? t(namespace.schema.copy.ready, language) : t(namespace.schema.copy.errorsTitle, language) }),
          h("p", { text: result.valid ? (language === "en" ? "Your bundle includes all data scripts, SEO files, an export report, and selected files." : "配置包包含全部数据脚本、SEO 文件、导出报告与所选文件。") : (language === "en" ? "Fix the highlighted fields before exporting." : "请先修正标记的字段再导出。") }),
          h("div", { class: "setup-export-actions" },
            button(t(namespace.schema.copy.downloadZip, language), { variant: "primary", icon: "download", disabled: !result.valid || state.exportStatus === "working", dataset: { action: "download-config" } }),
            button(t(namespace.schema.copy.writeFolder, language), { icon: "folder", disabled: !result.valid || !fileSystemSupported || state.exportStatus === "working", dataset: { action: "write-folder" } })
          ),
          !fileSystemSupported ? h("p", { class: "setup-export-card__support", text: t(namespace.schema.copy.unsupportedFolder, language) }) : null,
          h("p", { class: "setup-export-card__support", text: language === "en" ? "The new-tab preview uses the current form. index.html changes only after you apply or replace the exported files." : "新标签页预览会显示当前表单；只有应用或替换导出文件后，index.html 才会更新。" }),
          h("div", { id: "setup-export-progress", class: "setup-export-progress", hidden: state.exportStatus !== "working" }, h("span", { style: { width: "0%" } }), h("output", { text: language === "en" ? "Preparing files…" : "正在准备文件…" }))
        )
      ),
      h("section", { class: "setup-next-steps" },
        h("h2", { text: language === "en" ? "After export" : "导出后" }),
        h("ol", {},
          h("li", { text: language === "en" ? "Replace the matching files in your ScholarCanvas repository." : "将配置包中的同名文件替换到 ScholarCanvas 仓库。" }),
          h("li", { text: language === "en" ? "Open index.html locally or push the repository to GitHub Pages." : "本地打开 index.html，或推送仓库到 GitHub Pages。" }),
          h("li", { text: language === "en" ? "Run python3 tools/validate_config.py before publishing." : "发布前运行 python3 tools/validate_config.py。" })
        )
      )
    );
  }

  namespace.components.exportPanel = { render };
})(window.SCHOLAR_CANVAS_SETUP);
