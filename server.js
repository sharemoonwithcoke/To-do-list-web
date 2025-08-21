// src/server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import sessionRoutes from './src/routes/sessionRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import shareRoutes from './src/routes/shareRoutes.js';
import submissionRoutes from './src/routes/submissionRoutes.js';

const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(cookieParser());
app.use(express.static('dist'));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 路由
app.use('/sessions', sessionRoutes);
app.use('/tasks', taskRoutes);
app.use('/shares', shareRoutes);
app.use('/submissions', submissionRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
