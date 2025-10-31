import React, { useState } from 'react';
import { Button, message, Form, Card, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CustomInput = ({ value, onChange, placeholder, ...props }) => {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange && onChange(e)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #d9d9d9',
        fontSize: '14px',
        transition: 'all 0.3s',
        outline: 'none',
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#40a9ff';
        e.target.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#d9d9d9';
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    />
  );
};

const TodoInput = ({ onAdd }) => {
  const [form] = Form.useForm();
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (values.title?.trim()) {
      setLoading(true);
      try {
        // 不再合并 title 和 description，直接传递两个字段
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

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  return (
    <Card
      style={{
        marginBottom: 24,
        borderRadius: 8,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02)'
      }}
      bodyStyle={{ padding: 20 }}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: '请输入任务标题' }]}
        >
          <CustomInput
            placeholder="任务标题"
          />
        </Form.Item>

        {isExpanded && (
          <Form.Item
            name="description"
            label="任务描述"
          >
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={modules}
              formats={formats}
              style={{
                backgroundColor: '#fff',
                borderRadius: 6
              }}
              placeholder="添加任务的详细描述..."
            />
          </Form.Item>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="link"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ padding: 0 }}
          >
            {isExpanded ? '︽ 收起详细编辑' : '︾ 展开详细编辑'}
          </Button>

          <Form.Item noStyle>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              size="large"
              style={{
                borderRadius: 6,
                fontWeight: 500
              }}
            >
              添加任务
            </Button>
          </Form.Item>
        </div>
      </Form>
      </Spin>
    </Card>
  );
};

export default TodoInput;