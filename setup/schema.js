(function initSetupSchema(namespace) {
  "use strict";

  const bilingual = (zh, en) => ({ zh, en });

  const steps = [
    { id: "welcome", label: bilingual("开始", "Welcome") },
    { id: "profile", label: bilingual("个人资料", "Profile") },
    { id: "sections", label: bilingual("页面模块", "Sections") },
    { id: "content", label: bilingual("内容", "Content") },
    { id: "appearance", label: bilingual("外观", "Appearance") },
    { id: "website", label: bilingual("站点设置", "Website") },
    { id: "review", label: bilingual("检查与导出", "Review & Export") }
  ];

  const sectionKeys = ["news", "publications", "projects", "experience", "awards", "skills", "teaching", "service"];

  const sectionLabels = {
    news: bilingual("动态", "News"),
    publications: bilingual("论文", "Publications"),
    projects: bilingual("项目", "Projects"),
    experience: bilingual("经历", "Experience"),
    awards: bilingual("奖项", "Awards"),
    skills: bilingual("技能", "Skills"),
    teaching: bilingual("教学", "Teaching"),
    service: bilingual("学术服务", "Service")
  };

  const recommendations = {
    student: { news: false, publications: false, projects: true, experience: true, awards: true, skills: true, teaching: false, service: false },
    researcher: { news: true, publications: true, projects: true, experience: false, awards: true, skills: false, teaching: true, service: true }
  };

  const copy = {
    productName: bilingual("ScholarCanvas 可视化初始化器", "ScholarCanvas Visual Setup"),
    privacy: bilingual("所有信息、头像和简历均只在当前浏览器中处理。ScholarCanvas 不会将这些内容上传到服务器。", "All information, avatars, and CV files are processed only in this browser. ScholarCanvas never uploads them to a server."),
    back: bilingual("上一步", "Back"),
    continue: bilingual("继续", "Continue"),
    finish: bilingual("完成", "Finish"),
    edit: bilingual("编辑", "Edit"),
    preview: bilingual("预览", "Preview"),
    saveDraft: bilingual("在此浏览器保存草稿", "Save draft in this browser"),
    draftSaved: bilingual("草稿已保存在此浏览器。", "Draft saved in this browser."),
    clearDraft: bilingual("清除本地草稿", "Clear local draft"),
    exportDraft: bilingual("导出草稿", "Export draft"),
    importDraft: bilingual("导入草稿", "Import draft"),
    restore: bilingual("恢复初始内容", "Restore initial content"),
    add: bilingual("新增", "Add"),
    duplicate: bilingual("复制", "Duplicate"),
    moveUp: bilingual("上移", "Move up"),
    moveDown: bilingual("下移", "Move down"),
    collapse: bilingual("折叠", "Collapse"),
    expand: bilingual("展开", "Expand"),
    remove: bilingual("删除", "Delete"),
    downloadZip: bilingual("下载 ScholarCanvas 配置包", "Download ScholarCanvas configuration bundle"),
    writeFolder: bilingual("选择 ScholarCanvas 文件夹并应用配置", "Choose a ScholarCanvas folder and apply configuration"),
    unsupportedFolder: bilingual("你的浏览器暂不支持直接写入文件夹，请使用“下载配置包”。", "Your browser does not support direct folder writing. Use the configuration bundle download instead."),
    ready: bilingual("配置已准备好", "Configuration is ready"),
    errorsTitle: bilingual("请先修正以下问题", "Please fix these issues first"),
    required: bilingual("必填", "Required"),
    optional: bilingual("可选", "Optional"),
    advanced: bilingual("高级字段", "Advanced fields"),
    currentSaved: bilingual("草稿已保存", "Draft saved"),
    unsaved: bilingual("有未保存更改", "Unsaved changes")
  };

  const field = (key, zh, en, type, options) => Object.assign({ key, label: bilingual(zh, en), type: type || "text" }, options || {});

  const contentSchemas = {
    news: {
      title: sectionLabels.news,
      fields: [
        field("date", "日期", "Date", "month", { required: true }),
        field("text.zh", "中文内容", "Chinese text", "textarea", { required: true }),
        field("text.en", "英文内容", "English text", "textarea", { required: true }),
        field("type", "类型", "Type", "select", { options: ["project", "paper", "award", "career", "other"] }),
        field("highlight", "设为重点", "Highlight", "checkbox"),
        field("link", "链接", "Link", "url")
      ]
    },
    publications: {
      title: sectionLabels.publications,
      fields: [
        field("id", "唯一 ID", "Unique ID", "text", { required: true }),
        field("title.zh", "中文标题", "Chinese title", "textarea", { required: true }),
        field("title.en", "英文标题", "English title", "textarea", { required: true }),
        field("venue", "Venue", "Venue", "text", { required: true }),
        field("year", "年份", "Year", "number", { required: true }),
        field("status", "状态", "Status", "select", { required: true, options: ["published", "accepted", "preprint", "under-review", "work-in-progress"] }),
        field("selected", "精选论文", "Selected publication", "checkbox"),
        field("tagsText", "标签（逗号分隔）", "Tags (comma separated)", "text"),
        field("summary.zh", "中文摘要", "Chinese summary", "textarea"),
        field("summary.en", "英文摘要", "English summary", "textarea"),
        field("links.paper", "Paper", "Paper", "url", { advanced: true }),
        field("links.code", "Code", "Code", "url", { advanced: true }),
        field("links.project", "Project", "Project", "url", { advanced: true }),
        field("links.dataset", "Dataset", "Dataset", "url", { advanced: true }),
        field("links.model", "Model", "Model", "url", { advanced: true }),
        field("links.slides", "Slides", "Slides", "url", { advanced: true }),
        field("bibtex", "BibTeX", "BibTeX", "textarea", { advanced: true }),
        field("image", "图片路径", "Image path", "text", { advanced: true }),
        field("imageAlt.zh", "图片中文 Alt", "Chinese image alt", "text", { advanced: true }),
        field("imageAlt.en", "图片英文 Alt", "English image alt", "text", { advanced: true })
      ]
    },
    projects: {
      title: sectionLabels.projects,
      fields: [
        field("id", "唯一 ID", "Unique ID", "text", { required: true }),
        field("name.zh", "中文名称", "Chinese name", "text", { required: true }),
        field("name.en", "英文名称", "English name", "text", { required: true }),
        field("description.zh", "中文简介", "Chinese summary", "textarea", { required: true }),
        field("description.en", "英文简介", "English summary", "textarea", { required: true }),
        field("details.zh", "中文详情", "Chinese details", "textarea"),
        field("details.en", "英文详情", "English details", "textarea"),
        field("tagsText", "标签（逗号分隔）", "Tags (comma separated)", "text"),
        field("status", "状态", "Status", "select", { options: ["active", "prototype", "completed"] }),
        field("featured", "精选项目", "Featured project", "checkbox"),
        field("links.github", "GitHub", "GitHub", "url", { advanced: true }),
        field("links.demo", "Demo", "Demo", "url", { advanced: true }),
        field("links.report", "报告", "Report", "url", { advanced: true }),
        field("image", "图片路径", "Image path", "text", { advanced: true }),
        field("imageAlt.zh", "图片中文 Alt", "Chinese image alt", "text", { advanced: true }),
        field("imageAlt.en", "图片英文 Alt", "English image alt", "text", { advanced: true })
      ]
    },
    experience: {
      title: sectionLabels.experience,
      fields: [
        field("id", "唯一 ID", "Unique ID", "text", { required: true }),
        field("type", "类型", "Type", "select", { options: ["education", "internship", "research", "service", "work"] }),
        field("organization.zh", "机构中文", "Chinese organization", "text", { required: true }),
        field("organization.en", "机构英文", "English organization", "text", { required: true }),
        field("role.zh", "角色中文", "Chinese role", "text", { required: true }),
        field("role.en", "角色英文", "English role", "text", { required: true }),
        field("startDate", "开始日期", "Start date", "text"),
        field("endDate", "结束日期", "End date", "text"),
        field("location.zh", "地点中文", "Chinese location", "text"),
        field("location.en", "地点英文", "English location", "text"),
        field("highlightsZh", "中文成果（每行一项）", "Chinese highlights (one per line)", "textarea"),
        field("highlightsEn", "英文成果（每行一项）", "English highlights (one per line)", "textarea"),
        field("logo", "Logo 路径", "Logo path", "text", { advanced: true })
      ]
    },
    awards: {
      title: sectionLabels.awards,
      fields: [
        field("id", "唯一 ID", "Unique ID", "text", { required: true }),
        field("title.zh", "中文标题", "Chinese title", "text", { required: true }),
        field("title.en", "英文标题", "English title", "text", { required: true }),
        field("organization.zh", "机构中文", "Chinese organization", "text"),
        field("organization.en", "机构英文", "English organization", "text"),
        field("date", "日期", "Date", "text", { required: true }),
        field("category", "类型", "Type", "select", { options: ["research", "scholarship", "competition", "activity", "other"] }),
        field("description.zh", "中文说明", "Chinese description", "textarea"),
        field("description.en", "英文说明", "English description", "textarea")
      ]
    },
    skills: {
      title: sectionLabels.skills,
      fields: [
        field("id", "唯一 ID", "Unique ID", "text", { required: true }),
        field("category.zh", "分类中文", "Chinese category", "text", { required: true }),
        field("category.en", "分类英文", "English category", "text", { required: true }),
        field("itemsText", "技能列表（每行一项）", "Skills (one per line)", "textarea", { required: true })
      ]
    },
    teaching: {
      title: sectionLabels.teaching,
      fields: [
        field("id", "唯一 ID", "Unique ID", "text", { required: true }),
        field("course.zh", "课程中文名", "Chinese course name", "text", { required: true }),
        field("course.en", "课程英文名", "English course name", "text", { required: true }),
        field("role.zh", "角色中文", "Chinese role", "text", { required: true }),
        field("role.en", "角色英文", "English role", "text", { required: true }),
        field("term.zh", "学期中文", "Chinese term", "text", { required: true }),
        field("term.en", "学期英文", "English term", "text", { required: true }),
        field("description.zh", "中文说明", "Chinese description", "textarea"),
        field("description.en", "英文说明", "English description", "textarea"),
        field("link", "链接", "Link", "url")
      ]
    },
    service: {
      title: sectionLabels.service,
      fields: [
        field("id", "唯一 ID", "Unique ID", "text", { required: true }),
        field("type.zh", "类型中文", "Chinese type", "text", { required: true }),
        field("type.en", "类型英文", "English type", "text", { required: true }),
        field("activity.zh", "名称中文", "Chinese activity", "text", { required: true }),
        field("activity.en", "名称英文", "English activity", "text", { required: true }),
        field("organization.zh", "组织中文", "Chinese organization", "text"),
        field("organization.en", "组织英文", "English organization", "text"),
        field("period", "日期", "Date", "text", { required: true }),
        field("description.zh", "中文说明", "Chinese description", "textarea"),
        field("description.en", "英文说明", "English description", "textarea"),
        field("link", "链接", "Link", "url")
      ]
    }
  };

  function t(value, language) {
    if (!value || typeof value !== "object") return value === undefined || value === null ? "" : String(value);
    return value[language === "en" ? "en" : "zh"] || value.en || value.zh || "";
  }

  namespace.schema = { steps, sectionKeys, sectionLabels, recommendations, copy, contentSchemas, t, bilingual };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
