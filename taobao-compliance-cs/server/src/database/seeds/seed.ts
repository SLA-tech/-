// 数据库种子文件 - 用于初始化基础数据
// 可以通过 TypeORM 的 DataSource 或直接 SQL 执行

export const seedSensitiveWords = [
  { word: '办证', type: 'legal', severity: 8, enabled: 1 },
  { word: '公章', type: 'legal', severity: 6, enabled: 1 },
  { word: '伪造', type: 'legal', severity: 9, enabled: 1 },
  { word: '假章', type: 'legal', severity: 8, enabled: 1 },
  { word: '国家机关', type: 'government', severity: 9, enabled: 1 },
  { word: '军队', type: 'government', severity: 10, enabled: 1 },
  { word: '公检法', type: 'government', severity: 9, enabled: 1 },
];

export const seedTemplates = [
  {
    name: '欢迎语',
    content: '您好，欢迎光临！如需了解产品详情，请查看商品详情页或回复"人工客服"。',
    keywords: '你好,您好,hello,hi',
    enabled: 1,
  },
  {
    name: '默认回复',
    content: '感谢您的咨询，如需详细沟通，请回复"人工客服"或访问我们的客服页面。',
    keywords: '',
    enabled: 1,
  },
  {
    name: '价格咨询',
    content: JSON.stringify({
      text: '关于价格信息，请查看商品详情页，或联系我们的客服获取最新报价。',
      type: 'text',
    }),
    keywords: '价格,多少钱,报价,费用',
    enabled: 1,
  },
];


