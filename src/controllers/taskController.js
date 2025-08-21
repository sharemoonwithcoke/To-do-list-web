// src/controllers/taskController.js
import { addTask, updateTask, removeTask } from '../services/taskService.js';
import { completeTask, getSharedTasks, getTaskCompletionHistory } from '../models/taskModel.js';
import { handleError } from '../utils/handleError.js';
import { getUserStats as getStats, getRankings as getRankingsList } from '../models/taskModel.js';
import { v4 as uuidv4 } from 'uuid';

export function createTask(req, res) {
  try {
    const taskData = {
      ...req.body,
      id: uuidv4(),
      date: req.body.date || new Date().toISOString().split('T')[0]
    };
    
    const task = addTask(req.username, taskData);
    if (!task) {
      handleError(res, 'invalidTask');
      return;
    }
    res.status(201).json(task);
  } catch (error) {
    handleError(res, 'serverError');
  }
}

export function updateTaskHandler(req, res) {
  try {
    const updatedTask = updateTask(req.username, req.params.taskId, req.body);
    if (!updatedTask) {
      handleError(res, 'taskNotFound');
      return;
    }
    res.json(updatedTask);
  } catch (error) {
    handleError(res, 'serverError');
  }
}

export function deleteTaskHandler(req, res) {
  try {
    const success = removeTask(req.username, req.params.taskId);
    if (!success) {
      handleError(res, 'taskNotFound');
      return;
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, 'serverError');
  }
}

export function completeTaskHandler(req, res) {
  try {
    const { taskId } = req.params;
    const completionData = req.body;
    
    // 验证完成数据
    if (!completionData.completedBy) {
      handleError(res, 'invalidTask');
      return;
    }
    
    const completedTask = completeTask(req.username, taskId, completionData);
    if (!completedTask) {
      handleError(res, 'taskNotFound');
      return;
    }
    
    res.json(completedTask);
  } catch (error) {
    handleError(res, 'serverError');
  }
}

export function getSharedTasksHandler(req, res) {
  try {
    const sharedTasks = getSharedTasks(req.username);
    res.json(sharedTasks);
  } catch (error) {
    handleError(res, 'serverError');
  }
}

export function getTaskCompletionHistoryHandler(req, res) {
  try {
    const { taskId } = req.params;
    const history = getTaskCompletionHistory(req.username, taskId);
    res.json(history);
  } catch (error) {
    handleError(res, 'serverError');
  }
}

export function getStatsHandler(req, res) {
  try {
    const stats = getStats(req.username);
    if (!stats) {
      handleError(res, 'serverError');
      return;
    }
    res.json(stats);
  } catch (error) {
    handleError(res, 'serverError');
  }
}

export function getRankingsHandler(req, res) {
  try {
    const rankings = getRankingsList();
    if (!rankings) {
      handleError(res, 'serverError');
      return;
    }
    res.json(rankings);
  } catch (error) {
    handleError(res, 'serverError');
  }
}
