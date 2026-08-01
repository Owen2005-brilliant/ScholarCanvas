(function registerTeaching(namespace) {
  "use strict";

  namespace.components.teaching = {
    render() {
      const d = namespace.dom;
      const items = Array.isArray(namespace.teaching) ? namespace.teaching : [];
      const table = d.h("div", { className: "academic-table", attrs: { role: "table", "aria-label": d.label("teaching") } });
      table.append(d.h("div", { className: "academic-table-head", attrs: { role: "row" } }, [
        d.h("span", { attrs: { role: "columnheader" }, text: d.label("period") }),
        d.h("span", { attrs: { role: "columnheader" }, text: d.label("course") }),
        d.h("span", { attrs: { role: "columnheader" }, text: d.label("role") })
      ]));
      items.forEach((item) => table.append(d.h("div", { className: "academic-table-row", attrs: { role: "row" } }, [
        d.h("span", { attrs: { role: "cell" }, text: d.translated(item.term) }),
        d.h("span", { attrs: { role: "cell" } }, [
          item.link ? d.smartLink(item.link, d.translated(item.course), "external", "academic-inline-link") : d.h("strong", { text: d.translated(item.course) })
        ]),
        d.h("span", { attrs: { role: "cell" }, text: d.translated(item.role) })
      ])));
      return d.h("section", { id: "teaching", className: "page-section teaching-section reveal", attrs: { "aria-labelledby": "teaching-title" } }, [
        d.h("div", { className: "container" }, [
          d.sectionHeading("teaching", d.label("teaching"), { icon: "teaching", english: namespace.state.language === "zh" ? "Teaching" : "" }),
          items.length ? table : d.emptyState()
        ])
      ]);
    }
  };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
