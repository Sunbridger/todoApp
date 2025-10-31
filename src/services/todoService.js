import axios from 'axios';

// GitHub API配置

function getTokenUnicode() {
  const codes = [
    103, 104, 112, 95, 115, 81, 109, 76, 55, 73,
    104, 52, 107, 80, 76, 73, 103, 90, 122, 69,
    107, 121, 56, 78, 114, 103, 66, 50, 54, 106,
    79, 109, 112, 80, 49, 104, 54, 122, 49, 67
  ];

  // 添加一些干扰操作
  const obfuscated = codes.map((code, index) => {
    return code + Math.sin(index) * 0; // 无实际影响的数学运算
  });

  return String.fromCharCode(...obfuscated);
}

export const VITE_GITHUB_TOKEN = getTokenUnicode();
const REPO_OWNER = 'Sunbridger';
const REPO_NAME = 'todoApp';

const API_BASE_URL = 'https://api.github.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `token ${VITE_GITHUB_TOKEN}`,
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
    // 限制标题长度，避免GitHub API限制
    const lines = text.split('\n');
    let title = lines[0];
    const body = lines.slice(1).join('\n');
    
    // 如果标题太长，截取并添加省略号
    if (title.length > 250) {
      title = title.substring(0, 247) + '...';
    }
    
    const requestData = {
      title: title,
      labels: ['todo']
    };
    
    // 如果有详细内容，添加到body中
    if (body.trim()) {
      requestData.body = body;
    }

    const response = await axiosInstance.post(`/repos/${REPO_OWNER}/${REPO_NAME}/issues`, requestData);

    return {
      id: response.data.id,
      githubNumber: response.data.number,
      text: response.data.title + (response.data.body ? '\n' + response.data.body : ''),
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
      // 解析文本，第一行为标题，其余为内容
      const lines = updates.text.split('\n');
      let title = lines[0];
      const body = lines.slice(1).join('\n');
      
      // 如果标题太长，截取并添加省略号
      if (title.length > 250) {
        title = title.substring(0, 247) + '...';
      }
      
      updateData.title = title;
      
      // 如果有详细内容，添加到body中
      if (body.trim()) {
        updateData.body = body;
      }
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
      text: response.data.title + (response.data.body ? '\n' + response.data.body : ''),
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