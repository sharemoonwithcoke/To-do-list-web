// taskModel.js

// 存储用户任务: { username: [{ id: string, title: string, description: string, frequency: string, completed: boolean, submissions: array }] }
const tasks = {};

// 存储任务视图分享: { fromUsername: { toUsername: { sharedAt: date, viewId: string } } }
const sharedViews = {};

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

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

  // 如果是新任务，生成ID
  if (!task.id) {
    task.id = generateId();
    task.createdAt = new Date().toISOString();
    task.submissions = task.submissions || [];
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
      submissions: task.submissions || []
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

// 提交任务证明
export function submitTaskProof(username, taskId, submission) {
  if (!username || !taskId || !submission) {
    throw new Error('Username, taskId and submission are required');
  }

  const task = tasks[username]?.find(t => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  const newSubmission = {
    id: generateId(),
    type: submission.type,
    content: submission.content,
    file: submission.file,
    date: new Date().toISOString(),
    submittedBy: username
  };

  task.submissions = task.submissions || [];
  task.submissions.push(newSubmission);

  return task;
}

// 分享整个任务视图给其他用户
export function shareTaskView(fromUsername, toUsername) {
  if (!fromUsername || !toUsername) {
    throw new Error('FromUsername and toUsername are required');
  }

  // 检查源用户是否有任务
  const sourceTasks = getTasks(fromUsername);
  if (sourceTasks.length === 0) {
    throw new Error('没有任务可以分享');
  }

  // 检查目标用户是否存在
  if (!tasks[toUsername]) {
    tasks[toUsername] = [];
  }

  // 创建分享记录
  if (!sharedViews[fromUsername]) {
    sharedViews[fromUsername] = {};
  }

  const viewId = generateId();
  sharedViews[fromUsername][toUsername] = {
    sharedAt: new Date().toISOString(),
    viewId: viewId
  };

  // 复制所有任务到目标用户（作为共享任务）
  const sharedTasks = sourceTasks.map(task => ({
    ...task,
    id: generateId(), // 生成新的ID
    sharedFrom: fromUsername,
    sharedAt: new Date().toISOString(),
    viewId: viewId,
    submissions: [] // 重置提交历史
  }));

  // 将共享任务添加到目标用户
  tasks[toUsername].push(...sharedTasks);

  return {
    viewId: viewId,
    sharedTasks: sharedTasks,
    sharedAt: new Date().toISOString()
  };
}

// 获取共享的任务视图
export function getSharedTaskView(username, viewId) {
  if (!username || !viewId) return [];
  
  return tasks[username]?.filter(task => task.viewId === viewId) || [];
}

// 获取用户分享的视图列表
export function getSharedViews(username) {
  if (!username) return [];
  
  const userSharedViews = sharedViews[username] || {};
  return Object.entries(userSharedViews).map(([toUsername, viewData]) => ({
    toUsername,
    viewId: viewData.viewId,
    sharedAt: viewData.sharedAt
  }));
}

// 获取指定日期的任务
export function getTasksForDate(username, date) {
  if (!username || !date) return [];
  
  const userTasks = getTasks(username);
  const dateStr = date.toISOString().split('T')[0];
  
  return userTasks.filter(task => {
    if (task.frequency === 'daily') return true;
    if (task.frequency === 'weekly') {
      const taskDate = new Date(task.startDate);
      const daysDiff = Math.floor((date - taskDate) / (1000 * 60 * 60 * 24));
      return daysDiff % 7 === 0;
    }
    if (task.frequency === 'monthly') {
      return date.getDate() === new Date(task.startDate).getDate();
    }
    // 一次性任务
    return task.dueDate === dateStr;
  });
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
    submissions: task.submissions || [],
    id: task.id || generateId()
  }));
  
  return [...tasks[username]]; // 返回副本
}

export function getUserStats(username) {
  const userTasks = getTasks(username);
  const completedTasks = userTasks.filter(task => task.completed);
  const pendingTasks = userTasks.filter(task => !task.completed);
  const tasksWithSubmissions = userTasks.filter(task => task.requiresSubmission);
  
  return {
    total: userTasks.length,
    completed: completedTasks.length,
    pending: pendingTasks.length,
    requiresSubmission: tasksWithSubmissions.length,
    completionRate: userTasks.length > 0 ? (completedTasks.length / userTasks.length * 100).toFixed(1) : 0
  };
}

export function getRankings() {
  return Object.entries(tasks).map(([username, userTasks]) => {
    const stats = getUserStats(username);
    return {
      username,
      totalTasks: stats.total,
      completedTasks: stats.completed,
      completionRate: stats.completionRate
    };
  }).sort((a, b) => b.completedTasks - a.completedTasks);
}

// 获取所有用户（用于分享功能）
export function getAllUsers() {
  return Object.keys(tasks);
}



