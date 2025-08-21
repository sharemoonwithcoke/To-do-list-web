// src/server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import sessionRoutes from './src/routes/sessionRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';

const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(cookieParser());
app.use(express.static('dist'));

// 路由
app.use('/sessions', sessionRoutes);
app.use('/tasks', taskRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
