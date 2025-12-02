# 淘宝店铺合规客服系统 - 部署指南

**版本**：1.0.0  
**最后更新**：2025-12-02  
**适用系统**：Windows 10+、Ubuntu 20.04+、macOS 10.15+

---

## 📋 目录

1. [前置需求](#前置需求)
2. [快速部署](#快速部署)
3. [详细部署步骤](#详细部署步骤)
4. [平台特定部署](#平台特定部署)
5. [环境配置](#环境配置)
6. [性能优化](#性能优化)
7. [监控和维护](#监控和维护)
8. [故障排查](#故障排查)
9. [升级指南](#升级指南)
10. [安全部署](#安全部署)

---

## 前置需求

### 系统要求

| 项目 | 最小配置 | 推荐配置 |
|------|---------|---------|
| **CPU** | 2核 | 4核+ |
| **内存** | 2GB | 4GB+ |
| **磁盘** | 100MB | 500MB+ |
| **操作系统** | Windows 10+、Ubuntu 20.04+、macOS 10.15+ | 同左 |

### 软件依赖

- **Node.js**：v18.0.0 或更高版本（推荐 v20+）
- **npm**：v9.0.0 或更高版本
- **Git**（可选，用于版本控制）

### 验证环境

```bash
# 检查 Node.js 版本
node --version
# 应输出：v18.0.0 或更高

# 检查 npm 版本
npm --version
# 应输出：v9.0.0 或更高
```

---

## 快速部署

### 5 分钟快速开始

```bash
# 1. 进入项目目录
cd taobao-compliance-cs

# 2. 安装所有依赖（一键安装）
npm run install:all

# 3. 构建项目
npm run build:all

# 4. 初始化数据库
cd server
npm run init:db
cd ..

# 5. 启动服务
npm run start:dev

# 6. 访问应用
# 前端: http://localhost:5173
# 后端 API: http://localhost:3000/api/v1
```

---

## 详细部署步骤

### 步骤 1：环境检查

```bash
# 检查 Node.js
node -v

# 检查 npm
npm -v

# 检查 npm 配置
npm config list
```

### 步骤 2：克隆/解压项目

```bash
# 如果从压缩包解压
tar -xzf taobao-cs-source.tar.gz
cd taobao-compliance-cs

# 或从 Git 克隆
git clone <repository-url>
cd taobao-compliance-cs
```

### 步骤 3：安装依赖

**方法 A：一键安装所有依赖**
```bash
npm run install:all
```

**方法 B：分别安装后端和前端依赖**
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

**方法 C：仅安装生产依赖（生产环境）**
```bash
# 后端生产依赖
cd server
npm install --production
cd ..

# 前端生产依赖
cd admin
npm install --production
cd ..
```

### 步骤 4：配置环境

```bash
# 复制环境配置文件
cp server/env.sample server/.env

# 编辑配置（如需要）
# Linux/Mac:
nano server/.env
# Windows:
notepad server\.env
```

**环境变量说明**：
```env
# 数据库路径
DB_PATH=./data/taobao_cs.db

# 服务端口
PORT=3000

# Node 环境
NODE_ENV=production

# 前端 URL（可选）
FRONTEND_URL=http://localhost:5173
```

### 步骤 5：初始化数据库

```bash
cd server

# 首次运行必须初始化数据库
npm run init:db

# 验证数据库是否创建成功
# 应该在 server/data/ 目录下看到 taobao_cs.db 文件

cd ..
```

### 步骤 6：构建项目（生产环境）

```bash
# 一键构建所有
npm run build:all

# 或分别构建

# 构建后端
cd server
npm run build
cd ..

# 构建前端
cd admin
npm run build
cd ..
```

### 步骤 7：启动服务

#### 开发环境启动

```bash
# 一键启动（同时启动后端和前端）
npm run start:dev
```

#### 生产环境启动

**方法 A：直接启动**
```bash
cd server
npm run start:prod
```

**方法 B：使用 PM2（推荐）**
```bash
# 全局安装 PM2
npm install -g pm2

# 启动应用
pm2 start server/dist/main.js --name "taobao-cs"

# 查看状态
pm2 status

# 查看日志
pm2 logs taobao-cs

# 设置开机自启
pm2 startup
pm2 save
```

**方法 C：使用 Systemd（Linux）**
```bash
# 创建服务文件
sudo tee /etc/systemd/system/taobao-cs.service > /dev/null <<EOF
[Unit]
Description=Taobao Compliance Customer Service System
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PWD/server
ExecStart=/usr/bin/node dist/main.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment="NODE_ENV=production"
Environment="DB_PATH=$PWD/server/data/taobao_cs.db"
Environment="PORT=3000"

[Install]
WantedBy=multi-user.target
EOF

# 启用服务
sudo systemctl daemon-reload
sudo systemctl enable taobao-cs
sudo systemctl start taobao-cs

# 查看状态
sudo systemctl status taobao-cs
```

### 步骤 8：验证部署

```bash
# 检查后端健康状态
curl http://localhost:3000/health

# 获取敏感词列表（验证 API）
curl http://localhost:3000/api/v1/sensitive-words

# 在浏览器中访问
# 前端: http://localhost:5173
# 后端 API: http://localhost:3000/api/v1
```

---

## 平台特定部署

### Windows 部署

#### 方式 1：命令提示符

```batch
@echo off
cd /d "C:\path\to\taobao-compliance-cs"

REM 安装依赖
cd server
call npm install --production
cd ..

cd admin
call npm install --production
cd ..

REM 初始化数据库
cd server
call npm run init:db
cd ..

REM 启动后端
cd server
call npm run start:prod

REM 前端可在另一个终端启动
REM cd admin
REM call npm run dev
```

#### 方式 2：PowerShell

```powershell
# 设置执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 进入项目目录
cd "C:\path\to\taobao-compliance-cs"

# 安装依赖
npm run install:all

# 初始化数据库
cd server
npm run init:db
cd ..

# 启动应用
npm run start:dev
```

#### 方式 3：使用批处理脚本

创建 `start.bat`：
```batch
@echo off
title Taobao Compliance Customer Service System

echo 启动后端服务...
cd server
start cmd /k "npm run start:prod"

timeout /t 2

echo 启动前端应用...
cd ..\admin
start cmd /k "npm run dev"

echo 应用已启动！
echo 前端: http://localhost:5173
echo 后端: http://localhost:3000
pause
```

### Linux/Ubuntu 部署

#### 使用 Systemd（推荐）

```bash
# 1. 安装依赖
cd ~/taobao-compliance-cs
npm run install:all

# 2. 构建项目
npm run build:all

# 3. 初始化数据库
cd server
npm run init:db
cd ..

# 4. 创建服务文件
sudo tee /etc/systemd/system/taobao-cs.service > /dev/null <<EOF
[Unit]
Description=Taobao Compliance Customer Service System
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)/server
ExecStart=$(which node) dist/main.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment="NODE_ENV=production"
Environment="DB_PATH=$(pwd)/server/data/taobao_cs.db"
Environment="PORT=3000"

[Install]
WantedBy=multi-user.target
EOF

# 5. 启用并启动服务
sudo systemctl daemon-reload
sudo systemctl enable taobao-cs
sudo systemctl start taobao-cs

# 6. 查看状态
sudo systemctl status taobao-cs
sudo journalctl -u taobao-cs -f
```

#### 使用 PM2

```bash
# 1. 全局安装 PM2
sudo npm install -g pm2

# 2. 构建项目
npm run build:all

# 3. 初始化数据库
cd server
npm run init:db
cd ..

# 4. 启动应用
pm2 start server/dist/main.js --name "taobao-cs" --env production

# 5. 保存 PM2 配置
pm2 save
pm2 startup

# 6. 查看日志
pm2 logs taobao-cs
```

### macOS 部署

```bash
# 1. 使用 Homebrew 安装 Node.js（如果还未安装）
brew install node

# 2. 克隆或解压项目
cd ~/Documents
tar -xzf taobao-cs-source.tar.gz
cd taobao-compliance-cs

# 3. 安装依赖
npm run install:all

# 4. 初始化数据库
cd server
npm run init:db
cd ..

# 5. 启动应用
npm run start:dev

# 访问应用
# 前端: http://localhost:5173
# 后端: http://localhost:3000
```

---

## Docker 部署

### 使用 Docker Compose（最简单）

```bash
# 1. 进入项目目录
cd taobao-compliance-cs

# 2. 构建并启动
docker-compose up -d

# 3. 查看日志
docker-compose logs -f

# 4. 验证服务
curl http://localhost:3000/health

# 5. 停止服务
docker-compose down
```

### 手动 Docker 部署

```bash
# 1. 构建镜像
docker build -t taobao-cs:latest .

# 2. 运行容器
docker run -d \
  --name taobao-cs \
  -p 3000:3000 \
  -p 5173:5173 \
  -v $(pwd)/data:/app/server/data \
  -e NODE_ENV=production \
  taobao-cs:latest

# 3. 查看日志
docker logs -f taobao-cs

# 4. 停止容器
docker stop taobao-cs
docker rm taobao-cs
```

---

## 环境配置

### 环境变量详解

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `NODE_ENV` | `development` | 运行环境（development/production） |
| `PORT` | `3000` | 后端服务端口 |
| `DB_PATH` | `./data/taobao_cs.db` | SQLite 数据库文件路径 |
| `FRONTEND_URL` | `http://localhost:5173` | 前端 URL |
| `LOG_LEVEL` | `info` | 日志级别 |

### 配置文件示例

**生产环境 (.env)**：
```env
NODE_ENV=production
PORT=3000
DB_PATH=/var/lib/taobao-cs/data/taobao_cs.db
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=warn
```

**开发环境 (.env)**：
```env
NODE_ENV=development
PORT=3000
DB_PATH=./data/taobao_cs.db
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=debug
```

---

## 性能优化

### 内存优化

```bash
# 设置 Node.js 堆内存大小
export NODE_OPTIONS="--max-old-space-size=2048"
npm run start:prod

# Windows:
set NODE_OPTIONS=--max-old-space-size=2048
npm run start:prod
```

### 数据库优化

```bash
# 定期备份数据库
cp server/data/taobao_cs.db server/data/taobao_cs.db.$(date +%Y%m%d)

# 检查数据库完整性
sqlite3 server/data/taobao_cs.db "PRAGMA integrity_check;"

# 优化数据库
sqlite3 server/data/taobao_cs.db "VACUUM;"
```

### Nginx 反向代理

创建 `/etc/nginx/sites-available/taobao-cs`：

```nginx
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 80;
    server_name yourdomain.com;

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
    }

    # HTTPS 配置（可选）
    # listen 443 ssl;
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/taobao-cs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 监控和维护

### 日志管理

```bash
# 查看后端日志
pm2 logs taobao-cs

# 或使用 Systemd
sudo journalctl -u taobao-cs -f

# 或使用 Docker
docker logs -f taobao-cs
```

### 性能监控

```bash
# 使用 PM2 监控
pm2 monit

# 使用系统命令监控
top
htop  # 需要安装

# 查看端口占用
lsof -i :3000
lsof -i :5173
```

### 定期备份

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/taobao-cs"
DB_PATH="/opt/taobao-cs/server/data/taobao_cs.db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份数据库
cp $DB_PATH $BACKUP_DIR/taobao_cs_$DATE.db

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.db" -mtime +7 -delete

echo "备份完成: $BACKUP_DIR/taobao_cs_$DATE.db"
```

设置定时备份：
```bash
# 每天 2 点执行备份
0 2 * * * /path/to/backup.sh
```

---

## 故障排查

### 问题 1：端口被占用

**症状**：`Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**：

```bash
# Linux/Mac: 查看占用端口的进程
lsof -i :3000

# Windows: 查看占用端口的进程
netstat -ano | findstr :3000

# 杀死进程
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows

# 或更换端口
export PORT=3001
npm run start:prod
```

### 问题 2：数据库连接失败

**症状**：`Error: Cannot find module 'sqlite3'` 或数据库文件不存在

**解决方案**：

```bash
# 重新安装依赖
cd server
rm -rf node_modules package-lock.json
npm install
cd ..

# 重新初始化数据库
cd server
npm run init:db
cd ..

# 检查数据库文件权限
chmod 755 server/data/taobao_cs.db
chmod 755 server/data/
```

### 问题 3：前端无法连接后端

**症状**：浏览器开发工具显示 CORS 错误或 API 请求超时

**解决方案**：

```bash
# 检查后端是否运行
curl http://localhost:3000/health

# 检查防火墙
# Windows:
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe"

# 检查环境变量
echo $PORT  # Linux/Mac
echo %PORT%  # Windows

# 确认前端的 API 地址配置正确
# 检查 admin/src/api/client.ts
```

### 问题 4：内存占用过高

**症状**：应用运行一段时间后内存持续增长

**解决方案**：

```bash
# 设置堆内存限制
export NODE_OPTIONS="--max-old-space-size=1024"
npm run start:prod

# 使用 PM2 自动重启
pm2 start server/dist/main.js --max-memory-restart 512M

# 监控内存使用
pm2 monit
```

### 问题 5：数据库文件损坏

**症状**：`database disk image is malformed` 错误

**解决方案**：

```bash
# 修复数据库
sqlite3 server/data/taobao_cs.db ".recover" | sqlite3 server/data/taobao_cs.db.recover

# 恢复备份（如果有）
cp server/data/taobao_cs.db.backup server/data/taobao_cs.db

# 或重新初始化
rm server/data/taobao_cs.db
cd server
npm run init:db
cd ..
```

### 问题 6：构建失败

**症状**：`npm run build` 显示编译错误

**解决方案**：

```bash
# 清理缓存
npm cache clean --force

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 重新构建
npm run build

# 查看详细错误
npm run build -- --verbose
```

---

## 升级指南

### 升级到新版本

```bash
# 1. 停止当前服务
pm2 stop taobao-cs
# 或
sudo systemctl stop taobao-cs

# 2. 备份数据
cp -r server/data server/data.backup

# 3. 获取新版本
git pull  # 如果使用 Git
# 或
tar -xzf taobao-cs-v1.1.0-prod.tar.gz

# 4. 安装新依赖
npm run install:all

# 5. 构建新版本
npm run build:all

# 6. 数据库迁移（如需要）
cd server
npm run migrate
cd ..

# 7. 启动新版本
pm2 restart taobao-cs
# 或
sudo systemctl start taobao-cs

# 8. 验证
curl http://localhost:3000/health
```

### 回滚版本

```bash
# 如果新版本有问题，恢复备份
cp -r server/data.backup/* server/data/

# 使用之前的版本
git checkout <previous-version>

# 重建和重启
npm run build:all
pm2 restart taobao-cs
```

---

## 安全部署

### 安全检查清单

- [ ] 修改所有默认密码和密钥
- [ ] 启用 HTTPS/SSL 证书
- [ ] 配置防火墙规则
- [ ] 限制公网访问敏感端口
- [ ] 启用日志审计
- [ ] 定期更新依赖包
- [ ] 配置备份策略
- [ ] 监控异常活动

### HTTPS 配置

```bash
# 使用 Let's Encrypt 获取免费证书
sudo apt install certbot python3-certbot-nginx

# 申请证书
sudo certbot certonly --nginx -d yourdomain.com

# Nginx 配置
sudo nano /etc/nginx/sites-available/taobao-cs

# 添加 SSL 配置：
# listen 443 ssl;
# ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

### 定期更新

```bash
# 检查过期的依赖
npm outdated

# 更新依赖
npm update

# 审计安全漏洞
npm audit

# 修复漏洞
npm audit fix
```

---

## 常用命令速查表

| 操作 | Windows | Linux/Mac |
|------|---------|----------|
| **安装依赖** | `npm install` | `npm install` |
| **启动开发** | `npm run start:dev` | `npm run start:dev` |
| **启动生产** | `npm run start:prod` | `npm run start:prod` |
| **构建** | `npm run build:all` | `npm run build:all` |
| **初始化数据库** | `cd server && npm run init:db` | `cd server && npm run init:db` |
| **查看日志** | 控制台输出 | `pm2 logs` 或 `journalctl -u taobao-cs -f` |
| **停止服务** | `Ctrl+C` | `pm2 stop taobao-cs` 或 `systemctl stop taobao-cs` |

---

## 获取帮助

### 常见问题

查看项目根目录的以下文件：
- `README.md` - 项目概述
- `PACKAGING.md` - 打包指南

### 查看日志

```bash
# 后端日志
pm2 logs taobao-cs

# 系统日志（Linux）
journalctl -u taobao-cs -f

# Docker 日志
docker logs -f taobao-cs
```

### 联系支持

如有问题，请查看上述故障排查部分或查阅相关文档。

---

## 附录

### A. 系统架构图

```
┌─────────────┐
│  浏览器      │
│ localhost:  │
│  5173       │
└──────┬──────┘
       │ HTTP/HTTPS
       ↓
┌──────────────────┐
│  Nginx (可选)    │
└──────┬───────────┘
       │
  ┌────┴────┐
  ↓         ↓
React    NestJS
5173     3000
  ↓
SQLite
data/taobao_cs.db
```

### B. 端口映射

| 服务 | 端口 | 协议 | 说明 |
|------|------|------|------|
| 前端 | 5173 | HTTP | Vite 开发服务器 |
| 后端 | 3000 | HTTP | NestJS API 服务器 |
| Nginx | 80/443 | HTTP/HTTPS | 反向代理（可选） |

### C. 默认凭证

| 项目 | 值 |
|------|-----|
| 数据库文件 | `./data/taobao_cs.db` |
| 初始敏感词数 | 7 个 |
| 初始模板数 | 3 个 |

---

**本文档持续更新中...**

如有任何问题或建议，欢迎反馈！
