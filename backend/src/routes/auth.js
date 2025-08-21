const express = require('express');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const { db } = require('../db');
const { signToken, authRequired } = require('../middleware/auth');

const authRouter = express.Router();

authRouter.post('/register', (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const now = dayjs().toISOString();
  const result = db
    .prepare('INSERT INTO users (username, email, password_hash, created_at) VALUES (?,?,?,?)')
    .run(username, email, passwordHash, now);
  const user = { id: result.lastInsertRowid, username, email };
  const token = signToken({ id: user.id, email: user.email, username: user.username });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ user, token });
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, row.password_hash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const user = { id: row.id, username: row.username, email: row.email };
  const token = signToken({ id: user.id, email: user.email, username: user.username });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ user, token });
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

authRouter.get('/me', authRequired, (req, res) => {
  const row = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(req.user.id);
  res.json({ user: row });
});

module.exports = { authRouter };

