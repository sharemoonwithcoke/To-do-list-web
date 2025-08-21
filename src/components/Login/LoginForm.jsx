import { useState } from 'react';
import "./LoginForm.css";


function LoginForm({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'register') {
      fetch('/sessions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
        .then((res) => {
          if (!res.ok) return res.json().then(err => { throw new Error(err.error || 'Register failed'); });
          return res.json();
        })
        .then((data) => {
          if (data.username) {
            onLogin(data.username);
          } else {
            throw new Error('Register failed');
          }
        })
        .catch((err) => alert(err.message));
    } else {
      fetch('/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: username || email, password }),
      })
        .then((res) => {
          if (!res.ok) return res.json().then(err => { throw new Error(err.error || 'Login failed'); });
          return res.json();
        })
        .then((data) => {
          if (data.username) {
            onLogin(data.username);
          } else {
            throw new Error('Login failed');
          }
        })
        .catch((err) => alert(err.message));
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      <label>
        <div className="set-username">Username</div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={mode === 'login' ? 'Username (or fill Email below)' : 'Username'}
          required={mode === 'register'}
        />
      </label>
      <label>
        <div className="set-username">Email</div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={mode === 'login' ? 'Email (or fill Username above)' : 'Email'}
          required={mode === 'register'}
        />
      </label>
      <label>
        <div className="set-username">Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button type="submit">{mode === 'register' ? 'Create Account' : 'Login'}</button>
        <button type="button" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>
          Switch to {mode === 'register' ? 'Login' : 'Register'}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;

