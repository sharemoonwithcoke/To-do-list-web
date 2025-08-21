import { useState } from 'react';
import "./LoginForm.css";


function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
// LoginForm.jsx
const handleSubmit = (e) => {
  e.preventDefault();
  
  fetch('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || 'Login failed'); 
        });
      }
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
};

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        <div className="set-username">Username:</div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;

