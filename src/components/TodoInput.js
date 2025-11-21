import React, { useState } from 'react';
import { Button, message, Form, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TodoInput = ({ onAdd }) => {
  const [form] = Form.useForm();
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (values.title?.trim()) {
      setLoading(true);
      try {
        await onAdd({
          title: values.title,
          description: values.description || '',
        });
        form.resetFields();
        setDescription('');
        setIsExpanded(false);
      } finally {
        setLoading(false);
      }
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

  return (
    <div className="todo-input-card">
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: '请输入任务标题' }]}
            style={{ marginBottom: 0 }}
          >
            <input
              className="custom-input"
              placeholder="准备做点什么？"
              style={{ width: '100%' }}
            />
          </Form.Item>

          {isExpanded && (
            <div style={{ marginTop: 20, animation: 'fadeIn 0.3s ease-out' }}>
              <Form.Item
                name="description"
                label={<span style={{ fontWeight: 600 }}>任务描述</span>}
              >
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  className="task-description-editor"
                  placeholder="添加详细描述..."
                />
              </Form.Item>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: isExpanded ? 20 : 12
          }}>
            <Button
              type="text"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ color: 'var(--primary-color)' }}
            >
              {isExpanded ? '收起详情' : '添加详情'}
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              size="large"
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '0 24px',
                background: 'var(--primary-color)',
                borderColor: 'var(--primary-color)'
              }}
            >
              添加任务
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default TodoInput;