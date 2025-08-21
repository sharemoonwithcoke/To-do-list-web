import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { api } from '../services/api'

function useAuthGuard() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])
}

function Calendar({ selectedDate, onSelectDate }) {
  const startOfMonth = dayjs(selectedDate).startOf('month')
  const endOfMonth = dayjs(selectedDate).endOf('month')
  const startGrid = startOfMonth.startOf('week')
  const endGrid = endOfMonth.endOf('week')
  const days = []
  let d = startGrid
  while (d.isBefore(endGrid) || d.isSame(endGrid, 'day')) {
    days.push(d)
    d = d.add(1, 'day')
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={() => onSelectDate(dayjs(selectedDate).subtract(1, 'month'))}>{'<'}</button>
        <strong>{dayjs(selectedDate).format('YYYY年MM月')}</strong>
        <button onClick={() => onSelectDate(dayjs(selectedDate).add(1, 'month'))}>{'>'}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {['日','一','二','三','四','五','六'].map(w => (
          <div key={w} style={{ textAlign: 'center', fontWeight: 'bold' }}>{w}</div>
        ))}
        {days.map((d) => {
          const isOther = d.month() !== startOfMonth.month()
          const isToday = d.isSame(dayjs(), 'day')
          return (
            <button
              key={d.format('YYYY-MM-DD')}
              onClick={() => onSelectDate(d)}
              style={{ padding: 10, border: '1px solid #ddd', background: isToday ? '#e6fffb' : isOther ? '#fafafa' : 'white' }}
            >
              {d.date()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function HomePage() {
  useAuthGuard()
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [data, setData] = useState({ tasks: [], submissions: [] })
  const ymd = useMemo(() => dayjs(selectedDate).format('YYYY-MM-DD'), [selectedDate])

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/tasks?date=${ymd}`)
        setData({ tasks: res.tasks || [], submissions: res.submissions || [] })
      } catch (e) {
        // ignore; auth guard will redirect
      }
    })()
  }, [ymd])

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>主页 / {ymd}</h2>
        <div>
          <Link to="/tasks/new">+ 添加任务</Link>
          <button style={{ marginLeft: 12 }} onClick={() => { api.clearToken(); window.location.href = '/login' }}>退出</button>
        </div>
      </header>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ border: '1px solid #ddd', padding: 12 }}>
          <h3>日历视图</h3>
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <div style={{ border: '1px solid #ddd', padding: 12 }}>
          <h3>今日项目</h3>
          {data.tasks.length === 0 ? (
            <div style={{ color: '#888' }}>空白，点击“+ 添加任务”</div>
          ) : (
            <ul>
              {data.tasks.map(t => (
                <li key={t.id} style={{ marginBottom: 8 }}>
                  <Link to={`/tasks/${t.id}`}>{t.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

