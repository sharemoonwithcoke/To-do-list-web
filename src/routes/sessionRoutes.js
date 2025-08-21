// src/routes/sessionRoutes.js
import express from 'express';
import { login, register, logout } from '../controllers/sessionController.js';
import { validateLogin, validateRegister } from '../middleware/validation.js';

const router = express.Router();

// 用户登录
router.post('/login', (req, res) => {
  if (!validateLogin(req, res)) return;
  login(req, res);
});

// 用户注册
router.post('/register', (req, res) => {
  if (!validateRegister(req, res)) return;
  register(req, res);
});

// 用户登出
router.delete('/logout', logout);

export default router;