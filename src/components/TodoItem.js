import React, { useState, useRef, useEffect } from 'react';
import { Checkbox, Button, Input, message, Popconfirm, Tag } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  UpOutlined,
  CalendarOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import dayjs from 'dayjs';
import 'react-quill/dist/quill.snow.css';

const TodoItem = ({ todo, onUpdate, onDelete, isSelected, onSelect, isDragging }) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Expand/Collapse state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  const contentRef = useRef(null);

  const title = todo?.text || '';
  const content = todo?.body || '';
  
  // 计算截止日期状态
  const getDueDateStatus = () => {
    if (!todo.dueDate) return null;
    const today = dayjs().startOf('day');
    const dueDate = dayjs(todo.dueDate).startOf('day');
    const diff = dueDate.diff(today, 'day');
    
    if (diff < 0) return 'overdue';
    if (diff === 0) return 'today';
    return 'upcoming';
  };
  
  const dueDateStatus = getDueDateStatus();

  useEffect(() => {
    if (contentRef.current) {
      // Check if content height exceeds 60px (approx 3 lines)
      setShowExpandBtn(contentRef.current.scrollHeight > 60);
    }
  }, [content, todo?.id]);

  const handleToggleComplete = (e) => {
    onUpdate(todo.id, { completed: e.target.checked });
  };

  const handleStartEdit = () => {
    setEditing(true);
    setEditTitle(title);
    setEditDescription(content);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        text: editTitle,
        body: editDescription
      });
      setEditing(false);
    } else {
      message.warning('请输入任务标题');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  if (editing) {
    // ... existing editing view ...
    return (
      <div className="todo-item-card editing">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="任务标题"
          className="custom-input"
          style={{ marginBottom: 12, fontSize: '1.1rem', fontWeight: 600 }}
        />
        <div style={{ marginBottom: 16 }}>
          <ReactQuill
            theme="snow"
            value={editDescription}
            onChange={setEditDescription}
            modules={modules}
            style={{ background: 'white', borderRadius: 8 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={handleCancelEdit}>取消</Button>
          <Button type="primary" onClick={handleSaveEdit}>保存</Button>
        </div>
      </div>
    );
  }

  const getPriorityBadge = () => {
    if (!todo.priority) return null;
    const priorityMap = {
      high: { label: '高', className: 'priority-high', icon: '🔴' },
      medium: { label: '中', className: 'priority-medium', icon: '🟡' },
      low: { label: '低', className: 'priority-low', icon: '🟢' }
    };
    const p = priorityMap[todo.priority];
    if (!p) return null;
    return (
      <span className={`priority-badge ${p.className}`}>
        {p.icon} {p.label}
      </span>
    );
  };

  return (
    <div 
      className={`todo-item-card ${todo.completed ? 'completed' : ''} ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={(e) => {
        // 如果按住 Shift 或 Ctrl/Cmd，触发选择
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onSelect?.(todo.id);
        }
      }}
    >
      <div className="todo-header">
        <Checkbox
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="todo-checkbox"
        />
        <div className="todo-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div className={`todo-title ${todo.completed ? 'completed' : ''}`}>
              {title}
            </div>
            {getPriorityBadge()}
          </div>

          {/* 元数据：标签和截止日期 */}
          <div className="todo-metadata">
            {todo.labels && todo.labels.length > 0 && (
              <>
                {todo.labels.map((label, index) => {
                  const labelName = typeof label === 'string' ? label : label.name;
                  const labelColor = typeof label === 'object' && label.color ? `#${label.color}` : undefined;
                  return (
                    <Tag
                      key={label.id || labelName || index}
                      color={labelColor}
                      style={{ marginRight: 0 }}
                    >
                      {labelName}
                    </Tag>
                  );
                })}
              </>
            )}
            
            {todo.dueDate && (
              <span className={`due-date-badge ${dueDateStatus}`}>
                <CalendarOutlined />
                {dayjs(todo.dueDate).format('MM-DD')}
                {dueDateStatus === 'overdue' && ' (逾期)'}
                {dueDateStatus === 'today' && ' (今天)'}
              </span>
            )}
          </div>


          {content && (
            <div className="todo-body-wrapper">
              <div
                ref={contentRef}
                className={`todo-body ${isExpanded ? 'expanded' : 'collapsed'}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
              {showExpandBtn && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="expand-btn"
                  icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                  style={{ padding: '4px 12px', height: 'auto', marginTop: '8px' }}
                >
                  {isExpanded ? '收起' : '展开'}
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="todo-actions">
          <Button
            icon={<EditOutlined />}
            onClick={handleStartEdit}
            size="small"
            type="text"
          />
          <Popconfirm
            title="确认删除"
            onConfirm={() => onDelete(todo.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              type="text"
              danger
            />
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;