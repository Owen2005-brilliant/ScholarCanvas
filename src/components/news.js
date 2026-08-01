(function registerNews(namespace) {
  "use strict";

  const typeIcons = { paper: "paper", award: "award", project: "code", career: "briefcase", other: "spark" };

  namespace.components.news = {
    render() {
      const d = namespace.dom;
      const items = Array.isArray(namespace.news) ? namespace.news : [];
      const visible = namespace.state.expandedNews ? items : items.slice(0, 5);
      const section = d.h("section", { id: "news", className: "page-section news-section reveal", attrs: { "aria-labelledby": "news-title" } });
      section.append(d.h("div", { className: "container" }, [
        d.sectionHeading("news", d.label("news"), { english: namespace.state.language === "zh" ? "News" : "" }),
        items.length ? d.h("ol", { className: "news-list" }, visible.map((item, index) => {
          const content = d.h("div", { className: "news-content" }, [
            d.h("span", { className: `news-type news-type-${item.type || "other"}` }, [d.icon(typeIcons[item.type] || "spark"), d.h("span", { className: "visually-hidden", text: item.type || "other" })]),
            item.link
              ? d.smartLink(item.link, d.translated(item.text), null, "news-link")
              : d.h("p", { text: d.translated(item.text) })
          ]);
          return d.h("li", { className: item.highlight ? "news-item is-highlighted" : "news-item" }, [
            d.h("time", { attrs: { datetime: item.date || "" }, text: item.date || "—" }),
            content,
            index === 0 && item.highlight ? d.h("span", { className: "latest-label", text: d.label("latest") }) : null
          ]);
        })) : d.emptyState(),
        items.length > 5 ? d.actionButton({
          text: namespace.state.expandedNews ? d.label("showLess") : d.label("showMore"),
          icon: "chevron",
          action: "toggle-news",
          className: "expand-button",
          expanded: String(namespace.state.expandedNews),
          controls: "news-list"
        }) : null
      ]));
      const list = section.querySelector("ol");
      if (list) list.id = "news-list";
      return section;
    }
  };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
