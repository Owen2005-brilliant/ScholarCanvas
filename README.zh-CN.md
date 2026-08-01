# ScholarCanvas

ScholarCanvas 是一个面向学生和研究者的双语学术个人主页，提供 Student 与 Researcher 两种模式。项目完全静态，不需要后端、数据库、依赖安装或构建步骤；推荐通过可视化初始化器完成配置。

> 仓库中的人物、学校、论文、项目与奖项均为虚构示例，发布前请替换为自己的内容。

[在线 Demo](https://owen2005-brilliant.github.io/ScholarCanvas/) · [**可视化初始化器**](https://owen2005-brilliant.github.io/ScholarCanvas/setup.html) · [使用此模板](https://github.com/Owen2005-brilliant/ScholarCanvas/generate) · [English README](README.md)

## 在线体验

- [查看 ScholarCanvas 示例主页（虚构人物，仅做展示）](https://owen2005-brilliant.github.io/ScholarCanvas/)
- [使用可视化初始化器创建主页](https://owen2005-brilliant.github.io/ScholarCanvas/setup.html)
- [阅读可视化初始化指南](docs/visual-setup-guide.zh-CN.md)

可视化初始化器完全在浏览器中运行。你的个人资料、头像、CV 和分享封面不会上传到 ScholarCanvas 服务器。

## 快速开始

1. 点击仓库右上角的 **Use this template**，创建自己的仓库。
2. 打开[可视化初始化器](https://owen2005-brilliant.github.io/ScholarCanvas/setup.html)。
3. 选择 Student 或 Researcher，并填写个人资料、项目、论文和经历。
4. 在页面中检查实时预览，然后下载生成的配置包。
5. 下载或克隆自己的 ScholarCanvas 仓库，解压配置包，并将其中的文件复制到仓库内的同名位置。
6. 确认 `index.html` 已显示你的资料，然后将修改推送到 GitHub。
7. 在自己的仓库中打开 **Settings → Pages → Source → GitHub Actions**。
8. 等待部署完成，即可访问自己的个人主页。

没有论文的学生可以保持 Publications 关闭。完成以上流程不需要手动编写 JavaScript。

<details>
<summary>在本地使用可视化初始化器</summary>

下载或克隆仓库后，可以直接双击 `setup.html`。也可以在仓库目录中运行本地服务器：

```bash
python3 -m http.server 8000
```

然后访问 [http://localhost:8000/setup.html](http://localhost:8000/setup.html)。整个过程不需要 Node.js、后端、数据库、依赖安装或构建命令。

</details>

## 项目预览

### Student Mode

![ScholarCanvas Student Mode 桌面预览](docs/screenshots/student-mode-desktop.png)

### Researcher Mode

![ScholarCanvas Researcher Mode 桌面预览](docs/screenshots/researcher-mode-desktop.png)

### Visual Setup

![ScholarCanvas 可视化初始化器桌面预览](docs/screenshots/setup-wizard-desktop.png)

<details>
<summary>查看更多截图</summary>

![ScholarCanvas 移动端主页预览](docs/screenshots/mobile-preview.png)

![ScholarCanvas 可视化初始化器移动端预览](docs/screenshots/setup-wizard-mobile.png)

![ScholarCanvas 可视化初始化器导出页面](docs/screenshots/setup-wizard-export.png)

</details>

[了解视觉设计过程](docs/setup-visual-spec.md)。

## Student 和 Researcher 模式

| | Student | Researcher |
| --- | --- | --- |
| 适用人群 | 学生、申请者和研究入门者 | 研究生、教师和科研人员 |
| 内容优先级 | 项目、研究兴趣与经历 | 动态、论文、教学与学术服务 |
| 推荐模块 | Projects、Experience、Awards、Skills | News、Publications、Projects、Teaching、Service |
| 视觉风格 | 温暖、舒展，以项目为主 | 紧凑、结构化，以论文为主 |

你可以在不删除内容的情况下预览两种模式，再选择更适合自己的主页形式。

## 主要功能

- Student 与 Researcher 双模式
- 中英文即时切换
- 浅色、深色与跟随系统主题
- 七步可视化配置
- 真实主页实时预览
- 项目、论文、经历和其他模块编辑
- 头像、CV 与分享封面本地处理
- 浏览器本地草稿与配置 ZIP 导出
- 无需构建的 GitHub Pages 部署
- 键盘无障碍、Reduce Motion 与移动端适配

## 部署到 GitHub Pages

1. 将完成配置的仓库推送到 GitHub，并使用 `main` 作为发布分支。
2. 打开 **Settings → Pages**。
3. 将 **Source** 设置为 **GitHub Actions**。
4. 等待 Validate 和 Deploy 工作流完成，然后打开 GitHub 显示的 Pages 地址。

ScholarCanvas 是纯静态站点，也可以直接放到其他静态托管服务中，无需填写构建命令。

## 高级使用

可视化初始化器是推荐方式。最终内容保存在 `data/*.js` 中；如果需要手动修改、批量处理或二次开发，请阅读[手动配置指南](docs/manual-configuration.zh-CN.md)。

开发、测试和贡献说明请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 开源、贡献与许可证

参与贡献前，请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)、[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 和 [SECURITY.md](SECURITY.md)。ScholarCanvas 使用 [MIT License](LICENSE)。

© 2026 ScholarCanvas contributors.
