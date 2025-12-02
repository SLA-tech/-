@echo off
REM Windows 环境诊断脚本
REM 检查系统配置并自动诊断问题

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║  淘宝合规客服系统 - Windows 环境诊断      ║
echo ╚════════════════════════════════════════════╝
echo.

set PASS=✅
set FAIL=❌
set INFO=ℹ️ 

REM 初始化计数器
set /a PASS_COUNT=0
set /a WARN_COUNT=0
set /a ERROR_COUNT=0

echo [1] 检查 Node.js 环境
echo ────────────────────────────────────────────
node --version > nul 2>&1
if errorlevel 1 (
    echo %FAIL% Node.js 未安装
    echo 请从 https://nodejs.org/ 下载安装
    set /a ERROR_COUNT=!ERROR_COUNT!+1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo %PASS% Node.js 已安装: !NODE_VERSION!
    set /a PASS_COUNT=!PASS_COUNT!+1
)
echo.

echo [2] 检查 npm 配置
echo ────────────────────────────────────────────
npm --version > nul 2>&1
if errorlevel 1 (
    echo %FAIL% npm 未找到
    set /a ERROR_COUNT=!ERROR_COUNT!+1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo %PASS% npm 已安装: !NPM_VERSION!
    set /a PASS_COUNT=!PASS_COUNT!+1
)

REM 检查 Python（可选）
python --version > nul 2>&1
if errorlevel 1 (
    echo %INFO% Python 未安装（可选，某些编译可能需要）
    set /a WARN_COUNT=!WARN_COUNT!+1
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo %PASS% Python 已安装: !PYTHON_VERSION!
    set /a PASS_COUNT=!PASS_COUNT!+1
)
echo.

echo [3] 检查项目目录
echo ────────────────────────────────────────────
if not exist server\ (
    echo %FAIL% server 目录不存在
    set /a ERROR_COUNT=!ERROR_COUNT!+1
) else (
    echo %PASS% server 目录存在
    set /a PASS_COUNT=!PASS_COUNT!+1
)

if not exist admin\ (
    echo %FAIL% admin 目录不存在
    set /a ERROR_COUNT=!ERROR_COUNT!+1
) else (
    echo %PASS% admin 目录存在
    set /a PASS_COUNT=!PASS_COUNT!+1
)

if not exist package.json (
    echo %FAIL% package.json 不存在
    set /a ERROR_COUNT=!ERROR_COUNT!+1
) else (
    echo %PASS% package.json 存在
    set /a PASS_COUNT=!PASS_COUNT!+1
)
echo.

echo [4] 检查依赖安装
echo ────────────────────────────────────────────
if exist server\node_modules\ (
    echo %PASS% 后端依赖已安装
    set /a PASS_COUNT=!PASS_COUNT!+1
) else (
    echo %FAIL% 后端依赖未安装
    echo 请运行: cd server && npm install
    set /a ERROR_COUNT=!ERROR_COUNT!+1
)

if exist admin\node_modules\ (
    echo %PASS% 前端依赖已安装
    set /a PASS_COUNT=!PASS_COUNT!+1
) else (
    echo %FAIL% 前端依赖未安装
    echo 请运行: cd admin && npm install
    set /a ERROR_COUNT=!ERROR_COUNT!+1
)
echo.

echo [5] 检查端口可用性
echo ────────────────────────────────────────────
netstat -an 2>nul | findstr ":3000 " > nul
if errorlevel 1 (
    echo %PASS% 端口 3000 可用
    set /a PASS_COUNT=!PASS_COUNT!+1
) else (
    echo %FAIL% 端口 3000 被占用（后端）
    echo 请关闭占用此端口的程序或修改 server/.env
    set /a WARN_COUNT=!WARN_COUNT!+1
)

netstat -an 2>nul | findstr ":5173 " > nul
if errorlevel 1 (
    echo %PASS% 端口 5173 可用
    set /a PASS_COUNT=!PASS_COUNT!+1
) else (
    echo %FAIL% 端口 5173 被占用（前端）
    echo 请关闭占用此端口的程序或修改 admin/vite.config.ts
    set /a WARN_COUNT=!WARN_COUNT!+1
)
echo.

echo [6] 检查数据库
echo ────────────────────────────────────────────
if exist server\data\taobao_cs.db (
    echo %PASS% 数据库已初始化
    set /a PASS_COUNT=!PASS_COUNT!+1
) else (
    echo %INFO% 数据库未初始化（首次运行时会自动创建）
    echo 如需手动初始化: cd server && npm run init:db
    set /a WARN_COUNT=!WARN_COUNT!+1
)
echo.

echo [7] 检查启动脚本
echo ────────────────────────────────────────────
if exist start.bat (
    echo %PASS% start.bat 存在（可用于一键启动）
    set /a PASS_COUNT=!PASS_COUNT!+1
) else (
    echo %FAIL% start.bat 不存在
    set /a ERROR_COUNT=!ERROR_COUNT!+1
)

if exist setup-windows.bat (
    echo %PASS% setup-windows.bat 存在（可用于配置）
    set /a PASS_COUNT=!PASS_COUNT!+1
) else (
    echo %INFO% setup-windows.bat 不存在
)
echo.

echo ╔════════════════════════════════════════════╗
echo ║            诊断结果总结                    ║
echo ╚════════════════════════════════════════════╝
echo.
echo   ✅ 通过检查: %PASS_COUNT% 项
echo   ⚠️  警告信息: %WARN_COUNT% 项
echo   ❌ 失败检查: %ERROR_COUNT% 项
echo.

if %ERROR_COUNT% equ 0 (
    echo 🎉 环境配置良好，可以启动系统！
    echo.
    echo 推荐启动方式:
    echo   双击 start.bat
    echo.
) else (
    echo ⚠️  存在配置问题，请查看上方错误信息
    echo.
    echo 建议操作:
    echo   1. 运行 setup-windows.bat 进行自动配置
    echo   2. 阅读 WINDOWS_SETUP.md 获取详细帮助
    echo   3. 查看 TROUBLESHOOTING.md 故障排查
    echo.
)

if %WARN_COUNT% gtr 0 (
    echo ℹ️  有 %WARN_COUNT% 项警告，可能需要注意
    echo.
)

echo ════════════════════════════════════════════
echo 诊断完成！
echo.

pause
