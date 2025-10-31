import React, { useState, useEffect } from 'react';
import {
  Typography,
  DatePicker,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Empty,
  Tabs,
  Badge,
} from 'antd';
import { CheckSquareOutlined, BarChartOutlined } from '@ant-design/icons';
import { getTodos } from '../services/todoService';

// eslint-disable-next-line no-unused-vars
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Analytics = () => {
  const [todos, setTodos] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    completionRate: 0,
  });
  // 访客统计数据
  const [visitorStats] = useState({
    totalVisitors: 1243,
    currentOnline: 26,
    returningVisitors: 68,
    newUserToday: 12,
    popularTime: '19:00-20:00',
  });

  // 用户画像数据
  const [userProfiles] = useState([
    { name: '学生', value: 35, color: '#ff9a9e' },
    { name: '上班族', value: 42, color: '#a1c4fd' },
    { name: '自由职业', value: 15, color: '#ffecd2' },
    { name: '其他', value: 8, color: '#84fab0' },
  ]);

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
      filteredTodos = todoList.filter((todo) => {
        const todoDate = new Date(todo.createdAt);
        return todoDate >= start && todoDate <= end;
      });
    }

    const total = filteredTodos.length;
    const completed = filteredTodos.filter((todo) => todo.completed).length;
    const active = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({
      total,
      completed,
      active,
      completionRate,
    });
  };

  const onDateRangeChange = (dates) => {
    setDateRange(dates);
    calculateStats(todos, dates);
  };

  return (
    <div>
      <Title
        level={4}
        style={{
          textAlign: 'center',
          marginBottom: 32,
          color: '#333',
          fontWeight: 800,
          fontSize: 28,
        }}
      >
        📊 数据分析中心
      </Title>

      <Tabs defaultActiveKey="tasks" size="large" centered>
        <TabPane
          tab={
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              <CheckSquareOutlined /> 任务分析
            </span>
          }
          key="tasks"
        >
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <Text
              strong
              style={{
                marginRight: 16,
                fontSize: 18,
                color: '#555',
                fontWeight: 600,
              }}
            >
              选择时间范围:
            </Text>
            <RangePicker
              onChange={onDateRangeChange}
              size="large"
              style={{
                borderRadius: 8,
                padding: '6px 12px',
              }}
            />
          </div>

          {todos.length > 0 ? (
            <>
              <Row gutter={24} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: '#fff',
                      textAlign: 'center',
                      height: '100%',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Statistic
                      title={
                        <span
                          style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 600,
                          }}
                        >
                          总任务数
                        </span>
                      }
                      value={stats.total}
                      valueStyle={{
                        color: '#fff',
                        fontSize: 36,
                        fontWeight: 800,
                      }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                      color: '#fff',
                      textAlign: 'center',
                      height: '100%',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Statistic
                      title={
                        <span
                          style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 600,
                          }}
                        >
                          已完成
                        </span>
                      }
                      value={stats.completed}
                      valueStyle={{
                        color: '#fff',
                        fontSize: 36,
                        fontWeight: 800,
                      }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                      color: '#fff',
                      textAlign: 'center',
                      height: '100%',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Statistic
                      title={
                        <span
                          style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 600,
                          }}
                        >
                          进行中
                        </span>
                      }
                      value={stats.active}
                      valueStyle={{
                        color: '#fff',
                        fontSize: 36,
                        fontWeight: 800,
                      }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
                      color: '#fff',
                      textAlign: 'center',
                      height: '100%',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Statistic
                      title={
                        <span
                          style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 600,
                          }}
                        >
                          完成率
                        </span>
                      }
                      value={stats.completionRate}
                      suffix="%"
                      valueStyle={{
                        color: '#fff',
                        fontSize: 36,
                        fontWeight: 800,
                      }}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Card
                    title="任务完成情况"
                    headStyle={{
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: 20,
                      fontWeight: 700,
                      padding: '0 24px',
                    }}
                    bodyStyle={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 300,
                    }}
                    style={{
                      borderRadius: 16,
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Progress
                      type="circle"
                      percent={stats.completionRate}
                      width={180}
                      strokeWidth={10}
                      strokeColor={{
                        '0%': '#ff9a9e',
                        '100%': '#84fab0',
                      }}
                      format={(percent) => (
                        <span
                          style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: '#333',
                          }}
                        >
                          {percent}%
                        </span>
                      )}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card
                    title="任务统计"
                    headStyle={{
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: 20,
                      fontWeight: 700,
                      padding: '0 24px',
                    }}
                    style={{
                      borderRadius: 16,
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div style={{ textAlign: 'center', padding: 30 }}>
                      <Progress
                        strokeColor={{
                          '0%': '#ff4d4f',
                          '100%': '#52c41a',
                        }}
                        percent={
                          stats.total > 0
                            ? Math.round((stats.completed / stats.total) * 100)
                            : 0
                        }
                        showInfo={false}
                        strokeWidth={24}
                        trailColor="#f0f0f0"
                      />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 25,
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                      >
                        <Text style={{ color: '#ff4d4f' }}>
                          进行中 {stats.active} 项
                        </Text>
                        <Text style={{ color: '#52c41a' }}>
                          已完成 {stats.completed} 项
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              {dateRange && (
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: 18, fontWeight: 500 }}
                  >
                    当前显示 {dateRange[0].format('YYYY-MM-DD')} 至{' '}
                    {dateRange[1].format('YYYY-MM-DD')} 的数据
                  </Text>
                </div>
              )}
            </>
          ) : (
            <Empty description="暂无数据" style={{ padding: '80px 0' }}>
              <Text style={{ fontSize: 18 }}>还没有任何任务数据</Text>
            </Empty>
          )}
        </TabPane>

        <TabPane
          tab={
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              <BarChartOutlined /> 访客分析
            </span>
          }
          key="visitors"
        >
          <div style={{ marginBottom: 32 }}>
            <Title
              level={5}
              style={{
                color: '#333',
                marginBottom: 32,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              实时访客统计
            </Title>

            <Row gutter={24} style={{ marginBottom: 32 }}>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  style={{
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: '#fff',
                    textAlign: 'center',
                    height: '100%',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Statistic
                    title={
                      <span
                        style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}
                      >
                        总访客数
                      </span>
                    }
                    value={visitorStats.totalVisitors}
                    valueStyle={{
                      color: '#fff',
                      fontSize: 36,
                      fontWeight: 800,
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  style={{
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                    color: '#fff',
                    textAlign: 'center',
                    height: '100%',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Statistic
                    title={
                      <span
                        style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}
                      >
                        当前在线
                      </span>
                    }
                    value={visitorStats.currentOnline}
                    valueStyle={{
                      color: '#fff',
                      fontSize: 36,
                      fontWeight: 800,
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  style={{
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                    color: '#fff',
                    textAlign: 'center',
                    height: '100%',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Statistic
                    title={
                      <span
                        style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}
                      >
                        回头访客
                      </span>
                    }
                    value={`${visitorStats.returningVisitors}%`}
                    valueStyle={{
                      color: '#fff',
                      fontSize: 36,
                      fontWeight: 800,
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card
                  style={{
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                    color: '#fff',
                    textAlign: 'center',
                    height: '100%',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Statistic
                    title={
                      <span
                        style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}
                      >
                        今日新增
                      </span>
                    }
                    value={visitorStats.newUserToday}
                    valueStyle={{
                      color: '#fff',
                      fontSize: 36,
                      fontWeight: 800,
                    }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Card
                  title="用户画像分布"
                  headStyle={{
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: 20,
                    fontWeight: 700,
                    padding: '0 24px',
                  }}
                  bodyStyle={{ height: 350 }}
                  style={{
                    borderRadius: 16,
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-around',
                      height: '100%',
                    }}
                  >
                    {userProfiles.map((profile, index) => (
                      <div
                        key={index}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <div
                          style={{
                            width: 100,
                            fontWeight: 600,
                            color: '#333',
                            fontSize: 18,
                          }}
                        >
                          {profile.name}
                        </div>
                        <div
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Progress
                            percent={profile.value}
                            strokeColor={profile.color}
                            showInfo={false}
                            style={{ flex: 1, marginRight: 15 }}
                            strokeWidth={20}
                            strokeLinecap="round"
                          />
                          <div
                            style={{
                              width: 50,
                              fontWeight: 700,
                              color: '#333',
                              fontSize: 18,
                            }}
                          >
                            {profile.value}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  title="热门时段"
                  headStyle={{
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: 20,
                    fontWeight: 700,
                    padding: '0 24px',
                  }}
                  bodyStyle={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 350,
                  }}
                  style={{
                    borderRadius: 16,
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Badge
                      count="热点"
                      style={{
                        backgroundColor: '#ff4d4f',
                        fontSize: 16,
                        height: 30,
                        lineHeight: '30px',
                        minWidth: 60,
                        borderRadius: 15,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        marginBottom: 15,
                        color: '#333',
                        marginTop: 20,
                      }}
                    >
                      {visitorStats.popularTime}
                    </div>
                    <Text style={{ fontSize: 18, color: '#666' }}>
                      大多数用户在这个时间段访问应用
                    </Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Analytics;
