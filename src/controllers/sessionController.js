// src/controllers/sessionController.js
import { createUser, findUser, validatePassword } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 生成JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function login(req, res) {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = findUser(username);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 验证密码
    if (!validatePassword(password, user.password)) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 生成token
    const token = generateToken(user);
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: '登录失败' });
  }
}

export function register(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // 检查用户是否已存在
    const existingUser = findUser(username);
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' });
    }
    
    // 创建新用户
    const user = createUser({ username, email, password });
    
    // 生成token
    const token = generateToken(user);
    
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: '注册失败' });
  }
}

export function logout(req, res) {
  // 由于使用JWT，客户端只需要删除token即可
  res.json({ message: '登出成功' });
}