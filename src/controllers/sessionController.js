// src/controllers/sessionController.js
import { startSession, endSession, registerUser, authenticateUser } from '../services/sessionService.js';
import { v4 as uuidv4 } from 'uuid';

export function login(req, res) {
  const { username, email, password } = req.body;
  
  try {
    const user = authenticateUser(username, email, password);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    const authId = uuidv4();
    const sid = startSession(username, authId);
    
    res.cookie('sid', sid, { httpOnly: true });
    res.json({ 
      username: user.username,
      email: user.email,
      authId: authId
    });
  } catch (error) {
    res.status(500).json({ error: '登录失败' });
  }
}

export function register(req, res) {
  const { username, email, password } = req.body;
  
  try {
    const newUser = registerUser(username, email, password);
    if (!newUser) {
      return res.status(400).json({ error: '用户名或邮箱已存在' });
    }
    
    const authId = uuidv4();
    const sid = startSession(username, authId);
    
    res.cookie('sid', sid, { httpOnly: true });
    res.status(201).json({ 
      username: newUser.username,
      email: newUser.email,
      authId: authId
    });
  } catch (error) {
    res.status(500).json({ error: '注册失败' });
  }
}

export function logout(req, res) {
  const sid = req.cookies.sid;
  endSession(sid);
  res.clearCookie('sid');
  res.json({ message: '已登出' });
}