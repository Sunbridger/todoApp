import React, { useState, useEffect } from 'react';
import { List, Typography, message } from 'antd';
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

  const handleAddTodo = async (text) => {
    try {
      const newTodo = await createTodo(text);
      setTodos(prev => [...prev, newTodo]);
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
        fontWeight: 600
      }}>
        {getTitle()}
      </Title>
      <TodoInput onAdd={handleAddTodo} />
      <List
        loading={loading}
        dataSource={filteredTodos}
        renderItem={todo => (
          <List.Item className="todo-item" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            marginBottom: 12,
            borderRadius: 12,
            padding: '16px 24px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <TodoItem
              todo={todo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          </List.Item>
        )}
        style={{ 
          background: 'transparent',
          paddingTop: 10
        }}
      />
    </div>
  );
};

export default TodoList;