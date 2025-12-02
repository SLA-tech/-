@echo off
REM 淘宝店铺合规客服系统 - API测试脚本（Windows）

echo.
echo ====================================================
echo 淘宝店铺合规客服系统 - API测试
echo ====================================================
echo.

REM 检查Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 请先安装 Node.js 20+
    pause
    exit /b 1
)

REM 运行测试
node test-api.js

echo.
pause
