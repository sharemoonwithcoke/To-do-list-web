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

const router = express.Router();

router.get('/', (req, res) => {
  if (!authMiddleware(req, res)) return;
  const tasks = getTasks(req.username);
  res.json(tasks);
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