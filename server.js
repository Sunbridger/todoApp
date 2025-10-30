require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001; // 更改端口避免冲突

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API路由
app.use('/api/todos', require('./routes/todos'));

// 所有其他路由返回前端应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`GitHub Token: ${process.env.REACT_APP_GITHUB_TOKEN ? 'Loaded' : 'Not found'}`);
  console.log(`Repo Owner: ${process.env.REACT_APP_REPO_OWNER || 'Sunbridger'}`);
  console.log(`Repo Name: ${process.env.REACT_APP_REPO_NAME || 'todoApp'}`);
});