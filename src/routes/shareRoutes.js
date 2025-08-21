// src/routes/shareRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { addShare, removeShare, listShares } from '../models/shareModel.js';
import { getUserByUsername, getUserByEmail } from '../models/userModel.js';

const router = express.Router();

// List current shares
router.get('/', (req, res) => {
  if (!authMiddleware(req, res)) return;
  const list = listShares(req.userId);
  res.json({ sharedWithUserIds: list });
});

// Add a share to another user by username or email
router.post('/', (req, res) => {
  if (!authMiddleware(req, res)) return;
  const { target } = req.body; // username or email
  if (!target) return res.status(400).json({ error: 'target is required' });
  const user = getUserByUsername(target) || getUserByEmail(target);
  if (!user) return res.status(404).json({ error: 'target user not found' });
  if (user.id === req.userId) return res.status(400).json({ error: 'cannot share with self' });
  addShare(req.userId, user.id);
  res.status(201).json({ ok: true, targetUserId: user.id });
});

router.delete('/', (req, res) => {
  if (!authMiddleware(req, res)) return;
  const { targetUserId } = req.body;
  if (!targetUserId) return res.status(400).json({ error: 'targetUserId is required' });
  const removed = removeShare(req.userId, targetUserId);
  if (!removed) return res.status(404).json({ error: 'share not found' });
  res.json({ ok: true });
});

export default router;

