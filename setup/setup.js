(function initScholarCanvasSetup(namespace) {
  "use strict";

  const { h, t, icon, button, toast, announce } = namespace.ui;
  const app = document.getElementById("setup-app");
  let visibleErrors = [];
  let setupTheme = localStorage.getItem("scholarCanvas.setupTheme") || "light";

  function applySetupTheme() {
    const resolved = setupTheme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : setupTheme;
    document.documentElement.dataset.setupTheme = resolved;
  }

  function sourceStatus(state) {
    if (state.draftSaved) return t(namespace.schema.copy.currentSaved, state.language);
    if (state.dirty) return t(namespace.schema.copy.unsaved, state.language);
    return state.language === "en" ? "Ready" : "已就绪";
  }

  function header(state) {
    const language = state.language;
    return h("header", { class: "setup-header" },
      h("a", { class: "setup-brand", href: "index.html", "aria-label": "ScholarCanvas homepage" },
        h("span", { class: "setup-brand__mark", text: "SC" }),
        h("span", {}, h("strong", { text: "ScholarCanvas" }), h("small", { text: language === "en" ? "Visual Setup" : "可视化初始化器" }))
      ),
      h("div", { class: "setup-header__status", title: sourceStatus(state) }, h("span", { class: state.dirty ? "is-dirty" : "" }), h("span", { text: sourceStatus(state) })),
      h("div", { class: "setup-header__actions" },
        h("div", { class: "setup-header__language", "aria-label": language === "en" ? "Interface language" : "界面语言" },
          h("button", { type: "button", class: language === "zh" ? "is-active" : "", "aria-pressed": String(language === "zh"), dataset: { action: "preview-language", value: "zh" }, text: "中" }),
          h("button", { type: "button", class: language === "en" ? "is-active" : "", "aria-pressed": String(language === "en"), dataset: { action: "preview-language", value: "en" }, text: "EN" })
        ),
        button(t(namespace.schema.copy.saveDraft, language), { variant: "quiet", icon: "save", className: "setup-header__save", dataset: { action: "save-draft" } }),
        h("button", { class: "setup-icon-button", type: "button", title: language === "en" ? "Change setup theme" : "切换初始化器主题", "aria-label": language === "en" ? "Change setup theme" : "切换初始化器主题", dataset: { action: "cycle-setup-theme" } }, icon(setupTheme === "dark" ? "moon" : "sun")),
        h("button", { class: "setup-icon-button setup-mobile-menu-button", type: "button", title: language === "en" ? "Open progress" : "打开进度", "aria-label": language === "en" ? "Open progress" : "打开进度", "aria-expanded": "false", dataset: { action: "toggle-mobile-steps" } }, icon("menu"))
      )
    );
  }

  function stepContent(state) {
    const stepId = namespace.schema.steps[state.currentStep].id;
    const renderers = {
      welcome: namespace.components.welcome.render,
      profile: namespace.components.identityForm.render,
      sections: namespace.components.sectionSelector.render,
      content: namespace.components.contentEditor.render,
      appearance: namespace.components.brandingForm.renderAppearance,
      website: namespace.components.brandingForm.renderWebsite,
      review: (value) => namespace.components.exportPanel.render(value, namespace.validators.validateState(value))
    };
    const content = renderers[stepId](state);
    if (visibleErrors.length && stepId !== "review") content.prepend(namespace.ui.errorSummary(visibleErrors, state.language));
    return content;
  }

  function footer(state) {
    const language = state.language;
    const last = state.currentStep === namespace.schema.steps.length - 1;
    return h("footer", { class: "setup-editor-footer" },
      h("div", { class: "setup-editor-footer__tools" },
        h("button", { type: "button", class: "setup-text-button", dataset: { action: "restore" }, text: t(namespace.schema.copy.restore, language) }),
        h("span", { "aria-hidden": "true", text: "·" }),
        h("button", { type: "button", class: "setup-text-button", dataset: { action: "export-draft" }, text: t(namespace.schema.copy.exportDraft, language) }),
        namespace.importer.hasDraft() ? h("button", { type: "button", class: "setup-text-button setup-text-button--danger", dataset: { action: "clear-draft" }, text: t(namespace.schema.copy.clearDraft, language) }) : null
      ),
      h("div", { class: "setup-editor-footer__nav" },
        button(t(namespace.schema.copy.back, language), { icon: "arrowLeft", disabled: state.currentStep === 0, dataset: { action: "previous-step" } }),
        !last ? button(t(namespace.schema.copy.continue, language), { variant: "primary", icon: "arrowRight", dataset: { action: "next-step" } }) : h("a", { class: "setup-button setup-button--primary", href: "index.html" }, h("span", { text: language === "en" ? "Open homepage" : "打开主页" }), icon("arrowRight"))
      )
    );
  }

  function preview(state) {
    const language = state.language;
    return h("aside", { class: `setup-preview setup-preview--${state.previewDevice}${state.mobilePane === "preview" ? " is-mobile-active" : ""}`, "aria-label": language === "en" ? "Live homepage preview" : "主页实时预览" },
      h("header", { class: "setup-preview__heading" }, h("div", {}, h("span", { class: "setup-live-dot" }), h("strong", { text: language === "en" ? "Live homepage" : "主页实时预览" })), h("small", { text: language === "en" ? "Rendered by ScholarCanvas" : "由 ScholarCanvas 真实渲染" })),
      namespace.components.previewToolbar.render(state),
      h("div", { class: "setup-preview__stage" },
        h("div", { class: "setup-preview__browser" },
          h("div", { class: "setup-preview__browser-bar", "aria-hidden": "true" }, h("span"), h("span"), h("span"), h("code", { text: namespace.serializer.computeSiteUrl(state.site) })),
          h("iframe", { id: "setup-preview-frame", title: language === "en" ? "ScholarCanvas live preview" : "ScholarCanvas 实时预览", src: "setup/preview/index.html?v=1.1.0", sandbox: "allow-scripts allow-same-origin" })
        )
      )
    );
  }

  function mobilePaneTabs(state) {
    const language = state.language;
    return h("div", { class: "setup-mobile-pane-tabs", role: "tablist", "aria-label": language === "en" ? "Edit or preview" : "编辑或预览" },
      h("button", { type: "button", role: "tab", class: state.mobilePane === "edit" ? "is-active" : "", "aria-selected": String(state.mobilePane === "edit"), dataset: { action: "mobile-pane", pane: "edit" } }, icon("file"), h("span", { text: t(namespace.schema.copy.edit, language) })),
      h("button", { type: "button", role: "tab", class: state.mobilePane === "preview" ? "is-active" : "", "aria-selected": String(state.mobilePane === "preview"), dataset: { action: "mobile-pane", pane: "preview" } }, icon("eye"), h("span", { text: t(namespace.schema.copy.preview, language) }))
    );
  }

  function render(options) {
    const state = namespace.store.get();
    const settings = options || {};
    const focusedPath = settings.keepPath && document.activeElement && document.activeElement.dataset && document.activeElement.dataset.path;
    app.replaceChildren(
      header(state),
      namespace.components.stepper.mobileProgress(state),
      mobilePaneTabs(state),
      h("div", { class: "setup-shell" },
        h("aside", { class: "setup-sidebar" }, namespace.components.stepper.render(state), h("div", { class: "setup-sidebar__privacy" }, icon("shield"), h("p", { text: state.language === "en" ? "Local-only processing. Nothing is uploaded." : "仅在本地处理，不会上传任何内容。" }))),
        h("div", { class: "setup-workspace" },
          h("main", { id: "setup-main", class: `setup-editor${state.mobilePane === "edit" ? " is-mobile-active" : ""}`, tabindex: "-1" }, h("div", { class: "setup-editor__scroll" }, stepContent(state)), footer(state)),
          preview(state)
        )
      )
    );
    app.setAttribute("aria-busy", "false");
    const frame = document.getElementById("setup-preview-frame");
    namespace.previewBridge.attach(frame);
    namespace.previewBridge.schedule();
    if (focusedPath) {
      const target = app.querySelector(`[data-path="${CSS.escape(focusedPath)}"]`);
      if (target) target.focus();
    }
  }

  function markErrors(errors) {
    visibleErrors = errors || [];
    visibleErrors.forEach((error) => {
      const control = app.querySelector(`[data-path="${CSS.escape(error.path)}"]`);
      const message = t(error.message, namespace.store.get().language);
      const errorNode = app.querySelector(`[data-error-for="${CSS.escape(error.path)}"]`);
      if (control) control.setAttribute("aria-invalid", "true");
      if (errorNode) { errorNode.textContent = message; errorNode.hidden = false; }
    });
  }

  function focusError(path) {
    const control = app.querySelector(`[data-path="${CSS.escape(path)}"]`);
    if (control) { control.focus(); control.scrollIntoView({ block: "center", behavior: "smooth" }); }
  }

  function validateCurrent() {
    const state = namespace.store.get();
    const step = namespace.schema.steps[state.currentStep].id;
    const result = namespace.validators.validateStep(state, step);
    visibleErrors = result.errors;
    if (!result.valid) {
      render();
      markErrors(result.errors);
      const summary = document.getElementById("setup-error-summary");
      if (summary) summary.focus();
      announce(t(namespace.schema.copy.errorsTitle, state.language));
    }
    return result.valid;
  }

  function goStep(index, force) {
    const state = namespace.store.get();
    const target = Math.max(0, Math.min(namespace.schema.steps.length - 1, Number(index)));
    if (!force && target > state.currentStep && !validateCurrent()) return;
    visibleErrors = [];
    namespace.store.update("currentStep", target, { dirty: false, reason: "navigation" });
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      const title = document.getElementById("setup-step-title");
      if (title) { title.setAttribute("tabindex", "-1"); title.focus(); }
    }, 0);
  }

  function fieldValue(control) {
    if (control.type === "checkbox") return control.checked;
    if (control.dataset.valueType === "number") return control.value === "" ? "" : Number(control.value);
    return control.value;
  }

  function validateTouched(path) {
    const state = namespace.store.get();
    const result = namespace.validators.validateState(state);
    const error = result.errors.find((item) => item.path === path);
    const control = app.querySelector(`[data-path="${CSS.escape(path)}"]`);
    const errorNode = app.querySelector(`[data-error-for="${CSS.escape(path)}"]`);
    if (control) control.setAttribute("aria-invalid", String(Boolean(error)));
    if (errorNode) {
      errorNode.hidden = !error;
      errorNode.textContent = error ? t(error.message, state.language) : "";
    }
  }

  async function loadDraft() {
    try {
      const result = await namespace.importer.loadDraft();
      if (!result.valid) throw new Error(t(result.message, namespace.store.get().language));
      namespace.store.clearRuntimeFiles();
      namespace.store.replace(result.state, { clean: true });
      if (result.runtimeFiles.avatar) namespace.store.setRuntimeFile("avatar", result.runtimeFiles.avatar, URL.createObjectURL(result.runtimeFiles.avatar));
      if (result.runtimeFiles.cv) namespace.store.setRuntimeFile("cv", result.runtimeFiles.cv, "");
      namespace.store.get().draftSaved = true;
      namespace.store.get().dirty = false;
      render();
      toast(namespace.store.get().language === "en" ? "Draft restored." : "草稿已恢复。");
    } catch (error) {
      toast(error.message || "Could not load draft", "error");
    }
  }

  async function handleFile(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const action = input.dataset.fileAction;
    if (action === "import-draft") {
      try {
        const result = await namespace.importer.importDraftFile(file);
        if (!result.valid) throw new Error(t(result.message, namespace.store.get().language));
        namespace.store.clearRuntimeFiles();
        namespace.store.replace(result.state);
        visibleErrors = [];
        render();
        toast(namespace.store.get().language === "en" ? "Draft imported." : "草稿已导入。");
      } catch (error) { toast(error.message || "Could not import draft", "error"); }
      return;
    }
    const validation = action === "avatar" ? namespace.validators.avatarFile(file) : namespace.validators.cvFile(file);
    if (!validation.valid) { toast(t(validation.message, namespace.store.get().language), "error"); input.value = ""; return; }
    const objectUrl = action === "avatar" ? URL.createObjectURL(file) : "";
    namespace.store.setRuntimeFile(action, file, objectUrl);
    if (action === "avatar") namespace.store.update("profile.avatar", namespace.serializer.avatarExportPath({ avatar: file }), { reason: "file" });
    if (action === "cv") namespace.store.update("profile.links.cv", "assets/files/cv.pdf", { reason: "file" });
    render();
    toast(namespace.store.get().language === "en" ? "File added locally." : "文件已在本地添加。");
  }

  function updateProgress(progress, label) {
    const element = document.getElementById("setup-export-progress");
    if (!element) return;
    element.hidden = false;
    const percent = progress.percent || Math.round(((progress.completed || 0) / Math.max(progress.total || 1, 1)) * 100);
    element.querySelector("span").style.width = `${percent}%`;
    element.querySelector("output").textContent = label || `${percent}%`;
  }

  async function downloadConfig() {
    const state = namespace.store.get();
    state.exportStatus = "working";
    render();
    try {
      const result = await namespace.exporter.downloadConfiguration(state, namespace.store.getRuntimeFiles(), (progress) => updateProgress(progress, state.language === "en" ? `Packing ${progress.completed} of ${progress.total} files…` : `正在打包 ${progress.completed} / ${progress.total} 个文件…`));
      state.exportStatus = "complete";
      render();
      toast(state.language === "en" ? `${result.names.length} files exported.` : `已导出 ${result.names.length} 个文件。`);
    } catch (error) {
      state.exportStatus = "error";
      render();
      toast(state.language === "en" ? "Export failed. Check the highlighted fields." : "导出失败，请检查标记字段。", "error");
    }
  }

  async function writeFolder() {
    const state = namespace.store.get();
    try {
      const entries = await namespace.exporter.buildEntries(state, namespace.store.getRuntimeFiles());
      const root = await namespace.fileSystem.chooseFolder();
      if (!await namespace.fileSystem.looksLikeScholarCanvas(root)) throw new Error("NOT_SCHOLARCANVAS");
      const confirmed = await namespace.components.confirmationDialog.confirm({
        title: state.language === "en" ? "Apply configuration to this folder?" : "将配置应用到此文件夹？",
        description: state.language === "en" ? "Only the approved files below will be written. Existing versions are backed up under .backup/." : "仅会写入下列允许文件；已有版本会备份到 .backup/。",
        list: entries.map((entry) => entry.name),
        confirmLabel: state.language === "en" ? "Back up and apply" : "备份并应用",
        cancelLabel: state.language === "en" ? "Cancel" : "取消",
        icon: "folder"
      });
      if (!confirmed) return;
      state.exportStatus = "working";
      render();
      const result = await namespace.fileSystem.applyEntries(root, entries, (progress) => updateProgress(progress, progress.path));
      state.exportStatus = "complete";
      render();
      toast(state.language === "en" ? `${result.written.length} files written. Backup: ${result.backup}` : `已写入 ${result.written.length} 个文件；备份：${result.backup}`);
    } catch (error) {
      if (error && error.name === "AbortError") return;
      const message = error.message === "NOT_SCHOLARCANVAS" ? (state.language === "en" ? "Choose the ScholarCanvas repository root." : "请选择 ScholarCanvas 仓库根目录。") : (state.language === "en" ? "The folder could not be updated. Download the ZIP instead." : "无法更新文件夹，请改用下载 ZIP。 ");
      toast(message, "error");
    }
  }

  async function handleAction(target) {
    const action = target.dataset.action;
    const state = namespace.store.get();
    const language = state.language;
    if (action === "next-step") goStep(state.currentStep + 1);
    else if (action === "previous-step") goStep(state.currentStep - 1, true);
    else if (action === "go-step") goStep(Number(target.dataset.step), Number(target.dataset.step) < state.currentStep);
    else if (action === "choose-source") {
      if (target.value === "import") document.getElementById("setup-draft-input").click();
      else { namespace.store.chooseSource(target.value); visibleErrors = []; render(); }
    } else if (action === "set-mode" || action === "preview-mode") { namespace.store.setMode(target.value || target.dataset.value); render(); }
    else if (action === "open-draft-file") document.getElementById("setup-draft-input").click();
    else if (action === "preview-language") {
      state.site.defaultLanguage = target.dataset.value;
      namespace.store.update("language", target.dataset.value, { reason: "selection" });
      render();
    }
    else if (action === "preview-theme") { namespace.store.update("site.defaultTheme", target.dataset.value, { reason: "selection" }); render(); }
    else if (action === "preview-device") { namespace.store.update("previewDevice", target.dataset.value, { dirty: false, reason: "selection" }); render(); }
    else if (action === "refresh-preview") namespace.previewBridge.refresh();
    else if (action === "mobile-pane") { namespace.store.update("mobilePane", target.dataset.pane, { dirty: false, reason: "selection" }); render(); }
    else if (action === "toggle-mobile-steps") {
      const sidebar = app.querySelector(".setup-sidebar");
      const open = sidebar.classList.toggle("is-mobile-open");
      target.setAttribute("aria-expanded", String(open));
    } else if (action === "toggle-section") { namespace.store.setSection(target.dataset.section, target.checked); render(); }
    else if (action === "select-module") { namespace.store.update("activeModule", target.dataset.module, { dirty: false, reason: "selection" }); render(); }
    else if (action === "add-item") { namespace.store.addItem(target.dataset.type); render(); }
    else if (action === "duplicate-item") { namespace.store.duplicateItem(target.dataset.type, Number(target.dataset.index)); render(); }
    else if (action === "move-item") { namespace.store.moveItem(target.dataset.type, Number(target.dataset.index), Number(target.dataset.direction)); render(); }
    else if (action === "remove-item") {
      const confirmed = await namespace.components.confirmationDialog.confirm({ title: language === "en" ? "Delete this item?" : "删除此项内容？", description: language === "en" ? "This removes the item from the current setup state. You can still restore the initial content." : "此项将从当前配置中移除；仍可恢复初始内容。", confirmLabel: language === "en" ? "Delete" : "删除", cancelLabel: language === "en" ? "Cancel" : "取消", tone: "danger" });
      if (confirmed) { namespace.store.removeItem(target.dataset.type, Number(target.dataset.index)); render(); }
    } else if (action === "toggle-collapse") {
      const path = `${target.dataset.type}.${target.dataset.index}`;
      state.collapsedItems[path] = !state.collapsedItems[path];
      namespace.store.notify("layout"); render();
    } else if (action === "add-author") { namespace.store.addAuthor(Number(target.dataset.publication)); render(); }
    else if (action === "move-author") { namespace.store.moveAuthor(Number(target.dataset.publication), Number(target.dataset.author), Number(target.dataset.direction)); render(); }
    else if (action === "remove-author") { namespace.store.removeAuthor(Number(target.dataset.publication), Number(target.dataset.author)); render(); }
    else if (action === "add-interest") {
      state.profile.interests.push({ id: `interest-${state.profile.interests.length + 1}`, label: { zh: "", en: "" }, description: { zh: "", en: "" } });
      state.dirty = true; namespace.store.notify("content"); render();
    } else if (action === "remove-interest") {
      state.profile.interests.splice(Number(target.dataset.index), 1); state.dirty = true; namespace.store.notify("content"); render();
    } else if (action === "move-interest") {
      const index = Number(target.dataset.index);
      const destination = index + Number(target.dataset.direction);
      if (destination >= 0 && destination < state.profile.interests.length) {
        const item = state.profile.interests.splice(index, 1)[0];
        state.profile.interests.splice(destination, 0, item);
        state.dirty = true; namespace.store.notify("content"); render();
      }
    } else if (action === "open-file") document.getElementById(`setup-${target.dataset.kind}-input`).click();
    else if (action === "remove-file") {
      namespace.store.setRuntimeFile(target.dataset.kind, null, "");
      namespace.store.update(target.dataset.kind === "avatar" ? "profile.avatar" : "profile.links.cv", target.dataset.kind === "avatar" ? "assets/avatar/profile-placeholder.svg" : "", { reason: "file" });
      render();
    } else if (action === "set-accent") { namespace.store.update("site.accentColor", target.dataset.color, { reason: "selection" }); render(); }
    else if (action === "save-draft") {
      const confirmed = await namespace.components.confirmationDialog.confirm({ title: language === "en" ? "Save this draft in your browser?" : "在此浏览器保存草稿？", description: t(namespace.schema.copy.privacy, language), confirmLabel: language === "en" ? "Save locally" : "保存在本地", cancelLabel: language === "en" ? "Cancel" : "取消", icon: "save" });
      if (confirmed) { await namespace.importer.saveDraft(state, namespace.store.getRuntimeFiles()); state.dirty = false; state.draftSaved = true; render(); toast(t(namespace.schema.copy.draftSaved, language)); }
    } else if (action === "load-draft") await loadDraft();
    else if (action === "clear-draft") {
      const confirmed = await namespace.components.confirmationDialog.confirm({ title: language === "en" ? "Clear the local draft?" : "清除本地草稿？", description: language === "en" ? "This removes the saved setup state and stored files from this browser. Your current unsaved form stays open." : "这会从浏览器中移除已保存的配置和文件；当前未保存表单仍会保留。", confirmLabel: language === "en" ? "Clear draft" : "清除草稿", cancelLabel: language === "en" ? "Cancel" : "取消", tone: "danger" });
      if (confirmed) { await namespace.importer.clearDraft(); state.draftSaved = false; render(); toast(language === "en" ? "Local draft cleared." : "本地草稿已清除。"); }
    } else if (action === "export-draft") { namespace.importer.exportDraft(state); toast(language === "en" ? "Draft JSON exported." : "草稿 JSON 已导出。"); }
    else if (action === "restore") {
      const confirmed = await namespace.components.confirmationDialog.confirm({ title: language === "en" ? "Restore the starting content?" : "恢复起始内容？", description: language === "en" ? "Current changes in the form will be replaced by the selected starting point." : "当前表单修改将被所选起点的内容替换。", confirmLabel: language === "en" ? "Restore" : "恢复", cancelLabel: language === "en" ? "Cancel" : "取消", tone: "danger" });
      if (confirmed) { namespace.store.clearRuntimeFiles(); namespace.store.restoreOriginal(); visibleErrors = []; render(); }
    } else if (action === "download-config") await downloadConfig();
    else if (action === "write-folder") await writeFolder();
    else if (action === "focus-path") focusError(target.dataset.focusPath);
    else if (action === "cycle-setup-theme") {
      setupTheme = setupTheme === "light" ? "dark" : setupTheme === "dark" ? "system" : "light";
      localStorage.setItem("scholarCanvas.setupTheme", setupTheme); applySetupTheme(); render();
    }
  }

  app.addEventListener("input", (event) => {
    const control = event.target.closest("[data-path]");
    if (!control) return;
    const nextValue = fieldValue(control);
    if (control.dataset.path === "language") namespace.store.get().site.defaultLanguage = nextValue;
    const interestName = control.dataset.path.match(/^profile\.interests\.(\d+)\.label\.en$/);
    if (interestName) {
      const interest = namespace.store.get().profile.interests[Number(interestName[1])];
      if (interest && (!interest.id || /^interest-\d+$/.test(interest.id))) interest.id = namespace.stateUtils.slugify(nextValue, `interest-${Number(interestName[1]) + 1}`);
    }
    namespace.store.update(control.dataset.path, nextValue, { reason: "field" });
    if (["site.githubUsername", "site.repositoryName", "site.customUrl"].includes(control.dataset.path)) {
      const generatedUrl = namespace.serializer.computeSiteUrl(namespace.store.get().site);
      app.querySelectorAll(".setup-url-preview code, .setup-preview__browser-bar code").forEach((node) => { node.textContent = generatedUrl; });
    }
    if (control.dataset.path === "site.accentColor") {
      const previewSample = app.querySelector(".setup-brand-preview");
      if (previewSample) previewSample.style.setProperty("--setup-accent-preview", nextValue);
    }
    namespace.previewBridge.schedule();
    const status = app.querySelector(".setup-header__status");
    if (status) status.replaceChildren(h("span", { class: "is-dirty" }), h("span", { text: sourceStatus(namespace.store.get()) }));
  });
  app.addEventListener("change", (event) => {
    const fileInput = event.target.closest("[data-file-action]");
    if (fileInput) { handleFile(fileInput); return; }
    const action = event.target.closest("[data-action]");
    if (action && ["choose-source", "set-mode", "toggle-section"].includes(action.dataset.action)) handleAction(action);
    const control = event.target.closest("[data-path]");
    if (control && (control.type === "radio" || control.type === "checkbox")) render();
  });
  app.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target || ["choose-source", "set-mode", "toggle-section"].includes(target.dataset.action) && (target.type === "radio" || target.type === "checkbox")) return;
    event.preventDefault();
    handleAction(target);
  });
  app.addEventListener("focusout", (event) => {
    const control = event.target.closest("[data-path]");
    if (control) validateTouched(control.dataset.path);
  });
  window.addEventListener("beforeunload", (event) => {
    if (!namespace.store.get().dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (setupTheme === "system") applySetupTheme(); });
  namespace.store.subscribe((_state, reason) => { if (reason !== "field") namespace.previewBridge.schedule(); });

  applySetupTheme();
  render();
  namespace.app = { render, goStep, validateCurrent, markErrors, focusError, downloadConfig };
})(window.SCHOLAR_CANVAS_SETUP);
