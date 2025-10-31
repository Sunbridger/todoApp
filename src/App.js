import React, { useState } from 'react';
import { Layout, Typography, Menu, Card, Avatar, Badge } from 'antd';
import {
  FileOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  BarChartOutlined,
  RocketOutlined
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
    <Layout className="app-layout">
      <div className="app-header">
        <div className="header-content">
          <div className="app-logo">
            ✅
          </div>
          <Title level={3} className="app-title">
            现代化待办清单
          </Title>
        </div>
      </div>
      <Layout hasSider className="main-layout">
        <Sider width={240} className="app-sider">
          <div className="menu-header">
            <Badge count={1243} showZero className="visitor-badge">
              <Avatar shape="square" size="large" icon={<BarChartOutlined />} />
            </Badge>
            <div className="menu-header-text">
              <div>访客统计</div>
              <div className="menu-subtitle">实时监控</div>
            </div>
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['all']}
            selectedKeys={[selectedKey]}
            onSelect={({ key }) => setSelectedKey(key)}
            style={{
              height: 'calc(100% - 100px)',
              borderRight: 0,
              background: 'transparent',
              marginTop: 20
            }}
            items={menuItems}
          />
        </Sider>
        <Layout className="content-layout">
          <Content className="app-content">
            <div className="todo-container">
              {selectedKey === 'analytics' ? (
                <Card className="analytics-card slide-in">
                  <Analytics />
                </Card>
              ) : (
                <Card className="todo-card slide-in">
                  <TodoList filter={selectedKey} />
                </Card>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;