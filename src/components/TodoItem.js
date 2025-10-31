import React, { useState } from 'react';
import { Checkbox, Button, Typography, Input, message } from 'antd';
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

  // 解析todo文本，第一行为标题，其余为内容
  const parseTodoText = (text) => {
    const lines = text.split('\n');
    const title = lines[0] || '';
    const content = lines.slice(1).join('\n') || '';
    return { title, content };
  };

  const { title, content } = parseTodoText(todo.text);

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
      // 将标题和描述组合成一个文本
      const fullText = editDescription 
        ? `${editTitle}\n${editDescription}`
        : editTitle;
      
      onUpdate(todo.id, { text: fullText });
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
        padding: '16px 0',
      }}
    >
      <Checkbox
        checked={todo.completed}
        onChange={handleToggleComplete}
        style={{
          marginRight: 16,
          marginTop: 6,
          transform: 'scale(1.3)',
        }}
      />
      {editing ? (
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="任务标题"
            style={{
              borderRadius: 6,
              fontSize: 18,
              fontWeight: 500,
              padding: '8px 12px',
            }}
            size="large"
          />
          <div>
            <div style={{ 
              fontSize: 14, 
              color: '#595959', 
              marginBottom: 8,
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
                borderRadius: 6
              }}
              placeholder="添加任务的详细描述..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancelEdit}
              size="large"
              style={{ 
                borderRadius: 6,
                fontWeight: 500,
                padding: '0 24px'
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
                padding: '0 24px'
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
              marginBottom: 12,
            }}
          >
            <Text
              delete={todo.completed}
              style={{
                flex: 1,
                fontSize: 18,
                fontWeight: 500,
                textDecorationColor: todo.completed ? '#ff6b6b' : 'transparent',
                lineHeight: '1.4',
                color: todo.completed ? '#8c8c8c' : '#262626',
                wordBreak: 'break-word',
                maxWidth: 'calc(100% - 200px)'
              }}
            >
              {title}
            </Text>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                icon={<EditOutlined />}
                onClick={handleStartEdit}
                size="middle"
                style={{
                  borderColor: '#d9d9d9',
                  color: '#595959',
                  borderRadius: 6,
                }}
              >
                编辑
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => onDelete(todo.id)}
                size="middle"
                danger
                style={{ 
                  borderRadius: 6,
                }}
              >
                删除
              </Button>
            </div>
          </div>
          {content && (
            <div
              style={{
                marginTop: 8,
                padding: '12px 16px',
                backgroundColor: '#fafafa',
                borderRadius: 6,
                border: '1px solid #f0f0f0'
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: content }} 
                style={{ 
                  color: todo.completed ? '#8c8c8c' : '#595959',
                  fontSize: 14,
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