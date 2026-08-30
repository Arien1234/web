-- 已有库补角色字段（新库直接执行 init.sql 即可，不必再跑本文件）
USE `database`;

ALTER TABLE users
  ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色：admin / user';

UPDATE users SET role = 'admin' WHERE username = 'admin';
