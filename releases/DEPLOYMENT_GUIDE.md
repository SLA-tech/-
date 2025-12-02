# 淘宝店铺合规客服系统 - 部署指南

## 📦 发布包说明

**版本**：1.0.0  
**发布日期**：2025-12-02  
**包含内容**：完整的后端服务 + 前端应用 + 数据库初始化

---

## 📋 发布包清单

### 1. 源代码包 (Source)
- **文件名**：`taobao-cs-v20251202-source.tar.gz`
- **大小**：~564 KB
- **用途**：开发环境、本地调试、源代码修改
- **包含**：完整的源代码和配置文件
- **不包含**：`node_modules`、已编译的 `dist` 文件、数据库

### 2. 生产包 (Production)
- **文件名**：`taobao-cs-v20251202-prod.tar.gz`
- **大小**：~497 KB
- **用途**：生产环境部署
- **包含**：
  - ✅ 后端编译产物 (`server/dist`)
  - ✅ 前端构建文件 (`admin/dist`)
  - ✅ 配置模板和说明文档
  - ✅ Package.json 文件
- **不包含**：
  - ❌ `node_modules` (需要单独 install)
  - ❌ 源代码文件
  - ❌ 数据库文件

---

## 🚀 快速部署指南

### 前置需求
- **系统**：Windows 10+、Ubuntu 20.04+、macOS 10.15+
- **Node.js**：v18.0.0 或更高版本
- **npm**：v9.0.0 或更高版本
- **磁盘空间**：至少 500MB

### 方式 1️⃣：使用生产包部署（推荐）

#### 步骤 1：解压生产包
```bash
# Linux/Mac
tar -xzf taobao-cs-v20251202-prod.tar.gz
cd taobao-cs-prod

# Windows (Git Bash 或 WSL)
tar -xzf taobao-cs-v20251202-prod.tar.gz
cd taobao-cs-prod
```

#### 步骤 2：安装依赖
```bash
# 安装后端依赖
cd server
npm install --production
cd ..

# 安装前端依赖（可选，如需要开发）
cd admin
npm install --production
cd ..
```

#### 步骤 3：配置环境
```bash
# 复制环境配置
cp server/env.example server/.env

# 编辑 .env 文件（可选）
# 默认配置：
# - DB_PATH=./data/taobao_cs.db
# - PORT=3000
# - NODE_ENV=production
```

#### 步骤 4：初始化数据库
```bash
cd server
npm run init:db  # 首次运行必需
cd ..
```

#### 步骤 5：启动服务

**方式 A：后台运行**
```bash
cd server
npm run start:prod &
cd ..
```

**方式 B：使用 pm2（推荐生产环境）**
```bash
npm install -g pm2
pm2 start server/dist/main.js --name "taobao-cs"
pm2 save
pm2 startup
```

#### 步骤 6：验证服务
```bash
# 检查后端健康状态
curl http://localhost:3000/health

# 查看敏感词列表（验证数据库）
curl http://localhost:3000/api/v1/sensitive-words
```

#### 步骤 7：访问应用
- **前端管理系统**：http://localhost:5173
- **后端 API**：http://localhost:3000/api/v1
- **H5 重定向页面**：http://localhost:3000/redirect/{sessionId}

---

### 方式 2️⃣：使用源代码包部署

#### 步骤 1：解压源代码
```bash
tar -xzf taobao-cs-v20251202-source.tar.gz
cd taobao-compliance-cs
```

#### 步骤 2：安装依赖
```bash
# 安装后端依赖
cd server
npm install
cd ..

# 安装前端依赖
cd admin
npm install
cd ..
```

#### 步骤 3：构建项目
```bash
# 构建后端
cd server
npm run build
cd ..

# 构建前端
cd admin
npm run build
cd ..
```

#### 步骤 4-7：同上（与生产包相同）

---

## 🔧 常见部署场景

### 场景 1：Windows 系统部署

```batch
@echo off
REM 解压文件
tar -xzf taobao-cs-v20251202-prod.tar.gz
cd taobao-cs-prod

REM 安装依赖
cd server
call npm install --production
cd ..

REM 初始化数据库
cd server
call npm run init:db
cd ..

REM 启动服务
cd server
call npm run start:prod

REM 前端可单独启动或使用 serve 工具
REM npm install -g serve
REM serve -s admin/dist -l 5173
```

### 场景 2：Linux 系统部署（使用 systemd）

