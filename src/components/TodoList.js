import React, { useState, useEffect } from 'react';
import { List, Typography, message, Empty, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TodoItem from './TodoItem';
import TodoInput from './TodoInput';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../services/todoService';

const { Title } = Typography;

const TodoList = React.memo(({ filter }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      message.error('获取待办事项失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (data) => {
    try {
      await createTodo({
        title: data.title,
        body: data.description,
        completed: false,
      });

      // 添加延迟以确保GitHub API同步完成
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 重试机制，最多尝试3次获取最新数据
      let retries = 0;
      const maxRetries = 3;
      while (retries < maxRetries) {
        await fetchTodos();
        // 等待一小段时间再检查
        await new Promise((resolve) => setTimeout(resolve, 300));
        retries++;
      }

      message.success('添加成功');
    } catch (error) {
      message.error('添加失败: ' + error.message);
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const updatedTodo = await updateTodo(id, updates);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败: ' + error.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败: ' + error.message);
    }
  };

  // 根据filter参数和搜索词过滤待办事项
  const filteredTodos = todos.filter((todo) => {
    // 先根据状态过滤
    if (filter === 'active') {
      if (todo.completed) return false;
    }
    if (filter === 'completed') {
      if (!todo.completed) return false;
    }
    // 再根据搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      // 添加空值检查，防止 undefined 调用 toLowerCase
      const titleMatch = todo.text && todo.text.toLowerCase().includes(term);
      const bodyMatch = todo.body && todo.body.toLowerCase().includes(term);
      return titleMatch || bodyMatch;
    }

    // 对于'all'或其他情况，显示所有待办事项
    return true;
  });

  const getTitle = () => {
    switch (filter) {
      case 'all':
        return '📋 所有任务';
      case 'active':
        return '🔥 进行中';
      case 'completed':
        return '✅ 已完成';
      default:
        return '📝 任务列表';
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <Title
          level={4}
          style={{
            margin: 0,
            color: '#333',
            fontWeight: 800,
            fontSize: 24,
          }}
        >
          {getTitle()}
        </Title>
        <div style={{ flex: 1, maxWidth: 300, position: 'relative' }}>
          <input
            type="text"
            placeholder="搜索任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '18px',
              border: '1px solid #d9d9d9',
              fontSize: '14px',
              transition: 'all 0.3s',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#40a9ff';
              e.target.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d9d9d9';
              e.target.style.boxShadow = 'none';
            }}
          />
          <SearchOutlined
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#bfbfbf'
            }}
          />
        </div>
      </div>
      <TodoInput onAdd={handleAddTodo} />
      <List
        loading={loading}
        dataSource={filteredTodos}
        locale={{ emptyText: <Empty description="暂无待办事项" /> }}
        renderItem={(todo) => (
          <List.Item className="todo-item">
            <TodoItem
              todo={todo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          </List.Item>
        )}
        style={{
          background: 'transparent',
          paddingTop: 20,
        }}
      />
    </div>
  );
});

export default TodoList;