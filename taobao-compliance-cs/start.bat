@echo off
REM 淘宝店铺合规客服系统 - 本地启动脚本（Windows）

echo.
echo ====================================================
echo 淘宝店铺合规客服系统 - 本地启动
echo ====================================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 请先安装 Node.js 20+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version
echo.

REM 检查是否在正确的目录
if not exist "server\package.json" (
    echo ❌ 错误：请在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 启动后端服务
echo 📦 启动后端服务...
cd server
if not exist "node_modules" (
    echo 📥 安装后端依赖...
    call npm install
)
echo.
echo ⏳ 初始化数据库...
call npm run init:db
echo.
echo 🚀 启动后端服务 (http://localhost:3000)...
start "淘宝客服系统-后端" cmd /k npm run start:dev

cd ..

REM 启动前端服务
echo.
echo 📦 启动前端服务...
cd admin
if not exist "node_modules" (
    echo 📥 安装前端依赖...
    call npm install
)
echo.
echo 🚀 启动前端服务 (http://localhost:5173)...
start "淘宝客服系统-前端" cmd /k npm run dev

echo.
echo ====================================================
echo ✅ 系统已启动！
echo ====================================================
echo.
echo 📱 前端: http://localhost:5173
echo 🔌 后端: http://localhost:3000
echo 📊 API 文档: 查看项目根目录 API.md
echo.
echo 按任意键继续...
REM pause
