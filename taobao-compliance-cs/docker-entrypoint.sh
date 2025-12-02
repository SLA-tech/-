#!/bin/sh

# 淘宝店铺合规客服系统 - Docker 启动脚本

set -e

# 环境变量默认值
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}
export DB_PATH=${DB_PATH:-/app/server/data/taobao_cs.db}
export FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}

echo "=========================================="
echo "淘宝店铺合规客服系统"
echo "=========================================="
echo ""
echo "环境信息:"
echo "  Node环境: $NODE_ENV"
echo "  后端端口: $PORT"
echo "  数据库文件: $DB_PATH"
echo "  前端地址: $FRONTEND_URL"
echo ""

# 初始化数据库（如果需要）
if [ ! -f "$DB_PATH" ]; then
    echo "首次运行，初始化数据库..."
    cd /app/server
    node -e "
    const fs = require('fs');
    const path = require('path');
    const dbDir = path.dirname('$DB_PATH');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    console.log('数据库目录已创建');
    "
    echo "✅ 数据库初始化完成"
    echo ""
fi

echo "启动服务..."
echo ""

# 启动后端服务（后台）
echo "🚀 启动后端服务 (PID: $$)..."
cd /app/server
node dist/main.js &
BACKEND_PID=$!
echo "   后端PID: $BACKEND_PID"
echo "   访问地址: http://localhost:$PORT"
echo ""

# 等待后端启动
sleep 3

# 启动前端服务（后台）
echo "🚀 启动前端服务..."
cd /app/admin
serve -s dist -l 5173 &
FRONTEND_PID=$!
echo "   前端PID: $FRONTEND_PID"
echo "   访问地址: http://localhost:5173"
echo ""

echo "=========================================="
echo "✅ 所有服务已启动"
echo "=========================================="
echo ""
echo "📝 说明:"
echo "  前端管理后台: http://localhost:5173"
echo "  后端API: http://localhost:$PORT"
echo "  H5客服页面: http://localhost:$PORT/redirect/1"
echo ""
echo "📋 日志:"
echo "  后端日志: docker logs <container-id>"
echo "  查看实时日志: docker logs -f <container-id>"
echo ""

# 捕获信号用于优雅关闭
trap "echo '收到关闭信号，正在关闭服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit 0" SIGTERM SIGINT

# 等待进程终止
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true

echo "✅ 所有服务已关闭"
exit 0
