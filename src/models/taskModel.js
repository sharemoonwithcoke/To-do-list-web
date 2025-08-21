// taskModel.js

// 存储用户任务: { username: [{ id: string, title: string, completed: boolean, priority: string }] }
const tasks = {};

// 获取用户的所有任务
export function getTasks(username) {
  if (!username) return [];
  // 返回副本而不是直接引用，避免外部修改影响存储
  return [...(tasks[username] || [])];
}

// 保存单个任务（新增或更新）
export function saveTask(username, task) {
  if (!username || !task) {
    throw new Error('Username and task are required');
  }

  // 确保用户的任务数组存在
  if (!tasks[username]) {
    tasks[username] = [];
  }

  // 查找是否存在同ID的任务
  const existingTaskIndex = tasks[username].findIndex(t => t.id === task.id);

  if (existingTaskIndex !== -1) {
    // 更新现有任务
    tasks[username][existingTaskIndex] = {
      ...tasks[username][existingTaskIndex],
      ...task,
      id: tasks[username][existingTaskIndex].id // 确保ID不变
    };
    return tasks[username][existingTaskIndex];
  } else {
    // 添加新任务
    const newTask = {
      ...task,
      completed: task.completed ?? false // 确保新任务有completed属性
    };
    tasks[username].push(newTask);
    return newTask;
  }
}

// 删除任务
export function deleteTask(username, taskId) {
  if (!username || !taskId) {
    throw new Error('Username and taskId are required');
  }

  if (!tasks[username]) {
    return false;
  }

  const initialLength = tasks[username].length;
  tasks[username] = tasks[username].filter(task => task.id !== taskId);
  
  // 如果长度变化了，说明成功删除了任务
  return tasks[username].length !== initialLength;
}

// 检查任务是否存在
export function taskExists(username, taskId) {
  if (!username || !taskId) return false;
  return tasks[username]?.some(task => task.id === taskId) ?? false;
}

// 根据标题查找任务
export function findTaskByTitle(username, title) {
  if (!username || !title) return null;
  return tasks[username]?.find(task => task.title === title) ?? null;
}

// 清除用户的所有任务（用于测试）
export function clearTasks(username) {
  if (!username) return false;
  tasks[username] = [];
  return true;
}

// 获取任务总数
export function getTaskCount(username) {
  if (!username) return 0;
  return tasks[username]?.length ?? 0;
}

// 保存任务列表（谨慎使用，通常应该使用saveTask）
export function saveTasks(username, userTasks) {
  if (!username) {
    throw new Error('Username is required');
  }
  
  // 确保所有任务都有必要的属性
  tasks[username] = userTasks.map(task => ({
    ...task,
    completed: task.completed ?? false,
    id: task.id // 保持原有ID
  }));
  
  return [...tasks[username]]; // 返回副本
}

export function getUserStats(username) {
 const userTasks = getTasks(username);
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



