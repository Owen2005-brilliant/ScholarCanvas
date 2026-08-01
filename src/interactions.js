(function initInteractions(namespace) {
  "use strict";

  let bound = false;
  let toastTimer = null;
  let revealObserver = null;
  let sectionObserver = null;
  let footerObserver = null;
  let scrollFrame = null;

  function toast(message) {
    const region = document.getElementById("toast-region");
    if (!region || !message) return;
    window.clearTimeout(toastTimer);
    region.replaceChildren();
    const item = namespace.dom.h("div", { className: "toast" }, [namespace.dom.icon("spark"), namespace.dom.h("span", { text: message })]);
    region.append(item);
    requestAnimationFrame(() => item.classList.add("is-visible"));
    toastTimer = window.setTimeout(() => {
      item.classList.remove("is-visible");
      window.setTimeout(() => region.replaceChildren(), 180);
    }, 2000);
  }

  async function copyText(text, successMessage) {
    if (!text) {
      toast(namespace.dom.label("unavailable"));
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("Copy command failed");
      }
      toast(successMessage);
    } catch (error) {
      toast(namespace.dom.label("copyFailed"));
    }
  }

  function closeModal() {
    const root = document.getElementById("modal-root");
    if (!root || !root.firstChild) return;
    namespace.accessibility.releaseFocusTrap();
    root.replaceChildren();
    document.body.classList.remove("modal-open");
  }

  function projectLink(project, key, labelKey, iconName) {
    const url = project.links && project.links[key];
    return namespace.dom.smartLink(url, namespace.dom.label(labelKey), iconName, "button button-secondary");
  }

  function openProject(projectId) {
    const project = (namespace.projects || []).find((item) => item.id === projectId);
    const root = document.getElementById("modal-root");
    if (!project || !root) return;
    const d = namespace.dom;
    const titleId = `project-dialog-${project.id}`;
    const overlay = d.h("div", { className: "modal-overlay", dataset: { action: "close-modal" } });
    const dialog = d.h("section", {
      className: "project-modal",
      attrs: { role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, tabindex: "-1" },
      dataset: { modalPanel: "true" }
    });
    const close = d.actionButton({ text: "", icon: "close", action: "close-modal", className: "modal-close icon-button", ariaLabel: d.label("close") });
    const image = d.h("img", {
      className: "project-modal-image",
      attrs: {
        src: project.image || "assets/illustrations/share-card.svg",
        alt: d.translated(project.imageAlt) || d.translated(project.name),
        loading: "lazy",
        width: "800",
        height: "480"
      }
    });
    const status = d.h("span", { className: `status status-${project.status || "active"}`, text: d.statusLabel(project.status || "active") });
    const tags = d.h("ul", { className: "tag-list", attrs: { "aria-label": d.label("interests") } }, (project.tags || []).map((tag) => d.h("li", { text: tag })));
    const actions = d.h("div", { className: "modal-actions" }, [
      projectLink(project, "github", "code", "github"),
      projectLink(project, "demo", "project", "external"),
      projectLink(project, "report", "paper", "paper")
    ]);
    dialog.append(
      close,
      image,
      d.h("div", { className: "project-modal-content" }, [
        d.h("p", { className: "modal-kicker", text: d.label("projectDialog") }),
        d.h("div", { className: "modal-title-row" }, [d.h("h2", { id: titleId, text: d.translated(project.name) }), status]),
        d.h("p", { className: "modal-summary", text: d.translated(project.description) }),
        d.h("p", { text: d.translated(project.details) || d.translated(project.description) }),
        tags,
        actions
      ])
    );
    overlay.append(dialog);
    root.replaceChildren(overlay);
    document.body.classList.add("modal-open");
    namespace.accessibility.trapFocus(dialog, closeModal);
  }

  function focusAfterRender(selector) {
    requestAnimationFrame(() => {
      const element = document.querySelector(selector);
      if (element) element.focus({ preventScroll: true });
    });
  }

  function closeMobileMenu() {
    const nav = document.getElementById("primary-navigation");
    const button = document.querySelector('[data-action="toggle-menu"]');
    if (nav) nav.classList.remove("is-open");
    if (button) {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", namespace.dom.label("openMenu"));
    }
    document.body.classList.remove("menu-open");
  }

  function toggleMobileMenu(button) {
    const nav = document.getElementById("primary-navigation");
    if (!nav) return;
    const open = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? namespace.dom.label("closeMenu") : namespace.dom.label("openMenu"));
  }

  function highlightConstellation(projectId) {
    const project = (namespace.projects || []).find((item) => item.id === projectId);
    if (!project) return;
    namespace.state.projectTag = project.tags && project.tags[0] ? project.tags[0] : "";
    document.querySelectorAll("[data-constellation-project]").forEach((node) => {
      const related = (namespace.projects || []).find((item) => item.id === node.dataset.constellationProject);
      const active = !namespace.state.projectTag || (related && (related.tags || []).includes(namespace.state.projectTag));
      node.classList.toggle("is-muted", !active);
      node.classList.toggle("is-active", node.dataset.constellationProject === projectId);
      node.setAttribute("aria-pressed", String(node.dataset.constellationProject === projectId));
    });
    const live = document.querySelector("[data-constellation-live]");
    if (live) live.textContent = `${namespace.dom.translated(project.name)} · ${namespace.state.projectTag}`;
  }

  function handleAction(target) {
    const action = target.dataset.action;
    if (action === "copy-email") copyText(namespace.profile.email, namespace.dom.label("emailCopied"));
    else if (action === "copy-bio") copyText(namespace.dom.translated(namespace.profile.shortBio || namespace.profile.bio), namespace.dom.label("bioCopied"));
    else if (action === "copy-bibtex") {
      const publication = (namespace.publications || []).find((item) => item.id === target.dataset.publicationId);
      copyText(publication && publication.bibtex, namespace.dom.label("bibtexCopied"));
    } else if (action === "toggle-language") namespace.app.toggleLanguage();
    else if (action === "toggle-theme") namespace.app.toggleTheme();
    else if (action === "toggle-mode") namespace.app.toggleMode();
    else if (action === "toggle-menu") toggleMobileMenu(target);
    else if (action === "unavailable") toast(namespace.dom.label("unavailable"));
    else if (action === "toggle-news") {
      namespace.state.expandedNews = !namespace.state.expandedNews;
      namespace.app.render();
      focusAfterRender('[data-action="toggle-news"]');
    } else if (action === "toggle-authors") {
      const id = target.dataset.publicationId;
      if (namespace.state.expandedAuthors.has(id)) namespace.state.expandedAuthors.delete(id);
      else namespace.state.expandedAuthors.add(id);
      namespace.app.render();
      focusAfterRender(`[data-action="toggle-authors"][data-publication-id="${CSS.escape(id)}"]`);
    } else if (action === "filter-publications") {
      namespace.state.publicationTag = target.dataset.tag || "all";
      namespace.app.render();
      toast(namespace.dom.label("filterAnnounce"));
      focusAfterRender(`[data-action="filter-publications"][data-tag="${CSS.escape(namespace.state.publicationTag)}"]`);
    } else if (action === "open-project") openProject(target.dataset.projectId);
    else if (action === "close-modal") closeModal();
    else if (action === "back-top") window.scrollTo({ top: 0, behavior: namespace.accessibility.prefersReducedMotion() ? "auto" : "smooth" });
    else if (action === "constellation-project") highlightConstellation(target.dataset.projectId);
  }

  function onClick(event) {
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      if (actionTarget.dataset.action === "close-modal" && event.target.closest("[data-modal-panel]")) return;
      event.preventDefault();
      handleAction(actionTarget);
      return;
    }
    const navLink = event.target.closest('a[href^="#"]');
    if (navLink) closeMobileMenu();
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      if (document.getElementById("modal-root") && document.getElementById("modal-root").firstChild) closeModal();
      else closeMobileMenu();
    }
  }

  function updateScrollUi() {
    const button = document.querySelector(".back-to-top");
    if (button) button.classList.toggle("is-visible", window.scrollY > Math.max(480, window.innerHeight * 0.7));
    updateCurrentSectionByPosition();
    scrollFrame = null;
  }

  function onScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollUi);
  }

  function updateActiveSection(id) {
    document.querySelectorAll("[data-nav-target]").forEach((link) => {
      const active = link.dataset.navTarget === id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function updateCurrentSectionByPosition() {
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    if (!sections.length) return;
    const anchor = window.innerHeight * 0.28;
    let current = sections[0];
    let currentTop = -Infinity;
    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top <= anchor && top > currentTop + 1) {
        current = section;
        currentTop = top;
      }
    });
    updateActiveSection(current.id);
  }

  function setupRevealObserver() {
    if (revealObserver) revealObserver.disconnect();
    const elements = document.querySelectorAll(".reveal");
    if (namespace.accessibility.prefersReducedMotion() || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10%", threshold: 0.08 });
    elements.forEach((element) => revealObserver.observe(element));
  }

  function setupSectionObserver() {
    if (sectionObserver) sectionObserver.disconnect();
    if (!("IntersectionObserver" in window)) {
      updateCurrentSectionByPosition();
      return;
    }
    sectionObserver = new IntersectionObserver(updateCurrentSectionByPosition, { rootMargin: "-22% 0px -60%", threshold: [0.05, 0.25, 0.5] });
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
    updateCurrentSectionByPosition();
  }

  function setupFooterObserver() {
    if (footerObserver) footerObserver.disconnect();
    const footer = document.querySelector(".site-footer");
    const orbit = document.querySelector(".orbit-nav");
    if (!footer || !orbit || !("IntersectionObserver" in window)) return;
    footerObserver = new IntersectionObserver(([entry]) => orbit.classList.toggle("is-hidden", entry.isIntersecting), { threshold: 0.05 });
    footerObserver.observe(footer);
  }

  function setupConstellation() {
    const field = document.querySelector(".constellation-field");
    if (!field || namespace.accessibility.prefersReducedMotion() || window.innerWidth <= 768) return;
    const move = (event) => {
      const bounds = field.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
      field.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
      field.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
    };
    const reset = () => {
      field.style.setProperty("--parallax-x", "0px");
      field.style.setProperty("--parallax-y", "0px");
    };
    field.addEventListener("pointermove", move, { passive: true });
    field.addEventListener("pointerleave", reset, { passive: true });
  }

  function afterRender() {
    setupRevealObserver();
    setupSectionObserver();
    setupFooterObserver();
    setupConstellation();
    updateScrollUi();
  }

  function bindGlobal() {
    if (bound) return;
    bound = true;
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", () => {
      document.body.dataset.pageVisible = document.hidden ? "false" : "true";
    });
  }

  namespace.interactions = { bindGlobal, afterRender, toast, copyText, openProject, closeModal };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
