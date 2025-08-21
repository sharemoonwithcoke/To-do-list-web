const express = require('express');
const dayjs = require('dayjs');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const tasksRouter = express.Router();

function isTaskScheduledOnDate(task, dateStr) {
  const date = dayjs(dateStr);
  const freq = task.frequency;
  if (freq === 'daily') return true;
  if (freq === 'weekly') {
    try {
      const days = JSON.parse(task.weekly_days || '[]');
      const dow = date.day(); // 0-6, Sunday=0
      return days.includes(dow);
    } catch (e) {
      return false;
    }
  }
  if (freq === 'monthly') {
    const dom = date.date();
    return Number(task.monthly_day) === dom;
  }
  return false;
}

function getOwnersVisibleToUser(userId) {
  const owners = new Set([userId]);
  const rows = db.prepare('SELECT owner_user_id FROM share_pairs WHERE partner_user_id = ?').all(userId);
  for (const r of rows) owners.add(r.owner_user_id);
  return Array.from(owners);
}

tasksRouter.post('/', authRequired, (req, res) => {
  const { title, frequency, weeklyDays, monthlyDay, requireSubmission } = req.body || {};
  if (!title || !frequency) return res.status(400).json({ error: 'Missing fields' });
  if (!['daily', 'weekly', 'monthly'].includes(frequency)) return res.status(400).json({ error: 'Invalid frequency' });
  const now = dayjs().toISOString();
  const weeklyDaysJson = frequency === 'weekly' ? JSON.stringify(weeklyDays || []) : null;
  const monthlyDayVal = frequency === 'monthly' ? Number(monthlyDay || 1) : null;
  const result = db
    .prepare(
      'INSERT INTO tasks (owner_user_id, title, require_submission, frequency, weekly_days, monthly_day, created_at) VALUES (?,?,?,?,?,?,?)'
    )
    .run(req.user.id, title, requireSubmission ? 1 : 0, frequency, weeklyDaysJson, monthlyDayVal, now);
  const created = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.json({ task: created });
});

tasksRouter.get('/by-date', authRequired, (req, res) => {
  const { date } = req.query;
  const dateStr = date || dayjs().format('YYYY-MM-DD');
  const ownerIds = getOwnersVisibleToUser(req.user.id);
  const placeholders = ownerIds.map(() => '?').join(',');
  const tasks = db.prepare(`SELECT * FROM tasks WHERE owner_user_id IN (${placeholders})`).all(...ownerIds);
  const tasksForDate = tasks.filter((t) => isTaskScheduledOnDate(t, dateStr));
  res.json({ date: dateStr, tasks: tasksForDate });
});

tasksRouter.get('/', authRequired, (req, res) => {
  const ownerIds = getOwnersVisibleToUser(req.user.id);
  const placeholders = ownerIds.map(() => '?').join(',');
  const tasks = db.prepare(`SELECT * FROM tasks WHERE owner_user_id IN (${placeholders}) ORDER BY created_at DESC`).all(...ownerIds);
  res.json({ tasks });
});

module.exports = { tasksRouter };

