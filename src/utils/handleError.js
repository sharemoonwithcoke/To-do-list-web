// src/utils/handleError.js
export function handleError(res, type) {
  const errors = {
    missingCredentials: {
      status: 400,
      message: '请提供用户名或邮箱'
    },
    missingPassword: {
      status: 400,
      message: '请输入密码'
    },
    missingFields: {
      status: 400,
      message: '请填写所有必填字段'
    },
    missingCompletionProof: {
      status: 400,
      message: '请至少提供一种完成证明（截图、链接或日志）'
    },
    invalidUsername: {
      status: 400,
      message: '用户名格式不正确（2-20位，支持中文、英文、数字、下划线）'
    },
    invalidEmail: {
      status: 400,
      message: '邮箱格式不正确'
    },
    invalidPassword: {
      status: 400,
      message: '密码至少6位，需包含字母和数字'
    },
    notLoggedIn: {
      status: 401,
      message: '请先登录'
    },
    accessDenied: {
      status: 403,
      message: '访问被拒绝'
    },
    invalidTask: {
      status: 400,
      message: '任务数据无效'
    },
    taskNotFound: {
      status: 404,
      message: '任务不存在'
    },
    serverError: {
      status: 500,
      message: '服务器错误'
    }
  };

  const error = errors[type] || errors.serverError;
  res.status(error.status).json({ error: error.message });
}