const express = require('express');
const router = express.Router();
const axios = require('axios');

// 代理 GitHub API 请求
router.get('/api/github/*', async (req, res) => {
  try {
    const targetUrl = 'https://api.github.com/' + req.params[0];
    const response = await axios.get(targetUrl, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`, // 可选：如果需要认证
        'User-Agent': 'MyApp' // GitHub API 建议设置 User-Agent
      },
      params: req.query // 转发查询参数
    });
    res.json(response.data);
  } catch (error) {
    console.error('GitHub API error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch data from GitHub'
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// 获取所有待办事项
router.get('/', todoController.getTodos);

// 创建待办事项
router.post('/', todoController.createTodo);

// 更新待办事项
router.put('/:id', todoController.updateTodo);

// 删除待办事项
router.delete('/:id', todoController.deleteTodo);

module.exports = router;