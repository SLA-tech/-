import { Table, Tag, Button, Space } from 'antd'
import { useEffect, useState } from 'react'
import api from '../api/client'

interface Session {
  id: number
  taobao_user_id: string
  current_status: string
  risk_level: number
  created_at: string
  updated_at: string
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })

  const fetchSessions = async (page = 1, limit = 20) => {
    setLoading(true)
    try {
      const response = await api.get('/sessions', { params: { page, limit } })
      const data = response as unknown as (any | any[])
      setSessions(Array.isArray(data) ? data : (data as any).data || [])
      setPagination({ ...pagination, total: Array.isArray(data) ? data.length : (data as any).total || 0, current: page })
    } catch (error) {
      console.error('获取会话列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleClose = async (id: number) => {
    try {
      await api.put(`/sessions/${id}/close`)
      fetchSessions(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('关闭会话失败:', error)
    }
  }

  const handleBlock = async (id: number) => {
    try {
      await api.put(`/sessions/${id}/block`)
      fetchSessions(pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('拦截会话失败:', error)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '淘宝用户ID',
      dataIndex: 'taobao_user_id',
      key: 'taobao_user_id',
    },
    {
      title: '状态',
      dataIndex: 'current_status',
      key: 'current_status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          open: 'green',
          closed: 'default',
          blocked: 'red',
        }
        return <Tag color={colorMap[status]}>{status}</Tag>
      },
    },
    {
      title: '风险等级',
      dataIndex: 'risk_level',
      key: 'risk_level',
      render: (level: number) => {
        const colors = ['green', 'orange', 'red']
        const labels = ['低', '中', '高']
        return <Tag color={colors[level]}>{labels[level] || '低'}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Session) => (
        <Space>
          <Button
            size="small"
            onClick={() => handleClose(record.id)}
            disabled={record.current_status !== 'open'}
          >
            关闭
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleBlock(record.id)}
            disabled={record.current_status === 'blocked'}
          >
            拦截
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>会话管理</h1>
      <Table
        columns={columns}
        dataSource={sessions}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchSessions(page, pageSize),
        }}
      />
    </div>
  )
}


