import { validateUsername, validateEmail, validatePassword } from '../utils/validators.js';
import { handleError } from '../utils/handleError.js';

export function validateLogin(req, res) {
  const { username, email, password } = req.body;
  
  if (!username && !email) {
    handleError(res, 'missingCredentials');
    return false;
  }
  
  if (!password) {
    handleError(res, 'missingPassword');
    return false;
  }
  
  if (username && !validateUsername(username)) {
    handleError(res, 'invalidUsername');
    return false;
  }
  
  if (email && !validateEmail(email)) {
    handleError(res, 'invalidEmail');
    return false;
  }

  return true;
}

export function validateRegister(req, res) {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    handleError(res, 'missingFields');
    return false;
  }
  
  if (!validateUsername(username)) {
    handleError(res, 'invalidUsername');
    return false;
  }
  
  if (!validateEmail(email)) {
    handleError(res, 'invalidEmail');
    return false;
  }
  
  if (!validatePassword(password)) {
    handleError(res, 'invalidPassword');
    return false;
  }

  return true;
}

export function validateTask(req, res) {
  const { title } = req.body;
  
  if (!title || !title.trim()) {
    handleError(res, 'invalidTask');
    return false;
  }

  return true;
}

export function validateTaskUpdate(req, res) {
  const { title } = req.body;
  
  if (!title || !title.trim()) {
    handleError(res, 'invalidTask');
    return false;
  }

  return true;
}

export function validateTaskCompletion(req, res) {
  const { completedBy, screenshot, link, log } = req.body;
  
  if (!completedBy) {
    handleError(res, 'missingFields');
    return false;
  }
  
  // 至少需要提供一种完成证明
  if (!screenshot && !link && !log) {
    handleError(res, 'missingCompletionProof');
    return false;
  }

  return true;
}