```bash
# 1. 解压并部署
sudo mkdir -p /opt/taobao-cs
sudo tar -xzf taobao-cs-v20251202-prod.tar.gz -C /opt/taobao-cs
cd /opt/taobao-cs/taobao-cs-prod

# 2. 安装依赖
cd server
npm install --production
npm run init:db
cd ..

# 3. 创建 systemd 服务文件
sudo tee /etc/systemd/system/taobao-cs.service > /dev/null <<EOF
[Unit]
Description=Taobao Compliance Customer Service System
After=network.target

[Service]
Type=simple
User=nobody
WorkingDirectory=/opt/taobao-cs/taobao-cs-prod/server
ExecStart=/usr/bin/node dist/main.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment="NODE_ENV=production"
Environment="DB_PATH=/opt/taobao-cs/taobao-cs-prod/server/data/taobao_cs.db"
Environment="PORT=3000"

[Install]
WantedBy=multi-user.target
EOF

# 4. 启动服务
sudo systemctl daemon-reload
sudo systemctl enable taobao-cs
sudo systemctl start taobao-cs

# 5. 验证状态
sudo systemctl status taobao-cs
sudo journalctl -u taobao-cs -f
```

### 场景 3：Docker 容器部署

```bash
# 1. 使用 docker-compose（项目自带）
cd taobao-compliance-cs
docker-compose up -d

# 2. 查看日志
docker-compose logs -f

# 3. 停止服务
docker-compose down
```

---

## 📊 性能优化建议

### 1. 数据库优化
```bash
# 定期备份数据库
cp server/data/taobao_cs.db server/data/taobao_cs.db.backup

# 检查数据库完整性
sqlite3 server/data/taobao_cs.db "PRAGMA integrity_check;"
```

### 2. 内存优化
```bash
# 设置 Node.js 堆大小
export NODE_OPTIONS="--max-old-space-size=2048"
npm run start:prod
```

### 3. 反向代理配置（Nginx）

```nginx
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 80;
    server_name your-domain.com;

    # 前端路由
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔐 安全部署建议

- [ ] 修改 `.env` 中的默认配置
- [ ] 使用 HTTPS（配置 SSL 证书）
- [ ] 配置防火墙，限制 3000 端口只允许内网访问
- [ ] 定期备份数据库
- [ ] 监控服务运行状态
- [ ] 关闭调试日志（生产环境）
- [ ] 定期更新依赖包安全补丁

---

## 📊 系统架构

```
┌─────────────────────────────────────────────────────┐
│                    客户端浏览器                      │
└────────────────┬──────────────────────────────────────┘
                 │ HTTP/HTTPS
         ┌───────▼────────────────┐
         │   Nginx 反向代理        │ (可选)
         └───────┬────────────────┘
         ┌───────┴──────────────────┐
         │                          │
    ┌────▼─────┐          ┌────────▼─────┐
    │ React    │          │ NestJS       │
    │ 前端应用  │          │ 后端服务     │
    │ Port:5173│          │ Port:3000    │
    └────┬─────┘          └────────┬─────┘
         │                         │
         │        ┌────────────────┘
         │        │
         └────┬───┴──────────────────┐
              │  SQLite 数据库        │
              │  data/taobao_cs.db   │
              └───────────────────────┘
```

---

## 🐛 故障排查

### 问题 1：数据库连接失败

**症状**：`Error: connect ECONNREFUSED 127.0.0.1:3000`

**解决**：
```bash
# 检查数据库文件是否存在
ls -la server/data/taobao_cs.db

# 重新初始化数据库
cd server
npm run init:db
cd ..

# 检查数据库权限
chmod 755 server/data/taobao_cs.db
```

### 问题 2：前端无法连接后端

**症状**：CORS 错误或 404

**解决**：
```bash
# 检查后端服务是否运行
curl http://localhost:3000/health

# 检查防火墙设置
# Windows: netstat -an | findstr :3000
# Linux: netstat -tulpn | grep :3000

# 检查环境配置
cat server/.env
```

### 问题 3：内存占用过高

**症状**：内存持续增长

**解决**：
```bash
# 设置堆内存限制
export NODE_OPTIONS="--max-old-space-size=1024"

# 使用 pm2 监控
pm2 monit
```

---

## 📈 升级指南

### 升级到新版本

```bash
# 1. 备份当前数据
cp -r server/data server/data.backup

# 2. 停止当前服务
systemctl stop taobao-cs

# 3. 解压新版本
tar -xzf taobao-cs-v{version}-prod.tar.gz

# 4. 复制数据
cp -r server/data.backup/* server/data/

# 5. 更新依赖
cd server
npm install --production
cd ..

# 6. 启动新版本
systemctl start taobao-cs

# 7. 验证
curl http://localhost:3000/health
```

---

## 📞 支持和反馈

遇到问题？请检查：
1. 系统日志：`journalctl -u taobao-cs -f`
2. 应用日志：`server/logs/` (如果配置)
3. API 健康状态：`http://localhost:3000/health`
4. 数据库完整性：`sqlite3 data/taobao_cs.db ".tables"`

---

## 📝 更新历史

### v1.0.0 (2025-12-02)
- ✅ 初始版本发布
- ✅ 敏感词过滤系统
- ✅ 自动回复引擎
- ✅ 会话管理模块
- ✅ 统计报表功能

---

**最后更新**：2025-12-02  
**维护者**：开发团队
