import React, { useState, useRef, useEffect } from 'react';
import { Checkbox, Button, Input, message, Popconfirm } from 'antd';
  // ... existing imports
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// ...

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Expand/Collapse state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  const contentRef = useRef(null);

  const title = todo?.text || '';
  const content = todo?.body || '';

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

  return (
    <div className={`todo-item-card ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-header">
        <Checkbox
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="todo-checkbox"
        />
        <div className="todo-content">
          <div className={`todo-title ${todo.completed ? 'completed' : ''}`}>
            {title}
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
                  style={{ padding: '4px 0', height: 'auto' }}
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