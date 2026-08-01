(function registerHero(namespace) {
  "use strict";

  const d = () => namespace.dom;

  function socialActions(profile, mode) {
    const dom = d();
    const actions = [
      dom.actionButton({ text: dom.label("copyEmail"), icon: "mail", action: "copy-email", className: "button button-primary" }),
      dom.smartLink(profile.links && profile.links.cv, dom.label("downloadCv"), "download", "button button-secondary", { download: true }),
      dom.smartLink(profile.links && profile.links.github, "GitHub", "github", "button button-secondary"),
      dom.smartLink(profile.links && profile.links.scholar, "Scholar", "scholar", "button button-secondary")
    ];
    if (mode === "researcher") actions.push(dom.smartLink(profile.links && profile.links.orcid, "ORCID", "orcid", "button button-secondary"));
    return actions;
  }

  function avatar(profile, compact) {
    return d().h("img", {
      className: compact ? "profile-avatar profile-avatar-compact" : "profile-avatar",
      attrs: {
        src: profile.avatar || "assets/avatar/lin-zhixia.svg",
        alt: d().translated(profile.avatarAlt) || d().translated(profile.name),
        width: compact ? "168" : "400",
        height: compact ? "168" : "400",
        loading: "eager",
        fetchpriority: "high"
      }
    });
  }

  function interests(profile, compact) {
    const dom = d();
    return dom.h("ul", { className: compact ? "interest-tags interest-tags-compact" : "interest-tags", attrs: { "aria-label": dom.label("interests") } },
      (profile.interests || []).map((interest) => dom.h("li", { text: dom.translated(interest.label) }))
    );
  }

  function renderStudent(profile) {
    const dom = d();
    const introduction = dom.h("div", { className: "hero-copy" }, [
      dom.h("div", { className: "hero-title-line" }, [
        dom.h("h1", { id: "hero-name", text: dom.translated(profile.name) || "ScholarCanvas" }),
        dom.icon("star", "hero-star")
      ]),
      dom.h("p", { className: "hero-identity", text: dom.translated(profile.identity) }),
      dom.h("p", { className: "hero-tagline", text: dom.translated(profile.tagline) }),
      dom.h("p", { className: "hero-bio", text: dom.translated(profile.bio) }),
      dom.h("div", { className: "hero-actions" }, socialActions(profile, "student")),
      dom.h("div", { className: "hero-utilities" }, [
        dom.actionButton({ text: dom.label("copyBio"), icon: "copy", action: "copy-bio", className: "text-button" }),
        profile.fictional ? dom.h("span", { className: "fictional-note", text: dom.label("fictionalBadge") }) : null
      ])
    ]);

    const focus = profile.currentFocus || {};
    const visual = dom.h("div", { className: "hero-visual" }, [
      dom.h("div", { className: "avatar-frame" }, [avatar(profile, false), dom.h("span", { className: "avatar-code-mark", text: "〈/〉" })]),
      dom.h("div", { className: "hero-interest-panel" }, [dom.h("h2", { text: dom.label("interests") }), interests(profile, false)]),
      dom.h("aside", { className: "focus-card" }, [
        dom.h("div", { className: "focus-card-title" }, [dom.icon("star"), dom.h("span", { text: dom.translated(focus.title) || dom.label("currentFocus") })]),
        dom.h("strong", { text: dom.translated(focus.text) }),
        dom.h("p", { text: dom.translated(focus.detail) })
      ])
    ]);

    return dom.h("section", { id: "about", className: "hero hero-student reveal", attrs: { "aria-labelledby": "hero-name" } }, [
      dom.h("div", { className: "hero-grid container" }, [introduction, visual])
    ]);
  }

  function detailItem(iconName, labelText, value) {
    if (!value) return null;
    const dom = d();
    return dom.h("div", { className: "bio-detail" }, [dom.icon(iconName), dom.h("dt", { text: labelText }), dom.h("dd", { text: value })]);
  }

  function renderResearcher(profile) {
    const dom = d();
    const summary = dom.h("div", { className: "researcher-summary" }, [
      avatar(profile, true),
      dom.h("div", {}, [
        dom.h("div", { className: "researcher-name-line" }, [dom.h("h1", { id: "hero-name", text: dom.translated(profile.name) || "ScholarCanvas" }), profile.fictional ? dom.h("span", { className: "fictional-note", text: dom.label("fictionalBadge") }) : null]),
        dom.h("p", { className: "hero-identity", text: dom.translated(profile.identity) }),
        dom.h("p", { className: "researcher-bio", text: dom.translated(profile.bio) }),
        interests(profile, true)
      ])
    ]);
    const details = dom.h("dl", { className: "researcher-details" }, [
      detailItem("scholar", dom.label("biography"), dom.translated(profile.affiliation)),
      detailItem("briefcase", dom.label("role"), dom.translated(profile.identity)),
      detailItem("spark", dom.label("interests"), dom.translated(profile.lab)),
      detailItem("teaching", namespace.state.language === "zh" ? "导师" : "Advisor", dom.translated(profile.advisor)),
      detailItem("location", namespace.state.language === "zh" ? "地点" : "Location", dom.translated(profile.location)),
      detailItem("mail", "Email", profile.email)
    ]);
    const quickLinks = dom.h("aside", { className: "researcher-quick-links", attrs: { "aria-label": dom.label("contact") } }, socialActions(profile, "researcher"));
    return dom.h("section", { id: "about", className: "hero hero-researcher reveal", attrs: { "aria-labelledby": "hero-name" } }, [
      dom.h("div", { className: "researcher-hero-grid container" }, [summary, details, quickLinks])
    ]);
  }

  namespace.components.hero = {
    render(mode) {
      const profile = namespace.profile || {};
      return mode === "researcher" ? renderResearcher(profile) : renderStudent(profile);
    }
  };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
