(function registerFooter(namespace) {
  "use strict";

  function footerLinks() {
    const d = namespace.dom;
    const profile = namespace.profile || {};
    return d.h("nav", { className: "footer-links", attrs: { "aria-label": d.label("contact") } }, [
      d.smartLink(profile.links && profile.links.scholar, "Google Scholar", "scholar", "footer-link"),
      d.smartLink(profile.links && profile.links.github, "GitHub", "github", "footer-link"),
      d.smartLink(profile.links && profile.links.orcid, "ORCID", "orcid", "footer-link")
    ]);
  }

  function renderStudent() {
    const d = namespace.dom;
    return d.h("footer", { id: "contact", className: "site-footer student-footer", attrs: { "aria-labelledby": "footer-title" } }, [
      d.h("div", { className: "container student-footer-content" }, [
        d.h("div", { className: "footer-message" }, [
          d.h("h2", { id: "footer-title", text: "Campus Horizon" }),
          d.h("p", { text: d.label("campusMotto") })
        ]),
        d.actionButton({ text: d.label("contactMe"), icon: "mail", action: "copy-email", className: "footer-contact-button", ariaLabel: `${d.label("contactMe")}: ${d.label("contactHint")}` })
      ]),
      d.h("img", { className: "campus-horizon", attrs: { src: "assets/illustrations/campus-horizon.svg", alt: "", width: "1200", height: "260", loading: "lazy" } }),
      d.h("div", { className: "footer-meta container" }, [
        d.h("span", { text: `© ${new Date().getFullYear()} ScholarCanvas · ${d.translated(namespace.profile && namespace.profile.name)}` }),
        d.h("span", { text: `${d.label("updated")}: ${(namespace.site && namespace.site.lastUpdated) || "—"}` }),
        d.h("a", { attrs: { href: "LICENSE" }, text: d.label("license") })
      ])
    ]);
  }

  function renderResearcher() {
    const d = namespace.dom;
    return d.h("footer", { id: "contact", className: "site-footer researcher-footer", attrs: { "aria-labelledby": "footer-title" } }, [
      d.h("img", { className: "research-night-art", attrs: { src: "assets/illustrations/research-night.svg", alt: "", width: "1200", height: "300", loading: "lazy" } }),
      d.h("div", { className: "container researcher-footer-grid" }, [
        d.h("section", {}, [
          d.h("h2", { id: "footer-title", text: "Research Night" }),
          d.h("p", { text: d.label("nightMotto") }),
          d.h("p", { className: "footer-signature", text: `— ${d.translated(namespace.profile && namespace.profile.name)}` })
        ]),
        d.h("section", {}, [d.h("h3", { text: d.label("contact") }), footerLinks()]),
        d.h("section", {}, [
          d.h("h3", { text: d.label("updated") }),
          d.h("p", { text: (namespace.site && namespace.site.lastUpdated) || "—" }),
          d.h("p", { text: "ScholarCanvas v1.0 · Researcher Mode" })
        ]),
        d.h("section", {}, [
          d.h("h3", { text: d.label("license") }),
          d.h("p", { text: namespace.state.language === "zh" ? "本网站内容为虚构示例。模板采用 MIT License。" : "This site contains fictional demo content. The template uses the MIT License." }),
          d.h("a", { className: "footer-license-link", attrs: { href: "LICENSE" }, text: d.label("license") })
        ])
      ])
    ]);
  }

  namespace.components.footer = { render: (mode) => mode === "researcher" ? renderResearcher() : renderStudent() };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
