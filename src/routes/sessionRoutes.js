// src/routes/sessionRoutes.js
import express from 'express';
import { login, logout } from '../controllers/sessionController.js';
import { validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/', (req, res) => {
  if (!validateLogin(req, res)) return;
  login(req, res);
});

router.delete('/', logout);

export default router;