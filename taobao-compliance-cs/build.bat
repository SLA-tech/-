@echo off
REM 淘宝店铺合规客服系统 - Windows 自动打包脚本

setlocal enabledelayedexpansion

REM 配置
set VERSION=%1
if "!VERSION!"=="" set VERSION=1.0.0

set BUILD_DIR=build
set RELEASE_DIR=releases
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set TIMESTAMP=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set TIMESTAMP=!TIMESTAMP!_%%a%%b)

echo.
echo ======================================
echo 淘宝合规客服系统 - Windows打包工具
echo 版本: %VERSION%
echo 时间: %TIMESTAMP%
echo ======================================
echo.

REM 检查环境
echo [1/5] 检查环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未安装 Node.js
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i

echo 成功: Node.js %NODE_VER%
echo 成功: npm %NPM_VER%
echo.

REM 创建目录
echo [2/5] 创建目录...
if not exist %BUILD_DIR% mkdir %BUILD_DIR%
if not exist %RELEASE_DIR% mkdir %RELEASE_DIR%
echo 成功: 目录创建完成
echo.

REM 构建后端
echo [3/5] 构建后端服务...
cd server
echo 清理旧构建...
if exist dist rmdir /s /q dist
if exist node_modules rmdir /s /q node_modules
echo 安装依赖...
call npm install >nul 2>&1 || call npm install --legacy-peer-deps >nul 2>&1
echo 编译源代码...
call npm run build >nul 2>&1
echo 安装生产依赖...
call npm install --production >nul 2>&1
cd ..
echo 成功: 后端构建完成
echo.

REM 构建前端
echo [4/5] 构建前端管理后台...
cd admin
echo 清理旧构建...
if exist dist rmdir /s /q dist
if exist node_modules rmdir /s /q node_modules
echo 安装依赖...
call npm install >nul 2>&1
echo 编译源代码...
call npm run build >nul 2>&1
cd ..
echo 成功: 前端构建完成
echo.

REM 打包
echo [5/5] 打包应用...

REM 5.1 创建生产包
echo 生成生产版本...
if not exist "%BUILD_DIR%\prod\server\data" mkdir "%BUILD_DIR%\prod\server\data"
if not exist "%BUILD_DIR%\prod\admin" mkdir "%BUILD_DIR%\prod\admin"

REM 复制后端文件
xcopy /s /i /y "server\dist" "%BUILD_DIR%\prod\server\dist" >nul
xcopy /s /i /y "server\node_modules" "%BUILD_DIR%\prod\server\node_modules" >nul
copy /y "server\package.json" "%BUILD_DIR%\prod\server\" >nul
copy /y "server\env.sample" "%BUILD_DIR%\prod\server\.env" >nul

REM 复制前端文件
xcopy /s /i /y "admin\dist" "%BUILD_DIR%\prod\admin" >nul
copy /y "admin\package.json" "%BUILD_DIR%\prod\" >nul

REM 复制文档
copy /y "README.md" "%BUILD_DIR%\prod\" >nul 2>&1
copy /y "QUICK_START.md" "%BUILD_DIR%\prod\" >nul 2>&1
copy /y "SETUP.md" "%BUILD_DIR%\prod\" >nul 2>&1
copy /y "API.md" "%BUILD_DIR%\prod\" >nul 2>&1
copy /y "MANUAL.md" "%BUILD_DIR%\prod\" >nul 2>&1
copy /y "PACKAGING.md" "%BUILD_DIR%\prod\" >nul 2>&1

REM 创建启动脚本
(
echo @echo off
echo cd server
echo set NODE_ENV=production
echo node dist/main.js
echo pause
) > "%BUILD_DIR%\prod\start-prod.bat"

echo 成功: 生产包打包完成
echo.

echo ======================================
echo 成功: 打包完成！
echo ======================================
echo.

echo 生成的文件:
dir /b %RELEASE_DIR%

echo.
echo 注意:
echo 1. 使用 7-Zip 或 WinRAR 压缩 %BUILD_DIR%\prod 目录为 taobao-cs-%VERSION%-prod.zip
echo 2. 使用 7-Zip 或 WinRAR 压缩整个项目为 taobao-cs-%VERSION%-source.zip
echo 3. 生成的包可用于分发和部署
echo.

echo 下一步:
echo 1. 手动压缩文件到 %RELEASE_DIR%
echo 2. 在目标系统上测试部署
echo 3. 准备部署文档
echo 4. 发布到仓库或分发
echo.

echo 生产包位置: %BUILD_DIR%\prod
echo.

pause
