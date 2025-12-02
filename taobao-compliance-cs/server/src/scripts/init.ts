// 初始化数据库脚本
import { initDatabase } from '../database/init-db';

const dbPath = process.env.DB_PATH || './data/taobao_cs.db';
initDatabase(dbPath).catch(console.error);


