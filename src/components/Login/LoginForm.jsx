import { useState } from 'react';
import "./LoginForm.css";

function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isRegistering ? '/sessions/register' : '/sessions';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '操作失败');
      }

      const data = await response.json();
      if (data.username && data.authId) {
        onLogin(data.username, data.authId);
      } else {
        throw new Error('登录失败');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? '注册账户' : '登录'}</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="请输入用户名"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="请输入邮箱"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="请输入密码"
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '处理中...' : (isRegistering ? '注册' : '登录')}
          </button>
        </form>
        
        <div className="toggle-mode">
          <button 
            type="button" 
            className="toggle-btn"
            onClick={toggleMode}
          >
            {isRegistering ? '已有账户？点击登录' : '没有账户？点击注册'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

