// src/controllers/taskController.js
import { 
  saveTask, 
  deleteTask, 
  taskExists,
  submitTaskProof,
  shareTask,
  getUserStats,
  getRankings
} from '../models/taskModel.js';

export function createTask(req, res) {
  try {
    const task = saveTask(req.username, req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function updateTaskHandler(req, res) {
  try {
    const { taskId } = req.params;
    if (!taskExists(req.username, taskId)) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    const updatedTask = saveTask(req.username, { ...req.body, id: taskId });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function deleteTaskHandler(req, res) {
  try {
    const { taskId } = req.params;
    const success = deleteTask(req.username, taskId);
    
    if (!success) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function submitTaskProofHandler(req, res) {
  try {
    const { taskId } = req.params;
    const { type, content, file } = req.body;
    
    if (!taskExists(req.username, taskId)) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    const submission = { type, content, file };
    const updatedTask = submitTaskProof(req.username, taskId, submission);
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function shareTaskHandler(req, res) {
  try {
    const { taskId } = req.params;
    const { toUsername } = req.body;
    
    if (!taskExists(req.username, taskId)) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    if (!toUsername) {
      return res.status(400).json({ error: '请指定分享给的用户' });
    }
    
    const sharedTask = shareTask(req.username, toUsername, taskId);
    res.json({ 
      message: '任务分享成功',
      sharedTask 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function getStatsHandler(req, res) {
  try {
    const stats = getUserStats(req.username);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export function getRankingsHandler(req, res) {
  try {
    const rankings = getRankings();
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
