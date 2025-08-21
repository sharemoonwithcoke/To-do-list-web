import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function AddTaskPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [weeklyDays, setWeeklyDays] = useState([])
  const [error, setError] = useState('')

  const toggleDay = (d) => {
    setWeeklyDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { title, frequency }
      if (frequency === 'weekly') payload.weeklyDays = weeklyDays
      await api.post('/tasks', payload)
      navigate('/')
    } catch (e) {
      setError(e.message || '创建失败')
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
      <h2>添加任务</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>任务标题</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>任务频率</label>
          <select value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option value="daily">每天</option>
            <option value="weekly">每周</option>
            <option value="monthly">每月</option>
          </select>
        </div>
        {frequency === 'weekly' && (
          <div style={{ marginBottom: 12 }}>
            <label>选择每周几</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              {['日','一','二','三','四','五','六'].map((w, i) => (
                <button type="button" key={i} onClick={() => toggleDay(i)}
                  style={{ padding: '6px 10px', border: '1px solid #ddd', background: weeklyDays.includes(i) ? '#bae7ff' : 'white' }}>
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button type="submit">保存</button>
      </form>
    </div>
  )
}

