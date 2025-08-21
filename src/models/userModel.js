// src/models/userModel.js
import crypto from 'crypto';

// In-memory user store: { userId: { id, username, email, passwordHash, createdAt } }
const usersById = {};
const userIdByUsername = {};
const userIdByEmail = {};

export function createUser({ username, email, passwordHash }) {
  const userId = crypto.randomUUID();
  const userRecord = {
    id: userId,
    username,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  usersById[userId] = userRecord;
  userIdByUsername[username.toLowerCase()] = userId;
  userIdByEmail[email.toLowerCase()] = userId;
  return { ...userRecord };
}

export function getUserById(userId) {
  const user = usersById[userId];
  return user ? { ...user } : null;
}

export function getUserByUsername(username) {
  if (!username) return null;
  const userId = userIdByUsername[username.toLowerCase()];
  return userId ? getUserById(userId) : null;
}

export function getUserByEmail(email) {
  if (!email) return null;
  const userId = userIdByEmail[email.toLowerCase()];
  return userId ? getUserById(userId) : null;
}

export function userExistsByUsername(username) {
  return !!getUserByUsername(username);
}

export function userExistsByEmail(email) {
  return !!getUserByEmail(email);
}

export function listAllUsers() {
  return Object.values(usersById).map(u => ({ id: u.id, username: u.username, email: u.email }));
}

