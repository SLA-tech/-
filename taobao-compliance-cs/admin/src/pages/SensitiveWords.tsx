import { Table, Button, Space, Modal, Form, Input, Select, InputNumber, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import api from '../api/client'

interface SensitiveWord {
  id: number
  word: string
  type: string
  severity: number
  enabled: number
  created_at: string
}

export default function SensitiveWords() {
  const [words, setWords] = useState<SensitiveWord[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingWord, setEditingWord] = useState<SensitiveWord | null>(null)
  const [form] = Form.useForm()

  const fetchWords = async () => {
    setLoading(true)
    try {
      const response = await api.get('/sensitive-words')
      setWords((response as unknown as SensitiveWord[]) || [])
    } catch (error) {
      console.error('获取敏感词列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWords()
  }, [])

  const handleAdd = () => {
    setEditingWord(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (word: SensitiveWord) => {
    setEditingWord(word)
    form.setFieldsValue(word)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/sensitive-words/${id}`)
      message.success('删除成功')
      fetchWords()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingWord) {
        await api.put(`/sensitive-words/${editingWord.id}`, values)
        message.success('更新成功')
      } else {
        await api.post('/sensitive-words', values)
        message.success('添加成功')
      }
      setModalVisible(false)
      fetchWords()
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
      title: '敏感词',
      dataIndex: 'word',
      key: 'word',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: number) => (enabled ? '启用' : '禁用'),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SensitiveWord) => (
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
        <h1 style={{ margin: 0 }}>敏感词管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加敏感词
        </Button>
      </div>
      <Table columns={columns} dataSource={words} loading={loading} rowKey="id" />
      <Modal
        title={editingWord ? '编辑敏感词' : '添加敏感词'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="word" label="敏感词" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="类型">
            <Select>
              <Select.Option value="legal">法律相关</Select.Option>
              <Select.Option value="government">政府相关</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="severity" label="严重程度 (1-10)">
            <InputNumber min={1} max={10} />
          </Form.Item>
          <Form.Item name="enabled" label="状态">
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}


