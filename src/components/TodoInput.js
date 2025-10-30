import React, { useState } from 'react';
import { Input, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const TodoInput = ({ onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (!values.text.trim()) return;
    
    setLoading(true);
    try {
      await onAdd(values.text);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} style={{ marginBottom: 24 }}>
      <Form.Item
        name="text"
        rules={[{ required: true, message: '请输入待办事项内容' }]}
      >
        <Input
          placeholder="📝 添加新的待办事项"
          suffix={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={form.submit}
              loading={loading}
              style={{ 
                marginRight: -8,
                borderRadius: '0 6px 6px 0'
              }}
            >
              添加
            </Button>
          }
          style={{
            borderRadius: 6,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default TodoInput;