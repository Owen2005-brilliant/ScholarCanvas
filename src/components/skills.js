(function registerSkills(namespace) {
  "use strict";

  namespace.components.skills = {
    render() {
      const d = namespace.dom;
      const groups = Array.isArray(namespace.skills) ? namespace.skills : [];
      return d.h("section", { id: "skills", className: "page-section skills-section reveal", attrs: { "aria-labelledby": "skills-title" } }, [
        d.h("div", { className: "container" }, [
          d.sectionHeading("skills", d.label("skills"), { icon: "code", english: namespace.state.language === "zh" ? "Skills" : "" }),
          groups.length ? d.h("div", { className: "skills-grid" }, groups.map((group) => d.h("section", { className: "skill-group" }, [
            d.h("h3", { text: d.translated(group.category) }),
            d.h("ul", { className: "skill-tags" }, (group.items || []).map((item) => d.h("li", { text: d.translated(item) })))
          ]))) : d.emptyState()
        ])
      ]);
    }
  };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
