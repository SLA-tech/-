#!/bin/bash

# 淘宝店铺合规客服系统 - Linux/Mac 自动打包脚本

set -e

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
VERSION=${1:-1.0.0}
BUILD_DIR="build"
RELEASE_DIR="releases"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}淘宝合规客服系统 - 打包工具${NC}"
echo -e "${GREEN}版本: $VERSION${NC}"
echo -e "${GREEN}时间: $TIMESTAMP${NC}"
echo -e "${GREEN}======================================${NC}\n"

# 清理函数
cleanup() {
    echo -e "${YELLOW}清理临时文件...${NC}"
    rm -rf $BUILD_DIR
}

# 错误处理
trap cleanup EXIT

# 1. 检查环境
echo -e "${YELLOW}[1/6] 检查环境...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未安装 Node.js${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 未安装 npm${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js 版本: $NODE_VERSION${NC}"
echo -e "${GREEN}✅ npm 版本: $(npm -v)${NC}\n"

# 2. 创建目录结构
echo -e "${YELLOW}[2/6] 创建目录结构...${NC}"
mkdir -p $BUILD_DIR/{prod,docker}
mkdir -p $RELEASE_DIR
echo -e "${GREEN}✅ 目录创建完成${NC}\n"

# 3. 构建后端
echo -e "${YELLOW}[3/6] 构建后端服务...${NC}"
cd server
echo "清理旧构建..."
rm -rf dist node_modules
echo "安装依赖..."
npm install --legacy-peer-deps > /dev/null 2>&1 || npm install > /dev/null 2>&1
echo "编译源代码..."
npm run build
echo "安装生产依赖..."
npm install --production > /dev/null 2>&1
cd ..
echo -e "${GREEN}✅ 后端构建完成${NC}\n"

# 4. 构建前端
echo -e "${YELLOW}[4/6] 构建前端管理后台...${NC}"
cd admin
echo "清理旧构建..."
rm -rf dist node_modules
echo "安装依赖..."
npm install > /dev/null 2>&1
echo "编译源代码..."
npm run build
cd ..
echo -e "${GREEN}✅ 前端构建完成${NC}\n"

# 5. 创建打包文件
echo -e "${YELLOW}[5/6] 打包应用文件...${NC}"

# 5.1 创建源代码包
echo "生成源代码包..."
tar -czf $RELEASE_DIR/taobao-cs-$VERSION-source.tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=.git \
  --exclude=build \
  --exclude=releases \
  --exclude=data \
  --exclude=coverage \
  --exclude=.DS_Store \
  --exclude='*.log' \
  . > /dev/null 2>&1

SOURCE_SIZE=$(du -sh $RELEASE_DIR/taobao-cs-$VERSION-source.tar.gz | cut -f1)
echo -e "${GREEN}✅ 源代码包: taobao-cs-$VERSION-source.tar.gz ($SOURCE_SIZE)${NC}"

# 5.2 创建生产包
echo "生成生产包..."
mkdir -p $BUILD_DIR/prod/server/data
mkdir -p $BUILD_DIR/prod/admin

# 复制后端文件
cp -r server/dist $BUILD_DIR/prod/server/
cp -r server/node_modules $BUILD_DIR/prod/server/
cp server/package.json $BUILD_DIR/prod/server/
cp server/env.sample $BUILD_DIR/prod/server/.env

