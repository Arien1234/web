-- 澜知 AI 官网：库名 database，字符集 utf8mb4
-- 连接账号：root / 123456

CREATE DATABASE IF NOT EXISTS `database`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `database`;

-- 登录用户（密码由后端首次启动时写入哈希，避免明文落库）
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '登录名',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
  display_name VARCHAR(50) NOT NULL DEFAULT '' COMMENT '显示名',
  role VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色：admin 系统管理员 / user 普通成员',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 官网「联系我们」留言
CREATE TABLE IF NOT EXISTS inquiries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '联系人',
  company VARCHAR(80) NOT NULL DEFAULT '' COMMENT '公司',
  message VARCHAR(500) NOT NULL COMMENT '需求描述',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
