# 王艺师 · 个站

一个纯静态网站，无需后端、无需数据库。可以直接丢到任何静态托管平台。

---

## 文件清单

| 路径 | 用途 |
|---|---|
| `index.html` | **主页**（域名根目录 → 这里） |
| `work.html` | 作品索引 |
| `project-agent.html` | 项目 №.003 · 金融场景 Agent |
| `project-rag.html` | 项目 №.002 · 厅堂 RAG 助理 |
| `project-recommend.html` | 项目 №.001 · 智能跟进推荐 |
| `project-dashboard.html` | 项目 №.000 · 经营看板 |
| `article.html` | 文章模板（可选保留） |
| `chat-embed.html` | 可嵌入对话面板（可选保留） |
| `resume.pdf` | 简历 PDF（顶栏按钮下载它） |
| `assets/` | 头像 + 微信二维码 |
| `directions/shared.jsx` | 站点数据（个人信息、项目、文章正文） |
| `fusion/` | 主页 + 对话面板 React 组件 |
| `tweaks-panel.jsx` | 主题切换组件 |

---

## 部署方式

### 方式 1：Vercel（推荐 · 免费 · 1 分钟）

1. 注册 [vercel.com](https://vercel.com)（用 GitHub 登录最快）
2. 点击 **"Add New" → "Project"**
3. 拖整个项目文件夹进去（或先把代码推到 GitHub 再 import）
4. **Framework Preset 选 "Other"** —— 不要选 Next.js / React
5. 直接 Deploy
6. 在 Settings → Domains 里加上你的域名，按提示改 DNS

### 方式 2：GitHub Pages

1. 把整个文件夹推到一个 GitHub 仓库（比如 `yishi-wang/site`）
2. Settings → Pages → Source 选 `main` 分支根目录
3. 等 1 分钟，会生成 `https://yishi-wang.github.io/site/`
4. 自定义域名：Settings → Pages → Custom domain 填你的，再去域名商把 CNAME 指过来

### 方式 3：直接 FTP 上传

如果你的域名已经绑定了一台普通虚拟主机（比如阿里云、腾讯云轻量、HostGator 等）：
1. 用 FTP 客户端（FileZilla / Cyberduck）连接
2. 把这个文件夹里**所有**文件上传到 `public_html/` 或 `www/`
3. 完事，访问域名就能看到

### 方式 4：Netlify

跟 Vercel 一样的流程，[netlify.com](https://netlify.com) → New site from drag-and-drop → 整个文件夹拖进去。

---

## 上传时的注意事项

1. **保持目录结构**：`assets/`、`directions/`、`fusion/` 这些子文件夹要原样保留
2. **大小写敏感**：Linux 服务器对大小写敏感，不要重命名文件
3. **第一次部署后检查**：
   - 访问域名 → 应该看到主页
   - 点头像、5 个 nav 链接、ASK ME — 都能点
   - 点项目卡进案例页 — 案例页能正常显示
   - 顶栏「简历 PDF」按钮 — 能下载到 `resume.pdf`
   - 联系区域微信悬停 — 二维码弹出

---

## 内容更新

| 改什么 | 改哪里 |
|---|---|
| 个人信息（姓名、邮箱、bio） | `directions/shared.jsx` 里的 `SITE_DATA` |
| 项目数据 | `directions/shared.jsx` 里的 `projects` 数组 |
| 文章正文 | `directions/shared.jsx` 里的 `ARTICLE_BODIES` 常量 |
| 项目案例页内容 | 直接编辑 `project-*.html`（每个就是一份独立的长稿） |
| 主题色 / 字体 | `fusion/theme.jsx` |
| 简历 PDF | 替换根目录 `resume.pdf` 文件 |
| 头像 | 替换 `assets/portrait.png` |
| 微信二维码 | 替换 `assets/wechat-qr.jpg` |

---

## 已知限制

- 项目使用 **React 18 + Babel in-browser** —— 不需要 Node / npm / 编译。打开 HTML 即可工作
- 因为 Babel 在浏览器里现编译，**首次加载会有 ~200ms 的白屏**。要去除可以在 build 后做 `babel-cli` 静态编译（不必）
- `chat.jsx` 里 `window.claude.complete()` 在普通域名上**不工作**（这是 Claude 沙盒专属）；当前对话靠预设关键词匹配，完全够用

---

任何问题再喊我。
