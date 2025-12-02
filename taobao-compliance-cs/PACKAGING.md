# 淘宝店铺合规客服系统 - 项目打包完全指南

## 📦 打包概述

本项目支持多种打包方式，满足不同的部署需求：

| 打包方式 | 适用场景 | 文件大小 | 难度 |
|--------|--------|--------|------|
| **源代码打包** | 开发/本地运行 | ~50MB | ⭐ 简单 |
| **可执行文件** | 无需Node.js环境 | ~150MB | ⭐⭐ 中等 |
| **Docker镜像** | 容器化部署 | ~500MB | ⭐⭐ 中等 |
| **Windows安装程序** | Windows用户一键安装 | ~200MB | ⭐⭐⭐ 复杂 |
| **Linux软件包** | Ubuntu/CentOS包管理器 | ~100MB | ⭐⭐⭐ 复杂 |

---

## 🚀 快速打包（推荐）

### 方式1️⃣：源代码打包（最简单）

```bash
# 1. 进入项目根目录
cd taobao-compliance-cs

# 2. 清理不必要的文件
rm -rf server/node_modules admin/node_modules  # Linux/Mac
rmdir /s server\node_modules admin\node_modules  # Windows

# 3. 创建压缩包
tar -czf taobao-cs-source.tar.gz --exclude=.git --exclude=data \
  --exclude=dist --exclude=coverage .  # Linux/Mac

# Windows用户可使用7-Zip或WinRAR：
# 1. 右键点击项目文件夹
# 2. 选择"添加到压缩文件"
# 3. 选择.zip格式
```

**使用方式**：
```bash
# 接收方解压后
tar -xzf taobao-cs-source.tar.gz
cd taobao-compliance-cs
npm install
npm run start:dev
```

---

### 方式2️⃣：生产构建打包

```bash
# 1. 构建后端
cd server
npm install --production  # 仅安装生产依赖
npm run build
cd ..

# 2. 构建前端
cd admin
npm install --production
npm run build
cd ..

# 3. 创建生产包
mkdir -p taobao-cs-prod/server/dist
mkdir -p taobao-cs-prod/admin/dist

# 复制必要的文件
cp -r server/dist taobao-cs-prod/server/
cp -r server/node_modules taobao-cs-prod/server/
cp server/package.json taobao-cs-prod/server/

cp -r admin/dist taobao-cs-prod/admin/
cp admin/package.json taobao-cs-prod/admin/

cp .env.sample taobao-cs-prod/server/.env
cp README.md SETUP.md API.md taobao-cs-prod/

# 4. 打包
tar -czf taobao-cs-prod.tar.gz taobao-cs-prod/
```

---

## 💻 Windows 可执行文件打包

### 使用 pkg 工具

```bash
# 1. 安装pkg全局工具
npm install -g pkg

# 2. 构建后端
cd server
npm install --production
npm run build

# 3. 生成exe文件
pkg dist/main.js -t win-x64 -o taobao-cs-backend.exe

# 创建启动脚本
echo @echo off > start.bat
echo taobao-cs-backend.exe >> start.bat
echo pause >> start.bat

# 4. 前端为SPA，需要使用轻量级服务器
npm install -g serve
serve -s admin/dist -l 5173
```

### 使用 NSIS 创建安装程序（高级）

```bash
# 1. 安装 NSIS
# 下载：https://nsis.sourceforge.io/

# 2. 创建安装脚本 installer.nsi
# 见下文专门章节

# 3. 编译安装程序
makensis installer.nsi
```

---

## 🐧 Linux/Mac 打包

### 创建 Linux 软件包

