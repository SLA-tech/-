# 数据库相关文件

## 迁移脚本

- `migrations/001-initial-schema.sql` - 初始数据库结构

## 种子数据

- `seeds/seed.ts` - TypeScript 种子数据定义
- `sensitive-words.csv` - 敏感词基础词库（CSV格式）

## 使用说明

### 执行迁移

```bash
# 方式1: 使用MySQL客户端
mysql -u root -p taobao_cs < migrations/001-initial-schema.sql

# 方式2: 使用Docker
docker exec -i taobao_cs_mysql mysql -uroot -prootpassword taobao_cs < migrations/001-initial-schema.sql
```

### 导入敏感词

敏感词可以通过管理后台添加，或使用SQL导入：

```sql
LOAD DATA LOCAL INFILE 'sensitive-words.csv'
INTO TABLE sensitive_words
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(word, type, severity, enabled);
```

### 注意事项

1. 生产环境应使用数据库迁移工具（如 TypeORM Migrations）
2. 敏感词库需要法务和运营人员审核
3. 定期更新和维护敏感词库


