# 淘宝店铺合规客服系统

> 为淘宝店铺提供**自动回复 + 敏感词过滤 + 合规引流**的综合系统

## 系统功能

1. **自动回复引擎**：文字/图片循环、FAQ匹配、欢迎语
2. **敏感词过滤与风险控制**：检测、拦截、统计、标注
3. **合规引流模块**：H5 中转页 + 企业微信接入 + 添加频率控制
4. **管理后台**：话术编辑、词库编辑、统计面板、用户管理

## 技术栈

- **后端**：NestJS + TypeORM + SQLite（本地文件数据库）
- **前端**：React + Vite + Ant Design
- **存储**：SQLite 本地数据库，无需服务器

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| **QUICK_START.md** | ⚡ 5分钟快速开始 |
| **WINDOWS_SETUP.md** | 🪟 Windows 完整设置指南 |
| **WINDOWS_READY.md** | ✅ Windows 配置完成检查 |
| **SETUP.md** | 📋 详细部署配置 |
| **API.md** | 🔌 REST API 文档 |
| **PACKAGING.md** | 📦 项目打包指南 |
| **QUICK_PACKAGING.md** | ⚡ 快速打包 |
| **CHECKLIST.md** | ✅ 部署检查清单 |
| **TROUBLESHOOTING.md** | 🔧 故障排查 |
| **MANUAL.md** | 📖 完整使用手册 |

## 快速开始（本地运行）

### 前置要求

- Node.js 20+
- npm 或 yarn

**无需安装 MySQL、Redis 或 Docker！** 系统使用 SQLite 本地数据库，所有数据存储在本地文件中。

### 一键启动（推荐）

#### Windows 用户
```
双击项目根目录的 start.bat
```

#### Linux/Mac 用户
```bash
chmod +x start.sh
./start.sh
```

### 1. 克隆项目

```bash
git clone <repository-url>
cd taobao-compliance-cs
```

### 2. 配置环境变量

#### 后端配置

复制 `server/env.sample` 为 `server/.env`：

```bash
cd server
cp env.sample .env
```

`.env` 文件已配置好默认值，可直接使用：

```env
DB_PATH=./data/taobao_cs.db  # SQLite数据库文件路径
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
H5_BASE_URL=http://localhost:3000
```

### 3. 安装后端依赖并初始化数据库

```bash
cd server
npm install

# 初始化数据库（自动创建数据库文件和种子数据）
npm run init:db

# 启动后端服务
npm run start:dev
```

后端服务将在 `http://localhost:3000` 启动

**注意**：首次运行会自动创建 `./data/taobao_cs.db` 数据库文件并插入初始数据。

### 4. 安装前端依赖并启动

```bash
cd admin
npm install
npm run dev
```

前端管理后台将在 `http://localhost:5173` 启动

### 5. 访问系统

- 后端API: http://localhost:3000
- 前端管理后台: http://localhost:5173
- H5重定向页面: http://localhost:3000/redirect/:sessionId

## 项目结构

```
taobao-compliance-cs/
├── server/                 # 后端服务
│   ├── data/              # SQLite 数据库文件（自动创建）
│   ├── src/
│   │   ├── entities/      # 数据库实体
│   │   ├── services/      # 业务服务
│   │   ├── messages/      # 消息模块
│   │   ├── sensitive-words/ # 敏感词模块
│   │   ├── templates/     # 模板模块
│   │   ├── sessions/      # 会话模块
│   │   ├── reports/       # 报表模块
│   │   ├── redirect/      # H5重定向模块
│   │   └── database/      # 数据库迁移和种子
│   └── package.json
├── admin/                  # 前端管理后台
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # 公共组件
│   │   └── api/           # API客户端
│   └── package.json
├── README.md
└── QUICK_START.md
```

## API 文档

### 消息接口

- `POST /api/v1/messages/inbound` - 接收消息
- `POST /api/v1/messages/outbound` - 发送消息
- `GET /api/v1/messages/session/:sessionId` - 获取会话消息

### 敏感词管理

- `GET /api/v1/sensitive-words` - 获取敏感词列表
- `POST /api/v1/sensitive-words` - 添加敏感词
- `PUT /api/v1/sensitive-words/:id` - 更新敏感词
- `DELETE /api/v1/sensitive-words/:id` - 删除敏感词

### 模板管理

- `GET /api/v1/templates` - 获取模板列表
- `POST /api/v1/templates` - 添加模板
- `PUT /api/v1/templates/:id` - 更新模板
- `DELETE /api/v1/templates/:id` - 删除模板

### 会话管理

- `GET /api/v1/sessions` - 获取会话列表
- `GET /api/v1/sessions/:id` - 获取会话详情
- `PUT /api/v1/sessions/:id/close` - 关闭会话
- `PUT /api/v1/sessions/:id/block` - 拦截会话

### 统计报表

- `GET /api/v1/reports/sensitive-summary` - 敏感词触发统计

### H5重定向

- `GET /redirect/:sessionId` - H5客服页面

## 核心功能说明

### 1. 敏感词检测

系统使用 Aho-Corasick 算法进行高效敏感词匹配，支持：
- 文本归一化（去空格、大小写、全角半角统一）
- 严重程度分级（1-10）
- 自动拦截高风险会话

### 2. 自动回复

- FAQ 匹配：基于关键词的精确/模糊匹配
- 循环模板：支持配置循环间隔和最大循环次数
- 欢迎语：首次会话自动发送

### 3. 合规引流

- H5 中转页面，降低封号风险
- 企业微信集成（需配置企业微信参数）
- 频率控制：同一用户1小时内只发送一次

## 安全与合规

**重要提示**：系统设计必须合法合规，禁止任何规避平台审查或制作/销售非法印章的行为。

系统会自动：
1. 拦截高风险会话并停止沟通
2. 回复告知无法提供违法服务
3. 将会话标注为高风险并记录审计日志

## 开发说明

### 数据库迁移

生产环境应使用 TypeORM 迁移，而不是 `synchronize: true`。

### 企业微信集成

需要在 `.env` 中配置企业微信相关参数：
- `WECHAT_CORP_ID`
- `WECHAT_SECRET`
- `WECHAT_AGENT_ID`

参考企业微信官方文档进行配置。

### PC 自动化适配层

如需对接淘宝PC客户端，需要实现适配层：
- 监听新私信
- 调用 `/api/v1/messages/inbound` 接口
- 从队列获取回复并发送

可以使用 Selenium、WinAppDriver 等工具实现。

## 测试

```bash
# 后端测试
cd server
npm test

# E2E测试
npm run test:e2e
```

## 部署

### 本地运行（推荐）

系统设计为本地运行，无需服务器：

1. 安装 Node.js 20+
2. 运行 `npm install` 安装依赖
3. 运行 `npm run init:db` 初始化数据库
4. 运行 `npm run start:dev` 启动服务

### 打包为可执行文件（可选）

可以使用 `pkg` 或 `nexe` 将 Node.js 应用打包为可执行文件：

```bash
npm install -g pkg
pkg server/package.json
```

### 环境变量说明

参考 `server/env.sample` 文件。主要配置：

- `DB_PATH`: SQLite 数据库文件路径（默认：`./data/taobao_cs.db`）
- `PORT`: 服务端口（默认：3000）
- `NODE_ENV`: 运行环境（development/production）

## 许可证

本项目仅供学习和合法合规使用。

## 支持

如有问题，请提交 Issue 或联系开发团队。

---

**注意**：本系统必须用于合法合规的业务场景，严禁用于任何违法用途。