```bash
# 1. 构建项目
cd server
npm run build
cd ../admin
npm run build
cd ..

# 2. 创建目录结构
mkdir -p taobao-cs-linux/opt/taobao-cs
mkdir -p taobao-cs-linux/etc/systemd/system
mkdir -p taobao-cs-linux/usr/local/bin

# 3. 复制文件
cp -r server/dist taobao-cs-linux/opt/taobao-cs/server/
cp -r server/node_modules taobao-cs-linux/opt/taobao-cs/server/
cp -r admin/dist taobao-cs-linux/opt/taobao-cs/admin/
cp .env.sample taobao-cs-linux/opt/taobao-cs/server/.env

# 4. 创建systemd服务文件
cat > taobao-cs-linux/etc/systemd/system/taobao-cs.service << 'EOF'
[Unit]
Description=Taobao Compliance Customer Service System
After=network.target

[Service]
Type=simple
User=nobody
WorkingDirectory=/opt/taobao-cs/server
ExecStart=/usr/bin/node dist/main.js
Restart=always
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
EOF

# 5. 打包为 tar.gz
tar -czf taobao-cs-linux-amd64.tar.gz taobao-cs-linux/
```

---

## 🐳 Docker 打包

### 创建 Dockerfile

```dockerfile
# 多阶段构建
FROM node:20-alpine AS builder

WORKDIR /app

# 复制源代码
COPY server server/
COPY admin admin/
COPY package.json .

# 安装依赖并构建
RUN cd server && npm install && npm run build
RUN cd admin && npm install && npm run build

# 运行时镜像
FROM node:20-alpine

WORKDIR /app

# 安装轻量级服务器
RUN npm install -g serve

# 复制构建产物
COPY --from=builder /app/server/dist server/dist/
COPY --from=builder /app/server/node_modules server/node_modules/
COPY --from=builder /app/admin/dist admin/dist/
COPY --from=builder /app/server/package.json server/

# 创建数据目录
RUN mkdir -p server/data

# 暴露端口
EXPOSE 3000 5173

# 启动脚本
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
```

### 创建启动脚本 (docker-entrypoint.sh)

```bash
#!/bin/sh

# 启动后端
cd /app/server
node dist/main.js &
BACKEND_PID=$!

# 启动前端
cd /app/admin
serve -s dist -l 5173 &
FRONTEND_PID=$!

# 等待进程
wait $BACKEND_PID $FRONTEND_PID
```

### 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  taobao-cs:
    build: .
    ports:
      - "3000:3000"
      - "5173:5173"
    volumes:
      - ./data:/app/server/data
    environment:
      - NODE_ENV=production
      - DB_PATH=/app/server/data/taobao_cs.db
      - PORT=3000
      - FRONTEND_URL=http://localhost:5173
    restart: unless-stopped
```

### 构建和运行

```bash
# 构建镜像
docker build -t taobao-cs:latest .

# 使用 docker-compose 运行
docker-compose up -d

# 查看日志
docker-compose logs -f taobao-cs

# 停止服务
docker-compose down
```

---

## 📦 详细打包步骤

### Windows 独立可执行文件

#### 第1步：安装 pkg

```bash
npm install -g pkg
```

#### 第2步：配置 package.json

在 `server/package.json` 中添加：

```json
{
  "pkg": {
    "targets": ["win-x64"],
    "outputPath": "dist",
    "scripts": ["dist/**/*.js"],
    "assets": [
      "node_modules/**/*"
    ]
  }
}
```

#### 第3步：构建

```bash
cd server
npm run build
pkg package.json
```

生成的 `server.exe` 就是可执行文件。

---

### Linux 系统服务安装

#### 创建安装脚本 (install.sh)

```bash
#!/bin/bash

set -e

echo "开始安装淘宝合规客服系统..."

# 检查权限
if [[ $EUID -ne 0 ]]; then
   echo "此脚本必须以root权限运行"
   exit 1
fi

# 安装目录
INSTALL_DIR="/opt/taobao-cs"
SERVICE_NAME="taobao-cs"

# 1. 创建安装目录
mkdir -p $INSTALL_DIR/server/data
mkdir -p $INSTALL_DIR/admin

# 2. 复制文件
cp -r server/dist $INSTALL_DIR/server/
cp -r server/node_modules $INSTALL_DIR/server/
cp -r admin/dist $INSTALL_DIR/admin/
cp server/package.json $INSTALL_DIR/server/
cp .env.sample $INSTALL_DIR/server/.env

