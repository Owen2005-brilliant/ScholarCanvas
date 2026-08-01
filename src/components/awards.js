(function registerAwards(namespace) {
  "use strict";

  function renderStudent(items) {
    const d = namespace.dom;
    return d.h("div", { className: "award-wall" }, items.map((item) => d.h("article", { className: `award-card award-${item.category || "other"}` }, [
      d.h("div", { className: "award-icon" }, [d.icon(item.category === "activity" ? "service" : "award")]),
      d.h("div", {}, [
        d.h("h3", { text: d.translated(item.title) }),
        d.h("p", { text: d.translated(item.organization) }),
        d.h("time", { attrs: { datetime: String(item.year || "") }, text: String(item.year || "") })
      ])
    ])));
  }

  function renderResearcher(items) {
    const d = namespace.dom;
    return d.h("ol", { className: "award-list" }, items.map((item) => d.h("li", {}, [
      d.icon("award"),
      d.h("span", { className: "award-list-title", text: d.translated(item.title) }),
      d.h("span", { text: d.translated(item.organization) }),
      d.h("time", { attrs: { datetime: String(item.year || "") }, text: String(item.year || "") })
    ])));
  }

  namespace.components.awards = {
    render(mode) {
      const d = namespace.dom;
      const items = Array.isArray(namespace.awards) ? namespace.awards : [];
      return d.h("section", { id: "awards", className: "page-section awards-section reveal", attrs: { "aria-labelledby": "awards-title" } }, [
        d.h("div", { className: "container" }, [
          d.sectionHeading("awards", mode === "researcher" ? d.label("awardsShort") : d.label("awards"), { icon: "award", english: namespace.state.language === "zh" ? "Awards" : "" }),
          items.length ? (mode === "researcher" ? renderResearcher(items) : renderStudent(items)) : d.emptyState()
        ])
      ]);
    }
  };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
