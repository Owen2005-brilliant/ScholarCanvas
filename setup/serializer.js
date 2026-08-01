(function initSetupSerializer(namespace) {
  "use strict";

  const utils = namespace.stateUtils;

  function nonEmpty(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  function cleanObject(value) {
    if (Array.isArray(value)) return value.map(cleanObject).filter((item) => item !== undefined);
    if (!value || typeof value !== "object") return value;
    const output = {};
    Object.entries(value).forEach(([key, item]) => {
      if (item === undefined) return;
      const cleaned = cleanObject(item);
      if (cleaned && typeof cleaned === "object" && !Array.isArray(cleaned) && Object.keys(cleaned).length === 0) return;
      output[key] = cleaned;
    });
    return output;
  }

  function cleanLinks(links) {
    const output = {};
    Object.entries(links || {}).forEach(([key, value]) => {
      if (nonEmpty(value)) output[key] = String(value).trim();
    });
    return output;
  }

  function toSource(value, depth) {
    const level = depth || 0;
    const indent = "  ".repeat(level);
    const nextIndent = "  ".repeat(level + 1);
    if (value === null) return "null";
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (Array.isArray(value)) {
      if (!value.length) return "[]";
      return `[\n${value.map((item) => `${nextIndent}${toSource(item, level + 1)}`).join(",\n")}\n${indent}]`;
    }
    if (value && typeof value === "object") {
      const entries = Object.entries(value).filter((entry) => entry[1] !== undefined);
      if (!entries.length) return "{}";
      return `{\n${entries.map(([key, item]) => `${nextIndent}${/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${toSource(item, level + 1)}`).join(",\n")}\n${indent}}`;
    }
    return "null";
  }

  function sourceFile(key, value) {
    return `window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {};\n\nwindow.SCHOLAR_CANVAS.${key} = ${toSource(cleanObject(value), 0)};\n`;
  }

  function normalizeSiteUrl(value) {
    const input = String(value || "").trim();
    if (!input) return "";
    try {
      const url = new URL(input);
      url.hash = "";
      url.search = "";
      url.pathname = `${url.pathname.replace(/\/{2,}/g, "/").replace(/\/+$/, "")}/`;
      return url.toString();
    } catch (_error) {
      return input.endsWith("/") ? input : `${input}/`;
    }
  }

  function computeSiteUrl(site) {
    if (site && site.customUrl) return normalizeSiteUrl(site.customUrl);
    const username = String(site && site.githubUsername || "").trim();
    const repository = String(site && site.repositoryName || "").trim();
    if (!username || !repository) return "";
    if (repository.toLowerCase() === `${username.toLowerCase()}.github.io`) return `https://${username}.github.io/`;
    return `https://${username}.github.io/${repository}/`;
  }

  function avatarExtension(file) {
    const byType = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg" };
    if (file && byType[file.type]) return byType[file.type];
    const name = file && file.name || "";
    const extension = name.includes(".") ? name.split(".").pop().toLowerCase() : "";
    return ["png", "jpg", "jpeg", "webp", "svg"].includes(extension) ? (extension === "jpeg" ? "jpg" : extension) : "png";
  }

  function avatarExportPath(runtimeFiles) {
    return runtimeFiles && runtimeFiles.avatar ? `assets/avatar/profile-avatar.${avatarExtension(runtimeFiles.avatar)}` : "";
  }

  function bilingualLines(value) {
    return utils.splitLines(value).map((line) => {
      const parts = line.split("||").map((part) => part.trim());
      if (parts.length > 1) return { zh: parts[0], en: parts.slice(1).join("||").trim() };
      return line;
    });
  }

  function buildSite(state) {
    const siteUrl = computeSiteUrl(state.site);
    return {
      mode: state.mode === "researcher" ? "researcher" : "student",
      defaultLanguage: state.language === "en" ? "en" : "zh",
      enableLanguageSwitch: true,
      enableDarkMode: true,
      enableModePreviewSwitch: true,
      defaultTheme: ["light", "dark", "system"].includes(state.site.defaultTheme) ? state.site.defaultTheme : "system",
      accentColor: /^#[0-9a-f]{6}$/i.test(state.site.accentColor || "") ? state.site.accentColor.toUpperCase() : "#F59E0B",
      sections: Object.fromEntries(namespace.schema.sectionKeys.map((key) => [key, state.sections[key] !== false])),
      seo: {
        title: utils.deepClone(state.site.seoTitle),
        description: utils.deepClone(state.site.seoDescription),
        keywords: utils.splitTags(state.site.seoKeywords),
        siteUrl,
        shareImage: state.site.shareImage || "assets/illustrations/share-card.svg"
      },
      lastUpdated: state.site.lastUpdated || new Date().toISOString().slice(0, 10)
    };
  }

  function buildProfile(state, runtimeFiles, options) {
    const settings = options || {};
    const profile = utils.deepClone(state.profile);
    const exportedAvatar = avatarExportPath(runtimeFiles);
    profile.fictional = false;
    profile.avatar = settings.previewAvatarUrl || exportedAvatar || profile.avatar || "assets/avatar/profile-placeholder.svg";
    profile.links = cleanLinks(profile.links);
    if (runtimeFiles && runtimeFiles.cv) profile.links.cv = "assets/files/cv.pdf";
    return cleanObject(profile);
  }

  function buildNews(state) {
    return (state.content.news || []).map((item) => cleanObject({
      id: item.id || utils.slugify(`${item.date}-${item.text && item.text.en}`, "news-item"),
      date: item.date,
      text: utils.deepClone(item.text),
      type: item.type || "other",
      highlight: Boolean(item.highlight),
      link: nonEmpty(item.link) ? item.link.trim() : undefined
    }));
  }

  function buildPublications(state) {
    return (state.content.publications || []).map((item) => cleanObject({
      id: item.id,
      title: utils.deepClone(item.title),
      authors: (item.authors || []).filter((author) => nonEmpty(author && author.name)).map((author) => ({ name: String(author.name).trim(), self: author.self ? true : undefined })),
      venue: item.venue,
      year: Number(item.year),
      status: item.status,
      selected: Boolean(item.selected),
      image: nonEmpty(item.image) ? item.image.trim() : undefined,
      imageAlt: nonEmpty(item.image) ? utils.deepClone(item.imageAlt) : undefined,
      links: cleanLinks(item.links),
      tags: utils.splitTags(item.tagsText),
      summary: utils.deepClone(item.summary),
      bibtex: nonEmpty(item.bibtex) ? item.bibtex : undefined
    }));
  }

  function buildProjects(state) {
    return (state.content.projects || []).map((item) => cleanObject({
      id: item.id,
      name: utils.deepClone(item.name),
      description: utils.deepClone(item.description),
      details: utils.deepClone(item.details),
      image: nonEmpty(item.image) ? item.image.trim() : undefined,
      imageAlt: nonEmpty(item.image) ? utils.deepClone(item.imageAlt) : undefined,
      tags: utils.splitTags(item.tagsText),
      featured: Boolean(item.featured),
      links: cleanLinks(item.links),
      status: item.status || "active"
    }));
  }

  function buildExperience(state) {
    return (state.content.experience || []).map((item) => {
      const zh = utils.splitLines(item.highlightsZh);
      const en = utils.splitLines(item.highlightsEn);
      const highlights = Array.from({ length: Math.max(zh.length, en.length) }, (_value, index) => ({ zh: zh[index] || "", en: en[index] || "" }));
      const period = [item.startDate, item.endDate].filter(nonEmpty).join(" — ");
      return cleanObject({
        id: item.id,
        type: item.type || "education",
        organization: utils.deepClone(item.organization),
        role: utils.deepClone(item.role),
        period,
        location: utils.deepClone(item.location),
        highlights,
        logo: nonEmpty(item.logo) ? item.logo.trim() : undefined
      });
    });
  }

  function buildAwards(state) {
    return (state.content.awards || []).map((item) => {
      const yearMatch = String(item.date || "").match(/(?:19|20)\d{2}/);
      return cleanObject({
        id: item.id,
        title: utils.deepClone(item.title),
        organization: utils.deepClone(item.organization),
        year: yearMatch ? Number(yearMatch[0]) : Number(item.year) || 2026,
        category: item.category || "other",
        description: utils.deepClone(item.description)
      });
    });
  }

  function buildSkills(state) {
    return (state.content.skills || []).map((item) => cleanObject({
      id: item.id,
      category: utils.deepClone(item.category),
      items: bilingualLines(item.itemsText)
    }));
  }

  function buildTeaching(state) {
    return (state.content.teaching || []).map((item) => cleanObject({
      id: item.id,
      course: utils.deepClone(item.course),
      role: utils.deepClone(item.role),
      term: utils.deepClone(item.term),
      description: utils.deepClone(item.description),
      link: nonEmpty(item.link) ? item.link.trim() : undefined
    }));
  }

  function buildService(state) {
    return (state.content.service || []).map((item) => cleanObject({
      id: item.id,
      type: utils.deepClone(item.type),
      activity: utils.deepClone(item.activity),
      organization: utils.deepClone(item.organization),
      period: item.period,
      description: utils.deepClone(item.description),
      link: nonEmpty(item.link) ? item.link.trim() : undefined
    }));
  }

  function buildPayload(state, runtimeFiles, options) {
    return {
      site: buildSite(state),
      profile: buildProfile(state, runtimeFiles || {}, options),
      news: buildNews(state),
      publications: buildPublications(state),
      projects: buildProjects(state),
      experience: buildExperience(state),
      awards: buildAwards(state),
      skills: buildSkills(state),
      teaching: buildTeaching(state),
      service: buildService(state)
    };
  }

  function escapeXml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }

  function robots(siteUrl) {
    return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`;
  }

  function sitemap(siteUrl, lastUpdated) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${escapeXml(siteUrl)}</loc>\n    <lastmod>${escapeXml(lastUpdated)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`;
  }

  function setupResult(state, siteUrl) {
    return `# ScholarCanvas Setup Result\n\nYour configuration is ready for: ${siteUrl}\n\n## Files to replace\n\nCopy the generated \`data/*.js\`, \`robots.txt\`, and \`sitemap.xml\` files over the matching files in your ScholarCanvas repository. Copy the generated avatar or CV files when they are included.\n\n## Preview and validate\n\nOpen \`index.html\` directly, or run:\n\n\`\`\`bash\npython3 -m http.server 8080\npython3 tools/validate_config.py\n\`\`\`\n\nThen commit and push the changed files. In GitHub, open **Settings → Pages** and select **GitHub Actions**.\n\nMode: ${state.mode === "researcher" ? "Researcher" : "Student"}\nGenerated by ScholarCanvas Visual Setup v1.1.0.\n`;
  }

  function buildTextFiles(state, runtimeFiles) {
    const payload = buildPayload(state, runtimeFiles || {});
    const siteUrl = payload.site.seo.siteUrl;
    const files = {};
    Object.keys(payload).forEach((key) => {
      files[`data/${key}.js`] = sourceFile(key, payload[key]);
    });
    files["robots.txt"] = robots(siteUrl);
    files["sitemap.xml"] = sitemap(siteUrl, payload.site.lastUpdated);
    files["SETUP_RESULT.md"] = setupResult(state, siteUrl);
    return files;
  }

  namespace.serializer = {
    cleanObject,
    cleanLinks,
    toSource,
    sourceFile,
    normalizeSiteUrl,
    computeSiteUrl,
    avatarExtension,
    avatarExportPath,
    buildSite,
    buildProfile,
    buildPayload,
    buildTextFiles,
    robots,
    sitemap,
    setupResult
  };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
