(function initConfirmationDialog(namespace) {
  "use strict";
  const { h, icon, button } = namespace.ui;
  let previousFocus = null;
  let currentDialog = null;

  function focusable(dialog) {
    return Array.from(dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
  }

  function close(result) {
    if (!currentDialog) return;
    const resolve = currentDialog._resolve;
    currentDialog.remove();
    currentDialog = null;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    resolve(Boolean(result));
  }

  function onKeydown(event) {
    if (!currentDialog) return;
    if (event.key === "Escape") { event.preventDefault(); close(false); return; }
    if (event.key !== "Tab") return;
    const items = focusable(currentDialog);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function confirm(options) {
    const settings = options || {};
    const root = document.getElementById("setup-dialog-root");
    if (currentDialog) close(false);
    previousFocus = document.activeElement;
    const titleId = "setup-confirm-title";
    const descriptionId = "setup-confirm-description";
    return new Promise((resolve) => {
      const dialog = h("div", { class: "setup-dialog-backdrop", dataset: { action: "dialog-backdrop" } },
        h("section", { class: "setup-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": descriptionId },
          h("div", { class: `setup-dialog__icon setup-dialog__icon--${settings.tone || "default"}` }, icon(settings.tone === "danger" ? "warning" : settings.icon || "check")),
          h("h2", { id: titleId, text: settings.title }),
          h("p", { id: descriptionId, text: settings.description }),
          settings.list && settings.list.length ? h("ul", { class: "setup-dialog__list" }, settings.list.map((item) => h("li", { text: item }))) : null,
          h("div", { class: "setup-dialog__actions" },
            button(settings.cancelLabel || "Cancel", { dataset: { action: "dialog-cancel" } }),
            button(settings.confirmLabel || "Confirm", { variant: settings.tone === "danger" ? "danger" : "primary", dataset: { action: "dialog-confirm" } })
          )
        )
      );
      dialog._resolve = resolve;
      dialog.addEventListener("keydown", onKeydown);
      dialog.addEventListener("click", (event) => {
        const action = event.target.closest("[data-action]");
        if (!action) return;
        if (action.dataset.action === "dialog-confirm") close(true);
        if (action.dataset.action === "dialog-cancel" || action.dataset.action === "dialog-backdrop") close(false);
      });
      root.append(dialog);
      currentDialog = dialog;
      window.setTimeout(() => {
        const buttons = focusable(dialog);
        if (buttons.length) buttons[buttons.length - 1].focus();
      }, 0);
    });
  }

  namespace.components.confirmationDialog = { confirm, close };
})(window.SCHOLAR_CANVAS_SETUP);
