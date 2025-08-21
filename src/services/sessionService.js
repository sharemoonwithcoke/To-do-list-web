// src/services/sessionService.js
import { createSession, getSession, deleteSession } from '../models/sessionModel.js';
import { createUser, findUserByUsername, findUserByEmail } from '../models/userModel.js';
import crypto from 'crypto';

export function startSession(username, authId) {
  const sid = crypto.randomUUID();
  createSession(sid, username, authId);
  return sid;
}

export function getSessionUser(sid) {
  return getSession(sid);
}

export function endSession(sid) {
  deleteSession(sid);
}

export function registerUser(username, email, password) {
  // 检查用户名是否已存在
  if (findUserByUsername(username)) {
    return null;
  }
  
  // 检查邮箱是否已存在
  if (findUserByEmail(email)) {
    return null;
  }
  
  // 创建新用户
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  const newUser = {
    username,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  // 保存用户
  createUser(newUser);
  
  return newUser;
}

export function authenticateUser(username, email, password) {
  // 尝试通过用户名查找
  let user = findUserByUsername(username);
  
  // 如果通过用户名没找到，尝试通过邮箱查找
  if (!user && email) {
    user = findUserByEmail(email);
  }
  
  if (!user) {
    return null;
  }
  
  // 验证密码
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  if (user.password !== hashedPassword) {
    return null;
  }
  
  return user;
}