// src/controllers/sessionController.js
import { startSession, endSession } from '../services/sessionService.js';


export function login(req, res) {
  const { username } = req.body;
  const sid = startSession(username);
  res.cookie('sid', sid, { httpOnly: true });
  res.json({ username });
}

export function logout(req, res) {
  const sid = req.cookies.sid;
  endSession(sid);
  res.clearCookie('sid');
  res.json({ message: 'Logged out' });
}