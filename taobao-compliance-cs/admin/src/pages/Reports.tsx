import { Card, Table, DatePicker, Button, Space } from 'antd'
import { useEffect, useState } from 'react'
import type { Dayjs } from 'dayjs'
import api from '../api/client'

interface ReportData {
  total_triggers: number
  top_words: Array<{ word: string; count: number }>
  date_range: {
    from: string | null
    to: string | null
  }
}

export default function Reports() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (dateRange[0]) {
        params.from = dateRange[0].format('YYYY-MM-DD')
      }
      if (dateRange[1]) {
        params.to = dateRange[1].format('YYYY-MM-DD')
      }
      const response = await api.get('/reports/sensitive-summary', { params })
      setReportData(response as unknown as ReportData | null)
    } catch (error) {
      console.error('获取报表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  const columns = [
    {
      title: '排名',
      key: 'rank',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '敏感词',
      dataIndex: 'word',
      key: 'word',
    },
    {
      title: '触发次数',
      dataIndex: 'count',
      key: 'count',
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>统计报表</h1>
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <DatePicker.RangePicker
            value={dateRange as any}
            onChange={(dates) => setDateRange(dates as any)}
          />
          <Button type="primary" onClick={fetchReport} loading={loading}>
            查询
          </Button>
        </Space>
      </Card>
      <Card title="敏感词触发统计" loading={loading}>
        <div style={{ marginBottom: 16 }}>
          <strong>总触发次数: </strong>
          {reportData?.total_triggers || 0}
        </div>
        <Table
          columns={columns}
          dataSource={reportData?.top_words || []}
          rowKey="word"
          pagination={false}
        />
      </Card>
    </div>
  )
}

