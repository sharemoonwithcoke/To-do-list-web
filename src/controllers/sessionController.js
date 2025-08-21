// src/controllers/sessionController.js
import { startSession, endSession } from '../services/sessionService.js';
import { getUserByUsername, getUserByEmail, createUser, userExistsByEmail, userExistsByUsername } from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export async function login(req, res) {
  const { usernameOrEmail, password } = req.body;
  const byUsername = getUserByUsername(usernameOrEmail);
  const byEmail = getUserByEmail(usernameOrEmail);
  const user = byUsername || byEmail;
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const sid = startSession(user.id);
  res.cookie('sid', sid, { httpOnly: true });
  res.json({ userId: user.id, username: user.username, email: user.email });
}

export function logout(req, res) {
  const sid = req.cookies.sid;
  endSession(sid);
  res.clearCookie('sid');
  res.json({ message: 'Logged out' });
}

export async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email and password are required' });
  }
  if (userExistsByUsername(username)) {
    return res.status(409).json({ error: 'username already exists' });
  }
  if (userExistsByEmail(email)) {
    return res.status(409).json({ error: 'email already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({ username, email, passwordHash });
  const sid = startSession(user.id);
  res.cookie('sid', sid, { httpOnly: true });
  res.status(201).json({ userId: user.id, username: user.username, email: user.email });
}