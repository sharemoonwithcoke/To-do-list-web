// src/routes/submissionRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../middleware/auth.js';
import { listSubmissions, addSubmission } from '../models/submissionModel.js';
import { getTasks } from '../models/taskModel.js';
import { isSharedWith } from '../models/shareModel.js';
import { getUserById } from '../models/userModel.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({ storage });

// List submissions for a task; ownerKey can be 'me' or an explicit ownerUserId
router.get('/:ownerKey/:taskId', (req, res) => {
  if (!authMiddleware(req, res)) return;
  const { ownerKey, taskId } = req.params;
  const ownerUserId = ownerKey === 'me' ? req.userId : ownerKey;
  // permission: if owner is not me, must be shared with me
  if (ownerUserId !== req.userId && !isSharedWith(ownerUserId, req.userId)) {
    return res.status(403).json({ error: 'forbidden' });
  }
  const submissions = listSubmissions(ownerUserId, taskId).map(s => {
    const submitter = getUserById(s.submitterUserId);
    return {
      ...s,
      submitterUsername: submitter?.username || 'unknown'
    };
  });
  res.json(submissions);
});

// Create submission (optional file); ownerKey can be 'me' or explicit owner id
router.post('/:ownerKey/:taskId', upload.single('file'), (req, res) => {
  if (!authMiddleware(req, res)) return;
  const { ownerKey, taskId } = req.params;
  const ownerUserId = ownerKey === 'me' ? req.userId : ownerKey;
  const { type, details } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : undefined;

  // permission: if owner is not me, must be shared with me
  if (ownerUserId !== req.userId && !isSharedWith(ownerUserId, req.userId)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  // basic validation
  const validTypes = ['screenshot', 'link', 'log'];
  if (!validTypes.includes(type)) return res.status(400).json({ error: 'invalid type' });

  // ensure task exists under specified owner
  const tasks = getTasks(ownerUserId);
  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'task not found' });

  const created = addSubmission({
    ownerUserId,
    taskId,
    submitterUserId: req.userId,
    type,
    details,
    filePath,
  });
  const submitter = getUserById(created.submitterUserId);
  res.status(201).json({ ...created, submitterUsername: submitter?.username || 'unknown' });
});

export default router;

