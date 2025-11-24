import React, { useState, useEffect } from 'react';
import { Input, Button, Card, message, Select, Tag, DatePicker } from 'antd';
import { PlusOutlined, TagOutlined, CalendarOutlined, FlagOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import dayjs from 'dayjs';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

const TodoInput = ({ onAdd, availableLabels = [] }) => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  // 快捷键支持
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K 快速添加任务
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.custom-input input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSubmit = () => {
    if (!text.trim()) {
      message.warning('请输入任务内容');
      return;
    }
    onAdd({
      text: text,
      body: description,
      labels: selectedLabels,
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority: priority
    });
    setText('');
    setDescription('');
    setSelectedLabels([]);
    setDueDate(null);
    setPriority('medium');
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

            <div style={{ marginBottom: 16 }}>
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

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                placeholder="设置截止日期"
                suffixIcon={<CalendarOutlined />}
                format="YYYY-MM-DD"
                style={{ flex: 1 }}
                disabledDate={(current) => {
                  // Disable dates before today
                  return current && current < dayjs().startOf('day');
                }}
              />
              <Select
                value={priority}
                onChange={setPriority}
                style={{ width: 140 }}
                placeholder={
                  <span>
                    <FlagOutlined /> 优先级
                  </span>
                }
              >
                <Option value="high">
                  <span style={{ color: '#ef4444' }}>🔴 高优先级</span>
                </Option>
                <Option value="medium">
                  <span style={{ color: '#f59e0b' }}>🟡 中优先级</span>
                </Option>
                <Option value="low">
                  <span style={{ color: '#10b981' }}>🟢 低优先级</span>
                </Option>
              </Select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={() => setIsExpanded(false)}>取消</Button>
              <Button type="primary" onClick={handleSubmit}>
                添加任务
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoInput;