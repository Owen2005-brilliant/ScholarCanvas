(function registerPublications(namespace) {
  "use strict";

  const linkIcons = { paper: "paper", code: "code", project: "link", dataset: "link", model: "spark", poster: "paper", slides: "paper" };

  function renderAuthors(publication) {
    const d = namespace.dom;
    const authors = Array.isArray(publication.authors) ? publication.authors : [];
    const expanded = namespace.state.expandedAuthors.has(publication.id);
    const needsToggle = authors.length > 4;
    const visible = needsToggle && !expanded ? authors.slice(0, 4) : authors;
    const line = d.h("div", { className: "publication-authors" });
    visible.forEach((author, index) => {
      const node = author.self ? d.h("strong", { text: author.name || "" }) : d.h("span", { text: author.name || "" });
      line.append(node);
      if (index < visible.length - 1) line.append(document.createTextNode(", "));
    });
    if (needsToggle && !expanded) line.append(document.createTextNode(`, +${authors.length - visible.length}`));
    if (needsToggle) {
      line.append(d.actionButton({
        text: expanded ? d.label("hideAuthors") : d.label("showAllAuthors"),
        icon: "chevron",
        action: "toggle-authors",
        className: "author-toggle",
        expanded: String(expanded),
        dataset: { publicationId: publication.id }
      }));
    }
    return line;
  }

  function renderLinks(publication) {
    const d = namespace.dom;
    const group = d.h("div", { className: "publication-links", attrs: { "aria-label": d.label("work") } });
    Object.entries(publication.links || {}).forEach(([key, url]) => {
      if (!url || !d.isSafeUrl(url) || !d.label(key)) return;
      group.append(d.smartLink(url, d.label(key), linkIcons[key] || "link", "publication-link"));
    });
    if (publication.bibtex) {
      group.append(d.actionButton({
        text: d.label("bibtex"),
        icon: "copy",
        action: "copy-bibtex",
        className: "publication-link",
        dataset: { publicationId: publication.id }
      }));
    }
    return group;
  }

  function renderPublication(publication, mode) {
    const d = namespace.dom;
    const title = d.translated(publication.title) || (namespace.state.language === "zh" ? "未命名论文" : "Untitled publication");
    const image = d.h("img", {
      className: "publication-image",
      attrs: {
        src: publication.image || "assets/illustrations/share-card.svg",
        alt: d.translated(publication.imageAlt) || title,
        loading: "lazy",
        width: "320",
        height: "200"
      }
    });
    const status = publication.status ? d.h("span", { className: `status publication-status status-${publication.status}`, text: d.statusLabel(publication.status) }) : null;
    const meta = d.h("div", { className: "publication-meta" }, [
      d.h("span", { text: publication.venue || "" }),
      publication.year ? d.h("span", { text: String(publication.year) }) : null,
      status
    ]);
    const tags = d.h("ul", { className: "tag-list publication-tags" }, (publication.tags || []).map((tag) => d.h("li", { text: tag })));
    const content = d.h("div", { className: "publication-content" }, [
      d.h("div", { className: "publication-heading-line" }, [
        d.h("h3", { text: title }),
        publication.selected && mode === "student" ? d.h("span", { className: "selected-mark", text: d.label("selected") }) : null
      ]),
      renderAuthors(publication),
      meta,
      d.h("p", { className: "publication-summary", text: d.translated(publication.summary) }),
      tags
    ]);
    return d.h("article", { className: `publication-item ${publication.selected ? "is-selected" : ""}` }, [image, content, renderLinks(publication)]);
  }

  function collectTags(publications) {
    const counts = new Map();
    publications.forEach((publication) => (publication.tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }

  function renderFilters(publications) {
    const d = namespace.dom;
    const selected = namespace.state.publicationTag || "all";
    const filters = d.h("div", { className: "publication-filters", attrs: { role: "group", "aria-label": d.label("publicationFilters") } });
    const allButton = d.actionButton({
      text: `${d.label("all")} (${publications.length})`,
      action: "filter-publications",
      className: selected === "all" ? "filter-button is-active" : "filter-button",
      dataset: { tag: "all" }
    });
    allButton.setAttribute("aria-pressed", String(selected === "all"));
    filters.append(allButton);
    collectTags(publications).forEach(([tag, count]) => {
      const button = d.actionButton({
        text: `${tag} (${count})`,
        action: "filter-publications",
        className: selected === tag ? "filter-button is-active" : "filter-button",
        dataset: { tag }
      });
      button.setAttribute("aria-pressed", String(selected === tag));
      filters.append(button);
    });
    return filters;
  }

  function filtered(publications) {
    const tag = namespace.state.publicationTag || "all";
    return tag === "all" ? publications : publications.filter((publication) => (publication.tags || []).includes(tag));
  }

  function publicationList(publications, mode) {
    const d = namespace.dom;
    const list = d.h("div", { className: `publication-list publication-list-${mode}`, attrs: { "aria-live": "polite" } });
    if (!publications.length) list.append(d.emptyState(d.label("noPublications")));
    else publications.forEach((publication) => list.append(renderPublication(publication, mode)));
    return list;
  }

  function renderStudent() {
    const d = namespace.dom;
    const publications = Array.isArray(namespace.publications) ? namespace.publications : [];
    const shown = filtered(publications);
    return d.h("section", { id: "publications", className: "page-section publications-section reveal", attrs: { "aria-labelledby": "publications-title" } }, [
      d.h("div", { className: "container" }, [
        d.sectionHeading("publications", d.label("work"), { icon: "paper", english: namespace.state.language === "zh" ? "Publications" : "" }),
        renderFilters(publications),
        d.h("p", { className: "filter-result-count", text: `${shown.length} ${d.label("resultCount")}` }),
        publicationList(shown, "student")
      ])
    ]);
  }

  function renderResearcher() {
    const d = namespace.dom;
    const publications = Array.isArray(namespace.publications) ? namespace.publications : [];
    const selected = publications.filter((publication) => publication.selected);
    const shown = filtered(publications);
    const selectedSection = d.h("section", { id: "selected-publications", className: "page-section selected-publications-section reveal", attrs: { "aria-labelledby": "selected-publications-title" } }, [
      d.h("div", { className: "container" }, [
        d.sectionHeading("selected-publications", d.label("selectedPublications"), { english: namespace.state.language === "zh" ? "Selected Publications" : "" }),
        publicationList(selected, "researcher")
      ])
    ]);
    const allSection = d.h("section", { id: "publications", className: "page-section publications-section reveal", attrs: { "aria-labelledby": "publications-title" } }, [
      d.h("div", { className: "container" }, [
        d.sectionHeading("publications", d.label("publications"), { english: namespace.state.language === "zh" ? "All Publications" : "" }),
        renderFilters(publications),
        d.h("p", { className: "filter-result-count", text: `${shown.length} ${d.label("resultCount")}` }),
        publicationList(shown, "researcher")
      ])
    ]);
    return [selectedSection, allSection];
  }

  namespace.components.publications = { renderStudent, renderResearcher };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
