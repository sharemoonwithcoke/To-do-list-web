// 用户数据存储（在实际应用中应该使用数据库）
const users = new Map();

export function createUser(userData) {
  users.set(userData.username, userData);
  return userData;
}

export function findUserByUsername(username) {
  return users.get(username) || null;
}

export function findUserByEmail(email) {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

export function updateUser(username, updates) {
  const user = users.get(username);
  if (!user) {
    return null;
  }
  
  const updatedUser = { ...user, ...updates };
  users.set(username, updatedUser);
  return updatedUser;
}

export function deleteUser(username) {
  return users.delete(username);
}

export function getAllUsers() {
  return Array.from(users.values());
}