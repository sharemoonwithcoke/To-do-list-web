// src/utils/handleError.js
export function handleError(res, type) {
  const errors = {
    invalidUsername: {
      status: 400,
      message: 'Invalid username'
    },
    notLoggedIn: {
      status: 401,
      message: 'Not logged in'
    },
    accessDenied: {
      status: 403,
      message: 'Access denied'
    },
    invalidTask: {
      status: 400,
      message: 'Invalid task data'
    },
    taskNotFound: {
      status: 404,
      message: 'Task not found'
    },
    serverError: {
      status: 500,
      message: 'Server error'
    },
    userNotFound: {
      status: 404,
      message: 'User not found'
    }
  };

  const error = errors[type] || errors.serverError;
  res.status(error.status).json({ error: error.message });
}