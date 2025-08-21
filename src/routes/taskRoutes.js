// src/routes/taskRoutes.js
import express from 'express';
import { 
  createTask, 
  updateTaskHandler, 
  deleteTaskHandler,
  getStatsHandler,
  getRankingsHandler,
  completeTaskHandler,
  getSharedTasksHandler
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateTask, validateTaskUpdate, validateTaskCompletion } from '../middleware/validation.js';
import { getTasks } from '../models/taskModel.js';

const router = express.Router();

// 获取用户任务
router.get('/', (req, res) => {
  if (!authMiddleware(req, res)) return;
  const tasks = getTasks(req.username);
  res.json(tasks);
});

// 创建任务
router.post('/', (req, res) => {
  if (!authMiddleware(req, res)) return;
  if (!validateTask(req, res)) return;
  createTask(req, res);
});

// 更新任务
router.put('/:taskId', (req, res) => {
  if (!authMiddleware(req, res)) return;
  if (!validateTaskUpdate(req, res)) return;
  updateTaskHandler(req, res);
});

// 删除任务
router.delete('/:taskId', (req, res) => {
  if (!authMiddleware(req, res)) return;
  deleteTaskHandler(req, res);
});

// 完成任务
router.post('/:taskId/complete', (req, res) => {
  if (!authMiddleware(req, res)) return;
  if (!validateTaskCompletion(req, res)) return;
  completeTaskHandler(req, res);
});

// 获取分享的任务
router.get('/shared', (req, res) => {
  if (!authMiddleware(req, res)) return;
  getSharedTasksHandler(req, res);
});

// 获取统计信息
router.get('/stats', (req, res) => {
  if (!authMiddleware(req, res)) return;
  getStatsHandler(req, res);
});

// 获取排行榜
router.get('/rankings', (req, res) => {
  if (!authMiddleware(req, res)) return;
  getRankingsHandler(req, res);
});

export default router;