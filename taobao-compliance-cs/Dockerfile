# 淘宝店铺合规客服系统 - 多阶段构建 Dockerfile

# ===== 构建阶段 =====
FROM node:20-alpine AS builder

LABEL maintainer="taobao-cs-team"
LABEL description="淘宝店铺合规客服系统 - 构建阶段"

WORKDIR /app

# 复制源代码文件
COPY server/package*.json server/
COPY admin/package*.json admin/

# 安装后端依赖
RUN cd server && npm install --legacy-peer-deps || npm install

# 构建后端
RUN cd server && npm run build

# 安装前端依赖
RUN cd admin && npm install

# 构建前端
RUN cd admin && npm run build

# ===== 运行时阶段 =====
FROM node:20-alpine

LABEL maintainer="taobao-cs-team"
LABEL version="1.0.0"
LABEL description="淘宝店铺合规客服系统 - 生产环境"

# 安装所需工具
RUN apk add --no-cache \
    bash \
    curl \
    dumb-init \
    && npm install -g serve

# 创建应用用户（安全性考虑）
RUN addgroup -S appuser && adduser -S appuser -G appuser

WORKDIR /app

# 复制构建产物（来自builder阶段）
COPY --from=builder --chown=appuser:appuser /app/server/dist ./server/dist
COPY --from=builder --chown=appuser:appuser /app/server/node_modules ./server/node_modules
COPY --from=builder --chown=appuser:appuser /app/admin/dist ./admin/dist

# 复制配置文件
COPY --chown=appuser:appuser server/package.json ./server/package.json
COPY --chown=appuser:appuser admin/package.json ./admin/package.json

# 创建数据目录
RUN mkdir -p /app/server/data && chown -R appuser:appuser /app

# 复制启动脚本
COPY --chown=appuser:appuser docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 设置用户
USER appuser

# 暴露端口
EXPOSE 3000 5173

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# 使用 dumb-init 作为 PID 1 进程（更好的信号处理）
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# 启动脚本
CMD ["/entrypoint.sh"]
