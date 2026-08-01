(function initSetupSeo(namespace) {
  "use strict";

  const defaultShareImage = "assets/illustrations/share-card.svg";
  const baseKeywords = ["academic homepage", "student portfolio", "researcher", "bilingual"];
  const fieldMap = {
    titleZh: "site.seoTitle.zh",
    titleEn: "site.seoTitle.en",
    descriptionZh: "site.seoDescription.zh",
    descriptionEn: "site.seoDescription.en",
    keywords: "site.seoKeywords"
  };
  const placeholders = new Set([
    "你的姓名", "your name", "你的身份", "your role", "你的学校", "your university",
    "你的学院", "your school or department", "你的研究兴趣", "your research interest"
  ]);

  function getPath(object, path) {
    return String(path || "").split(".").filter(Boolean).reduce((value, key) => value === undefined || value === null ? undefined : value[key], object);
  }

  function setPath(object, path, value) {
    const parts = String(path || "").split(".").filter(Boolean);
    let target = object;
    parts.slice(0, -1).forEach((key) => {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      target = target[key];
    });
    if (parts.length) target[parts[parts.length - 1]] = value;
  }

  function text(value) {
    if (typeof value !== "string" && typeof value !== "number") return "";
    const result = String(value).replace(/\s+/g, " ").trim();
    return placeholders.has(result.toLowerCase()) ? "" : result;
  }

  function localDate(date) {
    const value = date || new Date();
    const pad = (number) => String(number).padStart(2, "0");
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  }

  function stableUnique(values) {
    const seen = new Set();
    return values.map(text).filter((value) => {
      if (!value) return false;
      const key = value.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function interestLabels(profile, language) {
    return stableUnique((profile && profile.interests || []).map((interest) => interest && interest.label && interest.label[language]));
  }

  function englishList(values) {
    if (values.length < 2) return values[0] || "";
    if (values.length === 2) return `${values[0]} and ${values[1]}`;
    return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
  }

  function truncate(value, limit) {
    const result = String(value || "").trim();
    if (result.length <= limit) return result;
    return `${result.slice(0, Math.max(1, limit - 1)).replace(/[，,;；、\s]+$/u, "")}…`;
  }

  function generate(profile) {
    const value = profile || {};
    const nameZh = text(value.name && value.name.zh);
    const nameEn = text(value.name && value.name.en);
    const identityZh = text(value.identity && value.identity.zh);
    const identityEn = text(value.identity && value.identity.en);
    const interestsZh = interestLabels(value, "zh");
    const interestsEn = interestLabels(value, "en");
    const titleZh = nameZh ? `${nameZh}的个人主页${identityZh ? `｜${identityZh}` : ""}` : "我的学术主页";
    const titleEn = nameEn ? `${nameEn} | ${identityEn || "Academic Homepage"}` : "My Academic Homepage";
    const descriptionZh = `${nameZh ? `${nameZh}的` : ""}个人学术主页，展示${interestsZh.length ? `${interestsZh.join("、")}方向的` : ""}科研项目、论文与个人经历。`;
    const descriptionEn = `${nameEn ? `${nameEn}'s` : "An"} academic homepage, featuring research, publications, projects, and experience${interestsEn.length ? ` in ${englishList(interestsEn)}` : ""}.`;
    const keywords = stableUnique([
      nameZh,
      nameEn,
      text(value.school && value.school.zh),
      text(value.school && value.school.en),
      text(value.affiliation && value.affiliation.zh),
      text(value.affiliation && value.affiliation.en),
      ...interestsZh,
      ...interestsEn,
      ...baseKeywords
    ]);
    return {
      titleZh: truncate(titleZh, 80),
      titleEn: truncate(titleEn, 80),
      descriptionZh: truncate(descriptionZh, 160),
      descriptionEn: truncate(descriptionEn, 200),
      keywords: keywords.join(", ")
    };
  }

  function validMode(value) {
    return value === "custom" ? "custom" : "auto";
  }

  function inferModes(state, generated) {
    const modes = {};
    Object.entries(fieldMap).forEach(([key, path]) => {
      const existing = text(getPath(state, path));
      modes[key] = existing && existing !== text(generated[key]) ? "custom" : "auto";
    });
    return modes;
  }

  function syncAutomatic(state) {
    const generated = generate(state.profile);
    state.seoModes = state.seoModes || {};
    state.seoOverrides = state.seoOverrides || {};
    Object.entries(fieldMap).forEach(([key, path]) => {
      state.seoModes[key] = validMode(state.seoModes[key]);
      if (state.seoModes[key] === "custom") {
        const custom = Object.prototype.hasOwnProperty.call(state.seoOverrides, key) ? state.seoOverrides[key] : getPath(state, path);
        state.seoOverrides[key] = custom === undefined || custom === null ? "" : String(custom);
        setPath(state, path, state.seoOverrides[key]);
      } else {
        state.seoOverrides[key] = "";
        setPath(state, path, generated[key]);
      }
    });
    return generated;
  }

  function initializeState(state, options) {
    const settings = options || {};
    const generated = generate(state.profile);
    let modes;
    if (settings.forceMode === "auto" || settings.forceMode === "custom") {
      modes = Object.fromEntries(Object.keys(fieldMap).map((key) => [key, settings.forceMode]));
    } else if (settings.modes && typeof settings.modes === "object") {
      modes = Object.fromEntries(Object.keys(fieldMap).map((key) => [key, validMode(settings.modes[key])]));
    } else {
      modes = inferModes(state, generated);
    }
    state.seoModes = modes;
    state.seoOverrides = Object.assign({}, settings.overrides || {});
    if (settings.forceMode === "custom") {
      Object.entries(fieldMap).forEach(([key, path]) => { state.seoOverrides[key] = getPath(state, path) || ""; });
    }
    state.advancedSeoExpanded = Boolean(state.advancedSeoExpanded);
    state.shareImageFile = state.shareImageFile && typeof state.shareImageFile === "object" ? state.shareImageFile : null;
    state.shareImageError = null;
    state.site.shareImage = text(state.site.shareImage) || defaultShareImage;
    const today = localDate();
    state.automaticLastUpdated = /^\d{4}-\d{2}-\d{2}$/.test(String(state.automaticLastUpdated || "")) ? state.automaticLastUpdated : (String(state.site.lastUpdated || "") || today);
    if (settings.forceAutomaticDate) state.automaticLastUpdated = today;
    if (settings.forceManualDate) state.useManualDate = true;
    else if (typeof state.useManualDate !== "boolean") state.useManualDate = Boolean(state.site.lastUpdated && state.site.lastUpdated !== state.automaticLastUpdated);
    if (!state.useManualDate) state.site.lastUpdated = state.automaticLastUpdated;
    syncAutomatic(state);
    return state;
  }

  function setCustom(state, key, value) {
    if (!Object.prototype.hasOwnProperty.call(fieldMap, key)) return false;
    state.seoModes[key] = "custom";
    state.seoOverrides[key] = value === undefined || value === null ? "" : String(value);
    setPath(state, fieldMap[key], state.seoOverrides[key]);
    return true;
  }

  function resetAutomatic(state, key) {
    if (!Object.prototype.hasOwnProperty.call(fieldMap, key)) return false;
    state.seoModes[key] = "auto";
    state.seoOverrides[key] = "";
    syncAutomatic(state);
    return true;
  }

  function setManualDate(state, enabled) {
    state.useManualDate = Boolean(enabled);
    if (!state.useManualDate) state.site.lastUpdated = state.automaticLastUpdated || localDate();
    return state.site.lastUpdated;
  }

  function searchSharingErrors(validation) {
    const prefixes = ["site.seoTitle.", "site.seoDescription.", "site.seoKeywords", "site.shareImage", "site.lastUpdated", "site.customUrl", "shareImageFile"];
    return (validation && validation.errors || []).filter((error) => prefixes.some((prefix) => error.path === prefix || error.path.startsWith(prefix)));
  }

  namespace.seo = {
    defaultShareImage,
    baseKeywords,
    fieldMap,
    text,
    localDate,
    stableUnique,
    generate,
    initializeState,
    syncAutomatic,
    setCustom,
    resetAutomatic,
    setManualDate,
    searchSharingErrors
  };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
