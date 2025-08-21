import { validateUsername } from '../utils/validators.js';  // 修正这里
import { handleError } from '../utils/handleError.js';

// src/middleware/validation.js

// 验证登录
export function validateLogin(req, res) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    res.status(400).json({ error: '用户名和密码都是必需的' });
    return false;
  }
  
  if (username.length < 3 || username.length > 20) {
    res.status(400).json({ error: '用户名长度必须在3-20个字符之间' });
    return false;
  }
  
  if (password.length < 6) {
    res.status(400).json({ error: '密码长度至少6个字符' });
    return false;
  }
  
  return true;
}

// 验证注册
export function validateRegister(req, res) {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    res.status(400).json({ error: '用户名、邮箱和密码都是必需的' });
    return false;
  }
  
  if (username.length < 3 || username.length > 20) {
    res.status(400).json({ error: '用户名长度必须在3-20个字符之间' });
    return false;
  }
  
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: '请输入有效的邮箱地址' });
    return false;
  }
  
  if (password.length < 6) {
    res.status(400).json({ error: '密码长度至少6个字符' });
    return false;
  }
  
  return true;
}

// 验证任务
export function validateTask(req, res) {
  const { title, frequency } = req.body;
  
  if (!title || title.trim().length === 0) {
    res.status(400).json({ error: '任务标题不能为空' });
    return false;
  }
  
  if (title.length > 100) {
    res.status(400).json({ error: '任务标题不能超过100个字符' });
    return false;
  }
  
  const validFrequencies = ['once', 'daily', 'weekly', 'monthly'];
  if (frequency && !validFrequencies.includes(frequency)) {
    res.status(400).json({ error: '无效的任务频率' });
    return false;
  }
  
  return true;
}

// 验证任务更新
export function validateTaskUpdate(req, res) {
  const { title } = req.body;
  
  if (title !== undefined && (title.trim().length === 0 || title.length > 100)) {
    res.status(400).json({ error: '任务标题不能为空且不能超过100个字符' });
    return false;
  }
  
  return true;
}

// 验证任务提交
export function validateSubmission(req, res) {
  const { type, content } = req.body;
  
  if (!type) {
    res.status(400).json({ error: '提交类型是必需的' });
    return false;
  }
  
  const validTypes = ['text', 'link', 'file'];
  if (!validTypes.includes(type)) {
    res.status(400).json({ error: '无效的提交类型' });
    return false;
  }
  
  if (type === 'text' && (!content || content.trim().length === 0)) {
    res.status(400).json({ error: '文字描述不能为空' });
    return false;
  }
  
  if (type === 'link' && (!content || !content.startsWith('http'))) {
    res.status(400).json({ error: '请输入有效的链接' });
    return false;
  }
  
  return true;
}