# 复制前端文件
cp -r admin/dist/* $BUILD_DIR/prod/admin/
cp admin/package.json $BUILD_DIR/prod/

# 复制文档和脚本
cp README.md QUICK_START.md SETUP.md API.md CHECKLIST.md TROUBLESHOOTING.md MANUAL.md PACKAGING.md $BUILD_DIR/prod/ 2>/dev/null || true
cp start.sh test-api.js $BUILD_DIR/prod/ 2>/dev/null || true

# 修改启动脚本以适应生产环境
cat > $BUILD_DIR/prod/start-prod.sh << 'EOF'
#!/bin/bash
cd server
NODE_ENV=production npm start
EOF
chmod +x $BUILD_DIR/prod/start-prod.sh

# 打包生产版本
tar -czf $RELEASE_DIR/taobao-cs-$VERSION-prod.tar.gz -C $BUILD_DIR prod/ > /dev/null 2>&1

PROD_SIZE=$(du -sh $RELEASE_DIR/taobao-cs-$VERSION-prod.tar.gz | cut -f1)
echo -e "${GREEN}✅ 生产包: taobao-cs-$VERSION-prod.tar.gz ($PROD_SIZE)${NC}"

# 5.3 创建Docker包
echo "生成Docker包..."
# 复制Dockerfile
if [ -f "Dockerfile" ]; then
    cp Dockerfile $BUILD_DIR/docker/
else
    # 如果没有Dockerfile，创建一个
    cat > $BUILD_DIR/docker/Dockerfile << 'DOCKERFILE'
FROM node:20-alpine

WORKDIR /app

COPY server/dist server/dist/
COPY server/node_modules server/node_modules/
COPY admin/dist admin/dist/
COPY server/package.json server/

RUN npm install -g serve

EXPOSE 3000 5173

CMD ["sh", "-c", "cd server && node dist/main.js & serve -s admin/dist -l 5173"]
DOCKERFILE
fi

# 复制docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    cp docker-compose.yml $BUILD_DIR/docker/
fi

tar -czf $RELEASE_DIR/taobao-cs-$VERSION-docker.tar.gz -C $BUILD_DIR docker/ > /dev/null 2>&1

DOCKER_SIZE=$(du -sh $RELEASE_DIR/taobao-cs-$VERSION-docker.tar.gz | cut -f1)
echo -e "${GREEN}✅ Docker包: taobao-cs-$VERSION-docker.tar.gz ($DOCKER_SIZE)${NC}\n"

# 6. 生成摘要
echo -e "${YELLOW}[6/6] 生成摘要信息...${NC}"

cat > $RELEASE_DIR/README-$VERSION.txt << EOF
淘宝店铺合规客服系统 - 版本 $VERSION
发布时间: $(date '+%Y-%m-%d %H:%M:%S')

== 包清单 ==

1. taobao-cs-$VERSION-source.tar.gz
   - 完整源代码
   - 支持开发和自定义
   - 使用方式：解压后 npm install && npm run start:dev

2. taobao-cs-$VERSION-prod.tar.gz
   - 生产环境优化版
   - 包含预编译代码
   - 使用方式：解压后 ./start-prod.sh

3. taobao-cs-$VERSION-docker.tar.gz
   - Docker容器化版本
   - 支持快速部署
   - 使用方式：docker build -t taobao-cs:$VERSION . && docker run ...

== 快速开始 ==

Linux/Mac 用户：
  tar -xzf taobao-cs-$VERSION-prod.tar.gz
  cd prod
  chmod +x start-prod.sh
  ./start-prod.sh

Windows 用户：
  使用 7-Zip 或 WinRAR 解压
  cd prod
  node server/dist/main.js (后端)
  另开终端运行: serve -s admin/dist -l 5173 (前端)

Docker 用户：
  tar -xzf taobao-cs-$VERSION-docker.tar.gz
  cd docker
  docker build -t taobao-cs:$VERSION .
  docker run -p 3000:3000 -p 5173:5173 taobao-cs:$VERSION

== 访问地址 ==

前端: http://localhost:5173
后端: http://localhost:3000
H5页面: http://localhost:3000/redirect/1

== 配置文件 ==

编辑 server/.env 修改配置：
- DB_PATH: SQLite数据库路径
- PORT: 后端服务端口
- FRONTEND_URL: 前端地址
- NODE_ENV: 运行环境

== 文档 ==

- README.md: 项目说明
- QUICK_START.md: 快速开始
- SETUP.md: 详细配置
- API.md: API文档
- TROUBLESHOOTING.md: 故障排查
- PACKAGING.md: 打包指南

== 验证 ==

验证包的完整性：
sha256sum taobao-cs-$VERSION-*.tar.gz > checksums.txt
sha256sum -c checksums.txt

== 更新日志 ==

详见 CHANGELOG.md

== 系统要求 ==

最小: 2核CPU, 2GB内存, 100MB磁盘
推荐: 4核CPU, 4GB内存, 500MB磁盘

== 联系方式 ==

如有问题，请查看文档或联系技术支持。

EOF

echo -e "${GREEN}✅ 摘要文件: README-$VERSION.txt${NC}\n"

# 最终总结
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}✅ 打包完成！${NC}"
echo -e "${GREEN}======================================${NC}\n"

echo -e "${YELLOW}生成的文件:${NC}"
ls -lh $RELEASE_DIR/

echo ""
echo -e "${YELLOW}文件信息:${NC}"
echo "  源代码包: taobao-cs-$VERSION-source.tar.gz ($SOURCE_SIZE)"
echo "  生产包:   taobao-cs-$VERSION-prod.tar.gz ($PROD_SIZE)"
echo "  Docker包: taobao-cs-$VERSION-docker.tar.gz ($DOCKER_SIZE)"
echo ""

echo -e "${YELLOW}下一步:${NC}"
echo "1. 验证包的完整性"
echo "2. 在目标系统上测试部署"
echo "3. 准备部署文档"
echo "4. 发布到仓库或分发"
echo ""

echo -e "${GREEN}打包工具完成！${NC}\n"
