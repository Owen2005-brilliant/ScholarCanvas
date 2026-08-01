window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {};

window.SCHOLAR_CANVAS.projects = [
  {
    id: "explainable-ml-studio",
    name: { zh: "可解释机器学习工坊", en: "Explainable ML Studio" },
    description: { zh: "帮助学生用概念卡片、反事实与可视化理解模型决策。", en: "A concept-card and counterfactual workspace for understanding model decisions." },
    details: { zh: "该虚构项目包含交互式概念编辑、对比样本和课堂演示模式，重点验证解释是否真的帮助学习。", en: "This fictional project combines concept editing, contrastive examples, and a classroom mode to test whether explanations genuinely support learning." },
    image: "assets/projects/explainable-studio.svg",
    imageAlt: { zh: "可解释机器学习工坊界面插画", en: "Explainable ML Studio interface illustration" },
    tags: ["HCI", "Explainability", "Education"],
    featured: true,
    links: { github: "https://github.com/Owen2005-brilliant/ScholarCanvas" },
    status: "active"
  },
  {
    id: "buddy-talk",
    name: { zh: "BuddyTalk 学习伙伴", en: "BuddyTalk Study Companion" },
    description: { zh: "面向低年级学生的情感友好型学习陪伴原型。", en: "An emotionally considerate study-companion prototype for early-year students." },
    details: { zh: "项目探索提示设计、情绪反馈与学习节奏之间的关系，不提供医疗或心理诊断。", en: "The project explores prompting, affective feedback, and study rhythm; it does not provide medical or mental-health diagnosis." },
    image: "assets/projects/buddy-talk.svg",
    imageAlt: { zh: "BuddyTalk 手机界面插画", en: "BuddyTalk mobile interface illustration" },
    tags: ["Conversational UI", "Education", "Prototype"],
    featured: true,
    status: "prototype"
  },
  {
    id: "city-lens",
    name: { zh: "CityLens 城市镜头", en: "CityLens" },
    description: { zh: "把城市环境数据组织成可探索的叙事地图。", en: "An explorable narrative map for urban environmental data." },
    details: { zh: "通过时间、空间与事件三个维度连接空气质量数据，让非专业访客也能找到有意义的变化。", en: "It connects air-quality data across time, place, and events so non-experts can discover meaningful change." },
    image: "assets/projects/city-lens.svg",
    imageAlt: { zh: "CityLens 城市地图插画", en: "CityLens city-map illustration" },
    tags: ["Visualization", "D3.js", "Urban Computing"],
    featured: true,
    status: "completed"
  },
  {
    id: "paper-trail",
    name: { zh: "PaperTrail 阅读轨迹", en: "PaperTrail" },
    description: { zh: "轻量记录论文问题、证据与后续阅读线索的工具。", en: "A lightweight tool for tracking questions, evidence, and follow-up reading." },
    details: { zh: "该项目尝试用双向连接替代复杂目录，帮助初学者建立自己的研究脉络。", en: "This project uses bidirectional links instead of complex folders to help beginners form a research trail." },
    image: "assets/projects/paper-trail.svg",
    imageAlt: { zh: "PaperTrail 阅读网络插画", en: "PaperTrail reading-network illustration" },
    tags: ["Knowledge Tools", "HCI"],
    featured: false,
    status: "active"
  }
];
