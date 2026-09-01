-- web 模块种子数据（模块级 seed.sql，oj 启动时对 default 库重放）。
-- 注意：seed 按英文分号朴素切分语句，注释里也不要出现英文分号。
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  roles TEXT NOT NULL DEFAULT '[]'
);
INSERT OR IGNORE INTO users (username, password_hash, roles) VALUES ('admin', '$2y$10$ylE2NdjnYiuEcq54W/KxH.bhvGaQQg3rbmYI3mcEHX6LdQEAqixeC', '["admin"]')
