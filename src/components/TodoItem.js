import React, { useState } from 'react';
import { Checkbox, Button, Typography, Input, message, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Text, Paragraph } = Typography;

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 标题使用text字段，内容使用body字段
  const title = todo.text || '';
  const content = todo.body || '';

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

  // 修改：不再尝试解析 fullText，直接使用 text 和 body
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

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        padding: '20px 0',
        borderBottom: '1px solid #f0f0f0'
      }}
    >
      <Checkbox
        checked={todo.completed}
        onChange={handleToggleComplete}
        style={{
          marginRight: 20,
          marginTop: 4,
          transform: 'scale(1.4)',
        }}
      />
      {editing ? (
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="任务标题"
            style={{
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 600,
              padding: '12px 16px',
              border: '1px solid #e0e0e0'
            }}
            size="large"
          />
          <div>
            <div style={{
              fontSize: 16,
              color: '#424242',
              marginBottom: 12,
              fontWeight: 500
            }}>
              任务描述
            </div>
            <ReactQuill
              theme="snow"
              value={editDescription}
              onChange={setEditDescription}
              modules={modules}
              formats={formats}
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                border: '1px solid #e0e0e0'
              }}
              placeholder="添加任务的详细描述..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancelEdit}
              size="large"
              style={{
                borderRadius: 6,
                fontWeight: 500,
                padding: '0 28px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSaveEdit}
              size="large"
              style={{
                borderRadius: 6,
                fontWeight: 500,
                padding: '0 28px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              保存
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: 16,
            }}
          >
            <Text
              delete={todo.completed}
              style={{
                flex: 1,
                fontSize: 20,
                fontWeight: 600,
                textDecorationColor: todo.completed ? '#e63946' : 'transparent',
                lineHeight: '1.4',
                color: todo.completed ? '#757575' : '#212121',
                wordBreak: 'break-word',
                maxWidth: 'calc(100% - 220px)'
              }}
            >
              {title}
            </Text>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                icon={<EditOutlined />}
                onClick={handleStartEdit}
                size="middle"
                style={{
                  borderColor: '#e0e0e0',
                  color: '#424242',
                  borderRadius: 6,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
              >
                编辑
              </Button>
              <Popconfirm
                title="确认删除"
                description="确定要删除这个任务吗？"
                onConfirm={() => onDelete(todo.id)}
                okText="确定"
                cancelText="取消"
                placement="topRight"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="middle"
                  danger
                  style={{
                    borderRadius: 6,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  删除
                </Button>
              </Popconfirm>
            </div>
          </div>
          {content && (
            <div
              style={{
                marginTop: 12,
                padding: '16px 20px',
                backgroundColor: '#f8f9fa',
                borderRadius: 8,
                border: '1px solid #e9ecef'
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  color: todo.completed ? '#757575' : '#424242',
                  fontSize: 15,
                  lineHeight: 1.6
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoItem;