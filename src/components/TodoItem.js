import React, { useState } from 'react';
import { Checkbox, Button, Typography, Input } from 'antd';
import { DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggleComplete = (e) => {
    onUpdate(todo.id, { completed: e.target.checked });
  };

  const handleStartEdit = () => {
    setEditing(true);
    setEditText(todo.text);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText });
      setEditing(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '8px 0' }}>
      <Checkbox
        checked={todo.completed}
        onChange={handleToggleComplete}
        style={{ marginRight: 12 }}
      />
      {editing ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Input
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onPressEnter={handleSaveEdit}
            style={{ flex: 1, marginRight: 10, borderRadius: 6 }}
          />
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleSaveEdit}
            size="small"
            style={{ marginRight: 5 }}
          />
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancelEdit}
            size="small"
          />
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Text 
            delete={todo.completed} 
            style={{ 
              flex: 1,
              fontSize: 16,
              textDecorationColor: todo.completed ? '#ff6b6b' : 'transparent'
            }}
          >
            {todo.text}
          </Text>
          <Button
            icon={<EditOutlined />}
            onClick={handleStartEdit}
            size="small"
            style={{ 
              marginRight: 5,
              borderColor: '#1890ff',
              color: '#1890ff'
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => onDelete(todo.id)}
            size="small"
            danger
          />
        </div>
      )}
    </div>
  );
};

export default TodoItem;