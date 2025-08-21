// src/routes/sessionRoutes.js
import express from 'express';
import { login, register, logout } from '../controllers/sessionController.js';
import { validateLogin, validateRegister } from '../middleware/validation.js';

const router = express.Router();

// 登录
router.post('/', (req, res) => {
  if (!validateLogin(req, res)) return;
  login(req, res);
});

// 注册
router.post('/register', (req, res) => {
  if (!validateRegister(req, res)) return;
  register(req, res);
});

// 登出
router.delete('/', logout);

export default router;