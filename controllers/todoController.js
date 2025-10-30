const axios = require('axios');

// GitHub API配置
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const REPO_OWNER = process.env.REACT_APP_REPO_OWNER || 'Sunbridger';
const REPO_NAME = process.env.REACT_APP_REPO_NAME || 'todoApp';

const API_BASE_URL = 'https://api.github.com';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
});

// 模拟数据存储（在实际应用中应使用数据库）
let localTodos = [
  {
    id: 1,
    text: '学习React',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    text: '学习Ant Design',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
let nextId = 3;

// 获取所有待办事项
const getTodos = async (req, res) => {
  try {
    // 尝试从GitHub获取issues
    const response = await axiosInstance.get(`/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
      params: {
        state: 'all',
        labels: 'todo'
      }
    });
    
    const todos = response.data
      .map(issue => ({
        id: issue.id,
        text: issue.title,
        completed: issue.state === 'closed',
        createdAt: issue.created_at,
        updatedAt: issue.updated_at
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(todos);
  } catch (error) {
    // 如果GitHub API不可用，使用本地模拟数据
    console.error('GitHub API Error:', error.message);
    res.json(localTodos);
  }
};

// 创建待办事项
const createTodo = async (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid todo text' });
  }
  
  try {
    // 尝试创建GitHub issue
    const response = await axiosInstance.post(`/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
      title: text,
      labels: ['todo']
    });
    
    const newTodo = {
      id: response.data.id,
      text: response.data.title,
      completed: false,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at
    };
    
    res.status(201).json(newTodo);
  } catch (error) {
    // 如果GitHub API不可用，使用本地模拟数据
    console.error('GitHub API Error:', error.message);
    const newTodo = {
      id: nextId++,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localTodos.push(newTodo);
    res.status(201).json(newTodo);
  }
};

// 更新待办事项
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  
  try {
    // 尝试更新GitHub issue
    let updateData = {};
    if (text !== undefined) {
      updateData.title = text;
    }
    
    // 如果要更新完成状态
    if (completed !== undefined) {
      updateData.state = completed ? 'closed' : 'open';
    }
    
    const response = await axiosInstance.patch(
      `/repos/${REPO_OWNER}/${REPO_NAME}/issues/${id}`,
      updateData
    );
    
    const updatedTodo = {
      id: response.data.id,
      text: response.data.title,
      completed: response.data.state === 'closed',
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at
    };
    
    res.json(updatedTodo);
  } catch (error) {
    // 如果GitHub API不可用，使用本地模拟数据
    console.error('GitHub API Error:', error.message);
    const todoIndex = localTodos.findIndex(todo => todo.id == id);
    
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    if (text !== undefined) {
      if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Invalid todo text' });
      }
      localTodos[todoIndex].text = text.trim();
    }
    
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid completed value' });
      }
      localTodos[todoIndex].completed = completed;
    }
    
    localTodos[todoIndex].updatedAt = new Date().toISOString();
    res.json(localTodos[todoIndex]);
  }
};

// 删除待办事项
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  
  try {
    // GitHub Issues不支持直接删除，我们将其关闭并添加删除标签
    await axiosInstance.patch(
      `/repos/${REPO_OWNER}/${REPO_NAME}/issues/${id}`,
      {
        state: 'closed',
        labels: ['todo', 'deleted']
      }
    );
    
    res.status(204).send();
  } catch (error) {
    // 如果GitHub API不可用，使用本地模拟数据
    console.error('GitHub API Error:', error.message);
    const todoIndex = localTodos.findIndex(todo => todo.id == id);
    
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    localTodos.splice(todoIndex, 1);
    res.status(204).send();
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};