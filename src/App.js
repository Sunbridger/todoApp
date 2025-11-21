import React, { useState, Suspense } from 'react';
import { Layout, Typography, Menu, Spin, Skeleton } from 'antd';
import {
  FileOutlined,
  CheckSquareOutlined,
  RocketOutlined,
  BarChartOutlined,
  UserOutlined
} from '@ant-design/icons';
import TodoList from './components/TodoList';
import './App.css';

// 懒加载 Analytics 组件
const Analytics = React.lazy(() => import('./components/Analytics'));

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
      icon: <RocketOutlined />,
      label: '进行中',
    },
    {
      key: 'completed',
      icon: <CheckSquareOutlined />,
      label: '已完成',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
    }
  ];

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="app-logo">
            ✓
          </div>
          <Title level={3} className="app-title">
            现代化待办清单
          </Title>
        </div>
      </header>

      <main className="main-layout">
        <aside className="app-sider">
          <div className="visitor-card">
            <UserOutlined style={{ fontSize: '24px' }} />
            <div className="visitor-info">
              <h4>今日访客</h4>
              <p>1,243</p>
            </div>
          </div>

          <div className="menu-card">
            <Menu
              mode="inline"
              defaultSelectedKeys={['all']}
              selectedKeys={[selectedKey]}
              onSelect={({ key }) => setSelectedKey(key)}
              items={menuItems}
            />
          </div>
        </aside>

        <div className="content-layout">
          <div className="todo-container">
            {selectedKey === 'analytics' ? (
              <div className="analytics-wrapper slide-in">
                <Suspense fallback={
                  <div style={{ padding: '24px', background: 'white', borderRadius: '16px' }}>
                    <Skeleton active paragraph={{ rows: 6 }} />
                  </div>
                }>
                  <Analytics />
                </Suspense>
              </div>
            ) : (
              <TodoList filter={selectedKey} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;