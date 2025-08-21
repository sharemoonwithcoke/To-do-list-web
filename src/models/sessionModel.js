// 会话数据存储（在实际应用中应该使用数据库）
const sessions = new Map();

export function createSession(sid, username, authId) {
  const session = {
    sid,
    username,
    authId,
    createdAt: new Date().toISOString()
  };
  sessions.set(sid, session);
  return session;
}

export function getSession(sid) {
  return sessions.get(sid) || null;
}

export function deleteSession(sid) {
  return sessions.delete(sid);
}

export function getSessionByAuthId(authId) {
  for (const session of sessions.values()) {
    if (session.authId === authId) {
      return session;
    }
  }
  return null;
}

export function getAllSessions() {
  return Array.from(sessions.values());
}