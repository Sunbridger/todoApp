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
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        fontSize: '16px',
        transition: 'all 0.3s',
        outline: 'none',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        fontWeight: '500'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#4361ee';
        e.target.style.boxShadow = '0 0 0 3px rgba(67, 97, 238, 0.2)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#e0e0e0';
        e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
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
        marginBottom: 28,
        borderRadius: 16,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
      }}
      bodyStyle={{
        padding: '30px',
        borderRadius: '16px'
      }}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: '请输入任务标题' }]}
        >
          <CustomInput
            placeholder="输入任务标题..."
          />
        </Form.Item>

        {isExpanded && (
          <Form.Item
            name="description"
            label={
              <span style={{
                fontWeight: '600',
                color: '#424242',
                fontSize: '16px'
              }}>
                任务描述
              </span>
            }
            style={{ marginTop: 20 }}
          >
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={modules}
              formats={formats}
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                overflow: 'hidden'
              }}
              placeholder="添加任务的详细描述..."
            />
          </Form.Item>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button
            type="link"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: 0,
              fontSize: 16,
              fontWeight: 600,
              color: '#4361ee',
              height: 'auto',
              lineHeight: 'normal'
            }}
          >
            {isExpanded ? '︽ 收起详细编辑' : '︾ 展开详细编辑'}
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            size="large"
            style={{
              borderRadius: 10,
              fontWeight: 600,
              padding: '0 36px',
              height: 48,
              boxShadow: '0 4px 8px rgba(67, 97, 238, 0.3)',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            添加任务
          </Button>
        </div>
      </Form>
      </Spin>
    </Card>
  );
};

export default TodoInput;