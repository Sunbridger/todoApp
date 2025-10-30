import React, { useState, useEffect } from 'react';
import { Typography, DatePicker, Row, Col, Card, Statistic, Progress, Empty } from 'antd';
import { getTodos } from '../services/todoService';

// eslint-disable-next-line no-unused-vars
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Analytics = () => {
  const [todos, setTodos] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
      calculateStats(data, null);
    } catch (error) {
      console.error('获取待办事项失败:', error);
    }
  };

  const calculateStats = (todoList, range) => {
    let filteredTodos = todoList;
    
    if (range && range.length === 2) {
      const [start, end] = range;
      filteredTodos = todoList.filter(todo => {
        const todoDate = new Date(todo.createdAt);
        return todoDate >= start && todoDate <= end;
      });
    }
    
    const total = filteredTodos.length;
    const completed = filteredTodos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setStats({
      total,
      completed,
      active,
      completionRate
    });
  };

  const onDateRangeChange = (dates) => {
    setDateRange(dates);
    calculateStats(todos, dates);
  };

  return (
    <div>
      <Title level={4} style={{ textAlign: 'center', marginBottom: 24, color: '#333' }}>
        📊 数据分析
      </Title>
      
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Text strong style={{ 
          marginRight: 16, 
          fontSize: 16,
          color: '#555'
        }}>
          选择时间范围:
        </Text>
        <RangePicker 
          onChange={onDateRangeChange} 
          size="large"
          style={{ borderRadius: 8 }}
        />
      </div>
      
      {todos.length > 0 ? (
        <>
          <Row gutter={24} style={{ marginBottom: 32 }}>
            <Col span={6}>
              <Card style={{ 
                borderRadius: 16,
                background: 'linear-gradient(120deg, #ff9a9e, #fecfef)',
                color: '#fff',
                textAlign: 'center'
              }}>
                <Statistic
                  title={<span style={{ color: '#fff', fontSize: 16 }}>总任务数</span>}
                  value={stats.total}
                  valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 600 }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card style={{ 
                borderRadius: 16,
                background: 'linear-gradient(120deg, #a1c4fd, #c2e9fb)',
                color: '#fff',
                textAlign: 'center'
              }}>
                <Statistic
                  title={<span style={{ color: '#fff', fontSize: 16 }}>已完成</span>}
                  value={stats.completed}
                  valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 600 }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card style={{ 
                borderRadius: 16,
                background: 'linear-gradient(120deg, #ffecd2, #fcb69f)',
                color: '#fff',
                textAlign: 'center'
              }}>
                <Statistic
                  title={<span style={{ color: '#fff', fontSize: 16 }}>进行中</span>}
                  value={stats.active}
                  valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 600 }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card style={{ 
                borderRadius: 16,
                background: 'linear-gradient(120deg, #84fab0, #8fd3f4)',
                color: '#fff',
                textAlign: 'center'
              }}>
                <Statistic
                  title={<span style={{ color: '#fff', fontSize: 16 }}>完成率</span>}
                  value={stats.completionRate}
                  suffix="%"
                  valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 600 }}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={12}>
              <Card title="任务完成情况" 
                headStyle={{ 
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: 18,
                  fontWeight: 600
                }}
                bodyStyle={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: 200
                }}
              >
                <Progress
                  type="circle"
                  percent={stats.completionRate}
                  width={140}
                  strokeWidth={8}
                  strokeColor={{
                    '0%': '#ff9a9e',
                    '100%': '#84fab0',
                  }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="任务统计"
                headStyle={{ 
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Progress
                    strokeColor={{
                      '0%': '#ff4d4f',
                      '100%': '#52c41a',
                    }}
                    percent={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
                    showInfo={false}
                    strokeWidth={20}
                    trailColor="#f0f0f0"
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: 20,
                    fontSize: 16,
                    fontWeight: 500
                  }}>
                    <Text style={{ color: '#ff4d4f' }}>进行中 {stats.active} 项</Text>
                    <Text style={{ color: '#52c41a' }}>已完成 {stats.completed} 项</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          
          {dateRange && (
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 16 }}>
                当前显示 {dateRange[0].format('YYYY-MM-DD')} 至 {dateRange[1].format('YYYY-MM-DD')} 的数据
              </Text>
            </div>
          )}
        </>
      ) : (
        <Empty 
          description="暂无数据" 
          style={{ padding: '60px 0' }}
        />
      )}
    </div>
  );
};

export default Analytics;