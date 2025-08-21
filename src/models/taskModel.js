// taskModel.js

// 存储用户任务: { username: [{ id: string, title: string, completed: boolean, priority: string, date: string, frequency: string, requiresSubmission: boolean, sharedWith: string, completionHistory: [] }] }
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
      completed: task.completed ?? false,
      completionHistory: task.completionHistory || [],
      createdAt: new Date().toISOString()
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

// 完成任务
export function completeTask(username, taskId, completionData) {
  if (!username || !taskId) {
    throw new Error('Username and taskId are required');
  }

  const task = tasks[username]?.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  // 添加完成记录到历史
  const completionRecord = {
    id: Date.now().toString(),
    completedBy: completionData.completedBy,
    completedAt: completionData.completedAt,
    screenshot: completionData.screenshot,
    link: completionData.link,
    log: completionData.log,
    notes: completionData.notes
  };

  task.completionHistory = task.completionHistory || [];
  task.completionHistory.push(completionRecord);
  
  // 更新任务状态
  task.completed = true;
  task.completedBy = completionData.completedBy;
  task.completedAt = completionData.completedAt;

  return task;
}

// 获取分享的任务
export function getSharedTasks(username) {
  if (!username) return [];
  
  const sharedTasks = [];
  
  // 查找分享给当前用户的任务
  for (const [ownerUsername, userTasks] of Object.entries(tasks)) {
    if (ownerUsername === username) continue;
    
    const sharedUserTasks = userTasks.filter(task => 
      task.sharedWith === username && task.requiresSubmission
    );
    
    sharedTasks.push(...sharedUserTasks.map(task => ({
      ...task,
      owner: ownerUsername
    })));
  }
  
  return sharedTasks;
}

// 获取任务完成历史
export function getTaskCompletionHistory(username, taskId) {
  if (!username || !taskId) return [];
  
  const task = tasks[username]?.find(t => t.id === taskId);
  return task?.completionHistory || [];
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
    completionHistory: task.completionHistory || [],
    id: task.id // 保持原有ID
  }));
  
  return [...tasks[username]]; // 返回副本
}

export function getUserStats(username) {
  const userTasks = getTasks(username);
  return {
    inProgress: userTasks.filter(task => !task.completed).length,
    completed: userTasks.filter(task => task.completed).length,
    total: userTasks.length
  };
}

export function getRankings() {
  return Object.entries(tasks).map(([username, userTasks]) => ({
    username,
    completedCount: userTasks.filter(task => task.completed).length,
    totalCount: userTasks.length
  })).sort((a, b) => b.completedCount - a.completedCount);
}



