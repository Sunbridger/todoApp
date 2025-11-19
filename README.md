# 现代化待办清单应用

一个基于 React、Ant Design 和 GitHub API 构建的现代化待办事项管理应用。该应用利用 GitHub Issues 作为数据存储后端，提供了完整的任务管理功能和数据分析能力。

## 功能特性

- ✅ **任务管理**：添加、编辑、删除待办事项
- ✅ **状态跟踪**：标记待办事项为已完成/进行中
- ✅ **任务筛选**：按状态筛选任务（所有、进行中、已完成）
- ✅ **任务搜索**：快速搜索任务标题和内容
- ✅ **富文本编辑**：支持富文本格式的任务描述
- ✅ **响应式设计**：完美适配桌面端和移动端
- ✅ **数据持久化**：使用 GitHub Issues 作为数据存储
- ✅ **数据分析**：可视化展示任务统计数据
- ✅ **访客统计**：实时监控应用使用情况

## 技术栈

- **前端框架**：React 18
- **UI 组件库**：Ant Design
- **构建工具**：Vite
- **富文本编辑器**：React Quill
- **HTTP 客户端**：Axios
- **数据存储**：GitHub Issues API
- **路由管理**：React Router（隐式）

## 项目结构

```
.
├── src/                    # 源代码目录
│   ├── components/        # React 组件
│   │   ├── Analytics.js   # 数据分析组件
│   │   ├── TodoInput.js   # 任务输入组件
│   │   ├── TodoItem.js    # 任务项组件
│   │   └── TodoList.js    # 任务列表组件
│   ├── services/          # API 服务
│   │   └── todoService.js # GitHub API 交互服务
│   ├── App.css            # 主应用样式
│   ├── App.js             # 主应用组件
│   ├── index.css          # 全局样式
│   └── index.js           # 应用入口文件
├── public/                # 静态资源目录
│   └── index.html         # HTML 模板
├── index.html             # Vite 入口文件
├── package.json           # 项目依赖和脚本
└── vite.config.js         # Vite 配置文件
```

## 核心组件

### App 组件
主应用组件，包含整体布局和导航菜单。

### TodoList 组件
任务列表组件，负责展示和过滤任务项。

### TodoItem 组件
单个任务项组件，支持编辑、删除和状态切换。

### TodoInput 组件
任务输入组件，支持添加新任务和富文本描述。

### Analytics 组件
数据分析组件，提供任务统计和访客分析功能。

### TodoService 服务
与 GitHub Issues API 交互的服务层。

## 安装和运行

1. 克隆项目：
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量：
   ```bash
   # 复制环境变量文件并填写相应信息
   cp .env.example .env
   ```

   在 `.env` 文件中配置以下变量：
   - `VITE_GITHUB_TOKEN`: GitHub 个人访问令牌
   - `VITE_REPO_OWNER`: GitHub 仓库所有者（用户名或组织名）
   - `VITE_REPO_NAME`: GitHub 仓库名称

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 构建和部署

1. 构建生产版本：
   ```bash
   npm run build
   ```

2. 预览构建结果：
   ```bash
   npm run serve
   ```

## GitHub API 集成

本应用使用 GitHub Issues 作为数据存储后端，通过以下方式与 GitHub API 交互：

- **认证**：使用 GitHub Personal Access Token 进行认证
- **数据模型**：每个待办事项对应一个 GitHub Issue
- **标签系统**：使用 `todo` 标签标识待办事项
- **状态管理**：通过 Issue 的 `open/closed` 状态表示任务的进行中/已完成

## 设计原则

1. **组件化设计**：React 组件可复用、可维护，遵循单一职责原则
2. **可迭代性**：代码结构清晰，易于添加新功能
3. **文件大小控制**：每个文件控制在合理行数范围内
4. **用户体验**：提供流畅的交互体验和友好的界面设计
5. **响应式布局**：适配不同屏幕尺寸的设备
6. **数据安全**：敏感信息通过环境变量管理

## 数据流说明

1. 应用启动时从 GitHub Issues 获取所有标记为 `todo` 的任务
2. 用户操作（添加、编辑、删除、状态切换）通过 GitHub API 实时同步
3. 数据分析组件实时计算并展示任务统计数据
4. 访客统计数据为模拟数据，用于展示分析界面

## 注意事项

- 需要有效的 GitHub Personal Access Token 才能正常使用应用
- 应用的性能受 GitHub API 速率限制影响
- 所有数据存储在指定的 GitHub 仓库中
