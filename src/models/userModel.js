// userModel.js
import bcrypt from 'bcrypt';

// 存储用户数据: { username: { id: string, username: string, email: string, password: string } }
const users = {};

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 创建新用户
export function createUser(userData) {
  const { username, email, password } = userData;
  
  if (!username || !email || !password) {
    throw new Error('用户名、邮箱和密码都是必需的');
  }
  
  if (users[username]) {
    throw new Error('用户名已存在');
  }
  
  // 检查邮箱是否已被使用
  const existingUser = Object.values(users).find(user => user.email === email);
  if (existingUser) {
    throw new Error('邮箱已被使用');
  }
  
  // 加密密码
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const user = {
    id: generateId(),
    username,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  users[username] = user;
  return user;
}

// 根据用户名查找用户
export function findUser(username) {
  return users[username] || null;
}

// 根据邮箱查找用户
export function findUserByEmail(email) {
  return Object.values(users).find(user => user.email === email) || null;
}

// 验证密码
export function validatePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

// 获取所有用户（用于分享功能）
export function getAllUsers() {
  return Object.values(users).map(user => ({
    id: user.id,
    username: user.username,
    email: user.email
  }));
}

// 更新用户信息
export function updateUser(username, updates) {
  if (!users[username]) {
    throw new Error('用户不存在');
  }
  
  const user = users[username];
  
  // 只允许更新某些字段
  if (updates.email) {
    // 检查邮箱是否已被其他用户使用
    const existingUser = Object.values(users).find(u => 
      u.email === updates.email && u.username !== username
    );
    if (existingUser) {
      throw new Error('邮箱已被使用');
    }
    user.email = updates.email;
  }
  
  if (updates.password) {
    user.password = bcrypt.hashSync(updates.password, 10);
  }
  
  return user;
}

// 删除用户
export function deleteUser(username) {
  if (!users[username]) {
    return false;
  }
  
  delete users[username];
  return true;
}

// 获取用户统计信息
export function getUserCount() {
  return Object.keys(users).length;
}