# 3. 设置权限
chown -R nobody:nogroup $INSTALL_DIR

# 4. 创建 systemd 服务
cat > /etc/systemd/system/$SERVICE_NAME.service << 'EOF'
[Unit]
Description=Taobao Compliance Customer Service System
After=network.target

[Service]
Type=simple
User=nobody
WorkingDirectory=/opt/taobao-cs/server
ExecStart=/usr/bin/node dist/main.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment="NODE_ENV=production"
Environment="DB_PATH=/opt/taobao-cs/server/data/taobao_cs.db"
Environment="PORT=3000"

[Install]
WantedBy=multi-user.target
EOF

# 5. 启用服务
systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl start $SERVICE_NAME

echo "✅ 安装完成！"
echo "服务状态: systemctl status $SERVICE_NAME"
echo "启动服务: systemctl start $SERVICE_NAME"
echo "停止服务: systemctl stop $SERVICE_NAME"
echo "查看日志: journalctl -u $SERVICE_NAME -f"
```

#### 使用安装脚本

```bash
chmod +x install.sh
sudo ./install.sh

# 验证安装
sudo systemctl status taobao-cs
sudo journalctl -u taobao-cs -f
```

---

### Windows NSIS 安装程序

#### 创建 installer.nsi

```nsis
; 淘宝合规客服系统 Windows 安装程序

!include "MUI2.nsh"

; 基本配置
Name "淘宝合规客服系统"
OutFile "taobao-cs-installer.exe"
InstallDir "$PROGRAMFILES\TaobaoCS"
InstallDirRegKey HKCU "Software\TaobaoCS" "Install_Dir"

; UI设置
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_LANGUAGE "ChineseSimplified"

; 安装步骤
Section "Install"
  SetOutPath "$INSTDIR"
  
  ; 复制文件
  File /r "server\dist\*.*"
  File /r "server\node_modules\*.*"
  File "server\.env"
  
  ; 创建开始菜单快捷方式
  CreateDirectory "$SMPROGRAMS\TaobaoCS"
  CreateShortcut "$SMPROGRAMS\TaobaoCS\启动服务.lnk" "$INSTDIR\start.bat"
  CreateShortcut "$SMPROGRAMS\TaobaoCS\卸载.lnk" "$INSTDIR\uninstall.exe"
  
  ; 保存安装路径
  WriteRegStr HKCU "Software\TaobaoCS" "Install_Dir" "$INSTDIR"
  
  ; 创建卸载程序
  WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

; 卸载步骤
Section "Uninstall"
  ; 删除文件
  RMDir /r "$INSTDIR"
  
  ; 删除开始菜单
  RMDir /r "$SMPROGRAMS\TaobaoCS"
  
  ; 删除注册表
  DeleteRegKey HKCU "Software\TaobaoCS"
SectionEnd
```

#### 使用 NSIS 编译

```bash
# 1. 安装 NSIS (Windows)
# 下载: https://nsis.sourceforge.io/Download

# 2. 准备文件
mkdir installer
cp -r server/dist installer/
cp -r server/node_modules installer/
cp .env.sample installer/.env

# 3. 编译
makensis.exe /DPRODUCTVERSION=1.0.0 /DPRODUCTNAME="taobao-cs" installer.nsi

