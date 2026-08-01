(function initBrandingForm(namespace) {
  "use strict";
  const { h, t, icon, button, field, sectionTitle } = namespace.ui;

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

  function seoField(state, key, label, type) {
    const path = namespace.seo.fieldMap[key];
    const mode = state.seoModes[key] === "custom" ? "custom" : "auto";
    const control = field({ path, label, value: namespace.stateUtils.getPath(state, path), type: type || "text", full: type === "textarea" || key === "keywords" });
    control.classList.add("setup-seo-field");
    control.querySelector(".setup-field__label").append(h("span", {
      class: `setup-seo-field__mode setup-seo-field__mode--${mode}`,
      dataset: { seoStatus: key },
      text: mode === "custom" ? (state.language === "en" ? "Customized" : "已自定义") : (state.language === "en" ? "Automatic" : "自动生成")
    }));
    const input = control.querySelector(".setup-input");
    input.dataset.seoKey = key;
    const error = control.querySelector(".setup-field__error");
    control.insertBefore(h("button", {
      type: "button",
      class: "setup-seo-field__reset",
      hidden: mode !== "custom",
      dataset: { action: "reset-seo", seoKey: key },
      text: state.language === "en" ? "Reset to automatic" : "恢复自动生成"
    }), error);
    return control;
  }

  function shareCover(state) {
    const language = state.language;
    const runtime = namespace.store.getRuntimeFiles();
    const hasUpload = Boolean(runtime.shareImage);
    const usingDefault = !hasUpload && state.site.shareImage === namespace.seo.defaultShareImage;
    const preview = runtime.shareImageUrl || state.site.shareImage || namespace.seo.defaultShareImage;
    const path = hasUpload ? namespace.serializer.shareImageExportPath(runtime) : state.site.shareImage;
    const status = hasUpload
      ? (language === "en" ? "Custom cover ready" : "自定义封面已就绪")
      : usingDefault
        ? (language === "en" ? "Using the ScholarCanvas default cover" : "正在使用 ScholarCanvas 默认封面")
        : (language === "en" ? "Using the existing project cover" : "正在使用项目现有封面");
    return h("div", { class: "setup-share-cover" },
      h("div", { class: "setup-share-cover__preview" }, h("img", {
        src: preview,
        alt: language === "en" ? "Current link preview cover" : "当前链接分享封面",
        onerror: (event) => { if (event.currentTarget.src !== new URL(namespace.seo.defaultShareImage, window.location.href).href) event.currentTarget.src = namespace.seo.defaultShareImage; }
      })),
      h("div", { class: "setup-share-cover__body" },
        h("div", { class: "setup-share-cover__status" }, icon("check"), h("strong", { text: status })),
        h("p", { text: language === "en" ? "This image appears when your page link is shared. It stays in this browser until you export or apply the configuration." : "这张图片会用于链接分享预览；在你导出或应用配置前，它只保留在当前浏览器中。" }),
        h("div", { class: "setup-share-cover__path" }, h("span", { text: language === "en" ? "Export path" : "当前导出路径" }), h("code", { text: path })),
        state.shareImageError ? h("p", { class: "setup-field__error", id: "setup-share-image-error", text: t(state.shareImageError, language) }) : null,
        h("div", { class: "setup-share-cover__actions" },
          button(hasUpload ? (language === "en" ? "Replace cover" : "更换封面") : (language === "en" ? "Upload cover image" : "上传新封面"), { icon: "upload", dataset: { action: "open-file", kind: "shareImage", path: "shareImageFile" } }),
          !usingDefault ? button(language === "en" ? "Use default cover" : "恢复默认封面", { variant: "quiet", icon: "refresh", dataset: { action: "restore-share-cover" } }) : null
        ),
        h("input", { id: "setup-shareImage-input", class: "setup-hidden-input", type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg", dataset: { fileAction: "shareImage" } })
      )
    );
  }

  function dateSettings(state) {
    const language = state.language;
    const displayDate = String(state.site.lastUpdated || "").replace(/-/g, "/");
    return h("div", { class: "setup-date-settings" },
      h("div", { class: "setup-date-settings__summary" }, icon("refresh"), h("div", {},
        h("strong", { text: state.useManualDate ? (language === "en" ? "Using a custom update date" : "正在使用手动更新时间") : (language === "en" ? `Automatically use today: ${displayDate}` : `自动使用今天：${displayDate}`) }),
        h("p", { text: language === "en" ? "The date is set once for this setup session and will not change while you edit other details." : "日期会在本次初始化时确定，编辑其他资料时不会反复变化。" })
      )),
      h("label", { class: "setup-manual-date-toggle" },
        h("input", { type: "checkbox", checked: state.useManualDate, dataset: { action: "toggle-manual-date" }, "aria-controls": "setup-manual-date-field" }),
        h("span", { text: language === "en" ? "Set date manually" : "手动设置更新时间" })
      ),
      state.useManualDate ? h("div", { id: "setup-manual-date-field" }, field({ path: "site.lastUpdated", label: language === "en" ? "Website update date" : "网站更新时间", value: state.site.lastUpdated, type: "date" })) : null
    );
  }

  function searchSharing(state) {
    const language = state.language;
    const errors = namespace.seo.searchSharingErrors(namespace.validators.validateState(state));
    const expanded = Boolean(state.advancedSeoExpanded);
    const allAutomatic = Object.values(state.seoModes || {}).every((mode) => mode !== "custom") && state.site.shareImage === namespace.seo.defaultShareImage && !state.useManualDate;
    const successText = allAutomatic
      ? (language === "en" ? "Generated automatically from your profile" : "已根据你的个人资料自动生成")
      : (language === "en" ? "Search and sharing information is ready" : "搜索与分享信息已准备完成");
    return h("section", { class: "setup-subsection setup-search-sharing" },
      h("div", { class: "setup-search-sharing__heading" },
        h("div", {},
          h("h2", { text: language === "en" ? "Search and sharing" : "搜索与分享设置" }),
          h("p", { text: language === "en" ? "This information is not shown in the main page content. It is used for browser titles, search results, and link previews." : "这些内容不会显示在主页正文中，主要用于浏览器标题、搜索结果和链接分享预览。" })
        ),
        h("span", { class: "setup-search-sharing__mark", "aria-hidden": "true" }, icon("globe"))
      ),
      errors.length
        ? h("button", { type: "button", class: "setup-search-sharing__status setup-search-sharing__status--error", dataset: { action: "open-seo-errors" } }, icon("warning"), h("span", { text: language === "en" ? `${errors.length} search and sharing ${errors.length === 1 ? "setting needs" : "settings need"} attention` : `需要检查 ${errors.length} 项搜索与分享设置` }))
        : h("div", { class: "setup-search-sharing__status" }, icon("check"), h("span", { text: successText })),
      h("button", {
        type: "button",
        class: "setup-search-sharing__toggle",
        "aria-expanded": String(expanded),
        "aria-controls": "setup-seo-advanced-panel",
        dataset: { action: "toggle-seo-advanced" }
      }, h("span", { text: expanded ? (language === "en" ? "Hide advanced settings" : "收起高级设置") : (language === "en" ? "Show advanced settings" : "展开高级设置") }), icon(expanded ? "chevronUp" : "chevronDown")),
      h("div", { id: "setup-seo-advanced-panel", class: "setup-search-sharing__advanced", hidden: !expanded },
        h("div", { class: "setup-search-sharing__section" },
          h("div", { class: "setup-search-sharing__section-heading" },
            h("h3", { text: language === "en" ? "Search result text" : "搜索结果文字" }),
            h("p", { text: language === "en" ? "These SEO values stay synchronized with your profile until you edit them." : "这些 SEO 信息会跟随个人资料自动更新；主动编辑后将保留你的自定义内容。" })
          ),
          h("div", { class: "setup-form-grid" },
            seoField(state, "titleZh", "搜索结果标题（中文）"),
            seoField(state, "titleEn", "Search result title (English)"),
            seoField(state, "descriptionZh", "搜索结果简介（中文）", "textarea"),
            seoField(state, "descriptionEn", "Search result description (English)", "textarea"),
            seoField(state, "keywords", language === "en" ? "Website keywords" : "网站关键词")
          )
        ),
        h("div", { class: "setup-search-sharing__section" },
          h("div", { class: "setup-search-sharing__section-heading" },
            h("h3", { text: language === "en" ? "Link preview cover" : "链接分享封面" }),
            h("p", { text: language === "en" ? "PNG, JPG, WebP, or SVG, up to 5MB. Nothing is uploaded." : "支持 PNG、JPG、WebP 或 SVG，最大 5MB；图片不会上传。" })
          ),
          shareCover(state)
        ),
        h("div", { class: "setup-search-sharing__section" },
          h("div", { class: "setup-search-sharing__section-heading" },
            h("h3", { text: language === "en" ? "Website update date" : "网站更新时间" }),
            h("p", { text: language === "en" ? "Used in the footer and generated sitemap." : "用于页脚和自动生成的站点地图。" })
          ),
          dateSettings(state)
        )
      )
    );
  }

  function renderWebsite(state) {
    const language = state.language;
    const url = namespace.serializer.computeSiteUrl(state.site);
    return h("div", { class: "setup-step" },
      sectionTitle(language === "en" ? "Step 6" : "第 6 步", language === "en" ? "Give the site a permanent address" : "为主页设置正式地址", language === "en" ? "Set the public address. Search and sharing information will be prepared automatically from your profile." : "填写公开地址，其余搜索与分享信息会根据个人资料自动准备。"),
      h("section", { class: "setup-subsection" },
        h("h2", { text: language === "en" ? "GitHub Pages" : "GitHub Pages" }),
        h("div", { class: "setup-form-grid" },
          field({ path: "site.githubUsername", label: language === "en" ? "GitHub username" : "GitHub 用户名", value: state.site.githubUsername, required: true, hint: language === "en" ? "Used for username.github.io" : "用于 username.github.io" }),
          field({ path: "site.repositoryName", label: language === "en" ? "Repository name" : "仓库名称", value: state.site.repositoryName, required: true, hint: language === "en" ? "Use username.github.io for a root site." : "根站点仓库应填写 username.github.io。" }),
          field({ path: "site.customUrl", label: language === "en" ? "Custom HTTPS URL (optional)" : "自定义 HTTPS 地址（可选）", value: state.site.customUrl, type: "url", full: true, hint: language === "en" ? "When provided, this overrides the GitHub Pages URL." : "填写后将优先使用此地址。" })
        ),
        h("div", { class: "setup-url-preview" }, icon("globe"), h("div", {}, h("small", { text: language === "en" ? "Generated public URL" : "生成的公开地址" }), h("code", { text: url })))
      ),
      searchSharing(state)
    );
  }

  namespace.components.brandingForm = { renderAppearance, renderWebsite, searchSharing, seoField, shareCover, dateSettings };
})(window.SCHOLAR_CANVAS_SETUP);
