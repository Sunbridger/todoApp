import React, { useState } from 'react';
import { Input, Button, Card, message, Select, Tag } from 'antd';
import { PlusOutlined, TagOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

const TodoInput = ({ onAdd, availableLabels = [] }) => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) {
      message.warning('请输入任务内容');
      return;
    }
    onAdd({
      text: text,
      body: description,
      labels: selectedLabels
    });
    setText('');
    setDescription('');
    setSelectedLabels([]);
    setIsExpanded(false);
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

  return (
    <div className="todo-input-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          size="large"
          placeholder="准备做点什么？"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onPressEnter={handleSubmit}
          className="custom-input"
          prefix={<PlusOutlined style={{ color: '#bfbfbf' }} />}
        />

        {isExpanded && (
          <div className="input-expansion" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: 16 }}>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="添加详细描述..."
                modules={modules}
                className="task-description-editor"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, marginRight: 16 }}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder={
                    <span>
                      <TagOutlined /> 选择标签
                    </span>
                  }
                  value={selectedLabels}
                  onChange={setSelectedLabels}
                  tagRender={(props) => {
                    const { label, closable, onClose, value } = props;
                    // Find the label object to get its color
                    const labelObj = availableLabels.find(l => l.name === value);
                    const color = labelObj ? `#${labelObj.color}` : undefined;
                    return (
                      <Tag
                        closable={closable}
                        onClose={onClose}
                        color={color}
                        style={{
                          marginRight: 3,
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        {label}
                      </Tag>
                    );
                  }}
                >
                  {availableLabels.map(label => (
                    <Option key={label.id} value={label.name}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: `#${label.color}`
                        }} />
                        {label.name}
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button onClick={() => setIsExpanded(false)}>取消</Button>
                <Button type="primary" onClick={handleSubmit}>
                  添加任务
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoInput;