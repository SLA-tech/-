# 🛍️ 淘宝店铺合规客服系统（Taobao Compliance CS）

> 一套为淘宝店铺提供**自动回复、敏感词过滤、合规引流**的综合客服系统。  
> 无需数据库服务器 | 本地 SQLite | 开箱即用

[![GitHub Stars](https://img.shields.io/github/stars/SLA-tech/-?style=flat-square)](https://github.com/SLA-tech/-)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat-square)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen?style=flat-square)](.)

---

## 🚀 快速开始（3分钟启动）

### 前置要求

- **Node.js 20+** 或更高版本
- **npm** 或 **yarn**
- **Windows / Linux / macOS**

### 一键启动

#### Windows 用户

```bash
# 双击运行
start.bat
```

或在 PowerShell/CMD 中运行：

```cmd
cd /d "path\to\project"
npm install
cd taobao-compliance-cs
npm install
cd server && npm run init:db && npm run start:dev
# 在另一个终端
cd taobao-compliance-cs\admin && npm run dev
```

#### Linux / macOS 用户

```bash
chmod +x start.sh
./start.sh
```

### 访问系统

启动后访问以下地址：

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端管理后台 | http://localhost:5173 | React 管理界面 |
| 后端 API | http://localhost:3000 | NestJS 服务 |
| H5 重定向页 | http://localhost:3000/redirect/:sessionId | 合规引流中转 |

---

## 📋 核心功能

### 1. **自动回复引擎**
- 文本/图片循环回复
- FAQ 智能匹配（关键词精确/模糊）
- 首次会话欢迎语
- 支持模板管理与编辑

### 2. **敏感词检测与风险控制**
- 高效的 Aho-Corasick 算法
- 文本归一化（去空格、统一大小写、全角半角）
- 严重程度分级（1-10 级）
- 自动拦截高风险会话
- 审计日志记录

### 3. **合规引流模块**
- H5 中转页面（降低平台封号风险）
- 企业微信集成
- 频率控制（同一用户 1 小时内仅发送一次）
- 可配置的引流参数

### 4. **管理后台**
- 话术编辑与管理
- 敏感词库编辑
- 实时统计面板
- 会话管理与检索
- 用户权限管理

---

## 🛠️ 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| **后端** | NestJS | 10+ |
| **ORM** | TypeORM | 0.3+ |
| **数据库** | SQLite 3 | 本地文件 |
| **前端框架** | React | 18+ |
| **构建工具** | Vite | 5+ |
| **UI 库** | Ant Design | 5+ |
| **HTTP 客户端** | Axios | 1.6+ |
| **验证** | class-validator | 0.14+ |
| **配置** | @nestjs/config | 3+ |

---

## 📚 详细文档

详见 `taobao-compliance-cs` 子目录：

| 文档 | 说明 |
|------|------|
| **README.md** | 完整项目说明 |
| **PACKAGING.md** | 打包与部署指南 |
| **DEPLOYMENT_GUIDE.md** | 生产环境部署 |
| **API.md** （如有）| REST API 完整文档 |

---

## 📁 项目结构

```
.
├── taobao-compliance-cs/          # 主项目目录
│   ├── server/                    # 后端服务（NestJS）
│   │   ├── data/                  # SQLite 数据库（自动创建）
│   │   ├── src/
│   │   │   ├── entities/          # 数据库模型
│   │   │   ├── services/          # 业务逻辑服务
│   │   │   ├── messages/          # 消息模块
│   │   │   ├── sensitive-words/   # 敏感词检测
│   │   │   ├── templates/         # 话术模板
│   │   │   ├── sessions/          # 会话管理
│   │   │   ├── reports/           # 数据统计
│   │   │   ├── redirect/          # H5 中转页
│   │   │   └── database/          # 数据库迁移和种子
│   │   ├── package.json
│   │   └── env.sample             # 环境变量示例
│   │
│   ├── admin/                     # 前端管理后台（React + Vite）
│   │   ├── src/
│   │   │   ├── pages/             # 页面组件
│   │   │   │   ├── Dashboard.tsx  # 仪表盘
│   │   │   │   ├── Messages.tsx   # 消息管理
│   │   │   │   ├── SensitiveWords.tsx # 敏感词库
│   │   │   │   ├── Templates.tsx  # 话术编辑
│   │   │   │   ├── Sessions.tsx   # 会话查询
│   │   │   │   └── Reports.tsx    # 数据统计
│   │   │   ├── components/        # 公共组件
│   │   │   ├── api/               # API 客户端
│   │   │   └── main.tsx           # 入口
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── README.md                  # 项目 README
│   ├── PACKAGING.md               # 打包指南
│   ├── DEPLOYMENT_GUIDE.md        # 部署文档
│   ├── docker-compose.yml         # Docker 编排（可选）
│   ├── Dockerfile                 # Docker 镜像（可选）
│   ├── start.bat / start.sh        # 一键启动脚本
│   └── build.bat / build.sh        # 构建脚本
│
├── releases/                      # 发布包（源码和生产包）
├── .github/                       # GitHub 配置
│   ├── workflows/ci.yml           # CI/CD 工作流
│   ├── PULL_REQUEST_TEMPLATE.md   # PR 模板
│   └── ISSUE_TEMPLATE/            # Issue 模板
├── README.md                      # 本文件
├── LICENSE                        # MIT 许可证
└── .gitignore                     # Git 忽略规则
```

---

## 🔧 环境配置

### 后端环境变量（`.env`）

在 `taobao-compliance-cs/server/.env` 中配置（已提供示例 `env.sample`）：

```env
# 数据库配置
DB_PATH=./data/taobao_cs.db        # SQLite 文件路径
DB_LOGGING=false                   # 是否输出 SQL 日志

# 服务配置
PORT=3000                          # API 服务端口
NODE_ENV=development               # 运行环境
LOG_LEVEL=info                     # 日志级别

# 前端配置
FRONTEND_URL=http://localhost:5173 # 前端 URL（CORS 用）
H5_BASE_URL=http://localhost:3000  # H5 中转页基础 URL

# 企业微信（可选）
WECHAT_CORP_ID=                    # 企业 ID
WECHAT_SECRET=                     # 企业应用密钥
WECHAT_AGENT_ID=                   # 应用 ID
```

### 首次初始化

```bash
cd taobao-compliance-cs/server
npm install
npm run init:db        # 初始化数据库和种子数据
npm run start:dev      # 启动开发服务
```

---

## 🏃 开发工作流

### 后端开发

```bash
cd taobao-compliance-cs/server

# 安装依赖
npm install

# 开发模式（自动重载）
npm run start:dev

# 生产构建
npm run build
npm start

# 测试
npm test
npm run test:e2e
```

### 前端开发

```bash
cd taobao-compliance-cs/admin

# 安装依赖
npm install

# 开发服务（Vite 热更新）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

---

## 📦 打包与部署

### 本地打包

```bash
cd taobao-compliance-cs

# 构建前后端
npm run build
cd admin
npm run build

# 打包为 tar 或 zip（详见 PACKAGING.md）
npm run package:prod
```

### Docker 部署（可选）

```bash
cd taobao-compliance-cs
docker-compose up -d
```

详见 `taobao-compliance-cs/DEPLOYMENT_GUIDE.md`

---

## 🔐 安全与合规

**重要声明**：本系统必须用于**合法合规的业务场景**。

系统内置安全控制：
- ✅ 自动拦截高风险会话
- ✅ 敏感词检测与标注
- ✅ 审计日志记录
- ✅ H5 中转降低风险
- ✅ 频率控制防止滥用

**禁止用于**：
- ❌ 销售非法商品
- ❌ 钓鱼/诈骗
- ❌ 规避平台审查
- ❌ 任何违法活动

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

详见 `CONTRIBUTING.md`

---

## 📝 许可证

本项目采用 [MIT License](./LICENSE) 许可证

---

## 💬 支持

- 📧 提交 Issue: [GitHub Issues](https://github.com/SLA-tech/-/issues)
- 💡 讨论: [GitHub Discussions](https://github.com/SLA-tech/-/discussions)
- 📖 查看完整文档: [taobao-compliance-cs/README.md](./taobao-compliance-cs/README.md)

---

**最后更新**: 2025-12-02  
**维护者**: [@SLA-tech](https://github.com/SLA-tech)
