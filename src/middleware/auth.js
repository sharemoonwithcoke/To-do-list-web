// src/middleware/auth.js
import { getSession, getSessionByAuthId } from '../models/sessionModel.js';
import { handleError } from '../utils/handleError.js';

export function authMiddleware(req, res) {
  // 首先尝试从cookie获取session
  const sid = req.cookies.sid;
  let session = sid ? getSession(sid) : null;
  
  // 如果没有session，尝试从Authorization header获取authId
  if (!session) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const authId = authHeader.substring(7);
      session = getSessionByAuthId(authId);
    }
  }
  
  if (!session) {
    handleError(res, 'notLoggedIn');
    return false;
  }
  
  req.username = session.username;
  req.authId = session.authId;
  return true;
}
