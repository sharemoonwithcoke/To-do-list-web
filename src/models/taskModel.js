// taskModel.js

// 存储用户任务: { userId: [{ id, title, description, completed, priority, category, schedule, ownerUserId }] }
const tasks = {};

// 获取用户的所有任务
export function getTasks(userId) {
  if (!userId) return [];
  // 返回副本而不是直接引用，避免外部修改影响存储
  return [...(tasks[userId] || [])];
}

// 保存单个任务（新增或更新）
export function saveTask(userId, task) {
  if (!userId || !task) {
    throw new Error('Username and task are required');
  }

  // 确保用户的任务数组存在
  if (!tasks[userId]) {
    tasks[userId] = [];
  }

  // 查找是否存在同ID的任务
  const existingTaskIndex = tasks[userId].findIndex(t => t.id === task.id);

  if (existingTaskIndex !== -1) {
    // 更新现有任务
    tasks[userId][existingTaskIndex] = {
      ...tasks[userId][existingTaskIndex],
      ...task,
      id: tasks[userId][existingTaskIndex].id // 确保ID不变
    };
    return tasks[userId][existingTaskIndex];
  } else {
    // 添加新任务
    const newTask = {
      ...task,
      completed: task.completed ?? false // 确保新任务有completed属性
    };
    tasks[userId].push(newTask);
    return newTask;
  }
}

// 删除任务
export function deleteTask(userId, taskId) {
  if (!userId || !taskId) {
    throw new Error('Username and taskId are required');
  }

  if (!tasks[userId]) {
    return false;
  }

  const initialLength = tasks[userId].length;
  tasks[userId] = tasks[userId].filter(task => task.id !== taskId);
  
  // 如果长度变化了，说明成功删除了任务
  return tasks[userId].length !== initialLength;
}

// 检查任务是否存在
export function taskExists(userId, taskId) {
  if (!userId || !taskId) return false;
  return tasks[userId]?.some(task => task.id === taskId) ?? false;
}

// 根据标题查找任务
export function findTaskByTitle(userId, title) {
  if (!userId || !title) return null;
  return tasks[userId]?.find(task => task.title === title) ?? null;
}

// 清除用户的所有任务（用于测试）
export function clearTasks(userId) {
  if (!userId) return false;
  tasks[userId] = [];
  return true;
}

// 获取任务总数
export function getTaskCount(userId) {
  if (!userId) return 0;
  return tasks[userId]?.length ?? 0;
}

// 保存任务列表（谨慎使用，通常应该使用saveTask）
export function saveTasks(userId, userTasks) {
  if (!userId) {
    throw new Error('Username is required');
  }
  
  // 确保所有任务都有必要的属性
  tasks[userId] = userTasks.map(task => ({
    ...task,
    completed: task.completed ?? false,
    id: task.id // 保持原有ID
  }));
  
  return [...tasks[userId]]; // 返回副本
}

export function getUserStats(userId) {
 const userTasks = getTasks(userId);
 return {
   inProgress: userTasks.filter(task => !task.completed).length,
   completed: userTasks.filter(task => task.completed).length
 };
}

export function getRankings() {
 return Object.entries(tasks).map(([username, userTasks]) => ({
   username,
   completedCount: userTasks.filter(task => task.completed).length
 })).sort((a, b) => b.completedCount - a.completedCount);
}



