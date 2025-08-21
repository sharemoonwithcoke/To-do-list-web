const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dayjs = require('dayjs');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}_${safe}`);
  },
});

const upload = multer({ storage });

const submissionsRouter = express.Router();

function canViewTask(userId, task) {
  if (!task) return false;
  if (task.owner_user_id === userId) return true;
  const row = db
    .prepare('SELECT 1 FROM share_pairs WHERE owner_user_id = ? AND partner_user_id = ?')
    .get(task.owner_user_id, userId);
  return !!row;
}

submissionsRouter.post('/text', authRequired, (req, res) => {
  const { taskId, date, text } = req.body || {};
  if (!taskId || !text) return res.status(400).json({ error: 'Missing fields' });
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!canViewTask(req.user.id, task)) return res.status(403).json({ error: 'Forbidden' });
  const now = dayjs().toISOString();
  const dateStr = date || dayjs().format('YYYY-MM-DD');
  const result = db
    .prepare('INSERT INTO submissions (task_id, user_id, date, type, content_text, created_at) VALUES (?,?,?,?,?,?)')
    .run(taskId, req.user.id, dateStr, 'text', text, now);
  res.json({ submissionId: result.lastInsertRowid });
});

submissionsRouter.post('/link', authRequired, (req, res) => {
  const { taskId, date, url } = req.body || {};
  if (!taskId || !url) return res.status(400).json({ error: 'Missing fields' });
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!canViewTask(req.user.id, task)) return res.status(403).json({ error: 'Forbidden' });
  const now = dayjs().toISOString();
  const dateStr = date || dayjs().format('YYYY-MM-DD');
  const result = db
    .prepare('INSERT INTO submissions (task_id, user_id, date, type, link_url, created_at) VALUES (?,?,?,?,?,?)')
    .run(taskId, req.user.id, dateStr, 'link', url, now);
  res.json({ submissionId: result.lastInsertRowid });
});

submissionsRouter.post('/file', authRequired, upload.single('file'), (req, res) => {
  const { taskId, date } = req.body || {};
  if (!taskId || !req.file) return res.status(400).json({ error: 'Missing fields' });
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(Number(taskId));
  if (!canViewTask(req.user.id, task)) return res.status(403).json({ error: 'Forbidden' });
  const now = dayjs().toISOString();
  const dateStr = date || dayjs().format('YYYY-MM-DD');
  const relativePath = path.join('uploads', path.basename(req.file.path));
  const result = db
    .prepare('INSERT INTO submissions (task_id, user_id, date, type, file_path, created_at) VALUES (?,?,?,?,?,?)')
    .run(task.id, req.user.id, dateStr, 'file', relativePath, now);
  res.json({ submissionId: result.lastInsertRowid, file: `/${relativePath}` });
});

submissionsRouter.get('/by-date', authRequired, (req, res) => {
  const { date } = req.query;
  const dateStr = date || dayjs().format('YYYY-MM-DD');
  // Visible tasks
  const ownerIds = new Set([req.user.id]);
  const rows = db.prepare('SELECT owner_user_id FROM share_pairs WHERE partner_user_id = ?').all(req.user.id);
  for (const r of rows) ownerIds.add(r.owner_user_id);
  const tasks = db
    .prepare(`SELECT * FROM tasks WHERE owner_user_id IN (${Array.from(ownerIds).map(() => '?').join(',')})`)
    .all(...Array.from(ownerIds));
  const taskIds = tasks.map((t) => t.id);
  if (taskIds.length === 0) return res.json({ date: dateStr, submissions: [] });
  const subs = db
    .prepare(`SELECT s.*, u.username FROM submissions s JOIN users u ON u.id = s.user_id WHERE s.date = ? AND s.task_id IN (${taskIds.map(() => '?').join(',')}) ORDER BY s.created_at DESC`)
    .all(dateStr, ...taskIds);
  res.json({ date: dateStr, submissions: subs });
});

submissionsRouter.get('/for-task/:taskId', authRequired, (req, res) => {
  const taskId = Number(req.params.taskId);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!canViewTask(req.user.id, task)) return res.status(403).json({ error: 'Forbidden' });
  const subs = db
    .prepare('SELECT s.*, u.username FROM submissions s JOIN users u ON u.id = s.user_id WHERE s.task_id = ? ORDER BY s.created_at DESC')
    .all(taskId);
  res.json({ submissions: subs });
});

module.exports = { submissionsRouter };

