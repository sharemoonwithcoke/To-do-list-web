// services/taskService.js
import crypto from 'crypto';
import { getTasks, saveTask, deleteTask } from '../models/taskModel.js';

// 获取任务列表
export function fetchTasks(username) {
  if (!username) {
    throw new Error('Username is required');
  }
  // 确保返回的是任务数组的副本
  return getTasks(username);
}

// 添加新任务，确保不重复创建
export function addTask(username, taskData) {
  if (!username || !taskData) {
    throw new Error('Username and task data are required');
  }

  const tasks = getTasks(username);
  
  // 如果前端传入了ID，检查是否已存在该任务
  if (taskData.id && tasks.some(task => task.id === taskData.id)) {
    // 如果任务已存在，返回现有任务
    return tasks.find(task => task.id === taskData.id);
  }

  const newTask = {
    ...taskData,
    id: taskData.id || crypto.randomUUID(), // 如果没有ID才生成新ID
    completed: false
  };

  return saveTask(username, newTask);
}

// 更新任务，确保不创建重复任务
export function updateTask(username, taskId, updatedData) {
  if (!username || !taskId) {
    throw new Error('Username and taskId are required');
  }

  const tasks = getTasks(username);
  const existingTask = tasks.find(task => task.id === taskId);

  if (!existingTask) {
    // 如果任务不存在，返回 null 而不是创建新任务
    return null;
  }

  const updatedTask = {
    ...existingTask,
    ...updatedData,
    id: taskId // 保持原有ID不变
  };

  return saveTask(username, updatedTask);
}

// 删除任务
export function removeTask(username, taskId) {
  if (!username || !taskId) {
    throw new Error('Username and taskId are required');
  }
  
  return deleteTask(username, taskId);
}

// 移除 validateTaskData - 应该只在 validators.js 中存在
