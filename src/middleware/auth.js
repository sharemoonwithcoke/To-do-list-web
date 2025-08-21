// src/middleware/auth.js
import { getSession } from '../models/sessionModel.js';
import { handleError } from '../utils/handleError.js';
import { getUserById } from '../models/userModel.js';

export function authMiddleware(req, res) {
  const sid = req.cookies.sid;
  const userId = getSession(sid);
  if (!userId) {
    handleError(res, 'notLoggedIn');
    return false;
  }
  const user = getUserById(userId);
  if (!user) {
    handleError(res, 'notLoggedIn');
    return false;
  }
  req.user = user;
  req.userId = user.id;
  req.username = user.username;
  return true;
}
