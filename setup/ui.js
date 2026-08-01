(function initSetupUi(namespace) {
  "use strict";

  let idCount = 0;
  const iconPaths = {
    arrowLeft: "M19 12H5m7 7-7-7 7-7",
    arrowRight: "M5 12h14m-7-7 7 7-7 7",
    check: "m5 12 4 4L19 6",
    chevronDown: "m6 9 6 6 6-6",
    chevronUp: "m18 15-6-6-6 6",
    copy: "M8 8h11v11H8zM5 16H4V5h11v1",
    download: "M12 3v12m-5-5 5 5 5-5M5 20h14",
    eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    file: "M7 3h7l4 4v14H7zM14 3v5h5",
    folder: "M3 6h7l2 2h9v11H3z",
    globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18c2.2 2.4 3.2 5.4 3 9 .2 3.6-.8 6.6-3 9-2.2-2.4-3.2-5.4-3-9-.2-3.6.8-6.6 3-9ZM3 12h18",
    menu: "M4 7h16M4 12h16M4 17h16",
    moon: "M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z",
    plus: "M12 5v14M5 12h14",
    refresh: "M20 7v5h-5M4 17v-5h5M6.1 8A7 7 0 0 1 18.4 7M5.6 17A7 7 0 0 0 17.9 16",
    save: "M5 4h12l2 2v14H5zM8 4v6h8V4m-8 16v-6h8v6",
    shield: "M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6z",
    sun: "M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m11.4 0 1.4 1.4M4.9 4.9l1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    trash: "M5 7h14M9 7V4h6v3m2 0-1 13H8L7 7m4 4v5m2-5v5",
    upload: "M12 16V4m-5 5 5-5 5 5M5 20h14",
    warning: "M12 3 2.5 20h19L12 3Zm0 6v5m0 3v.1"
  };

  function h(tag, attributes) {
    const element = document.createElement(tag);
    const attrs = attributes || {};
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      if (key === "class") element.className = value;
      else if (key === "text") element.textContent = String(value);
      else if (key === "checked" || key === "disabled" || key === "hidden" || key === "selected") element[key] = Boolean(value);
      else if (key === "dataset") Object.entries(value).forEach(([name, data]) => { element.dataset[name] = String(data); });
      else if (key === "style") Object.entries(value).forEach(([name, styleValue]) => { element.style[name] = styleValue; });
      else if (key.startsWith("on") && typeof value === "function") element.addEventListener(key.slice(2).toLowerCase(), value);
      else element.setAttribute(key, String(value));
    });
    Array.prototype.slice.call(arguments, 2).flat(Infinity).forEach((child) => {
      if (child === undefined || child === null || child === false) return;
      element.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return element;
  }

  function t(value, language) {
    return namespace.schema.t(value, language || namespace.store.get().language);
  }

  function icon(name, label) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", label ? "false" : "true");
    if (label) svg.setAttribute("aria-label", label);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", iconPaths[name] || iconPaths.warning);
    svg.append(path);
    return svg;
  }

  function button(label, options) {
    const settings = options || {};
    const element = h("button", {
      class: `setup-button setup-button--${settings.variant || "secondary"}${settings.className ? ` ${settings.className}` : ""}`,
      type: settings.type || "button",
      disabled: settings.disabled,
      title: settings.title,
      dataset: settings.dataset,
      "aria-label": settings.ariaLabel
    });
    if (settings.icon) element.append(icon(settings.icon));
    element.append(h("span", { text: label }));
    return element;
  }

  function uid(prefix) {
    idCount += 1;
    return `${prefix || "setup"}-${idCount}`;
  }

  function hint(text) {
    return text ? h("p", { class: "setup-field__hint", text }) : null;
  }

  function field(options) {
    const settings = options || {};
    const id = settings.id || uid("field");
    const errorId = `${id}-error`;
    const hintId = settings.hint ? `${id}-hint` : "";
    const wrapper = h("div", { class: `setup-field${settings.full ? " setup-field--full" : ""}` });
    const label = h("label", { class: "setup-field__label", for: id }, settings.label);
    if (settings.required) label.append(h("span", { class: "setup-field__required", text: ` ${t(namespace.schema.copy.required)}` }));
    wrapper.append(label);
    let control;
    const common = {
      id,
      name: settings.path,
      class: "setup-input",
      required: settings.required,
      placeholder: settings.placeholder,
      dataset: { path: settings.path, valueType: settings.valueType || settings.type || "text" },
      "aria-describedby": [hintId, errorId].filter(Boolean).join(" "),
      "aria-invalid": "false"
    };
    if (settings.type === "textarea") {
      control = h("textarea", Object.assign(common, { rows: settings.rows || 4 }));
      control.value = settings.value || "";
    } else if (settings.type === "select") {
      control = h("select", common);
      (settings.options || []).forEach((option) => {
        const value = typeof option === "string" ? option : option.value;
        const optionLabel = typeof option === "string" ? option : option.label;
        control.append(h("option", { value, text: optionLabel, selected: String(value) === String(settings.value) }));
      });
    } else if (settings.type === "checkbox") {
      control = h("input", Object.assign(common, { class: "setup-checkbox", type: "checkbox", checked: settings.value }));
      label.classList.add("setup-switch-label");
      label.prepend(control);
      wrapper.replaceChildren(label);
    } else {
      control = h("input", Object.assign(common, {
        type: settings.type || "text",
        value: settings.value === undefined || settings.value === null ? "" : settings.value,
        min: settings.min,
        max: settings.max,
        accept: settings.accept,
        autocomplete: settings.autocomplete || "off"
      }));
    }
    if (settings.type !== "checkbox") wrapper.append(control);
    if (settings.hint) wrapper.append(h("p", { id: hintId, class: "setup-field__hint", text: settings.hint }));
    wrapper.append(h("p", { id: errorId, class: "setup-field__error", dataset: { errorFor: settings.path }, hidden: true }));
    return wrapper;
  }

  function sectionTitle(eyebrow, title, description) {
    return h("header", { class: "setup-step-heading" },
      eyebrow ? h("p", { class: "setup-eyebrow", text: eyebrow }) : null,
      h("h1", { id: "setup-step-title", text: title }),
      description ? h("p", { class: "setup-step-description", text: description }) : null
    );
  }

  function errorSummary(errors, language) {
    const list = Array.isArray(errors) ? errors : [];
    if (!list.length) return null;
    return h("section", { class: "setup-error-summary", role: "alert", tabindex: "-1", id: "setup-error-summary" },
      h("div", { class: "setup-error-summary__title" }, icon("warning"), h("h2", { text: t(namespace.schema.copy.errorsTitle, language) })),
      h("ul", {}, list.map((error) => h("li", {}, h("button", { type: "button", class: "setup-error-link", dataset: { action: "focus-path", focusPath: error.path }, text: t(error.message, language) }))))
    );
  }

  function toast(message, tone) {
    const region = document.getElementById("setup-toast-region");
    if (!region) return;
    const item = h("div", { class: `setup-toast setup-toast--${tone || "success"}` }, tone === "error" ? icon("warning") : icon("check"), h("span", { text: message }));
    region.replaceChildren(item);
    window.setTimeout(() => { if (item.isConnected) item.remove(); }, 4200);
  }

  function announce(message) {
    const region = document.getElementById("setup-announcer");
    if (!region) return;
    region.textContent = "";
    window.setTimeout(() => { region.textContent = message; }, 10);
  }

  namespace.ui = { h, t, icon, button, field, hint, uid, sectionTitle, errorSummary, toast, announce };
  namespace.components = namespace.components || {};
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
