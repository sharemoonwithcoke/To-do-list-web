// src/routes/taskRoutes.js
import express from 'express';
import { 
  createTask, 
  updateTaskHandler, 
  deleteTaskHandler,
  getStatsHandler,
  getRankingsHandler 
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateTask, validateTaskUpdate } from '../middleware/validation.js';
import { getTasks } from '../models/taskModel.js';
import { listOwnersThatSharedWith } from '../models/shareModel.js';

const router = express.Router();

router.get('/', (req, res) => {
  if (!authMiddleware(req, res)) return;
  const tasks = getTasks(req.userId);
  res.json(tasks);
});

// tasks shared with me
router.get('/shared-with-me', (req, res) => {
  if (!authMiddleware(req, res)) return;
  const owners = listOwnersThatSharedWith(req.userId);
  const all = owners.flatMap(ownerId => getTasks(ownerId).map(t => ({ ...t, ownerUserId: ownerId })));
  res.json(all);
});

router.post('/', (req, res) => {
  if (!authMiddleware(req, res)) return;
  if (!validateTask(req, res)) return;
  createTask(req, res);
});

router.put('/:taskId', (req, res) => {
  if (!authMiddleware(req, res)) return;
  if (!validateTaskUpdate(req, res)) return;
  updateTaskHandler(req, res);
});

router.delete('/:taskId', (req, res) => {
  if (!authMiddleware(req, res)) return;
  deleteTaskHandler(req, res);
});

router.get('/stats', (req, res) => {
  if (!authMiddleware(req, res)) return;
  getStatsHandler(req, res);
});

router.get('/rankings', (req, res) => {
  if (!authMiddleware(req, res)) return;
  getRankingsHandler(req, res);
});

export default router;