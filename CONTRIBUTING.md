# 贡献指南

感谢你对本项目的兴趣！我们欢迎任何形式的贡献。

## 行为准则

本项目采纳开放源代码基金会的 [Contributor Covenant](https://www.contributor-covenant.org/) 行为准则。
所有参与者应遵守以下原则：

- 尊重他人，构建包容性社区
- 接受建设性批评
- 专注于对项目最有利的讨论

## 开始贡献

### 报告 Bug

在提交 Bug 报告前，请先：

1. 检查 [Issues](https://github.com/SLA-tech/-/issues) 确认是否已报告
2. 收集调试信息：
   - 操作系统及版本
   - Node.js 版本 (`node --version`)
   - npm 版本 (`npm --version`)
   - 重现步骤（尽可能详细）
   - 实际结果 vs 预期结果
   - 错误信息或日志

### 提议功能

1. 在 [Issues](https://github.com/SLA-tech/-/issues) 中开启讨论
2. 提供：
   - 功能描述
   - 使用场景
   - 可能的实现方案
   - 对现有功能的影响

### 提交 Pull Request

#### 1. Fork & Clone

```bash
git clone https://github.com/YOUR-USERNAME/-.git
cd -
git remote add upstream https://github.com/SLA-tech/-
```

#### 2. 创建特性分支

```bash
git checkout -b feature/your-feature-name
```

**分支命名约定**：
- `feature/xxx` - 新功能
- `bugfix/xxx` - bug 修复
- `docs/xxx` - 文档更新
- `refactor/xxx` - 代码重构
- `test/xxx` - 测试改进

#### 3. 提交更改

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
git commit -m "type(scope): description

body（可选）

footer（可选）"
```

**类型示例**：
- `feat:` 新功能
- `fix:` bug 修复
- `docs:` 文档改动
- `style:` 格式改动（不影响代码逻辑）
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建过程、依赖管理等

**示例**：

```bash
git commit -m "feat(messages): add sentiment analysis to messages"
git commit -m "fix(auth): prevent duplicate login tokens"
git commit -m "docs: update README with Docker setup"
```

#### 4. 推送到 Fork

```bash
git push origin feature/your-feature-name
```

#### 5. 开启 Pull Request

在 GitHub 上打开 PR，提供：
- 改动的清晰描述
- 关联的 Issue 号（如 `Closes #123`）
- 测试结果
- 截图或视频（如适用）

#### 6. Code Review & Merge

- 等待至少一名维护者审核
- 根据反馈进行修改（继续在同一分支推送）
- 通过所有检查后（CI、Review）合并到 `main`

## 开发环境设置

### 克隆并安装

```bash
git clone https://github.com/SLA-tech/-
cd taobao-compliance-cs
npm install
```

### 后端开发

```bash
cd server
npm install
npm run init:db           # 初始化数据库
npm run start:dev         # 启动开发服务
npm test                  # 运行测试
npm run lint              # 代码检查
```

### 前端开发

```bash
cd ../admin
npm install
npm run dev               # 启动开发服务
npm run build             # 构建
npm run lint              # 代码检查
```

## 代码风格

### TypeScript

- 使用 ESLint 和 Prettier 进行格式化
- 遵循项目的 `tsconfig.json` 配置
- 为公共 API 提供完整类型注解和 JSDoc 注释

```typescript
/**
 * 描述函数功能
 * @param param1 参数说明
 * @returns 返回值说明
 */
export async function processMessage(param1: string): Promise<void> {
  // 实现
}
```

### React / TSX

- 使用函数组件 + Hooks
- 组件使用 PascalCase 命名
- Props 接口使用 `ComponentProps` 后缀

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);
```

## 提交 PR 前的检查清单

- [ ] 代码遵循项目风格指南
- [ ] 添加了必要的测试
- [ ] 所有测试通过 (`npm test`)
- [ ] 代码无 lint 错误 (`npm run lint`)
- [ ] 更新了相关文档
- [ ] 提交信息清晰描述了改动
- [ ] 无多余的打印语句或调试代码
- [ ] 适当添加了中文注释（如需要）

## 审核标准

PR 需满足以下条件才能合并：

1. ✅ 至少一名维护者 Approve
2. ✅ 所有 CI 检查通过（测试、Lint）
3. ✅ 无冲突
4. ✅ 代码质量符合标准
5. ✅ 文档已更新（如需要）

## 发布流程

- 版本号遵循 [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH)
- Release 会标记在 GitHub 上
- 更新日志在 [CHANGELOG.md](./CHANGELOG.md)（如有）

## 获取帮助

- 📧 提交 Issue: [GitHub Issues](https://github.com/SLA-tech/-/issues)
- 💬 讨论: [GitHub Discussions](https://github.com/SLA-tech/-/discussions)
- 📖 查看文档: [README.md](./README.md)

感谢你的贡献！
