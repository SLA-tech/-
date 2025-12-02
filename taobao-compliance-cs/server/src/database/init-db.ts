// 数据库初始化脚本 - 用于本地SQLite数据库
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Message } from '../entities/message.entity';
import { SensitiveWord } from '../entities/sensitive-word.entity';
import { AutomatedTemplate } from '../entities/automated-template.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { seedSensitiveWords, seedTemplates } from './seeds/seed';

export async function initDatabase(dbPath: string = './data/taobao_cs.db') {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: dbPath,
    entities: [User, Message, SensitiveWord, AutomatedTemplate, AuditLog],
    synchronize: true,
  });

  await dataSource.initialize();

  // 检查是否已有数据
  const sensitiveWordRepo = dataSource.getRepository(SensitiveWord);
  const templateRepo = dataSource.getRepository(AutomatedTemplate);

  const wordCount = await sensitiveWordRepo.count();
  const templateCount = await templateRepo.count();

  // 如果数据库为空，插入种子数据
  if (wordCount === 0) {
    console.log('初始化敏感词数据...');
    for (const word of seedSensitiveWords) {
      const newWord = sensitiveWordRepo.create({
        word: word.word,
        type: word.type as any,
        severity: word.severity,
        enabled: word.enabled,
      });
      await sensitiveWordRepo.save(newWord);
    }
  }

  if (templateCount === 0) {
    console.log('初始化模板数据...');
    for (const template of seedTemplates) {
      const newTemplate = templateRepo.create({
        name: template.name,
        content: template.content,
        keywords: template.keywords,
        enabled: template.enabled,
      });
      await templateRepo.save(newTemplate);
    }
  }

  await dataSource.destroy();
  console.log('数据库初始化完成！');
}

// 如果直接运行此文件
if (require.main === module) {
  initDatabase().catch(console.error);
}

