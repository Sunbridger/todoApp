import React, { useState, Suspense, useEffect } from 'react';
import { Layout, Menu, Button, Skeleton } from 'antd';
import {
  UnorderedListOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  BulbOutlined,
  BulbFilled,
  UserOutlined
} from '@ant-design/icons';
import TodoList from './components/TodoList';
import './App.css';

// Lazy load Analytics component
const Analytics = React.lazy(() => import('./components/Analytics'));

const { Header, Sider, Content } = Layout;

const App = () => {
  const [selectedKey, setSelectedKey] = useState('all');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const menuItems = [
    {
      key: 'all',
      icon: <UnorderedListOutlined />,
      label: '所有任务',
    },
    {
      key: 'active',
      icon: <ClockCircleOutlined />,
      label: '进行中',
    },
    {
      key: 'completed',
      icon: <CheckCircleOutlined />,
      label: '已完成',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
    }
  ];

  const renderContent = () => {
    if (selectedKey === 'analytics') {
      return (
        <Suspense fallback={<div style={{ padding: 24 }}><Skeleton active /></div>}>
          <Analytics />
        </Suspense>
      );
    }
    return <TodoList filter={selectedKey} />;
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-content">
          <div className="app-logo">T</div>
          <h1 className="app-title">现代化待办清单</h1>
          <Button
            type="text"
            icon={theme === 'light' ? <BulbOutlined /> : <BulbFilled />}
            onClick={toggleTheme}
            style={{ marginLeft: 'auto', color: 'var(--text-primary)' }}
          />
        </div>
      </Header>

      <Layout className="main-layout">
        <Sider width={260} className="app-sider">
          <div className="visitor-card">
            <UserOutlined style={{ fontSize: '24px' }} />
            <div className="visitor-info">
              <h4>今日访客</h4>
              <p>1,234</p>
            </div>
          </div>
          <div className="menu-card">
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={({ key }) => setSelectedKey(key)}
              items={menuItems}
            />
          </div>
        </Sider>
        <Content className="content-layout">
          <div className="todo-container">
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;