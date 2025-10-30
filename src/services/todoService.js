import axios from 'axios';

// GitHub API配置
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPO_OWNER = 'Sunbridger';
const REPO_NAME = 'todoApp';

const API_BASE_URL = 'https://api.github.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
});

// 获取所有待办事项
export const getTodos = async () => {
  try {
    const response = await axiosInstance.get(`/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
      params: {
        state: 'all',
        labels: 'todo'
      }
    });

    return response.data
      .map(issue => ({
        id: issue.id,
        githubNumber: issue.number,
        text: issue.title,
        completed: issue.state === 'closed',
        createdAt: issue.created_at,
        updatedAt: issue.updated_at
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    // eslint-disable-next-line no-throw-before-return
    throw new Error(error.response?.data?.message || '获取待办事项失败');
  }
};

// 创建待办事项
export const createTodo = async (text) => {
  try {
    const response = await axiosInstance.post(`/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
      title: text,
      labels: ['todo']
    });

    return {
      id: response.data.id,
      githubNumber: response.data.number,
      text: response.data.title,
      completed: false,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at
    };
  } catch (error) {
    // eslint-disable-next-line no-throw-before-return
    throw new Error(error.response?.data?.message || '创建待办事项失败');
  }
};

// 更新待办事项
export const updateTodo = async (id, updates) => {
  try {
    // 首先需要获取issue number
    const todos = await getTodos();
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      throw new Error('待办事项不存在');
    }

    let updateData = {};
    if (updates.text !== undefined) {
      updateData.title = updates.text;
    }

    // 如果要更新完成状态
    if (updates.completed !== undefined) {
      updateData.state = updates.completed ? 'closed' : 'open';
    }

    const response = await axiosInstance.patch(
      `/repos/${REPO_OWNER}/${REPO_NAME}/issues/${todo.githubNumber}`,
      updateData
    );

    return {
      id: response.data.id,
      githubNumber: response.data.number,
      text: response.data.title,
      completed: response.data.state === 'closed',
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at
    };
  } catch (error) {
    // eslint-disable-next-line no-throw-before-return
    throw new Error(error.response?.data?.message || '更新待办事项失败');
  }
};

// 删除待办事项
export const deleteTodo = async (id) => {
  try {
    const todos = await getTodos();
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      throw new Error('待办事项不存在');
    }

    // GitHub Issues不支持直接删除，我们将其关闭并添加删除标签
    await axiosInstance.patch(
      `/repos/${REPO_OWNER}/${REPO_NAME}/issues/${todo.githubNumber}`,
      {
        state: 'closed',
        labels: ['todo', 'deleted']
      }
    );

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-throw-before-return
    throw new Error(error.response?.data?.message || '删除待办事项失败');
  }
};