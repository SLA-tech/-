import { Card, Row, Col, Statistic } from 'antd'
import { MessageOutlined, SafetyOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    blockedSessions: 0,
    totalTriggers: 0,
  })

  useEffect(() => {
    // 获取统计数据
    // 这里可以调用API获取实际数据
    setStats({
      totalSessions: 0,
      activeSessions: 0,
      blockedSessions: 0,
      totalTriggers: 0,
    })
  }, [])

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表盘</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总会话数"
              value={stats.totalSessions}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃会话"
              value={stats.activeSessions}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已拦截会话"
              value={stats.blockedSessions}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="敏感词触发"
              value={stats.totalTriggers}
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}


