(function initRenderer(namespace) {
  "use strict";

  const components = namespace.components = namespace.components || {};

  function appendChildren(parent, children) {
    const list = Array.isArray(children) ? children.flat(Infinity) : [children];
    list.forEach((child) => {
      if (child === null || child === undefined || child === false) return;
      parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
    });
  }

  function h(tagName, options, children) {
    const element = document.createElement(tagName);
    const settings = options || {};
    if (settings.className) element.className = settings.className;
    if (settings.id) element.id = settings.id;
    if (settings.text !== undefined) element.textContent = settings.text;
    Object.entries(settings.attrs || {}).forEach(([name, value]) => {
      if (value === false || value === null || value === undefined) return;
      if (value === true) element.setAttribute(name, "");
      else element.setAttribute(name, String(value));
    });
    Object.entries(settings.dataset || {}).forEach(([name, value]) => {
      if (value !== null && value !== undefined) element.dataset[name] = String(value);
    });
    if (settings.style) {
      Object.entries(settings.style).forEach(([name, value]) => element.style.setProperty(name, value));
    }
    if (children !== undefined) appendChildren(element, children);
    return element;
  }

  function icon(name, className) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.classList.add("icon");
    if (className) className.split(" ").forEach((value) => value && svg.classList.add(value));
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#icon-${name}`);
    svg.append(use);
    return svg;
  }

  function translated(value) {
    return namespace.i18n.t(value, namespace.state.language, (namespace.site && namespace.site.defaultLanguage) || "zh");
  }

  function label(key) {
    return namespace.i18n.label(key, namespace.state.language);
  }

  function isSafeUrl(url) {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (!trimmed || /^(javascript|data|vbscript):/i.test(trimmed)) return false;
    return /^(https?:|mailto:|#|\.\.?\/|[a-zA-Z0-9_./-]+$)/i.test(trimmed);
  }

  function actionButton(options) {
    const button = h("button", {
      className: options.className || "button",
      attrs: {
        type: "button",
        "aria-label": options.ariaLabel || options.text,
        "aria-expanded": options.expanded,
        "aria-controls": options.controls,
        disabled: options.disabled
      },
      dataset: Object.assign({ action: options.action }, options.dataset || {})
    }, [options.icon ? icon(options.icon) : null, h("span", { text: options.text })]);
    return button;
  }

  function smartLink(url, text, iconName, className, options) {
    const settings = options || {};
    if (!isSafeUrl(url)) {
      return actionButton({
        text,
        icon: iconName,
        action: "unavailable",
        className: className || "button button-secondary",
        ariaLabel: `${text}. ${label("unavailable")}`
      });
    }
    const external = /^https?:/i.test(url);
    return h("a", {
      className: className || "button button-secondary",
      attrs: {
        href: url,
        target: external ? "_blank" : undefined,
        rel: external ? "noopener noreferrer" : undefined,
        download: settings.download || undefined,
        "aria-label": external ? `${text}. ${label("externalLink")}` : text
      }
    }, [iconName ? icon(iconName) : null, h("span", { text }), external ? icon("external", "external-mark") : null]);
  }

  function sectionHeading(id, title, options) {
    const settings = options || {};
    const wrapper = h("div", { className: "section-heading" });
    const titleRow = h("div", { className: "section-title-row" }, [
      settings.icon ? icon(settings.icon, "section-icon") : null,
      h("h2", { id: `${id}-title`, text: title }),
      settings.english ? h("span", { className: "section-title-english", text: settings.english }) : null
    ]);
    wrapper.append(titleRow);
    if (settings.description) wrapper.append(h("p", { className: "section-description", text: settings.description }));
    if (settings.trailing) wrapper.append(settings.trailing);
    return wrapper;
  }

  function emptyState(message) {
    return h("div", { className: "empty-state" }, [icon("spark"), h("p", { text: message || label("noItems") })]);
  }

  function statusLabel(status) {
    const map = {
      published: "published",
      accepted: "accepted",
      preprint: "preprint",
      "under-review": "underReview",
      "work-in-progress": "workInProgress",
      active: "active",
      prototype: "prototype",
      completed: "completed"
    };
    return label(map[status] || status);
  }

  function enabled(section) {
    const sections = namespace.site && namespace.site.sections;
    return !sections || sections[section] !== false;
  }

  function navigationItems(mode) {
    const items = mode === "researcher"
      ? [
          ["about", "biography", true],
          ["news", "news", enabled("news")],
          ["selected-publications", "selectedPublications", enabled("publications")],
          ["publications", "publications", enabled("publications")],
          ["projects", "researchProjects", enabled("projects")],
          ["teaching", "teaching", enabled("teaching")],
          ["service", "service", enabled("service")],
          ["awards", "awardsShort", enabled("awards")]
        ]
      : [
          ["about", "about", true],
          ["projects", "projects", enabled("projects")],
          ["interests", "interests", enabled("projects")],
          ["experience", "experience", enabled("experience")],
          ["publications", "work", enabled("publications")],
          ["awards", "awards", enabled("awards")],
          ["skills", "skills", enabled("skills")]
        ];
    return items.filter((item) => item[2]).map(([id, key]) => ({ id, label: label(key) }));
  }

  function renderHeader(mode) {
    const navItems = navigationItems(mode);
    const header = h("header", { className: "site-header", dataset: { mode } });
    const inner = h("div", { className: "header-inner" });
    const brand = h("a", { className: "brand", attrs: { href: "#about", "aria-label": "ScholarCanvas" } }, [
      icon("star", "brand-mark"),
      h("span", { text: "ScholarCanvas" })
    ]);
    const navigation = h("nav", { className: "primary-nav", id: "primary-navigation", attrs: { "aria-label": label("navLabel") } }, navItems.map((item) =>
      h("a", { attrs: { href: `#${item.id}` }, dataset: { navTarget: item.id }, text: item.label })
    ));
    if (namespace.site.enableModePreviewSwitch) {
      navigation.append(actionButton({
        text: mode === "student" ? label("previewResearcher") : label("previewStudent"),
        icon: mode === "student" ? "scholar" : "spark",
        action: "toggle-mode",
        className: "button button-secondary mobile-nav-mode"
      }));
    }

    const controls = h("div", { className: "header-controls" });
    if (namespace.site.enableLanguageSwitch !== false) {
      controls.append(actionButton({
        text: namespace.state.language === "zh" ? "EN" : "中",
        action: "toggle-language",
        className: "control-button language-button",
        ariaLabel: label("languageSwitch")
      }));
    }
    if (namespace.site.enableDarkMode !== false) {
      controls.append(actionButton({
        text: "",
        icon: namespace.state.theme === "dark" ? "sun" : "moon",
        action: "toggle-theme",
        className: "control-button icon-button",
        ariaLabel: namespace.state.theme === "dark" ? label("lightMode") : label("darkMode")
      }));
    }
    if (namespace.site.enableModePreviewSwitch) {
      controls.append(actionButton({
        text: mode === "student" ? label("previewResearcher") : label("previewStudent"),
        icon: mode === "student" ? "scholar" : "spark",
        action: "toggle-mode",
        className: "control-button mode-button"
      }));
    }
    controls.append(actionButton({
      text: label("menu"),
      icon: "menu",
      action: "toggle-menu",
      className: "control-button mobile-menu-button",
      ariaLabel: label("openMenu"),
      expanded: "false",
      controls: "primary-navigation"
    }));

    inner.append(brand, navigation, controls);
    header.append(inner);
    return header;
  }

  function renderOrbitNavigation(mode) {
    const aside = h("aside", { className: "orbit-nav", attrs: { "aria-label": label("navLabel") } });
    const list = h("ol");
    navigationItems(mode).forEach((item) => {
      list.append(h("li", {}, [
        h("a", { attrs: { href: `#${item.id}`, "aria-label": item.label }, dataset: { navTarget: item.id } }, [
          h("span", { className: "orbit-dot" }),
          h("span", { className: "orbit-label", text: item.label })
        ])
      ]));
    });
    aside.append(list);
    return aside;
  }

  function renderMain(mode) {
    const main = h("main", { id: "main-content", className: "site-main", attrs: { tabindex: "-1" } });
    if (components.hero) main.append(components.hero.render(mode));
    if (mode === "researcher") {
      if (enabled("news") && components.news) main.append(components.news.render());
      if (enabled("publications") && components.publications) appendChildren(main, components.publications.renderResearcher());
      if (enabled("projects") && components.projects) main.append(components.projects.renderResearcher());
      if ((enabled("teaching") && components.teaching) || (enabled("service") && components.service)) {
        const academicSplit = h("div", { className: "academic-split" });
        if (enabled("teaching") && components.teaching) academicSplit.append(components.teaching.render());
        if (enabled("service") && components.service) academicSplit.append(components.service.render());
        main.append(academicSplit);
      }
      if (enabled("awards") && components.awards) main.append(components.awards.render(mode));
    } else {
      if (enabled("projects") && components.projects) appendChildren(main, components.projects.renderStudent());
      if (enabled("experience") && components.experience) main.append(components.experience.render());
      if (enabled("publications") && components.publications) main.append(components.publications.renderStudent());
      if (enabled("awards") && components.awards) main.append(components.awards.render(mode));
      if (enabled("skills") && components.skills) main.append(components.skills.render());
    }
    return main;
  }

  function renderPage() {
    const root = document.getElementById("app");
    if (!root) return;
    const mode = namespace.state.mode === "researcher" ? "researcher" : "student";
    document.body.dataset.mode = mode;
    document.body.dataset.pageVisible = document.hidden ? "false" : "true";
    document.documentElement.dataset.mode = mode;
    if (/^#[0-9a-f]{6}$/i.test(namespace.site && namespace.site.accentColor || "")) {
      document.documentElement.style.setProperty("--student-accent", namespace.site.accentColor);
    }
    const skipLink = document.querySelector(".skip-link");
    if (skipLink) skipLink.textContent = label("skip");
    namespace.i18n.applyMetadata(namespace.state.language);
    root.setAttribute("aria-busy", "true");

    const header = renderHeader(mode);
    const main = renderMain(mode);
    const footer = components.footer ? components.footer.render(mode) : null;
    const orbit = renderOrbitNavigation(mode);
    const backTop = actionButton({
      text: label("backToTop"),
      icon: "up",
      action: "back-top",
      className: "back-to-top",
      ariaLabel: label("backToTop")
    });
    root.replaceChildren(header, main, footer, orbit, backTop);
    root.setAttribute("aria-busy", "false");
    if (namespace.interactions && namespace.interactions.afterRender) namespace.interactions.afterRender();
  }

  namespace.dom = { h, icon, translated, label, smartLink, actionButton, sectionHeading, emptyState, statusLabel, isSafeUrl, appendChildren };
  namespace.renderer = { renderPage, navigationItems };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
