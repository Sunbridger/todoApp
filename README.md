# Todo App

一个基于 React、Ant Design 和 GitHub API 的简单待办事项应用。

## 功能特性

- 添加、编辑、删除待办事项
- 标记待办事项为已完成
- 响应式设计，支持移动端
- 数据存储在 GitHub Issues 中
- 数据分析功能，可按时间范围查看任务统计

## 技术栈

- 前端：React、Ant Design、Vite
- 数据存储：GitHub Issues API

## 项目结构

```
.
├── src/               # 源代码
│   ├── components/    # React 组件
│   └── services/      # API 服务
├── public/            # 静态资源
└── index.html         # 入口HTML文件
```

## 安装和运行

1. 克隆项目：
   ```
   git clone <repository-url>
   ```

2. 安装依赖：
   ```
   cd todo-app
   npm install
   ```

3. 配置环境变量：
   ```
   # 复制前端环境变量文件并填写相应信息
   cp .env.example .env
   ```

4. 启动开发服务器：
   ```
   npm run dev
   ```

## 构建和部署

1. 构建生产版本：
   ```
   npm run build
   ```

2. 预览构建结果：
   ```
   npm run serve
   ```

## 环境变量配置

在 `.env` 文件中配置以下变量：

- `VITE_GITHUB_TOKEN`: GitHub个人访问令牌
- `VITE_REPO_OWNER`: GitHub仓库所有者（用户名或组织名）
- `VITE_REPO_NAME`: GitHub仓库名称

## 设计原则

1. 组件化：React组件可复用、可维护
2. 可迭代性：代码结构清晰，易于添加新功能
3. 文件大小控制：每个文件不超过200行
