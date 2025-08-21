// src/routes/sessionRoutes.js
import express from 'express';
import { login, logout, register } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/', login);

router.post('/register', register);

router.delete('/', logout);

export default router;