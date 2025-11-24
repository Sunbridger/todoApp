import React, { useState } from 'react';
import { Button, Card, message } from 'antd';
import todoService from '../services/todoService';

const ApiTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testApi = async () => {
    setTesting(true);
    try {
      const result = await todoService.testConnection();
      setResult(result);
      if (result.success) {
        message.success('API 连接成功！');
      } else {
        message.error('API 连接失败！');
      }
    } catch (error) {
      message.error('测试失败：' + error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card title="API 连接测试" style={{ marginBottom: 16 }}>
      <Button onClick={testApi} loading={testing} type="primary">
        测试 GitHub API 连接
      </Button>
      {result && (
        <pre style={{ 
          marginTop: 16, 
          padding: 12, 
          background: '#f5f5f5', 
          borderRadius: 4,
          overflow: 'auto',
          maxHeight: 300
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </Card>
  );
};

export default ApiTest;