# 得到 taobao-cs-installer.exe
```

---

## 🗂️ 打包文件清单

### 源代码包应包含

```
taobao-cs-source/
├── README.md
├── QUICK_START.md
├── SETUP.md
├── API.md
├── CHECKLIST.md
├── TROUBLESHOOTING.md
├── MANUAL.md
├── start.sh
├── start.bat
├── test-api.js
├── test-api.bat
├── server/
│   ├── src/
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── env.sample
│   └── .env (可选)
├── admin/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── .gitignore
```

### 生产包应包含

```
taobao-cs-prod/
├── README.md
├── SETUP.md
├── server/
│   ├── dist/         ← 编译后的代码
│   ├── node_modules/ ← 生产依赖
│   ├── data/         ← 数据目录（可选）
│   ├── package.json
│   └── .env
├── admin/
│   ├── dist/         ← 构建的静态文件
│   └── package.json
└── docker-compose.yml (可选)
```

---

## 📋 打包前检查清单

- [ ] 所有测试通过：`npm test`
- [ ] 代码构建成功：`npm run build`
- [ ] 前端构建成功：`npm run build`
- [ ] 删除敏感信息（密钥、密码等）
- [ ] 更新版本号：`package.json` 中的 `version`
- [ ] 检查依赖大小，移除不必要的包
- [ ] 清理 `node_modules` 和 `dist` 目录
- [ ] 验证数据库初始化脚本
- [ ] 准备好部署文档和说明
- [ ] 创建变更日志 (CHANGELOG.md)

---

## 📊 不同打包方式对比

| 方面 | 源代码 | 可执行文件 | Docker | 安装程序 |
|------|--------|-----------|--------|---------|
| **文件大小** | 50MB | 150MB | 500MB+ | 200MB |
| **部署时间** | 5分钟 | 1分钟 | 2分钟 | 3分钟 |
| **系统依赖** | Node.js | 无 | Docker | 无 |
| **易用性** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **维护性** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| **跨平台** | ✅ | ❌ | ✅ | ❌ |

---

## 🔧 包管理工具对比

### pkg（生成可执行文件）

**优点**：
- 无需安装Node.js
- 文件独立，便于分发
- 支持多平台

**缺点**：
- 文件体积较大
- 不易更新依赖
- 调试困难

### Docker（容器化）

**优点**：
- 环境一致性好
- 易于扩展和编排
- 生产环境推荐

**缺点**：
- 需要安装Docker
- 学习曲线较陡
- 文件体积大

### NSIS（Windows安装程序）

**优点**：
- 用户体验好
- 自动化安装
- Windows用户熟悉

**缺点**：
- 仅限Windows
- 制作复杂
- 难以自动更新

---

## 💾 版本管理

### 创建版本标签

```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0

# 查看所有标签
git tag -l
```

### 创建变更日志

```markdown
# 变更日志

## [1.0.0] - 2025-12-01

### 新功能
- 敏感词过滤系统
- 自动回复引擎
- 会话管理模块
- 统计报表功能

### 改进
- 优化敏感词匹配性能
- 改进前端用户界面
- 增强数据库稳定性

### 修复
- 修复H5页面布局问题
- 修复API跨域错误
- 修复数据库初始化bug

### 已知问题
- 大数据量下性能需优化
- 部分功能需完善
```

---

## 🚀 自动化打包脚本

### build.sh（Linux/Mac）

```bash
#!/bin/bash

set -e

VERSION=${1:-1.0.0}
BUILD_DIR="build"
RELEASE_DIR="releases"

echo "开始打包版本 $VERSION..."

# 1. 创建目录
mkdir -p $BUILD_DIR/$RELEASE_DIR

# 2. 构建后端
cd server
npm install --production
npm run build
cd ..

# 3. 构建前端
cd admin
npm install --production
npm run build
cd ..

# 4. 创建源代码包
echo "打包源代码..."
tar -czf $RELEASE_DIR/taobao-cs-$VERSION-source.tar.gz \
  --exclude=node_modules --exclude=dist --exclude=.git \
  --exclude=data --exclude=coverage .

# 5. 创建生产包
echo "打包生产版本..."
mkdir -p $BUILD_DIR/prod/server/dist
mkdir -p $BUILD_DIR/prod/admin/dist

