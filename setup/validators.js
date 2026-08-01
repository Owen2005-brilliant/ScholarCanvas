(function initSetupValidators(namespace) {
  "use strict";

  const statuses = new Set(["published", "accepted", "preprint", "under-review", "work-in-progress"]);
  const unsafeProtocol = /^(?:javascript|vbscript|data|file):/i;
  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const githubPattern = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)$/;
  const repositoryPattern = /^(?![.-])[A-Za-z0-9._-]{1,100}$/;

  const message = (zh, en) => ({ zh, en });

  function isSafeUrl(value, options) {
    const settings = options || {};
    if (value === undefined || value === null || String(value).trim() === "") return settings.required ? false : true;
    const input = String(value).trim();
    if (unsafeProtocol.test(input)) return false;
    if (/^(?:https:|mailto:)/i.test(input)) return true;
    if (settings.allowHttp && /^http:/i.test(input)) return true;
    if (settings.allowRelative && /^(?:\.\.?\/|[A-Za-z0-9_./-]+$)/.test(input)) return true;
    return false;
  }

  function isValidSiteUrl(value) {
    if (!isSafeUrl(value, { required: true })) return false;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && Boolean(url.hostname);
    } catch (_error) {
      return false;
    }
  }

  function isValidDate(value, kind) {
    const input = String(value || "").trim();
    if (!input) return false;
    if (kind === "month") return /^\d{4}-(?:0[1-9]|1[0-2])$/.test(input);
    if (kind === "year") return /^(?:19|20)\d{2}$/.test(input);
    return /^(?:19|20)\d{2}(?:[.\/-](?:0?[1-9]|1[0-2]))?(?:\s*(?:—|-|to)\s*(?:Present|至今|(?:19|20)\d{2}(?:[.\/-](?:0?[1-9]|1[0-2]))?))?$/i.test(input);
  }

  function avatarFile(file) {
    if (!file) return { valid: true };
    const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);
    if (!allowed.has(file.type)) return { valid: false, code: "type", message: message("头像必须是 PNG、JPG、WebP 或 SVG 文件。", "Avatar must be a PNG, JPG, WebP, or SVG file.") };
    if (file.size > 5 * 1024 * 1024) return { valid: false, code: "size", message: message("头像不能超过 5MB。", "Avatar must be 5MB or smaller.") };
    return { valid: true };
  }

  function cvFile(file) {
    if (!file) return { valid: true };
    if (file.type !== "application/pdf") return { valid: false, code: "type", message: message("简历必须是 PDF 文件。", "CV must be a PDF file.") };
    if (file.size > 20 * 1024 * 1024) return { valid: false, code: "size", message: message("简历不能超过 20MB。", "CV must be 20MB or smaller.") };
    return { valid: true };
  }

  function addError(errors, path, zh, en, detail) {
    if (errors.some((error) => error.path === path)) return;
    errors.push({ path, message: message(zh, en), detail: detail || "" });
  }

  function collectUrls(value, path, output) {
    if (!value || typeof value !== "object") return;
    Object.entries(value).forEach(([key, item]) => {
      const nextPath = path ? `${path}.${key}` : key;
      if (typeof item === "string" && /(?:url|link|github|scholar|orcid|linkedin|website|cv|paper|code|project|dataset|model|slides|demo|report)$/i.test(key)) {
        if (item.trim()) output.push({ path: nextPath, value: item });
      } else if (item && typeof item === "object") collectUrls(item, nextPath, output);
    });
  }

  function validateState(state) {
    const errors = [];
    const warnings = [];
    if (!state || typeof state !== "object") {
      addError(errors, "state", "配置状态无效，请重新开始。", "The setup state is invalid. Start again.");
      return { valid: false, errors, warnings };
    }

    if (!String(state.profile && state.profile.name && state.profile.name.zh || "").trim()) addError(errors, "profile.name.zh", "请填写中文姓名。", "Enter a Chinese name.");
    if (!String(state.profile && state.profile.name && state.profile.name.en || "").trim()) addError(errors, "profile.name.en", "请填写英文姓名。", "Enter an English name.");
    ["identity", "school", "affiliation"].forEach((key) => {
      if (!String(state.profile && state.profile[key] && state.profile[key].zh || "").trim()) addError(errors, `profile.${key}.zh`, "请填写这个中文必填项。", "Enter this required Chinese field.");
      if (!String(state.profile && state.profile[key] && state.profile[key].en || "").trim()) addError(errors, `profile.${key}.en`, "请填写这个英文必填项。", "Enter this required English field.");
    });
    if (!emailPattern.test(String(state.profile && state.profile.email || ""))) addError(errors, "profile.email", "请输入有效的邮箱地址，例如 name@example.com。", "Enter a valid email address, such as name@example.com.");
    if (!githubPattern.test(String(state.site && state.site.githubUsername || ""))) addError(errors, "site.githubUsername", "GitHub 用户名只能包含字母、数字和单个连字符。", "GitHub username may contain letters, numbers, and single hyphens only.");
    if (!repositoryPattern.test(String(state.site && state.site.repositoryName || ""))) addError(errors, "site.repositoryName", "仓库名称包含不支持的字符。", "Repository name contains unsupported characters.");
    if (state.site && state.site.customUrl && !isValidSiteUrl(state.site.customUrl)) addError(errors, "site.customUrl", "自定义站点地址必须是完整的 HTTPS URL。", "Custom site URL must be a complete HTTPS URL.");
    if (!/^#[0-9a-f]{6}$/i.test(String(state.site && state.site.accentColor || ""))) addError(errors, "site.accentColor", "强调色必须使用六位十六进制格式，例如 #F59E0B。", "Accent color must use six-digit hexadecimal format, such as #F59E0B.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(state.site && state.site.lastUpdated || ""))) addError(errors, "site.lastUpdated", "最后更新日期必须使用 YYYY-MM-DD。", "Last updated must use YYYY-MM-DD.");
    ["seoTitle", "seoDescription"].forEach((key) => ["zh", "en"].forEach((language) => {
      if (!String(state.site && state.site[key] && state.site[key][language] || "").trim()) addError(errors, `site.${key}.${language}`, "请填写这个 SEO 必填项。", "Enter this required SEO field.");
    }));

    const interestIds = new Set();
    (state.profile && state.profile.interests || []).forEach((interest, index) => {
      const id = String(interest && interest.id || "").trim();
      if (!id) addError(errors, `profile.interests.${index}.id`, "请填写研究兴趣的唯一 ID。", "Enter a unique research-interest ID.");
      else if (interestIds.has(id)) addError(errors, `profile.interests.${index}.id`, "这个研究兴趣 ID 已经被使用。", "This research-interest ID is already used.");
      else interestIds.add(id);
      if (!String(interest && interest.label && interest.label.zh || "").trim() || !String(interest && interest.label && interest.label.en || "").trim()) addError(errors, `profile.interests.${index}.label.zh`, "研究兴趣需要同时填写中文和英文名称。", "Research interests need both Chinese and English names.");
    });

    const allIds = new Map();
    Object.entries(state.content || {}).forEach(([type, items]) => {
      (Array.isArray(items) ? items : []).forEach((item, index) => {
        if (!item || typeof item !== "object") return;
        if ("id" in item) {
          const id = String(item.id || "").trim();
          if (!id) addError(errors, `content.${type}.${index}.id`, "请填写唯一 ID。", "Enter a unique ID.");
          else if (allIds.has(id)) addError(errors, `content.${type}.${index}.id`, `这个 ID 已经被使用。请换一个，例如 ${id}-2026。`, `This ID is already used. Try ${id}-2026.`);
          else allIds.set(id, `${type}.${index}`);
        }
        const definitions = namespace.schema.contentSchemas[type] && namespace.schema.contentSchemas[type].fields || [];
        definitions.filter((definition) => definition.required).forEach((definition) => {
          const value = definition.key.split(".").reduce((current, key) => current === undefined || current === null ? undefined : current[key], item);
          if (value === undefined || value === null || String(value).trim() === "") addError(errors, `content.${type}.${index}.${definition.key}`, "请填写这个必填字段。", "Enter this required field.");
        });
      });
    });

    (state.content && state.content.news || []).forEach((item, index) => {
      if (!isValidDate(item.date, "month")) addError(errors, `content.news.${index}.date`, "动态日期必须使用 YYYY-MM，例如 2026-08。", "News date must use YYYY-MM, such as 2026-08.");
      if (!String(item.text && item.text.zh || "").trim() || !String(item.text && item.text.en || "").trim()) addError(errors, `content.news.${index}.text.zh`, "动态需要同时填写中文和英文内容。", "News needs both Chinese and English text.");
    });

    (state.content && state.content.publications || []).forEach((item, index) => {
      if (!statuses.has(item.status)) addError(errors, `content.publications.${index}.status`, "请选择支持的论文状态。", "Choose a supported publication status.");
      if (!Array.isArray(item.authors) || !item.authors.some((author) => String(author && author.name || "").trim())) addError(errors, `content.publications.${index}.authors`, "请至少添加一位作者。", "Add at least one author.");
      if (!String(item.title && item.title.zh || "").trim() || !String(item.title && item.title.en || "").trim()) addError(errors, `content.publications.${index}.title.zh`, "论文需要同时填写中文和英文标题。", "Publication needs both Chinese and English titles.");
      if (!Number.isInteger(Number(item.year)) || Number(item.year) < 1900 || Number(item.year) > 2100) addError(errors, `content.publications.${index}.year`, "论文年份应为 1900 到 2100 之间的整数。", "Publication year must be an integer between 1900 and 2100.");
    });

    (state.content && state.content.projects || []).forEach((item, index) => {
      if (!String(item.name && item.name.zh || "").trim() || !String(item.name && item.name.en || "").trim()) addError(errors, `content.projects.${index}.name.zh`, "项目需要同时填写中文和英文名称。", "Project needs both Chinese and English names.");
    });

    (state.content && state.content.experience || []).forEach((item, index) => {
      if (item.startDate && !isValidDate(item.startDate)) addError(errors, `content.experience.${index}.startDate`, "开始日期格式无法识别，例如可填写 2025.09。", "Start date is not recognized; try 2025.09.");
    });

    const urlFields = [];
    collectUrls(state.profile && state.profile.links || {}, "profile.links", urlFields);
    collectUrls(state.content || {}, "content", urlFields);
    urlFields.forEach((entry) => {
      if (!isSafeUrl(entry.value, { allowRelative: true })) addError(errors, entry.path, "此链接使用了不安全或不支持的协议。请使用 HTTPS。", "This link uses an unsafe or unsupported protocol. Use HTTPS.");
    });

    Object.entries(state.sections || {}).forEach(([key, enabled]) => {
      const items = state.content && state.content[key];
      if (enabled && Array.isArray(items) && items.length === 0) warnings.push({ path: `sections.${key}`, message: message("此模块已开启，但暂时没有内容；主页会显示安全空状态。", "This section is enabled but has no content; the homepage will show a safe empty state.") });
      if (!enabled && Array.isArray(items) && items.length > 0) warnings.push({ path: `sections.${key}`, message: message("此模块已有内容但当前关闭，内容会保留且不会导出到页面导航。", "This section contains content but is disabled; the content is preserved but hidden from page navigation.") });
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  function validateStep(state, stepId) {
    const result = validateState(state);
    const prefixes = {
      profile: ["profile."],
      sections: ["sections."],
      content: ["content."],
      website: ["site."],
      review: [""]
    }[stepId];
    if (!prefixes) return { valid: true, errors: [], warnings: result.warnings };
    const errors = prefixes[0] === "" ? result.errors : result.errors.filter((error) => prefixes.some((prefix) => error.path.startsWith(prefix)));
    return { valid: errors.length === 0, errors, warnings: result.warnings };
  }

  function validateDraftDocument(documentValue) {
    if (!documentValue || typeof documentValue !== "object") return { valid: false, message: message("文件不是有效的草稿 JSON。", "File is not a valid draft JSON.") };
    if (documentValue.format !== "scholarcanvas-setup") return { valid: false, message: message("这不是 ScholarCanvas 初始化器草稿。", "This is not a ScholarCanvas setup draft.") };
    if (documentValue.version !== 1) return { valid: false, message: message("暂不支持这个草稿版本。", "This draft version is not supported.") };
    if (!documentValue.state || typeof documentValue.state !== "object") return { valid: false, message: message("草稿缺少配置状态。", "Draft is missing setup state.") };
    return { valid: true };
  }

  function validatePreviewPayload(payload) {
    if (!payload || typeof payload !== "object") return false;
    if (!payload.site || typeof payload.site !== "object") return false;
    if (!payload.profile || typeof payload.profile !== "object") return false;
    return ["news", "publications", "projects", "experience", "awards", "skills", "teaching", "service"].every((key) => Array.isArray(payload[key]));
  }

  namespace.validators = {
    isSafeUrl,
    isValidSiteUrl,
    isValidDate,
    avatarFile,
    cvFile,
    validateState,
    validateStep,
    validateDraftDocument,
    validatePreviewPayload,
    patterns: { emailPattern, githubPattern, repositoryPattern }
  };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
