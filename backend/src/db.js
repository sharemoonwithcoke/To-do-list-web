const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS share_pairs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_user_id INTEGER NOT NULL,
      partner_user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(owner_user_id, partner_user_id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      require_submission INTEGER NOT NULL DEFAULT 0,
      frequency TEXT NOT NULL, -- daily | weekly | monthly
      weekly_days TEXT, -- JSON array of 0-6
      monthly_day INTEGER, -- 1-31
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_owner ON tasks(owner_user_id);

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL, -- YYYY-MM-DD
      type TEXT NOT NULL, -- text | link | file
      content_text TEXT,
      link_url TEXT,
      file_path TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_date ON submissions(date);
    CREATE INDEX IF NOT EXISTS idx_submissions_task ON submissions(task_id);
  `);
}

migrate();

module.exports = { db };