cp -r server/dist/* $BUILD_DIR/prod/server/dist/
cp -r admin/dist/* $BUILD_DIR/prod/admin/dist/
cp README.md SETUP.md API.md $BUILD_DIR/prod/
cp server/.env $BUILD_DIR/prod/server/

tar -czf $RELEASE_DIR/taobao-cs-$VERSION-prod.tar.gz -C $BUILD_DIR prod/

# 6. 清理
rm -rf $BUILD_DIR

echo "✅ 打包完成！"
echo "文件位置："
ls -lh $RELEASE_DIR/
```

### build.bat（Windows）

```batch
@echo off
setlocal enabledelayedexpansion

set VERSION=%1
if "%VERSION%"=="" set VERSION=1.0.0

set BUILD_DIR=build
set RELEASE_DIR=releases

echo 开始打包版本 %VERSION%...

REM 1. 创建目录
if not exist %RELEASE_DIR% mkdir %RELEASE_DIR%
if not exist %BUILD_DIR% mkdir %BUILD_DIR%

REM 2. 构建后端
cd server
call npm install --production
call npm run build
cd ..

REM 3. 构建前端
cd admin
call npm install --production
call npm run build
cd ..

REM 4. 创建生产包
echo 打包生产版本...
REM 使用 7-Zip 或其他压缩工具
REM 此处需要手动操作或使用第三方工具

echo ✅ 打包完成！
pause
```

---

## 📝 部署包说明文档模板

创建 `DEPLOYMENT.md`：

```markdown
# 部署指南

## 包版本
- 版本号：1.0.0
- 发布日期：2025-12-01
- 支持系统：Windows 10+, Ubuntu 20.04+, macOS 10.15+

## 系统需求

- **最小配置**：2核CPU、2GB内存、100MB磁盘
- **推荐配置**：4核CPU、4GB内存、500MB磁盘

## 快速部署

### Windows
1. 双击 `taobao-cs-installer.exe`
2. 按照向导完成安装
3. 启动菜单中找到应用并运行

### Linux
\`\`\`bash
tar -xzf taobao-cs-1.0.0-prod.tar.gz
cd prod
sudo ./install.sh
sudo systemctl start taobao-cs
\`\`\`

### Docker
\`\`\`bash
docker-compose up -d
\`\`\`

## 首次运行

访问 http://localhost:5173

## 故障排查

查看 TROUBLESHOOTING.md

## 更新

\`\`\`bash
# 停止服务
systemctl stop taobao-cs

# 备份数据
cp -r data data.backup

# 解压新版本
tar -xzf taobao-cs-1.1.0-prod.tar.gz

# 启动服务
systemctl start taobao-cs
\`\`\`

## 支持

有问题请查看文档或联系技术支持。
```

---

## ✅ 打包验证

### 检查源代码包

```bash
# 解压
tar -xzf taobao-cs-1.0.0-source.tar.gz
cd taobao-cs

# 验证文件完整性
ls -la server/src/ admin/src/

# 安装和运行
npm install
npm run start:dev

# 访问系统
# http://localhost:5173
```

### 检查生产包

```bash
# 解压
tar -xzf taobao-cs-1.0.0-prod.tar.gz

# 验证构建产物
ls prod/server/dist/
ls prod/admin/dist/

# 检查文件大小
du -sh prod/
```

### 检查Docker镜像

```bash
# 查看镜像
docker images | grep taobao-cs

# 运行容器
docker run -p 3000:3000 -p 5173:5173 taobao-cs:latest

# 查看日志
docker logs <container-id>
```

---

## 🔐 安全打包建议

- [ ] 移除所有调试信息和日志
- [ ] 删除 `.env` 中的敏感密钥（使用环境变量替代）
- [ ] 移除源代码中的硬编码凭证
- [ ] 压缩和混淆前端代码（生产构建自动完成）
- [ ] 签名可执行文件（Windows代码签名）
- [ ] 验证依赖包的安全性

---

## 📈 包大小优化

### 减少依赖大小

```bash
# 分析包大小
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer admin/dist/stats.json

# 移除未使用的依赖
npm prune --production
```

### 压缩优化

```bash
# 启用gzip压缩
npm install -g gzip

# 压缩文件
gzip -9 server/dist/*.js
```

---

## 🎯 下一步

选择适合您的打包方式并按照对应步骤执行。建议按以下优先级：

1. **开发/测试**：源代码打包
2. **小型部署**：Docker打包
3. **大规模企业**：Windows/Linux安装程序
4. **最终交付**：生产构建包 + 部署文档

---

**更新日期**：2025年12月1日  
**版本**：1.0.0
