(function initBrandingForm(namespace) {
  "use strict";
  const { h, t, icon, field, sectionTitle } = namespace.ui;

  const accents = ["#F59E0B", "#EA7A57", "#377D9E", "#5667C9", "#2F866E", "#9B5AA5"];

  function choiceGroup(state, legend, path, choices) {
    const value = namespace.stateUtils.getPath(state, path);
    return h("fieldset", { class: "setup-segment-field" },
      h("legend", { text: legend }),
      h("div", { class: "setup-segmented" }, choices.map((choice) => h("label", { class: value === choice.value ? "is-selected" : "" },
        h("input", { type: "radio", name: path, value: choice.value, checked: value === choice.value, dataset: { path, valueType: "text" } }),
        choice.icon ? icon(choice.icon) : null,
        h("span", { text: choice.label })
      )))
    );
  }

  function renderAppearance(state) {
    const language = state.language;
    const themeChoices = [
      { value: "light", label: language === "en" ? "Light" : "浅色", icon: "sun" },
      { value: "dark", label: language === "en" ? "Dark" : "深色", icon: "moon" },
      { value: "system", label: language === "en" ? "System" : "跟随系统", icon: "refresh" }
    ];
    return h("div", { class: "setup-step" },
      sectionTitle(language === "en" ? "Step 5" : "第 5 步", language === "en" ? "Set a confident visual tone" : "设定清晰而自信的视觉基调", language === "en" ? "A few focused choices keep the ScholarCanvas design coherent and accessible." : "少量而关键的选择，让 ScholarCanvas 始终保持协调与易读。"),
      h("section", { class: "setup-subsection" },
        h("h2", { text: language === "en" ? "Default experience" : "默认体验" }),
        choiceGroup(state, language === "en" ? "Language visitors see first" : "访客首先看到的语言", "language", [
          { value: "zh", label: "中文" }, { value: "en", label: "English" }
        ]),
        choiceGroup(state, language === "en" ? "Theme" : "主题", "site.defaultTheme", themeChoices)
      ),
      h("section", { class: "setup-subsection" },
        h("h2", { text: language === "en" ? "Accent color" : "强调色" }),
        h("p", { class: "setup-subsection__intro", text: language === "en" ? "Choose a preset or enter a valid hexadecimal color." : "选择预设，或输入有效的十六进制颜色。" }),
        h("div", { class: "setup-color-row" },
          h("div", { class: "setup-color-swatches", role: "radiogroup", "aria-label": language === "en" ? "Accent color presets" : "强调色预设" }, accents.map((color) => h("button", { type: "button", role: "radio", class: state.site.accentColor.toLowerCase() === color.toLowerCase() ? "is-selected" : "", "aria-checked": String(state.site.accentColor.toLowerCase() === color.toLowerCase()), "aria-label": color, title: color, style: { "--swatch": color }, dataset: { action: "set-accent", color } }, state.site.accentColor.toLowerCase() === color.toLowerCase() ? icon("check") : null))),
          field({ path: "site.accentColor", label: language === "en" ? "Custom color" : "自定义颜色", value: state.site.accentColor, type: "text", required: true, hint: "Example: #F59E0B" })
        )
      ),
      h("section", { class: "setup-subsection setup-brand-preview", style: { "--setup-accent-preview": state.site.accentColor } },
        h("div", { class: "setup-brand-preview__mark", text: "SC" }),
        h("div", {}, h("span", { text: language === "en" ? "Interface preview" : "界面预览" }), h("strong", { text: t(state.profile.name, language) }), h("p", { text: t(state.profile.tagline, language) })),
        h("span", { class: "setup-brand-preview__button", text: language === "en" ? "View work" : "查看作品" })
      )
    );
  }

  function renderWebsite(state) {
    const language = state.language;
    const url = namespace.serializer.computeSiteUrl(state.site);
    return h("div", { class: "setup-step" },
      sectionTitle(language === "en" ? "Step 6" : "第 6 步", language === "en" ? "Give the site a permanent address" : "为主页设置正式地址", language === "en" ? "These values produce canonical, social, robots, and sitemap URLs without a build step." : "这些设置会生成 Canonical、社交分享、robots 与 sitemap 地址，无需构建流程。"),
      h("section", { class: "setup-subsection" },
        h("h2", { text: language === "en" ? "GitHub Pages" : "GitHub Pages" }),
        h("div", { class: "setup-form-grid" },
          field({ path: "site.githubUsername", label: language === "en" ? "GitHub username" : "GitHub 用户名", value: state.site.githubUsername, required: true, hint: language === "en" ? "Used for username.github.io" : "用于 username.github.io" }),
          field({ path: "site.repositoryName", label: language === "en" ? "Repository name" : "仓库名称", value: state.site.repositoryName, required: true, hint: language === "en" ? "Use username.github.io for a root site." : "根站点仓库应填写 username.github.io。" }),
          field({ path: "site.customUrl", label: language === "en" ? "Custom HTTPS URL (optional)" : "自定义 HTTPS 地址（可选）", value: state.site.customUrl, type: "url", full: true, hint: language === "en" ? "When provided, this overrides the GitHub Pages URL." : "填写后将优先使用此地址。" })
        ),
        h("div", { class: "setup-url-preview" }, icon("globe"), h("div", {}, h("small", { text: language === "en" ? "Generated public URL" : "生成的公开地址" }), h("code", { text: url })))
      ),
      h("section", { class: "setup-subsection" },
        h("h2", { text: language === "en" ? "Search and social sharing" : "搜索与社交分享" }),
        h("div", { class: "setup-form-grid" },
          field({ path: "site.seoTitle.zh", label: "SEO 标题（中文）", value: state.site.seoTitle.zh, required: true }),
          field({ path: "site.seoTitle.en", label: "SEO title (English)", value: state.site.seoTitle.en, required: true }),
          field({ path: "site.seoDescription.zh", label: "SEO 描述（中文）", value: state.site.seoDescription.zh, type: "textarea", required: true }),
          field({ path: "site.seoDescription.en", label: "SEO description (English)", value: state.site.seoDescription.en, type: "textarea", required: true }),
          field({ path: "site.seoKeywords", label: language === "en" ? "Keywords (comma separated)" : "关键词（逗号分隔）", value: state.site.seoKeywords, full: true }),
          field({ path: "site.shareImage", label: language === "en" ? "Social image path" : "社交分享图片路径", value: state.site.shareImage, full: true, hint: "assets/illustrations/share-card.svg" }),
          field({ path: "site.lastUpdated", label: language === "en" ? "Last updated" : "最后更新日期", value: state.site.lastUpdated, type: "date" })
        )
      )
    );
  }

  namespace.components.brandingForm = { renderAppearance, renderWebsite };
})(window.SCHOLAR_CANVAS_SETUP);
