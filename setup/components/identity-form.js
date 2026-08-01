(function initIdentityForm(namespace) {
  "use strict";
  const { h, t, icon, button, field, sectionTitle } = namespace.ui;

  function pair(state, root, key, labelZh, labelEn, options) {
    const settings = options || {};
    return [
      field({ path: `${root}.${key}.zh`, label: `${labelZh}（中文）`, value: namespace.stateUtils.getPath(state, `${root}.${key}.zh`), required: settings.required, type: settings.type || "text", full: settings.full }),
      field({ path: `${root}.${key}.en`, label: `${labelEn} (English)`, value: namespace.stateUtils.getPath(state, `${root}.${key}.en`), required: settings.required, type: settings.type || "text", full: settings.full })
    ];
  }

  function fileCard(kind, state) {
    const isAvatar = kind === "avatar";
    const file = state.files[kind];
    const runtime = namespace.store.getRuntimeFiles();
    const preview = isAvatar ? runtime.avatarUrl || state.profile.avatar : "";
    return h("div", { class: "setup-file-card" },
      isAvatar ? h("div", { class: "setup-avatar-preview" }, h("img", { src: preview, alt: t(state.profile.avatarAlt, state.language) })) : h("div", { class: "setup-file-card__icon" }, icon("file")),
      h("div", { class: "setup-file-card__body" },
        h("strong", { text: isAvatar ? (state.language === "en" ? "Profile image" : "个人头像") : (state.language === "en" ? "Curriculum vitae" : "个人简历") }),
        h("span", { text: file ? `${file.name} · ${Math.ceil(file.size / 1024)} KB` : isAvatar ? "PNG / JPG / WebP / SVG · ≤ 5MB" : "PDF · ≤ 20MB" })
      ),
      button(file ? (state.language === "en" ? "Replace" : "更换") : (state.language === "en" ? "Choose file" : "选择文件"), { icon: "upload", dataset: { action: "open-file", kind } }),
      file ? button(state.language === "en" ? "Remove" : "移除", { variant: "quiet", icon: "trash", ariaLabel: state.language === "en" ? `Remove ${kind}` : `移除${isAvatar ? "头像" : "简历"}`, dataset: { action: "remove-file", kind } }) : null,
      h("input", { id: `setup-${kind}-input`, class: "setup-hidden-input", type: "file", accept: isAvatar ? "image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg" : "application/pdf,.pdf", dataset: { fileAction: kind } })
    );
  }

  function interestEditor(state) {
    const language = state.language;
    return h("section", { class: "setup-subsection" },
      h("div", { class: "setup-subsection__heading" },
        h("div", {}, h("h2", { text: state.language === "en" ? "Research interests" : "研究兴趣" }), h("p", { text: state.language === "en" ? "Add concise themes that help visitors understand your direction." : "用简洁主题帮助访客理解你的方向。" })),
        button(state.language === "en" ? "Add interest" : "新增兴趣", { icon: "plus", dataset: { action: "add-interest" } })
      ),
        h("div", { class: "setup-interest-list" }, (state.profile.interests || []).map((item, index) => h("div", { class: "setup-interest-row" },
        h("div", { class: "setup-form-grid" },
          field({ path: `profile.interests.${index}.id`, label: language === "en" ? "Unique ID" : "唯一 ID", value: item.id, required: true, hint: language === "en" ? "Generated from the English name; advanced users may edit it." : "根据英文名称自动生成；高级用户可修改。" }),
          field({ path: `profile.interests.${index}.label.zh`, label: "兴趣名称（中文）", value: item.label && item.label.zh, required: true }),
          field({ path: `profile.interests.${index}.label.en`, label: "Interest (English)", value: item.label && item.label.en, required: true }),
          field({ path: `profile.interests.${index}.description.zh`, label: "简短说明（中文）", value: item.description && item.description.zh, type: "textarea" }),
          field({ path: `profile.interests.${index}.description.en`, label: "Description (English)", value: item.description && item.description.en, type: "textarea" })
        ),
        h("div", { class: "setup-interest-actions" },
          button(state.language === "en" ? "Move up" : "上移", { variant: "quiet", icon: "chevronUp", dataset: { action: "move-interest", index, direction: -1 }, disabled: index === 0 }),
          button(state.language === "en" ? "Move down" : "下移", { variant: "quiet", icon: "chevronDown", dataset: { action: "move-interest", index, direction: 1 }, disabled: index === state.profile.interests.length - 1 }),
          button(state.language === "en" ? "Remove interest" : "删除兴趣", { variant: "danger-quiet", icon: "trash", dataset: { action: "remove-interest", index }, disabled: state.profile.interests.length <= 1 })
        )
      )))
    );
  }

  function render(state) {
    const language = state.language;
    return h("div", { class: "setup-step" },
      sectionTitle(language === "en" ? "Step 2" : "第 2 步", language === "en" ? "Introduce the person behind the work" : "介绍作品背后的你", language === "en" ? "Core identity is bilingual so every visitor receives a complete introduction." : "核心身份信息采用中英双语，让每位访客都能获得完整介绍。"),
      h("section", { class: "setup-subsection" },
        h("h2", { text: language === "en" ? "Identity" : "身份信息" }),
        h("div", { class: "setup-form-grid" },
          ...pair(state, "profile", "name", "姓名", "Name", { required: true }),
          ...pair(state, "profile", "identity", "身份", "Role", { required: true }),
          ...pair(state, "profile", "school", "学校", "University", { required: true }),
          ...pair(state, "profile", "affiliation", "学院 / 系", "School / Department", { required: true }),
          ...pair(state, "profile", "lab", "实验室", "Lab"),
          ...pair(state, "profile", "advisor", "导师", "Advisor"),
          ...pair(state, "profile", "location", "所在地", "Location"),
          field({ path: "profile.email", label: language === "en" ? "Email" : "邮箱", value: state.profile.email, type: "email", required: true, autocomplete: "email" })
        )
      ),
      h("section", { class: "setup-subsection" },
        h("h2", { text: language === "en" ? "Biography" : "个人介绍" }),
        h("div", { class: "setup-form-grid" },
          ...pair(state, "profile", "tagline", "个人宣言", "Tagline", { type: "textarea" }),
          ...pair(state, "profile", "bio", "详细简介", "Biography", { type: "textarea" }),
          ...pair(state, "profile", "shortBio", "可复制短简介", "Copyable short bio", { type: "textarea" }),
          ...pair(state, "profile", "avatarAlt", "头像替代文本", "Avatar alt text")
        )
      ),
      h("section", { class: "setup-subsection" },
        h("h2", { text: language === "en" ? "Files" : "文件" }),
        h("p", { class: "setup-subsection__intro", text: language === "en" ? "Files stay on this device until you explicitly export or write them." : "文件只保留在当前设备，直到你主动导出或写入文件夹。" }),
        h("div", { class: "setup-file-grid" }, fileCard("avatar", state), fileCard("cv", state))
      ),
      interestEditor(state),
      h("details", { class: "setup-advanced" },
        h("summary", {}, h("span", { text: language === "en" ? "Links and current focus" : "链接与当前关注" }), icon("chevronDown")),
        h("div", { class: "setup-form-grid" },
          ...["github", "scholar", "orcid", "linkedin", "cv", "website"].map((key) => field({ path: `profile.links.${key}`, label: key === "github" ? "GitHub" : key === "cv" ? "CV URL" : key[0].toUpperCase() + key.slice(1), value: state.profile.links[key], type: "url" })),
          ...pair(state, "profile.currentFocus", "title", "当前关注标题", "Current focus title"),
          ...pair(state, "profile.currentFocus", "text", "当前关注内容", "Current focus text", { type: "textarea" }),
          ...pair(state, "profile.currentFocus", "detail", "当前关注补充", "Current focus detail", { type: "textarea" })
        )
      )
    );
  }

  namespace.components.identityForm = { render };
})(window.SCHOLAR_CANVAS_SETUP);
