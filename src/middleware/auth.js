// src/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function authMiddleware(req, res) {
  try {
    // 从Authorization header获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未提供认证token' });
    }
    
    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
    
    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 将用户信息添加到请求对象
    req.username = decoded.username;
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    
    return true;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: '无效的token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'token已过期' });
    } else {
      return res.status(500).json({ error: '认证失败' });
    }
  }
}
