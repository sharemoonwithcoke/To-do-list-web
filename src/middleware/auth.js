// src/middleware/auth.js
import { getSession } from '../models/sessionModel.js';
import { handleError } from '../utils/handleError.js';

export function authMiddleware(req, res) {
  const sid = req.cookies.sid;
  const username = getSession(sid);
  
  if (!username) {
    handleError(res, 'notLoggedIn');
    return false;
  }
  
  req.username = username;
  return true;
}
