// src/models/sessionModel.js
const sessions = {};

export function createSession(sid, userId) {
  sessions[sid] = userId;
  return true;
}

export function getSession(sid) {
  return sessions[sid] || null;
}

export function deleteSession(sid) {
  delete sessions[sid];
}