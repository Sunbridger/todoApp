import React, { useState } from 'react';
import { Layout, Typography, Menu, Card } from 'antd';
import { 
  FileOutlined, 
  CheckSquareOutlined, 
  CalendarOutlined
} from '@ant-design/icons';
import TodoList from './components/TodoList';
import Analytics from './components/Analytics';
import './App.css';

// eslint-disable-next-line no-unused-vars
import { useClient } from 'react';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

function App() {
  const [selectedKey, setSelectedKey] = useState('all');
  
  const menuItems = [
    {
      key: 'all',
      icon: <FileOutlined />,
      label: '所有任务',
    },
    {
      key: 'active',
      icon: <CheckSquareOutlined />,
      label: '进行中',
    },
    {
      key: 'completed',
      icon: <CalendarOutlined />,
      label: '已完成',
    },
    {
      key: 'analytics',
      icon: <CalendarOutlined />,
      label: '数据分析',
    }
  ];

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 600 }}>
          📝 Todo App
        </Title>
      </Header>
      <Layout style={{ background: 'transparent' }}>
        <Sider width={220} className="app-sider" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['all']}
            selectedKeys={[selectedKey]}
            onSelect={({ key }) => setSelectedKey(key)}
            style={{ 
              height: '100%', 
              borderRight: 0,
              background: 'transparent',
              marginTop: 20
            }}
            items={menuItems}
          />
        </Sider>
        <Content className="app-content">
          <div className="todo-container">
            {selectedKey === 'analytics' ? (
              <Card className="analytics-card">
                <Analytics />
              </Card>
            ) : (
              <Card className="todo-card">
                <TodoList filter={selectedKey} />
              </Card>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;