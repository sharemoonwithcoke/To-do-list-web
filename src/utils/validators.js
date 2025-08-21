// src/utils/validators.js
export function validateUsername(username) {
  const allowedUsernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
  return allowedUsernamePattern.test(username);
}



export function validateTaskFields(task) {
  const { title, category } = task;
  
  // 标题验证
  const titlePattern = /^[\w\s.,!?-]{1,50}$/;
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