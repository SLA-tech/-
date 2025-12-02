@echo off
REM Windows npm 一键配置脚本
REM 此脚本解决常见的 Windows 环境问题

setlocal enabledelayedexpansion

echo ========================================
echo  淘宝合规客服系统 - Windows npm 配置
echo ========================================
echo.

REM 1. 检查 npm 是否安装
echo [1/5] 检查 npm 安装...
npm --version > nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 npm。请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ npm 已安装: %npm_version%

REM 2. 更新 npm 配置
echo.
echo [2/5] 配置 npm...

REM 设置为使用新的依赖管理标志
npm config set legacy-peer-deps true
echo ✅ 已启用 legacy-peer-deps

REM 3. 清理缓存
echo.
echo [3/5] 清理 npm 缓存...
npm cache clean --force > nul 2>&1
echo ✅ 缓存已清理

REM 4. 安装项目依赖
echo.
echo [4/5] 安装项目依赖...
echo.

if exist server\node_modules (
    echo 后端依赖已存在，跳过安装
) else (
    echo 安装后端依赖...
    cd server
    call npm install --ignore-scripts
    cd ..
    echo ✅ 后端依赖已安装
)

if exist admin\node_modules (
    echo 前端依赖已存在，跳过安装
) else (
    echo 安装前端依赖...
    cd admin
    call npm install --ignore-scripts
    cd ..
    echo ✅ 前端依赖已安装
)

REM 5. 初始化数据库
echo.
echo [5/5] 初始化数据库...
if not exist server\data (
    mkdir server\data
)
if not exist server\data\taobao_cs.db (
    cd server
    call npm run init:db
    cd ..
    echo ✅ 数据库已初始化
) else (
    echo 数据库已存在，跳过初始化
)

echo.
echo ========================================
echo  ✅ 配置完成！
echo ========================================
echo.
echo 现在您可以运行:
echo   双击 start.bat  (推荐)
echo 或者:
echo   cd server && npm start
echo   (在另一个窗口) cd admin && npm run dev
echo.
pause
