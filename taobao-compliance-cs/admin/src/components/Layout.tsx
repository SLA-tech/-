import { useState } from 'react'
import { Layout as AntLayout, Menu, theme } from 'antd'
import {
  DashboardOutlined,
  MessageOutlined,
  SafetyOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = AntLayout

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/sessions',
      icon: <MessageOutlined />,
      label: '会话管理',
    },
    {
      key: '/sensitive-words',
      icon: <SafetyOutlined />,
      label: '敏感词管理',
    },
    {
      key: '/templates',
      icon: <FileTextOutlined />,
      label: '模板管理',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: '统计报表',
    },
  ]

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {collapsed ? 'TCS' : '淘宝合规客服'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ padding: '0 24px', lineHeight: '64px', fontSize: 20, fontWeight: 'bold' }}>
            管理后台
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}


