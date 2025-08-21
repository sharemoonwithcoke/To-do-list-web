// src/models/sessionModel.js
const sessions = {};

export function createSession(sid, username) {
  sessions[sid] = username;
  return true;
}

export function getSession(sid) {
  return sessions[sid] || null;
}

export function deleteSession(sid) {
  delete sessions[sid];
}