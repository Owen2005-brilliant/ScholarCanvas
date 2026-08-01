(function initSectionSelector(namespace) {
  "use strict";
  const { h, t, icon, sectionTitle } = namespace.ui;

  const descriptions = {
    news: { zh: "近期动态、录用消息与职业进展", en: "Recent updates, acceptances, and career news" },
    publications: { zh: "论文、预印本与研究成果", en: "Papers, preprints, and research outputs" },
    projects: { zh: "研究项目与实践作品", en: "Research projects and practical work" },
    experience: { zh: "教育、实习与工作经历", en: "Education, internships, and work" },
    awards: { zh: "奖学金、荣誉与竞赛奖项", en: "Scholarships, honors, and awards" },
    skills: { zh: "方法、工具与技术能力", en: "Methods, tools, and technical skills" },
    teaching: { zh: "课程与教学经历", en: "Courses and teaching experience" },
    service: { zh: "评审、组织与社区贡献", en: "Reviewing, organizing, and community work" }
  };

  function render(state) {
    const language = state.language;
    return h("div", { class: "setup-step" },
      sectionTitle(language === "en" ? "Step 3" : "第 3 步", language === "en" ? "Shape the story your homepage tells" : "决定主页要讲述什么", language === "en" ? "Recommendations change with your mode. Your manual choices are always preserved." : "推荐项会随模式变化；你手动做出的选择始终会保留。"),
      h("div", { class: "setup-recommendation-note" }, icon("check"), h("span", { text: language === "en" ? `${state.mode === "student" ? "Student" : "Researcher"} recommendations are active` : `已应用${state.mode === "student" ? "学生" : "研究者"}模式推荐` })),
      h("div", { class: "setup-section-grid" }, namespace.schema.sectionKeys.map((key) => {
        const enabled = Boolean(state.sections[key]);
        const recommended = Boolean(namespace.schema.recommendations[state.mode][key]);
        const count = (state.content[key] || []).length;
        return h("label", { class: `setup-section-toggle${enabled ? " is-enabled" : ""}` },
          h("input", { type: "checkbox", checked: enabled, dataset: { action: "toggle-section", section: key } }),
          h("span", { class: "setup-section-toggle__mark" }, enabled ? icon("check") : null),
          h("span", { class: "setup-section-toggle__body" },
            h("span", { class: "setup-section-toggle__title" }, h("strong", { text: t(namespace.schema.sectionLabels[key], language) }), recommended ? h("small", { text: language === "en" ? "Recommended" : "推荐" }) : null),
            h("span", { text: t(descriptions[key], language) }),
            h("span", { class: "setup-section-toggle__count", text: language === "en" ? `${count} item${count === 1 ? "" : "s"}` : `${count} 项内容` })
          )
        );
      })),
      h("aside", { class: "setup-help-note" }, h("strong", { text: language === "en" ? "Nothing is deleted when a section is turned off." : "关闭模块不会删除内容。" }), h("p", { text: language === "en" ? "You can turn it back on later. Disabled content stays in your draft and export data." : "之后可随时重新开启；已关闭模块的内容仍保留在草稿和导出数据中。" }))
    );
  }

  namespace.components.sectionSelector = { render };
})(window.SCHOLAR_CANVAS_SETUP);
