(function initI18n(namespace) {
  "use strict";

  const labels = {
    skip: { zh: "跳到主要内容", en: "Skip to main content" },
    navLabel: { zh: "页面章节", en: "Page sections" },
    openMenu: { zh: "打开导航菜单", en: "Open navigation menu" },
    closeMenu: { zh: "关闭导航菜单", en: "Close navigation menu" },
    about: { zh: "关于", en: "About" },
    biography: { zh: "简介", en: "Biography" },
    news: { zh: "动态", en: "News" },
    projects: { zh: "精选项目", en: "Featured Projects" },
    researchProjects: { zh: "研究项目", en: "Research Projects" },
    interests: { zh: "研究兴趣", en: "Research Interests" },
    experience: { zh: "经历", en: "Experience" },
    selectedPublications: { zh: "精选论文", en: "Selected Publications" },
    publications: { zh: "全部论文", en: "All Publications" },
    work: { zh: "成果", en: "Work" },
    awards: { zh: "荣誉与活动", en: "Awards & Activities" },
    awardsShort: { zh: "获奖", en: "Awards" },
    skills: { zh: "技能", en: "Skills" },
    teaching: { zh: "教学", en: "Teaching" },
    service: { zh: "学术服务", en: "Academic Service" },
    contact: { zh: "联系", en: "Contact" },
    fictionalBadge: { zh: "虚构示例", en: "Fictional demo" },
    copyEmail: { zh: "复制邮箱", en: "Copy email" },
    copyBio: { zh: "复制简介", en: "Copy bio" },
    downloadCv: { zh: "下载简历", en: "Download CV" },
    languageSwitch: { zh: "Switch to English", en: "切换到中文" },
    lightMode: { zh: "切换到浅色模式", en: "Switch to light mode" },
    darkMode: { zh: "切换到深色模式", en: "Switch to dark mode" },
    previewResearcher: { zh: "研究者预览", en: "Researcher preview" },
    previewStudent: { zh: "学生模式预览", en: "Student preview" },
    menu: { zh: "菜单", en: "Menu" },
    viewDetails: { zh: "查看详情", en: "View details" },
    viewProject: { zh: "查看项目", en: "View project" },
    close: { zh: "关闭", en: "Close" },
    latest: { zh: "最新", en: "Latest" },
    showMore: { zh: "展开更多", en: "Show more" },
    showLess: { zh: "收起", en: "Show less" },
    showAllAuthors: { zh: "展开全部作者", en: "Show all authors" },
    hideAuthors: { zh: "收起作者", en: "Collapse authors" },
    all: { zh: "全部", en: "All" },
    selected: { zh: "精选", en: "Selected" },
    publicationFilters: { zh: "论文标签筛选", en: "Publication tag filters" },
    resultCount: { zh: "篇结果", en: "results" },
    noPublications: { zh: "暂时没有可展示的论文。你可以在 data/publications.js 中添加内容。", en: "No publications to show yet. Add entries in data/publications.js." },
    noProjects: { zh: "暂时没有可展示的项目。你可以在 data/projects.js 中添加内容。", en: "No projects to show yet. Add entries in data/projects.js." },
    noItems: { zh: "暂时没有可展示的内容。", en: "Nothing to show yet." },
    bibtex: { zh: "复制 BibTeX", en: "Copy BibTeX" },
    paper: { zh: "论文", en: "Paper" },
    code: { zh: "代码", en: "Code" },
    project: { zh: "主页", en: "Project" },
    dataset: { zh: "数据", en: "Dataset" },
    model: { zh: "模型", en: "Model" },
    poster: { zh: "海报", en: "Poster" },
    slides: { zh: "幻灯片", en: "Slides" },
    backToTop: { zh: "返回顶部", en: "Back to top" },
    currentFocus: { zh: "当前关注", en: "Current focus" },
    projectConstellation: { zh: "研究星座", en: "Research Constellation" },
    constellationHelp: { zh: "选择星点，高亮它关联的研究方向。", en: "Select a star to highlight its related research themes." },
    constellationFallback: { zh: "当前使用静态列表，以保持页面清晰与流畅。", en: "A static list is shown to keep the page clear and responsive." },
    period: { zh: "时间", en: "Period" },
    role: { zh: "角色", en: "Role" },
    course: { zh: "课程", en: "Course" },
    activity: { zh: "活动 / 职务", en: "Activity / Role" },
    category: { zh: "类型", en: "Type" },
    updated: { zh: "最后更新", en: "Last updated" },
    license: { zh: "MIT License 开源许可", en: "Open source under the MIT License" },
    campusMotto: { zh: "让每一步探索，都留下清晰的坐标。", en: "Give every exploration a clear place to land." },
    nightMotto: { zh: "把复杂留给过程，把清晰留给读者。", en: "Keep the complexity in the process—and the clarity for readers." },
    contactMe: { zh: "联系我", en: "Contact me" },
    contactHint: { zh: "复制邮箱，开启交流", en: "Copy the email to start a conversation" },
    emailCopied: { zh: "邮箱已复制。", en: "Email copied." },
    bioCopied: { zh: "简短个人简介已复制。", en: "Short biography copied." },
    bibtexCopied: { zh: "BibTeX 已复制。", en: "BibTeX copied." },
    unavailable: { zh: "示例链接尚未配置，请在 data 文件中补充。", en: "This demo link is not configured yet. Add it in the data files." },
    copyFailed: { zh: "无法自动复制，请手动选择文本。", en: "Automatic copy failed. Please select the text manually." },
    filterAnnounce: { zh: "论文筛选结果已更新。", en: "Publication results updated." },
    projectDialog: { zh: "项目详情", en: "Project details" },
    projectStatus: { zh: "项目状态", en: "Project status" },
    active: { zh: "进行中", en: "Active" },
    prototype: { zh: "原型", en: "Prototype" },
    completed: { zh: "已完成", en: "Completed" },
    published: { zh: "已发表", en: "Published" },
    accepted: { zh: "已接收", en: "Accepted" },
    preprint: { zh: "预印本", en: "Preprint" },
    underReview: { zh: "审稿中", en: "Under Review" },
    workInProgress: { zh: "进行中", en: "Work in Progress" },
    externalLink: { zh: "在新标签页打开", en: "Opens in a new tab" }
  };

  function t(value, language, fallbackLanguage) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value !== "object" || Array.isArray(value)) return "";
    const preferred = value[language];
    if (typeof preferred === "string" || typeof preferred === "number") return String(preferred);
    const fallback = value[fallbackLanguage];
    if (typeof fallback === "string" || typeof fallback === "number") return String(fallback);
    const first = Object.values(value).find((item) => typeof item === "string" || typeof item === "number");
    return first === undefined ? "" : String(first);
  }

  function label(key, language) {
    return t(labels[key] || key, language, "en");
  }

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Storage can be disabled for file:// pages; the current session still works.
    }
  }

  function initialLanguage(site) {
    const stored = safeStorageGet("scholarCanvas.language");
    if (stored === "zh" || stored === "en") return stored;
    return site && (site.defaultLanguage === "en" || site.defaultLanguage === "zh") ? site.defaultLanguage : "zh";
  }

  function applyMetadata(language) {
    const site = namespace.site || {};
    const profile = namespace.profile || {};
    const title = t(site.seo && site.seo.title, language, site.defaultLanguage || "zh") || "ScholarCanvas";
    const description = t(site.seo && site.seo.description, language, site.defaultLanguage || "zh") || "ScholarCanvas academic homepage.";
    document.title = title;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

    const setMeta = (selector, value) => {
      const node = document.querySelector(selector);
      if (node && value) node.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);

    const siteUrl = site.seo && site.seo.siteUrl;
    const shareImage = site.seo && site.seo.shareImage;
    let resolvedShareImage = shareImage;
    if (siteUrl && shareImage) {
      try {
        resolvedShareImage = new URL(shareImage, siteUrl).href;
      } catch (error) {
        resolvedShareImage = shareImage;
      }
    }
    setMeta('meta[property="og:url"]', siteUrl);
    setMeta('meta[property="og:image"]', resolvedShareImage);
    setMeta('meta[name="twitter:image"]', resolvedShareImage);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && siteUrl) canonical.href = siteUrl;

    const jsonLd = document.getElementById("person-jsonld");
    if (jsonLd) {
      const person = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: t(profile.name, language, site.defaultLanguage || "zh"),
        description: t(profile.shortBio || profile.bio, language, site.defaultLanguage || "zh"),
        url: siteUrl || "",
        email: profile.email ? `mailto:${profile.email}` : undefined,
        affiliation: t(profile.school, language, site.defaultLanguage || "zh")
          ? { "@type": "EducationalOrganization", name: t(profile.school, language, site.defaultLanguage || "zh") }
          : undefined,
        sameAs: profile.links ? Object.values(profile.links).filter((url) => /^https:\/\//i.test(url)) : []
      };
      jsonLd.textContent = JSON.stringify(person);
    }
  }

  namespace.i18n = {
    t,
    label,
    labels,
    initialLanguage,
    safeStorageGet,
    safeStorageSet,
    applyMetadata
  };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
