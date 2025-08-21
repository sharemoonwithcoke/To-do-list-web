// src/utils/validators.js
export function validateUsername(username) {
  const allowedUsernamePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/;
  return allowedUsernamePattern.test(username);
}

export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function validatePassword(password) {
  // 密码至少6位，包含字母和数字
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordPattern.test(password);
}

export function validateTaskFields(task) {
  const { title, category } = task;
  
  // 标题验证
  const titlePattern = /^[\w\s.,!?\-\u4e00-\u9fa5]{1,100}$/;
  if (!title || !titlePattern.test(title)) {
    return false;
  }
  
  // 类别验证
  const validCategories = ['study', 'work', 'life', 'other'];
  if (category && !validCategories.includes(category)) {
    return false;
  }

  return true;
}