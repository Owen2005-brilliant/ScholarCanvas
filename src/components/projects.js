(function registerProjects(namespace) {
  "use strict";

  const positions = [
    [13, 28], [39, 64], [68, 22], [86, 67], [21, 78], [54, 44], [79, 82], [8, 58], [92, 35], [47, 16], [31, 38], [63, 75]
  ];

  function projectImage(project) {
    const d = namespace.dom;
    return d.h("img", {
      className: "project-image",
      attrs: {
        src: project.image || "assets/illustrations/share-card.svg",
        alt: d.translated(project.imageAlt) || d.translated(project.name),
        loading: "lazy",
        width: "800",
        height: "480"
      }
    });
  }

  function projectTags(project) {
    return namespace.dom.h("ul", { className: "tag-list project-tags" }, (project.tags || []).map((tag) => namespace.dom.h("li", { text: tag })));
  }

  function renderProjectCard(project) {
    const d = namespace.dom;
    return d.h("article", { className: "project-card" }, [
      d.h("div", { className: "project-media" }, [projectImage(project), project.featured ? d.h("span", { className: "project-featured-mark" }, [d.icon("star"), d.h("span", { className: "visually-hidden", text: d.label("selected") })]) : null]),
      d.h("div", { className: "project-card-content" }, [
        d.h("div", { className: "project-card-heading" }, [
          d.h("h3", { text: d.translated(project.name) }),
          d.h("span", { className: `status status-${project.status || "active"}`, text: d.statusLabel(project.status || "active") })
        ]),
        d.h("p", { text: d.translated(project.description) }),
        d.h("div", { className: "project-card-footer" }, [
          projectTags(project),
          d.actionButton({ text: d.label("viewDetails"), icon: "arrow", action: "open-project", className: "project-detail-button", dataset: { projectId: project.id } })
        ])
      ])
    ]);
  }

  function constellationLines() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "constellation-lines");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    ["M13 28 L39 64 L68 22 L86 67", "M13 28 L54 44 L86 67", "M39 64 L54 44 L68 22"].forEach((pathData) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      svg.append(path);
    });
    return svg;
  }

  function renderConstellation(projects) {
    const d = namespace.dom;
    if (projects.length > 12) {
      return d.h("div", { className: "constellation-fallback", dataset: { fallback: "true" } }, [
        d.h("p", { text: d.label("constellationFallback") }),
        d.h("ul", { className: "constellation-fallback-grid" }, projects.map((project) => d.h("li", {}, [
          d.actionButton({ text: d.translated(project.name), icon: "star", action: "open-project", className: "constellation-list-button", dataset: { projectId: project.id } })
        ])))
      ]);
    }
    const field = d.h("div", { className: "constellation-field", dataset: { fallback: "false" } });
    field.append(constellationLines());
    projects.forEach((project, index) => {
      const position = positions[index % positions.length];
      const button = d.actionButton({
        text: d.translated(project.name),
        icon: "star",
        action: "constellation-project",
        className: "constellation-node",
        dataset: { projectId: project.id, constellationProject: project.id }
      });
      button.setAttribute("aria-pressed", "false");
      button.style.setProperty("--node-x", `${position[0]}%`);
      button.style.setProperty("--node-y", `${position[1]}%`);
      button.style.setProperty("--float-delay", `${index * -0.7}s`);
      field.append(button);
    });
    return field;
  }

  function renderInterestDetails() {
    const d = namespace.dom;
    const interests = namespace.profile && Array.isArray(namespace.profile.interests) ? namespace.profile.interests : [];
    return d.h("div", { className: "interest-detail-list" }, interests.map((interest) => d.h("article", { className: "interest-detail" }, [
      d.h("div", { className: "interest-name" }, [d.icon("star"), d.h("h3", { text: d.translated(interest.label) })]),
      d.h("p", { text: d.translated(interest.description) })
    ])));
  }

  function renderStudent() {
    const d = namespace.dom;
    const projects = Array.isArray(namespace.projects) ? namespace.projects : [];
    const featured = projects.filter((project) => project.featured);
    const shown = featured.length ? featured : projects;
    const projectsSection = d.h("section", { id: "projects", className: "page-section projects-section reveal", attrs: { "aria-labelledby": "projects-title" } }, [
      d.h("div", { className: "container" }, [
        d.sectionHeading("projects", d.label("projects"), { icon: "briefcase", english: namespace.state.language === "zh" ? "Projects" : "" }),
        shown.length ? d.h("div", { className: "project-card-rail" }, shown.map(renderProjectCard)) : d.emptyState(d.label("noProjects"))
      ])
    ]);
    const interestsSection = d.h("section", { id: "interests", className: "page-section interests-section reveal", attrs: { "aria-labelledby": "interests-title" } }, [
      d.h("div", { className: "container" }, [
        d.sectionHeading("interests", d.label("interests"), { icon: "spark", description: d.label("constellationHelp") }),
        projects.length ? renderConstellation(projects) : d.emptyState(d.label("noProjects")),
        d.h("p", { className: "visually-hidden", attrs: { "aria-live": "polite" }, dataset: { constellationLive: "true" } }),
        renderInterestDetails()
      ])
    ]);
    return [projectsSection, interestsSection];
  }

  function renderProjectRow(project) {
    const d = namespace.dom;
    const links = d.h("div", { className: "research-project-links" });
    Object.entries(project.links || {}).forEach(([key, url]) => {
      if (!url) return;
      links.append(d.smartLink(url, key === "github" ? "GitHub" : key === "demo" ? "Demo" : d.label("paper"), key === "github" ? "github" : "external", "publication-link"));
    });
    links.append(d.actionButton({ text: d.label("viewDetails"), icon: "arrow", action: "open-project", className: "publication-link", dataset: { projectId: project.id } }));
    return d.h("article", { className: "research-project-row" }, [
      d.h("div", { className: "research-project-main" }, [
        d.h("h3", { text: d.translated(project.name) }),
        d.h("p", { text: d.translated(project.description) })
      ]),
      projectTags(project),
      d.h("span", { className: `status status-${project.status || "active"}`, text: d.statusLabel(project.status || "active") }),
      links
    ]);
  }

  function renderResearcher() {
    const d = namespace.dom;
    const projects = Array.isArray(namespace.projects) ? namespace.projects : [];
    return d.h("section", { id: "projects", className: "page-section research-projects-section reveal", attrs: { "aria-labelledby": "projects-title" } }, [
      d.h("div", { className: "container" }, [
        d.sectionHeading("projects", d.label("researchProjects"), { english: namespace.state.language === "zh" ? "Research Projects" : "" }),
        projects.length ? d.h("div", { className: "research-project-list" }, projects.map(renderProjectRow)) : d.emptyState(d.label("noProjects"))
      ])
    ]);
  }

  namespace.components.projects = { renderStudent, renderResearcher };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
