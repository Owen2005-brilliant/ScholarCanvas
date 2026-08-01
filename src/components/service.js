(function registerService(namespace) {
  "use strict";

  namespace.components.service = {
    render() {
      const d = namespace.dom;
      const items = Array.isArray(namespace.service) ? namespace.service : [];
      const table = d.h("div", { className: "academic-table", attrs: { role: "table", "aria-label": d.label("service") } });
      table.append(d.h("div", { className: "academic-table-head", attrs: { role: "row" } }, [
        d.h("span", { attrs: { role: "columnheader" }, text: d.label("category") }),
        d.h("span", { attrs: { role: "columnheader" }, text: d.label("activity") }),
        d.h("span", { attrs: { role: "columnheader" }, text: d.label("period") })
      ]));
      items.forEach((item) => table.append(d.h("div", { className: "academic-table-row", attrs: { role: "row" } }, [
        d.h("span", { attrs: { role: "cell" }, text: d.translated(item.type) }),
        d.h("span", { attrs: { role: "cell" } }, [
          item.link ? d.smartLink(item.link, d.translated(item.activity), "external", "academic-inline-link") : d.h("strong", { text: d.translated(item.activity) })
        ]),
        d.h("span", { attrs: { role: "cell" }, text: item.period || "" })
      ])));
      return d.h("section", { id: "service", className: "page-section service-section reveal", attrs: { "aria-labelledby": "service-title" } }, [
        d.h("div", { className: "container" }, [
          d.sectionHeading("service", d.label("service"), { icon: "service", english: namespace.state.language === "zh" ? "Academic Service" : "" }),
          items.length ? table : d.emptyState()
        ])
      ]);
    }
  };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
