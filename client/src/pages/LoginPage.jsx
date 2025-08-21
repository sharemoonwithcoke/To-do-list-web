import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        const res = await api.post('/auth/register', { username, email, password })
        api.setToken(res.token)
      } else {
        const res = await api.post('/auth/login', { email, password })
        api.setToken(res.token)
      }
      navigate('/')
    } catch (err) {
      setError(err.message || '请求失败')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 20 }}>
      <h2>{mode === 'register' ? '注册' : '登录'}</h2>
      <form onSubmit={onSubmit}>
        {mode === 'register' && (
          <div style={{ marginBottom: 12 }}>
            <label>用户名</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <label>邮箱</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>密码</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          {mode === 'register' ? '注册' : '登录'}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        {mode === 'register' ? (
          <button onClick={() => setMode('login')}>已有账号？去登录</button>
        ) : (
          <button onClick={() => setMode('register')}>没有账号？去注册</button>
        )}
      </div>
    </div>
  )
}

