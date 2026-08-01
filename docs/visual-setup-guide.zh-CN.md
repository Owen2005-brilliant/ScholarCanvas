# ScholarCanvas 可视化初始化指南

可视化初始化器将现有 `data/*.js` 配置转换为七步纯浏览器流程。你可以直接打开 [`setup.html`](../setup.html)，也可以使用线上[可视化初始化器](https://owen2005-brilliant.github.io/ScholarCanvas/setup.html)。它不需要账号、后端、依赖安装或构建命令。

## 1. 选择起点与模式

选择“从最小配置开始”可获得明确的替换占位内容；“导入当前主页”会读取仓库已有的 ScholarCanvas 配置；“导入草稿”可重新打开初始化器 JSON。旧版配置仍然兼容。学生模式推荐项目、经历、奖项和技能；研究者模式推荐动态、论文、项目、奖项、教学与学术服务。切换模式不会删除内容，也不会覆盖手动选择的模块。

## 2. 填写个人资料

填写中英文身份、单位、简介、短简介、研究兴趣和可选外部链接。必填项会明确标记；继续下一步时，错误摘要会链接到对应字段。

头像支持 PNG、JPG、WebP 或 SVG，最大 5MB；简历支持 PDF，最大 20MB。文件不会上传。头像会立即出现在预览中；头像与简历只会在你主动导出或写入文件夹时进入配置包。

## 3. 选择模块并编辑内容

八个模块均可独立开关，关闭模块不会删除内容。所有内容编辑器均支持新增、删除、复制、上移、下移和折叠。论文包含嵌套作者编辑器，可调整顺序并标记本人。链接、图片路径与 BibTeX 等高级字段收纳在可展开区域。

## 4. 外观、预览与站点地址

选择默认语言、浅色/深色/跟随系统主题和强调色。实时预览通过隔离的 iframe 使用真正的 ScholarCanvas 渲染器；配置经过稳定序列化后，通过校验来源、Origin、类型、版本和载荷的 `postMessage` 协议更新。预览工具栏可切换学生/研究者、中/英文、桌面/手机并刷新。

在“检查与导出”步骤中，“在新标签页预览”会通过一次性、校验 Origin 的交接把当前表单传给预览页，也会带上本地选择的头像和简历文件。“打开已应用配置的主页”读取的是 `index.html`，因此只展示已经应用或替换到项目中的配置文件。

填写 GitHub 用户名与仓库名后，`username.github.io` 仓库生成根地址，其他仓库生成 `https://username.github.io/repository/`。完整的自定义 HTTPS 地址优先于 Pages 地址。Canonical、robots、sitemap、Open Graph 与 JSON-LD 均使用同一正式地址。

搜索结果标题、简介、关键词与更新时间会根据中英文个人资料和研究兴趣自动生成，不会出现在主页正文中。普通用户通常无需修改简洁的“搜索与分享设置”卡片；如有需要，可展开高级设置，单独自定义某个字段，也可以随时将该字段恢复为自动生成而不影响其他自定义内容。

ScholarCanvas 默认分享封面可直接使用。你也可以上传不超过 5MB 的 PNG、JPG、WebP 或 SVG 并在本地预览。图片不会上传服务器；受支持时会随浏览器草稿保存，并在导出时写入 `assets/illustrations/share-card.<ext>`。恢复默认封面会继续使用项目已有 SVG，不重复打包。

## 5. 保存与迁移草稿

“在此浏览器保存草稿”会在确认后将 JSON 状态写入 `localStorage`，将所选文件写入 IndexedDB。“导出草稿”下载 `scholarcanvas-setup.json`；“导入草稿”只将 JSON 当作数据解析，不执行代码；“清除本地草稿”会在确认后删除浏览器中保存的状态和文件。

浏览器存储按 Origin 隔离。在 `file://` 下保存的草稿与 GitHub Pages 或本地 HTTP 站点的草稿相互独立；跨地址迁移时请导出并导入 JSON 草稿。

## 6. 导出配置包

“下载 ScholarCanvas 配置包”会在浏览器中生成 `scholarcanvas-config.zip`，包含十个 `data/*.js`、`robots.txt`、`sitemap.xml`、`SETUP_RESULT.md`，以及选择的头像、简历和自定义分享封面。内置 ZIP 写入器采用无压缩 ZIP 格式，不依赖第三方库，并在文件之间让出主线程。

解压后，将同名路径替换到 ScholarCanvas 仓库。如果设备有 Python，可运行 `python3 tools/validate_config.py`。Python 只用于维护者校验；主页与初始化器本身不依赖 Python。

## 7. 直接写入本地文件夹

最新 Chrome 与 Edge 可通过 File System Access API 使用“选择 ScholarCanvas 文件夹并应用配置”。请选择包含 `index.html`、`data/`、`src/` 和 `styles/` 的仓库根目录。写入前会展示准确文件清单；已有文件会备份到 `.backup/setup-YYYYMMDD-HHMMSS/`，严格白名单保证只修改生成的数据、搜索/部署文件、头像、简历与自定义分享封面。

Safari 与 Firefox 暂不提供此 API。ZIP 导出始终可用，初始化器会显示降级提示，不会禁用其他功能。

## 8. 发布到 GitHub Pages

提交替换后的文件并推送到 GitHub，然后在 **Settings → Pages** 中选择 **GitHub Actions**。现有部署工作流会校验并发布静态仓库。部署后检查正式地址、`robots.txt` 和 `sitemap.xml`。

## 隐私与安全

- 不发送个人资料、文件、凭据、Token、分析数据或 OAuth 请求。
- 草稿使用 `JSON.parse`；初始化器没有 `eval`、`new Function` 或导入脚本执行。
- 链接采用协议白名单；预览消息校验来源；文件夹写入采用明确路径白名单。
- 头像或分享封面更换、清除时会释放 Object URL。

## 浏览器兼容性

最新 Chrome 与 Edge 支持完整流程和可选文件夹写入。最新 Safari 与 Firefox 支持编辑、实时预览、本地草稿、JSON 导入导出和 ZIP 下载；无法直接写入文件夹时自动降级。布局面向 360px 及以上屏幕，并支持键盘、可见焦点、Reduce Motion 与屏幕阅读器提示。

## 常见问题

**还能直接编辑 `data/*.js` 吗？** 可以。公开配置结构与主页渲染器均未改变。

**为什么换一个地址后找不到本地草稿？** 浏览器存储按 Origin 隔离。请导出草稿 JSON，再在新地址导入。

**关闭模块会删除内容吗？** 不会；内容会保留，可随时重新开启。

**为什么文件夹写入不可用？** 当前浏览器没有提供 File System Access API。请下载 ZIP 并手动替换文件。

**初始化器能导入任意 JavaScript 吗？** 不能。它只读取页面已加载的可信仓库脚本和自身 JSON 草稿格式，从不执行导入文本。
