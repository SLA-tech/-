import { Table, Button, Space, Modal, Form, Input, InputNumber, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import api from '../api/client'

interface Template {
  id: number
  name: string
  content: string
  loop_interval: number
  max_loops: number
  keywords: string
  enabled: number
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [form] = Form.useForm()

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await api.get('/templates')
      setTemplates((response as unknown as Template[]) || [])
    } catch (error) {
      console.error('获取模板列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleAdd = () => {
    setEditingTemplate(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    form.setFieldsValue(template)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/templates/${id}`)
      message.success('删除成功')
      fetchTemplates()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingTemplate) {
        await api.put(`/templates/${editingTemplate.id}`, values)
        message.success('更新成功')
      } else {
        await api.post('/templates', values)
        message.success('添加成功')
      }
      setModalVisible(false)
      fetchTemplates()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      key: 'keywords',
    },
    {
      title: '循环间隔(秒)',
      dataIndex: 'loop_interval',
      key: 'loop_interval',
    },
    {
      title: '最大循环次数',
      dataIndex: 'max_loops',
      key: 'max_loops',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: number) => (enabled ? '启用' : '禁用'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Template) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>模板管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加模板
        </Button>
      </div>
      <Table columns={columns} dataSource={templates} loading={loading} rowKey="id" />
      <Modal
        title={editingTemplate ? '编辑模板' : '添加模板'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="keywords" label="关键词 (逗号分隔)">
            <Input placeholder="例如: 价格,多少钱,报价" />
          </Form.Item>
          <Form.Item name="loop_interval" label="循环间隔(秒)">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="max_loops" label="最大循环次数 (0为无限制)">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="enabled" label="状态">
            <InputNumber min={0} max={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}


