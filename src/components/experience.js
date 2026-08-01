(function registerExperience(namespace) {
  "use strict";

  const typeIcons = { education: "scholar", internship: "briefcase", research: "spark", service: "service" };

  namespace.components.experience = {
    render() {
      const d = namespace.dom;
      const items = Array.isArray(namespace.experience) ? namespace.experience : [];
      const timeline = items.length ? d.h("ol", { className: "experience-timeline" }, items.map((item) => d.h("li", { className: "experience-item" }, [
        d.h("div", { className: "experience-marker" }, [d.icon(typeIcons[item.type] || "briefcase")]),
        d.h("time", { className: "experience-period", text: item.period || "—" }),
        d.h("article", { className: "experience-content" }, [
          d.h("div", { className: "experience-heading" }, [
            d.h("h3", { text: d.translated(item.organization) }),
            d.h("span", { text: d.translated(item.role) })
          ]),
          d.h("p", { className: "experience-location" }, [d.icon("location"), d.h("span", { text: d.translated(item.location) })]),
          d.h("ul", { className: "experience-highlights" }, (item.highlights || []).map((highlight) => d.h("li", { text: d.translated(highlight) })))
        ])
      ]))) : d.emptyState();
      return d.h("section", { id: "experience", className: "page-section experience-section reveal", attrs: { "aria-labelledby": "experience-title" } }, [
        d.h("div", { className: "container" }, [
          d.sectionHeading("experience", d.label("experience"), { icon: "briefcase", english: namespace.state.language === "zh" ? "Experience" : "" }),
          timeline
        ])
      ]);
    }
  };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
