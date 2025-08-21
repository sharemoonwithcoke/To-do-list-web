// src/routes/taskRoutes.js
import express from 'express';
import { 
  createTask, 
  updateTaskHandler, 
  deleteTaskHandler,
  getStatsHandler,
  getRankingsHandler,
  submitTaskProofHandler,
  shareTaskHandler,
  getSharedViewsHandler
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateTask, validateTaskUpdate, validateSubmission } from '../middleware/validation.js';
import { getTasks } from '../models/taskModel.js';

const router = express.Router();

// 获取用户任务
router.get('/', (req, res) => {
  if (!authMiddleware(req, res)) return;
  const tasks = getTasks(req.username);
  res.json(tasks);
});

// 创建新任务
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

// 提交任务证明
router.post('/:taskId/submit', (req, res) => {
  if (!authMiddleware(req, res)) return;
  if (!validateSubmission(req, res)) return;
  submitTaskProofHandler(req, res);
});

// 分享整个任务视图
router.post('/share', (req, res) => {
  if (!authMiddleware(req, res)) return;
  shareTaskHandler(req, res);
});

// 获取分享的视图列表
router.get('/shared-views', (req, res) => {
  if (!authMiddleware(req, res)) return;
  getSharedViewsHandler(req, res);
});

// 获取统计数据
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