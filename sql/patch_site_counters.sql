-- 已有库补官网访客计数（新库直接执行 init.sql 即可）
USE `database`;

CREATE TABLE IF NOT EXISTS site_counters (
  name VARCHAR(50) NOT NULL PRIMARY KEY COMMENT '计数器名称',
  value BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '累计次数',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO site_counters (name, value) VALUES ('home_visits', 0);
