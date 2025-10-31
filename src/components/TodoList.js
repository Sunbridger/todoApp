import React, { useState, useEffect } from 'react';
import { List, Typography, message, Empty } from 'antd';
import TodoItem from './TodoItem';
import TodoInput from './TodoInput';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';

const { Title } = Typography;

const TodoList = ({ filter }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 重试机制，最多尝试3次获取最新数据
      let retries = 0;
      const maxRetries = 3;
      while (retries < maxRetries) {
        await fetchTodos();
        // 等待一小段时间再检查
        await new Promise(resolve => setTimeout(resolve, 300));
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
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败: ' + error.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败: ' + error.message);
    }
  };

  // 根据filter参数过滤待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    // 对于'all'或其他情况，显示所有待办事项
    return true;
  });

  const getTitle = () => {
    switch (filter) {
      case 'all': return '📋 所有任务';
      case 'active': return '🔥 进行中';
      case 'completed': return '✅ 已完成';
      default: return '📝 任务列表';
    }
  };

  return (
    <div>
      <Title level={4} style={{
        textAlign: 'center',
        marginBottom: 28,
        color: '#333',
        fontWeight: 800,
        fontSize: 28
      }}>
        {getTitle()}
      </Title>
      <TodoInput onAdd={handleAddTodo} />
      <List
        loading={loading}
        dataSource={filteredTodos}
        locale={{ emptyText: <Empty description="暂无待办事项" /> }}
        renderItem={todo => (
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
          paddingTop: 20
        }}
      />
    </div>
  );
};

export default TodoList;