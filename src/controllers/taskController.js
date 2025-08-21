// src/controllers/taskController.js
import { addTask, updateTask, removeTask } from '../services/taskService.js';
import { handleError } from '../utils/handleError.js';
import { getUserStats as getStats, getRankings as getRankingsList } from '../models/taskModel.js';

export function createTask(req, res) {
  const task = addTask(req.username, req.body);
  if (!task) {
    handleError(res, 'invalidTask');
    return;
  }
  res.status(201).json(task);
}

export function updateTaskHandler(req, res) {
  const updatedTask = updateTask(req.username, req.params.taskId, req.body);
  if (!updatedTask) {
    handleError(res, 'taskNotFound');
    return;
  }
  res.json(updatedTask);
}

export function deleteTaskHandler(req, res) {
  const success = removeTask(req.username, req.params.taskId);
  if (!success) {
    handleError(res, 'taskNotFound');
    return;
  }
  res.status(204).send();
}

export function getStatsHandler(req, res) {
  const stats = getStats(req.username);
  if (!stats) {
    handleError(res, 'serverError');
    return;
  }
  res.json(stats);
}

export function getRankingsHandler(req, res) {
  const rankings = getRankingsList();
  if (!rankings) {
    handleError(res, 'serverError');
    return;
  }
  res.json(rankings);
}
