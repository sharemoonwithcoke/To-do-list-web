import { useState } from 'react';
import "./LoginForm.css";

function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);
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
      const endpoint = isLogin ? '/sessions/login' : '/sessions/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '操作失败');
      }

      if (data.user) {
        onLogin(data.user);
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
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? '登录' : '注册'}</h2>
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
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>
        
        <div className="toggle-mode">
          <span>{isLogin ? '还没有账号？' : '已有账号？'}</span>
          <button type="button" onClick={toggleMode} className="toggle-btn">
            {isLogin ? '立即注册' : '立即登录'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

