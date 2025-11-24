import React, { useState, useEffect } from 'react';
import { List, Typography, Empty, Input, Skeleton, Select, Button, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  SortAscendingOutlined,
  SortDescendingOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import TodoItem from './TodoItem';
import TodoInput from './TodoInput';
import { useTodos } from '../hooks/useTodos';

const { Title } = Typography;
const { Option } = Select;

const TodoList = React.memo(({ filter, onFilterChange }) => {
  const { todos, labels, loading, addTodo, updateTodo, deleteTodo } = useTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' 或 'desc'
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);

  // 防抖处理搜索词
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 根据filter参数和搜索词过滤待办事项
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      const titleMatch = todo.text && todo.text.toLowerCase().includes(term);
      const bodyMatch = todo.body && todo.body.toLowerCase().includes(term);
      return titleMatch || bodyMatch;
    }
    return true;
  });

  // 排序逻辑
  const sortedTodos = React.useMemo(() => {
    let sorted = [...filteredTodos].sort((a, b) => {
      let result = 0;
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          result = (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
          break;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) result = 0;
          else if (!a.dueDate) result = 1;
          else if (!b.dueDate) result = -1;
          else result = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case 'title':
          result = (a.text || '').localeCompare(b.text || '');
          break;
        case 'createdAt':
        default:
          result = (b.id || 0) - (a.id || 0);
      }
      
      // 应用排序顺序
      return sortOrder === 'asc' ? result : -result;
    });
    return sorted;
  }, [filteredTodos, sortBy, sortOrder]);

  // 统计数据
  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length,
  };

  // 快捷键支持
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        const visibleIds = sortedTodos.map(t => t.id);
        setSelectedTodos(visibleIds);
      }
      if (e.key === 'Escape') {
        setSelectedTodos([]);
      }
      if (e.key === '?' && !e.target.matches('input, textarea')) {
        setShowKeyboardHints(!showKeyboardHints);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sortedTodos, showKeyboardHints]);

  const getTitle = () => {
    switch (filter) {
      case 'all': return '所有任务';
      case 'active': return '进行中';
      case 'completed': return '已完成';
      default: return '任务列表';
    }
  };

  const handleAddTodo = async (data) => {
    await addTodo(data);
  };

  const handleToggleSelect = (id) => {
    setSelectedTodos(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    selectedTodos.forEach(id => updateTodo(id, { completed: true }));
    setSelectedTodos([]);
  };

  const handleBulkDelete = () => {
    selectedTodos.forEach(id => deleteTodo(id));
    setSelectedTodos([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* 统计卡片 */}
      {filter === 'all' && (
        <div className="stats-card">
          <div className="stat-item" onClick={() => onFilterChange?.('all')} style={{ cursor: 'pointer' }}>
            <p className="stat-value">{stats.total}</p>
            <p className="stat-label">总任务</p>
          </div>
          <div className="stat-item" onClick={() => onFilterChange?.('active')} style={{ cursor: 'pointer' }}>
            <p className="stat-value" style={{ color: '#f59e0b' }}>{stats.active}</p>
            <p className="stat-label">进行中</p>
          </div>
          <div className="stat-item" onClick={() => onFilterChange?.('completed')} style={{ cursor: 'pointer' }}>
            <p className="stat-value" style={{ color: '#10b981' }}>{stats.completed}</p>
            <p className="stat-label">已完成</p>
          </div>
          <div className="stat-item" onClick={() => {
            onFilterChange?.('all');
            setSortBy('priority');
            setSortOrder('desc');
          }} style={{ cursor: 'pointer' }}>
            <p className="stat-value" style={{ color: '#ef4444' }}>{stats.highPriority}</p>
            <p className="stat-label">高优先级</p>
          </div>
        </div>
      )}

      {/* 工具栏 */}
      <div className="toolbar" style={{ position: 'relative' }}>
        <div className="toolbar-section">
          <Title level={3} style={{ margin: 0 }}>
            {getTitle()}
          </Title>
        </div>
        <div className="toolbar-section" style={{ marginLeft: 'auto', gap: 12, position: 'relative' }}>
          <Input
            placeholder="搜索任务... (Ctrl+K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 240 }}
          />
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 140 }}
          >
            <Option value="createdAt">创建时间</Option>
            <Option value="priority">优先级</Option>
            <Option value="dueDate">截止日期</Option>
            <Option value="title">标题</Option>
          </Select>
          <Tooltip title="切换排序顺序">
            <Button
              icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              type="text"
            />
          </Tooltip>
          <Tooltip title="快捷键帮助">
            <Button
              icon={<QuestionCircleOutlined />}
              onClick={() => setShowKeyboardHints(!showKeyboardHints)}
              type="text"
            />
          </Tooltip>
        </div>
      </div>

      <TodoInput onAdd={handleAddTodo} availableLabels={labels} />

      {/* 可滚动的任务列表容器 */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <List
        loading={false}
        dataSource={loading ? [...Array(5)].map((_, i) => ({ id: i, loading: true })) : sortedTodos}
        locale={{ 
          emptyText: (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <Empty 
                description={
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {searchTerm ? '没有找到匹配的任务' : '暂无待办事项，开始添加吧！'}
                  </span>
                } 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            </div>
          )
        }}
        renderItem={(todo) => (
          <List.Item className="todo-item-wrapper" style={{ padding: 0, border: 'none' }}>
            {todo.loading ? (
              <div className="skeleton-card">
                <Skeleton active avatar paragraph={{ rows: 1 }} />
              </div>
            ) : (
              <TodoItem
                todo={todo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
                isSelected={selectedTodos.includes(todo.id)}
                onSelect={handleToggleSelect}
              />
            )}
          </List.Item>
        )}
        split={false}
        />

        {/* 批量操作栏 */}
        {selectedTodos.length > 0 && (
          <div className="bulk-actions-bar">
            <span className="selected-count">
              已选择 {selectedTodos.length} 项
            </span>
            <Button
              icon={<CheckOutlined />}
              onClick={handleBulkComplete}
              size="small"
            >
              标记完成
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={handleBulkDelete}
              danger
              size="small"
            >
              批量删除
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={() => setSelectedTodos([])}
              size="small"
              type="text"
            />
          </div>
        )}

        {/* 快捷键提示 */}
        {showKeyboardHints && (
          <div className="keyboard-hint">
            <h4>⌨️ 快捷键</h4>
            <div className="keyboard-hint-item">
              <span>快速添加</span>
              <span className="keyboard-hint-key">Ctrl/Cmd + K</span>
            </div>
            <div className="keyboard-hint-item">
              <span>全选</span>
              <span className="keyboard-hint-key">Ctrl/Cmd + A</span>
            </div>
            <div className="keyboard-hint-item">
              <span>取消选择</span>
              <span className="keyboard-hint-key">Esc</span>
            </div>
            <div className="keyboard-hint-item">
              <span>显示/隐藏提示</span>
              <span className="keyboard-hint-key">?</span>
            </div>
            <Button
              size="small"
              type="text"
              onClick={() => setShowKeyboardHints(false)}
              style={{ marginTop: 8, width: '100%' }}
            >
              关闭
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

export default TodoList;
