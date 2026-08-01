(function initSetupState(namespace) {
  "use strict";

  const schema = namespace.schema;

  function deepClone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function getPath(object, path) {
    return String(path || "").split(".").filter(Boolean).reduce((value, key) => value === undefined || value === null ? undefined : value[key], object);
  }

  function setPath(object, path, value) {
    const parts = String(path || "").split(".").filter(Boolean);
    if (!parts.length) return object;
    let target = object;
    parts.slice(0, -1).forEach((key) => {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      target = target[key];
    });
    target[parts[parts.length - 1]] = value;
    return object;
  }

  function slugify(value, fallback) {
    const normalized = String(value || "")
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 56);
    return normalized || fallback || `item-${Date.now()}`;
  }

  function splitLines(value) {
    return String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  }

  function splitTags(value) {
    return String(value || "").split(/[,，]/).map((item) => item.trim()).filter(Boolean);
  }

  function bilingualPlaceholder(kind) {
    const values = {
      project: { zh: "请替换为你的项目", en: "Replace with your project" },
      publication: { zh: "请替换为你的论文", en: "Replace with your publication" },
      experience: { zh: "请替换为你的经历", en: "Replace with your experience" },
      award: { zh: "请替换为你的奖项", en: "Replace with your award" },
      news: { zh: "请替换为你的动态", en: "Replace with your news" },
      teaching: { zh: "请替换为你的课程", en: "Replace with your course" },
      service: { zh: "请替换为你的学术服务", en: "Replace with your academic service" }
    };
    return values[kind] || { zh: "请替换此内容", en: "Replace this content" };
  }

  function emptyContent() {
    return { news: [], publications: [], projects: [], experience: [], awards: [], skills: [], teaching: [], service: [] };
  }

  function createItem(type, index) {
    const suffix = Number.isFinite(index) ? index + 1 : 1;
    if (type === "news") {
      return { id: `news-${suffix}`, date: "2026-08", text: bilingualPlaceholder("news"), type: "other", highlight: false, link: "" };
    }
    if (type === "publications") {
      return {
        id: `replace-publication-${suffix}`,
        title: bilingualPlaceholder("publication"),
        authors: [{ name: "Your Name", self: true }],
        venue: "Your venue",
        year: 2026,
        status: "work-in-progress",
        selected: true,
        tagsText: "",
        summary: { zh: "", en: "" },
        links: {},
        bibtex: "",
        image: "",
        imageAlt: { zh: "", en: "" }
      };
    }
    if (type === "projects") {
      return {
        id: `replace-project-${suffix}`,
        name: bilingualPlaceholder("project"),
        description: { zh: "请在这里概括项目解决的问题。", en: "Summarize the problem your project solves." },
        details: { zh: "", en: "" },
        tagsText: "",
        status: "active",
        featured: true,
        links: {},
        image: "",
        imageAlt: { zh: "", en: "" }
      };
    }
    if (type === "experience") {
      return {
        id: `replace-experience-${suffix}`,
        type: "education",
        organization: bilingualPlaceholder("experience"),
        role: { zh: "你的角色", en: "Your role" },
        startDate: "2025.09",
        endDate: "Present",
        location: { zh: "", en: "" },
        highlightsZh: "请写下一项成果",
        highlightsEn: "Add one outcome",
        logo: ""
      };
    }
    if (type === "awards") {
      return {
        id: `replace-award-${suffix}`,
        title: bilingualPlaceholder("award"),
        organization: { zh: "", en: "" },
        date: "2026",
        category: "other",
        description: { zh: "", en: "" }
      };
    }
    if (type === "skills") {
      return { id: `skills-${suffix}`, category: { zh: "技能分类", en: "Skill category" }, itemsText: "请替换技能\nReplace this skill" };
    }
    if (type === "teaching") {
      return {
        id: `replace-teaching-${suffix}`,
        course: bilingualPlaceholder("teaching"),
        role: { zh: "你的角色", en: "Your role" },
        term: { zh: "2026 秋", en: "Fall 2026" },
        description: { zh: "", en: "" },
        link: ""
      };
    }
    return {
      id: `replace-service-${suffix}`,
      type: { zh: "类型", en: "Type" },
      activity: bilingualPlaceholder("service"),
      organization: { zh: "", en: "" },
      period: "2026",
      description: { zh: "", en: "" },
      link: ""
    };
  }

  function baseProfile() {
    return {
      fictional: false,
      name: { zh: "你的姓名", en: "Your Name" },
      identity: { zh: "你的身份", en: "Your role" },
      school: { zh: "你的学校", en: "Your University" },
      affiliation: { zh: "你的学院", en: "Your School or Department" },
      lab: { zh: "", en: "" },
      advisor: { zh: "", en: "" },
      location: { zh: "", en: "" },
      tagline: { zh: "写下一句你的个人宣言。", en: "Write a short personal statement." },
      bio: { zh: "请在这里介绍你的学习、研究与项目方向。", en: "Introduce your studies, research, and project interests here." },
      shortBio: { zh: "请填写一段可复制的短简介。", en: "Add a short biography that visitors can copy." },
      email: "you@example.com",
      avatar: "assets/avatar/profile-placeholder.svg",
      avatarAlt: { zh: "个人头像占位图", en: "Profile avatar placeholder" },
      currentFocus: {
        title: { zh: "当前关注", en: "Current focus" },
        text: { zh: "请填写关注方向", en: "Add your current focus" },
        detail: { zh: "", en: "" }
      },
      interests: [
        { id: "your-interest", label: { zh: "你的研究兴趣", en: "Your research interest" }, description: { zh: "请补充中文说明。", en: "Add an English description." } }
      ],
      links: { github: "", scholar: "", orcid: "", linkedin: "", cv: "", website: "" }
    };
  }

  function baseSite(mode) {
    return {
      githubUsername: "your-username",
      repositoryName: "ScholarCanvas",
      customUrl: "",
      defaultLanguage: "zh",
      defaultTheme: "system",
      accentColor: "#F59E0B",
      seoTitle: { zh: "", en: "" },
      seoDescription: { zh: "", en: "" },
      seoKeywords: "academic homepage, student portfolio, researcher, bilingual",
      shareImage: namespace.seo.defaultShareImage,
      lastUpdated: namespace.seo.localDate(),
      mode
    };
  }

  function createMinimal(mode) {
    const normalizedMode = mode === "researcher" ? "researcher" : "student";
    const content = emptyContent();
    if (normalizedMode === "researcher") {
      content.news.push(createItem("news", 0));
      content.publications.push(createItem("publications", 0));
      content.projects.push(createItem("projects", 0));
      content.teaching.push(createItem("teaching", 0));
      content.service.push(createItem("service", 0));
      content.awards.push(createItem("awards", 0));
    } else {
      content.projects.push(createItem("projects", 0));
      content.experience.push(createItem("experience", 0));
      content.awards.push(createItem("awards", 0));
      content.skills.push(createItem("skills", 0));
    }
    const state = {
      version: 1,
      mode: normalizedMode,
      language: "zh",
      theme: "light",
      currentStep: 0,
      mobilePane: "edit",
      previewDevice: "desktop",
      source: "minimal",
      sections: deepClone(schema.recommendations[normalizedMode]),
      sectionTouched: {},
      site: baseSite(normalizedMode),
      profile: baseProfile(),
      content,
      activeModule: normalizedMode === "researcher" ? "publications" : "projects",
      collapsedItems: {},
      advancedItems: {},
      files: { avatar: null, cv: null },
      seoModes: {},
      seoOverrides: {},
      advancedSeoExpanded: false,
      shareImageFile: null,
      shareImageError: null,
      automaticLastUpdated: namespace.seo.localDate(),
      useManualDate: false,
      dirty: false,
      draftSaved: false,
      exportStatus: "idle"
    };
    return namespace.seo.initializeState(state, { forceMode: "auto", forceAutomaticDate: true });
  }

  function bilingualLines(items) {
    return (Array.isArray(items) ? items : []).map((item) => {
      if (item && typeof item === "object") return `${item.zh || ""} || ${item.en || ""}`.trim();
      return String(item || "");
    }).filter(Boolean).join("\n");
  }

  function fromCurrentConfig(config) {
    const current = config || {};
    const mode = current.site && current.site.mode === "researcher" ? "researcher" : "student";
    const state = createMinimal(mode);
    state.source = "current";
    state.site = Object.assign(baseSite(mode), {
      defaultLanguage: current.site && current.site.defaultLanguage || "zh",
      defaultTheme: current.site && current.site.defaultTheme || "system",
      accentColor: current.site && current.site.accentColor || "#F59E0B",
      seoTitle: deepClone(current.site && current.site.seo && current.site.seo.title || baseSite(mode).seoTitle),
      seoDescription: deepClone(current.site && current.site.seo && current.site.seo.description || baseSite(mode).seoDescription),
      seoKeywords: (current.site && current.site.seo && current.site.seo.keywords || []).join(", "),
      shareImage: current.site && current.site.seo && current.site.seo.shareImage || "assets/illustrations/share-card.svg",
      lastUpdated: current.site && current.site.lastUpdated || "2026-08-01",
      mode
    });
    state.language = state.site.defaultLanguage;
    const siteUrl = current.site && current.site.seo && current.site.seo.siteUrl || "";
    const pagesMatch = siteUrl.match(/^https:\/\/([A-Za-z0-9-]+)\.github\.io(?:\/([^/]+))?\/?$/);
    if (pagesMatch) {
      state.site.githubUsername = pagesMatch[1];
      state.site.repositoryName = pagesMatch[2] || `${pagesMatch[1]}.github.io`;
    } else if (siteUrl) state.site.customUrl = siteUrl;
    state.sections = Object.assign({}, schema.recommendations[mode], deepClone(current.site && current.site.sections || {}));
    state.profile = Object.assign(baseProfile(), deepClone(current.profile || {}));
    state.profile.links = Object.assign(baseProfile().links, deepClone(current.profile && current.profile.links || {}));
    state.content = {
      news: deepClone(current.news || []),
      publications: deepClone(current.publications || []).map((item) => Object.assign({}, item, { tagsText: (item.tags || []).join(", "), links: Object.assign({}, item.links || {}) })),
      projects: deepClone(current.projects || []).map((item) => Object.assign({}, item, { tagsText: (item.tags || []).join(", "), links: Object.assign({}, item.links || {}) })),
      experience: deepClone(current.experience || []).map((item) => Object.assign({}, item, {
        startDate: item.period || "",
        endDate: "",
        highlightsZh: (item.highlights || []).map((value) => value && typeof value === "object" ? value.zh || "" : value).filter(Boolean).join("\n"),
        highlightsEn: (item.highlights || []).map((value) => value && typeof value === "object" ? value.en || "" : value).filter(Boolean).join("\n")
      })),
      awards: deepClone(current.awards || []).map((item) => Object.assign({}, item, { date: String(item.year || item.date || "") })),
      skills: deepClone(current.skills || []).map((item) => Object.assign({}, item, { itemsText: bilingualLines(item.items) })),
      teaching: deepClone(current.teaching || []),
      service: deepClone(current.service || [])
    };
    state.activeModule = mode === "researcher" ? "publications" : "projects";
    state.files = { avatar: null, cv: null };
    namespace.seo.initializeState(state, { forceMode: "custom", forceManualDate: true });
    state.dirty = false;
    return state;
  }

  function normalizeImportedState(input) {
    const base = createMinimal(input && input.mode);
    const incoming = deepClone(input || {});
    const imported = Object.assign({}, base, incoming);
    imported.site = Object.assign({}, base.site, incoming.site || {});
    ["seoTitle", "seoDescription"].forEach((key) => {
      imported.site[key] = Object.assign({}, base.site[key], incoming.site && incoming.site[key] || {});
    });
    imported.profile = Object.assign({}, base.profile, incoming.profile || {});
    ["name", "identity", "school", "affiliation", "lab", "advisor", "location", "tagline", "bio", "shortBio", "avatarAlt"].forEach((key) => {
      imported.profile[key] = Object.assign({}, base.profile[key], incoming.profile && incoming.profile[key] || {});
    });
    imported.profile.currentFocus = Object.assign({}, base.profile.currentFocus, incoming.profile && incoming.profile.currentFocus || {});
    ["title", "text", "detail"].forEach((key) => {
      imported.profile.currentFocus[key] = Object.assign({}, base.profile.currentFocus[key], incoming.profile && incoming.profile.currentFocus && incoming.profile.currentFocus[key] || {});
    });
    imported.profile.links = Object.assign({}, base.profile.links, incoming.profile && incoming.profile.links || {});
    imported.sections = Object.assign({}, base.sections, incoming.sections || {});
    imported.sectionTouched = Object.assign({}, base.sectionTouched, incoming.sectionTouched || {});
    imported.collapsedItems = Object.assign({}, base.collapsedItems, incoming.collapsedItems || {});
    imported.advancedItems = Object.assign({}, base.advancedItems, incoming.advancedItems || {});
    imported.content = Object.assign(emptyContent(), incoming.content || {});
    schema.sectionKeys.forEach((key) => { if (!Array.isArray(imported.content[key])) imported.content[key] = []; });
    imported.files = { avatar: input && input.files && input.files.avatar || null, cv: input && input.files && input.files.cv || null };
    imported.seoOverrides = Object.assign({}, incoming.seoOverrides || {});
    imported.shareImageFile = incoming.shareImageFile && typeof incoming.shareImageFile === "object" ? incoming.shareImageFile : null;
    namespace.seo.initializeState(imported, {
      modes: incoming.seoModes,
      overrides: incoming.seoOverrides,
      forceManualDate: typeof incoming.useManualDate !== "boolean" && Boolean(incoming.site && incoming.site.lastUpdated)
    });
    imported.version = 1;
    imported.dirty = true;
    return imported;
  }

  const sourceConfig = deepClone(window.SCHOLAR_CANVAS || {});
  let state = createMinimal("student");
  let originalState = deepClone(state);
  const listeners = new Set();
  const runtimeFiles = { avatar: null, cv: null, shareImage: null, avatarUrl: "", shareImageUrl: "" };

  function notify(reason) {
    listeners.forEach((listener) => listener(state, reason || "update"));
  }

  function replace(next, options) {
    state = normalizeImportedState(next);
    if (options && options.clean) state.dirty = false;
    if (options && options.asOriginal) originalState = deepClone(state);
    notify("replace");
    return state;
  }

  function update(path, value, options) {
    setPath(state, path, value);
    if (String(path).startsWith("profile.")) namespace.seo.syncAutomatic(state);
    if (!options || options.dirty !== false) {
      state.dirty = true;
      state.draftSaved = false;
    }
    notify(options && options.reason || "field");
    return state;
  }

  function setSeoCustom(key, value) {
    if (!namespace.seo.setCustom(state, key, value)) return state;
    state.dirty = true;
    state.draftSaved = false;
    notify("field");
    return state;
  }

  function resetSeoAutomatic(key) {
    if (!namespace.seo.resetAutomatic(state, key)) return state;
    state.dirty = true;
    state.draftSaved = false;
    notify("field");
    return state;
  }

  function setManualDate(enabled) {
    namespace.seo.setManualDate(state, enabled);
    state.dirty = true;
    state.draftSaved = false;
    notify("field");
    return state;
  }

  function chooseSource(source) {
    const mode = state.mode;
    const next = source === "current" || source === "demo" ? fromCurrentConfig(sourceConfig) : createMinimal(mode);
    next.source = source === "demo" ? "demo" : source === "current" ? "current" : "minimal";
    return replace(next, { asOriginal: true, clean: true });
  }

  function setMode(mode) {
    const nextMode = mode === "researcher" ? "researcher" : "student";
    if (nextMode === state.mode) return state;
    state.mode = nextMode;
    state.site.mode = nextMode;
    schema.sectionKeys.forEach((key) => {
      if (!state.sectionTouched[key]) state.sections[key] = schema.recommendations[nextMode][key];
    });
    if (!state.sections[state.activeModule]) state.activeModule = nextMode === "researcher" ? "publications" : "projects";
    state.dirty = true;
    state.draftSaved = false;
    notify("mode");
    return state;
  }

  function setSection(key, enabled) {
    if (!schema.sectionKeys.includes(key)) return state;
    state.sections[key] = Boolean(enabled);
    state.sectionTouched[key] = true;
    state.dirty = true;
    state.draftSaved = false;
    notify("section");
    return state;
  }

  function addItem(type) {
    if (!Array.isArray(state.content[type])) return null;
    const item = createItem(type, state.content[type].length);
    state.content[type].push(item);
    state.dirty = true;
    state.draftSaved = false;
    notify("content");
    return item;
  }

  function uniqueId(type, base) {
    const used = new Set((state.content[type] || []).map((item) => item.id));
    let candidate = slugify(base, `${type}-item`);
    let count = 2;
    while (used.has(candidate)) candidate = `${slugify(base, `${type}-item`)}-${count++}`;
    return candidate;
  }

  function duplicateItem(type, index) {
    const list = state.content[type];
    if (!Array.isArray(list) || !list[index]) return;
    const copy = deepClone(list[index]);
    if (copy.id) copy.id = uniqueId(type, `${copy.id}-copy`);
    list.splice(index + 1, 0, copy);
    state.dirty = true;
    state.draftSaved = false;
    notify("content");
  }

  function moveItem(type, index, direction) {
    const list = state.content[type];
    const target = index + direction;
    if (!Array.isArray(list) || index < 0 || target < 0 || index >= list.length || target >= list.length) return;
    const item = list.splice(index, 1)[0];
    list.splice(target, 0, item);
    state.dirty = true;
    state.draftSaved = false;
    notify("content");
  }

  function removeItem(type, index) {
    const list = state.content[type];
    if (!Array.isArray(list) || !list[index]) return;
    list.splice(index, 1);
    state.dirty = true;
    state.draftSaved = false;
    notify("content");
  }

  function addAuthor(publicationIndex) {
    const publication = state.content.publications[publicationIndex];
    if (!publication) return;
    publication.authors = Array.isArray(publication.authors) ? publication.authors : [];
    publication.authors.push({ name: "", self: false });
    state.dirty = true;
    notify("content");
  }

  function moveAuthor(publicationIndex, authorIndex, direction) {
    const publication = state.content.publications[publicationIndex];
    const authors = publication && publication.authors;
    const target = authorIndex + direction;
    if (!Array.isArray(authors) || target < 0 || target >= authors.length) return;
    const author = authors.splice(authorIndex, 1)[0];
    authors.splice(target, 0, author);
    state.dirty = true;
    notify("content");
  }

  function removeAuthor(publicationIndex, authorIndex) {
    const publication = state.content.publications[publicationIndex];
    if (!publication || !Array.isArray(publication.authors)) return;
    publication.authors.splice(authorIndex, 1);
    state.dirty = true;
    notify("content");
  }

  function restoreOriginal() {
    return replace(originalState, { clean: true });
  }

  function setRuntimeFile(kind, file, objectUrl) {
    if (!Object.prototype.hasOwnProperty.call(runtimeFiles, kind)) return;
    const urlKey = kind === "avatar" ? "avatarUrl" : kind === "shareImage" ? "shareImageUrl" : "";
    if (urlKey && runtimeFiles[urlKey] && runtimeFiles[urlKey] !== objectUrl) URL.revokeObjectURL(runtimeFiles[urlKey]);
    runtimeFiles[kind] = file || null;
    if (urlKey) runtimeFiles[urlKey] = objectUrl || "";
    const metadata = file ? { name: file.name, type: file.type, size: file.size } : null;
    if (kind === "shareImage") state.shareImageFile = metadata;
    else state.files[kind] = metadata;
    state.dirty = true;
    state.draftSaved = false;
    notify("file");
  }

  function clearRuntimeFiles() {
    if (runtimeFiles.avatarUrl) URL.revokeObjectURL(runtimeFiles.avatarUrl);
    if (runtimeFiles.shareImageUrl) URL.revokeObjectURL(runtimeFiles.shareImageUrl);
    runtimeFiles.avatar = null;
    runtimeFiles.cv = null;
    runtimeFiles.shareImage = null;
    runtimeFiles.avatarUrl = "";
    runtimeFiles.shareImageUrl = "";
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  namespace.stateUtils = { deepClone, getPath, setPath, slugify, splitLines, splitTags, createItem, createMinimal, fromCurrentConfig, normalizeImportedState };
  namespace.store = {
    get: () => state,
    getSourceConfig: () => deepClone(sourceConfig),
    getRuntimeFiles: () => runtimeFiles,
    replace,
    update,
    setSeoCustom,
    resetSeoAutomatic,
    setManualDate,
    chooseSource,
    setMode,
    setSection,
    addItem,
    duplicateItem,
    moveItem,
    removeItem,
    addAuthor,
    moveAuthor,
    removeAuthor,
    restoreOriginal,
    setRuntimeFile,
    clearRuntimeFiles,
    subscribe,
    notify
  };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
