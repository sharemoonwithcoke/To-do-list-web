import { validateUsername } from '../utils/validators.js';  // 修正这里
import { handleError } from '../utils/handleError.js';

// src/middleware/validation.js
export function validateLogin(req, res) {
  const { username } = req.body;
  
  // 添加调试日志
  console.log('Validating username:', username);
  console.log('Validation result:', validateUsername(username));
  
  if (!validateUsername(username)) {
    handleError(res, 'invalidUsername');
    return false;
  }

  if (username === 'dog') {
    handleError(res, 'accessDenied');
    return false;
  }

  return true;
}

export function validateTask(req, res) {
  const { title } = req.body;
  
  if (!title) {
    handleError(res, 'invalidTask');
    return false;
  }

  return true;
}

export function validateTaskUpdate(req, res) {
  const { title } = req.body;
  
  if (!title) {
    handleError(res, 'invalidTask');
    return false;
  }

  return true;
}

