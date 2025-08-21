const express = require('express');
const dayjs = require('dayjs');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const shareRouter = express.Router();

// Share your tasks with another account (by email)
shareRouter.post('/add', authRequired, (req, res) => {
  const { partnerEmail } = req.body || {};
  if (!partnerEmail) return res.status(400).json({ error: 'Missing partnerEmail' });
  const partner = db.prepare('SELECT id, email FROM users WHERE email = ?').get(partnerEmail);
  if (!partner) return res.status(404).json({ error: 'User not found' });
  if (partner.id === req.user.id) return res.status(400).json({ error: 'Cannot share with yourself' });
  const now = dayjs().toISOString();
  try {
    db.prepare('INSERT INTO share_pairs (owner_user_id, partner_user_id, created_at) VALUES (?,?,?)').run(req.user.id, partner.id, now);
  } catch (e) {
    // ignore unique conflict
  }
  res.json({ ok: true });
});

// List who can view your tasks and whose tasks you can see
shareRouter.get('/list', authRequired, (req, res) => {
  const viewers = db
    .prepare('SELECT u.id, u.username, u.email FROM share_pairs sp JOIN users u ON u.id = sp.partner_user_id WHERE sp.owner_user_id = ?')
    .all(req.user.id);
  const owners = db
    .prepare('SELECT u.id, u.username, u.email FROM share_pairs sp JOIN users u ON u.id = sp.owner_user_id WHERE sp.partner_user_id = ?')
    .all(req.user.id);
  res.json({ viewers, owners });
});

module.exports = { shareRouter };

