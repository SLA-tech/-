#!/bin/bash

# 淘宝店铺合规客服系统 - 本地启动脚本（Linux/Mac）

echo ""
echo "===================================================="
echo "淘宝店铺合规客服系统 - 本地启动"
echo "===================================================="
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js 20+"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本:"
node --version
echo ""

# 检查是否在正确的目录
if [ ! -f "server/package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 启动后端服务
echo "📦 启动后端服务..."
cd server

if [ ! -d "node_modules" ]; then
    echo "📥 安装后端依赖..."
    npm install
fi

echo ""
echo "⏳ 初始化数据库..."
npm run init:db

echo ""
echo "🚀 启动后端服务 (http://localhost:3000)..."

# 在后台启动后端
npm run start:dev &
BACKEND_PID=$!

cd ..

# 等待一下后端启动
sleep 5

# 启动前端服务
echo ""
echo "📦 启动前端服务..."
cd admin

if [ ! -d "node_modules" ]; then
    echo "📥 安装前端依赖..."
    npm install
fi

echo ""
echo "🚀 启动前端服务 (http://localhost:5173)..."

# 在后台启动前端
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "===================================================="
echo "✅ 系统已启动！"
echo "===================================================="
echo ""
echo "📱 前端: http://localhost:5173"
echo "🔌 后端: http://localhost:3000"
echo "📊 API 文档: 查看项目根目录 API.md"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待中断信号
wait $BACKEND_PID $FRONTEND_PID
