// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import sessionRoutes from './src/routes/sessionRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(cookieParser());
app.use(express.static('dist'));

// CORS设置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 路由
app.use('/sessions', sessionRoutes);
app.use('/tasks', taskRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 处理所有其他请求，返回React应用
app.get('*', (req, res) => {
  res.sendFile('dist/index.html', { root: '.' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
