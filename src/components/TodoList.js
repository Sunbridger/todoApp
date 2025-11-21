import React, { useState, useEffect } from 'react';
import { List, Typography, Empty, Input, Skeleton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TodoItem from './TodoItem';
import TodoInput from './TodoInput';
import { useTodos } from '../hooks/useTodos';

const { Title } = Typography;

const TodoList = React.memo(({ filter }) => {
  const { todos, loading, addTodo, updateTodo, deleteTodo } = useTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 防抖处理搜索词
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
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
        return '所有任务';
      case 'active':
        return '进行中';
      case 'completed':
        return '已完成';
      default:
        return '任务列表';
    }
  };

  const handleAddTodo = async (data) => {
    await addTodo(data);
  };

  return (
    <div>
      <div className="todo-list-header">
        <Title level={3} style={{ margin: 0 }}>
          {getTitle()}
        </Title>
        <div className="search-input">
          <Input
            placeholder="搜索任务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
            allowClear
          />
        </div>
      </div>

      <TodoInput onAdd={handleAddTodo} />

      <List
        loading={false} // Disable default loading to use custom Skeleton
        dataSource={loading ? [...Array(5)].map((_, i) => ({ id: i, loading: true })) : filteredTodos}
        locale={{ emptyText: <Empty description="暂无待办事项" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        renderItem={(todo) => (
          <List.Item className="todo-item-wrapper" style={{ padding: 0, border: 'none' }}>
             {todo.loading ? (
               <div className="todo-item-card" style={{ padding: '24px' }}>
                 <Skeleton active avatar paragraph={{ rows: 1 }} />
               </div>
             ) : (
               <TodoItem
                 todo={todo}
                 onUpdate={updateTodo}
                 onDelete={deleteTodo}
               />
             )}
          </List.Item>
        )}
        split={false}
      />
    </div>
  );
});

export default TodoList;