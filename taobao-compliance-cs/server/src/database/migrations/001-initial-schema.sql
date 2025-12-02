-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS taobao_cs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE taobao_cs;

-- 用户会话表
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  taobao_user_id VARCHAR(128) UNIQUE NOT NULL,
  current_status VARCHAR(32) DEFAULT 'open',
  risk_level TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_taobao_user_id (taobao_user_id),
  INDEX idx_status (current_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 消息记录表
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id BIGINT NOT NULL,
  direction ENUM('inbound', 'outbound') NOT NULL,
  content TEXT NOT NULL,
  content_type VARCHAR(16) DEFAULT 'text',
  matched_rules VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_session_id (session_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 敏感词库表
CREATE TABLE IF NOT EXISTS sensitive_words (
  id INT AUTO_INCREMENT PRIMARY KEY,
  word VARCHAR(255) NOT NULL,
  type VARCHAR(32) DEFAULT 'other',
  severity TINYINT DEFAULT 5,
  enabled TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_word (word),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 自动回复模板表
CREATE TABLE IF NOT EXISTS automated_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  content TEXT NOT NULL,
  loop_interval INT DEFAULT 60,
  max_loops INT DEFAULT 0,
  keywords VARCHAR(255) NULL,
  enabled TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  actor VARCHAR(128) NOT NULL,
  action VARCHAR(255) NOT NULL,
  meta JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_actor (actor),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入示例数据
INSERT INTO sensitive_words (word, type, severity, enabled) VALUES
('办证', 'legal', 8, 1),
('公章', 'legal', 6, 1),
('伪造', 'legal', 9, 1),
('假章', 'legal', 8, 1),
('国家机关', 'government', 9, 1),
('军队', 'government', 10, 1),
('公检法', 'government', 9, 1);

INSERT INTO automated_templates (name, content, keywords, enabled) VALUES
('欢迎语', '您好，欢迎光临！如需了解产品详情，请查看商品详情页或回复"人工客服"。', '你好,您好,hello,hi', 1),
('默认回复', '感谢您的咨询，如需详细沟通，请回复"人工客服"或访问我们的客服页面。', '', 1),
('价格咨询', '{"text": "关于价格信息，请查看商品详情页，或联系我们的客服获取最新报价。", "type": "text"}', '价格,多少钱,报价,费用', 1);


