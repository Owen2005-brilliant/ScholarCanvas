(function initRepeaterEditor(namespace) {
  "use strict";
  const { h, t, icon, button, field } = namespace.ui;

  function itemTitle(type, item, index, language) {
    const paths = {
      news: "text", publications: "title", projects: "name", experience: "organization",
      awards: "title", skills: "category", teaching: "course", service: "activity"
    };
    const value = namespace.stateUtils.getPath(item, paths[type]);
    const resolved = value && typeof value === "object" ? t(value, language) : value;
    return String(resolved || `${t(namespace.schema.sectionLabels[type], language)} ${index + 1}`).slice(0, 80);
  }

  function fieldFor(state, type, index, definition) {
    const path = `content.${type}.${index}.${definition.key}`;
    const value = namespace.stateUtils.getPath(state, path);
    const typeName = definition.type || "text";
    return field({
      path,
      label: t(definition.label, state.language),
      value,
      type: typeName,
      valueType: typeName === "number" ? "number" : typeName === "checkbox" ? "boolean" : "text",
      options: definition.options,
      required: definition.required,
      full: typeName === "textarea"
    });
  }

  function authorEditor(state, publicationIndex, publication) {
    const language = state.language;
    const authors = Array.isArray(publication.authors) ? publication.authors : [];
    return h("section", { class: "setup-author-editor" },
      h("div", { class: "setup-author-editor__heading" },
        h("h4", { text: language === "en" ? "Authors" : "作者" }),
        button(language === "en" ? "Add author" : "新增作者", { variant: "quiet", icon: "plus", dataset: { action: "add-author", publication: publicationIndex } })
      ),
      h("div", { class: "setup-author-list" }, authors.map((author, authorIndex) => h("div", { class: "setup-author-row" },
        field({ path: `content.publications.${publicationIndex}.authors.${authorIndex}.name`, label: language === "en" ? `Author ${authorIndex + 1}` : `作者 ${authorIndex + 1}`, value: author.name, required: true }),
        field({ path: `content.publications.${publicationIndex}.authors.${authorIndex}.self`, label: language === "en" ? "This is me" : "这是我", value: author.self, type: "checkbox", valueType: "boolean" }),
        h("div", { class: "setup-author-actions" },
          button(language === "en" ? "Up" : "上移", { variant: "quiet", icon: "chevronUp", ariaLabel: language === "en" ? "Move author up" : "作者上移", disabled: authorIndex === 0, dataset: { action: "move-author", publication: publicationIndex, author: authorIndex, direction: -1 } }),
          button(language === "en" ? "Down" : "下移", { variant: "quiet", icon: "chevronDown", ariaLabel: language === "en" ? "Move author down" : "作者下移", disabled: authorIndex === authors.length - 1, dataset: { action: "move-author", publication: publicationIndex, author: authorIndex, direction: 1 } }),
          button(language === "en" ? "Remove" : "删除", { variant: "quiet", icon: "trash", ariaLabel: language === "en" ? "Remove author" : "删除作者", disabled: authors.length <= 1, dataset: { action: "remove-author", publication: publicationIndex, author: authorIndex } })
        )
      ))),
      h("p", { class: "setup-field__error", dataset: { errorFor: `content.publications.${publicationIndex}.authors` }, hidden: true })
    );
  }

  function itemCard(state, type, item, index) {
    const schema = namespace.schema.contentSchemas[type];
    const collapsed = Boolean(state.collapsedItems[`${type}.${index}`]);
    const basicFields = schema.fields.filter((definition) => !definition.advanced);
    const advancedFields = schema.fields.filter((definition) => definition.advanced);
    const language = state.language;
    return h("article", { class: `setup-content-card${collapsed ? " is-collapsed" : ""}`, dataset: { itemType: type, itemIndex: index } },
      h("header", { class: "setup-content-card__header" },
        h("button", { class: "setup-content-card__collapse", type: "button", dataset: { action: "toggle-collapse", type, index }, "aria-expanded": String(!collapsed) },
          icon(collapsed ? "chevronDown" : "chevronUp"),
          h("span", {}, h("small", { text: `${index + 1}`.padStart(2, "0") }), h("strong", { text: itemTitle(type, item, index, language) }))
        ),
        h("div", { class: "setup-content-card__actions" },
          button(language === "en" ? "Duplicate" : "复制", { variant: "quiet", icon: "copy", ariaLabel: language === "en" ? `Duplicate item ${index + 1}` : `复制第 ${index + 1} 项`, dataset: { action: "duplicate-item", type, index } }),
          button(language === "en" ? "Up" : "上移", { variant: "quiet", icon: "chevronUp", ariaLabel: language === "en" ? `Move item ${index + 1} up` : `第 ${index + 1} 项上移`, disabled: index === 0, dataset: { action: "move-item", type, index, direction: -1 } }),
          button(language === "en" ? "Down" : "下移", { variant: "quiet", icon: "chevronDown", ariaLabel: language === "en" ? `Move item ${index + 1} down` : `第 ${index + 1} 项下移`, disabled: index === state.content[type].length - 1, dataset: { action: "move-item", type, index, direction: 1 } }),
          button(language === "en" ? "Delete" : "删除", { variant: "danger-quiet", icon: "trash", ariaLabel: language === "en" ? `Delete item ${index + 1}` : `删除第 ${index + 1} 项`, dataset: { action: "remove-item", type, index } })
        )
      ),
      !collapsed ? h("div", { class: "setup-content-card__body" },
        h("div", { class: "setup-form-grid" }, basicFields.map((definition) => fieldFor(state, type, index, definition))),
        type === "publications" ? authorEditor(state, index, item) : null,
        advancedFields.length ? h("details", { class: "setup-advanced" },
          h("summary", {}, h("span", { text: t(namespace.schema.copy.advanced, language) }), icon("chevronDown")),
          h("div", { class: "setup-form-grid" }, advancedFields.map((definition) => fieldFor(state, type, index, definition)))
        ) : null
      ) : null
    );
  }

  function render(state, type) {
    const items = state.content[type] || [];
    const language = state.language;
    return h("section", { class: "setup-repeater", "aria-labelledby": `module-${type}-title` },
      h("div", { class: "setup-repeater__heading" },
        h("div", {}, h("h2", { id: `module-${type}-title`, text: t(namespace.schema.sectionLabels[type], language) }), h("p", { text: language === "en" ? `${items.length} item${items.length === 1 ? "" : "s"}. Changes appear in the preview automatically.` : `共 ${items.length} 项；修改会自动显示在预览中。` })),
        button(`${t(namespace.schema.copy.add, language)}${language === "zh" ? t(namespace.schema.sectionLabels[type], language) : ` ${t(namespace.schema.sectionLabels[type], language)}`}`, { variant: "primary", icon: "plus", dataset: { action: "add-item", type } })
      ),
      items.length ? h("div", { class: "setup-repeater__list" }, items.map((item, index) => itemCard(state, type, item, index))) : h("div", { class: "setup-empty-state" }, icon("file"), h("h3", { text: language === "en" ? "This section is empty" : "此模块暂无内容" }), h("p", { text: language === "en" ? "Add your first item, or leave it empty to use the homepage safe empty state." : "添加第一项内容，或保持为空以使用主页的安全空状态。" }), button(language === "en" ? "Add first item" : "添加第一项", { variant: "primary", icon: "plus", dataset: { action: "add-item", type } }))
    );
  }

  namespace.components.repeaterEditor = { render, itemTitle };
})(window.SCHOLAR_CANVAS_SETUP);
