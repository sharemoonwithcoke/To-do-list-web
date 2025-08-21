import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);
  return { user, setUser, loading };
}

function LoginPage({ onAuthed }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = `${API_BASE}/auth/${mode === 'login' ? 'login' : 'register'}`;
    const body = mode === 'login' ? { email: form.email, password: form.password } : form;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed');
      onAuthed(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="container">
      <h2>{mode === 'login' ? '登录' : '注册'}</h2>
      <form onSubmit={onSubmit} className="form">
        {mode === 'register' && (
          <input placeholder="用户名" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        )}
        <input placeholder="邮箱" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="密码" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">{mode === 'login' ? '登录' : '注册并登录'}</button>
        <div className="muted" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? '没有账号？去注册' : '已有账号？去登录'}
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

function AddTaskForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [weekly, setWeekly] = useState([1]);
  const [monthly, setMonthly] = useState(1);
  const [requireSubmission, setRequireSubmission] = useState(false);
  const create = async () => {
    const r = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, frequency, weeklyDays: weekly, monthlyDay: monthly, requireSubmission }),
    });
    const data = await r.json();
    if (r.ok) {
      onCreated(data.task);
      setTitle('');
    }
  };
  return (
    <div className="card">
      <h3>添加任务</h3>
      <input placeholder="任务名称" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div>
        <label>
          <input type="checkbox" checked={requireSubmission} onChange={(e) => setRequireSubmission(e.target.checked)} /> 需要提交细节（截图/链接/日志）
        </label>
      </div>
      <div>
        <label>频率：</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="daily">每天</option>
          <option value="weekly">每周</option>
          <option value="monthly">每月</option>
        </select>
      </div>
      {frequency === 'weekly' && (
        <div className="row">
          {[0,1,2,3,4,5,6].map((d) => (
            <label key={d}>
              <input
                type="checkbox"
                checked={weekly.includes(d)}
                onChange={(e) => {
                  if (e.target.checked) setWeekly([...weekly, d]); else setWeekly(weekly.filter((x) => x !== d));
                }}
              /> 周{['日','一','二','三','四','五','六'][d]}
            </label>
          ))}
        </div>
      )}
      {frequency === 'monthly' && (
        <div>
          <label>每月第几天：</label>
          <input type="number" min="1" max="31" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} />
        </div>
      )}
      <button onClick={create}>添加</button>
    </div>
  );
}

function SharePanel() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const add = async () => {
    const r = await fetch(`${API_BASE}/share/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ partnerEmail: email }),
    });
    const data = await r.json();
    setMessage(r.ok ? '已共享' : data.error || '失败');
  };
  return (
    <div className="card">
      <h3>共享你的 To-Do 列表</h3>
      <input placeholder="对方邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={add}>共享</button>
      {message && <div className="muted">{message}</div>}
    </div>
  );
}

function SubmissionForm({ task }) {
  const [tab, setTab] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const submit = async () => {
    if (tab === 'text') {
      await fetch(`${API_BASE}/submissions/text`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ taskId: task.id, text }) });
    } else if (tab === 'link') {
      await fetch(`${API_BASE}/submissions/link`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ taskId: task.id, url }) });
    } else if (tab === 'file') {
      const fd = new FormData();
      fd.append('taskId', String(task.id));
      if (file) fd.append('file', file);
      await fetch(`${API_BASE}/submissions/file`, { method: 'POST', credentials: 'include', body: fd });
    }
    setText(''); setUrl(''); setFile(null);
  };
  return (
    <div className="card">
      <div className="tabs">
        {['text','link','file'].map((t) => (
          <button key={t} className={tab===t?'active':''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === 'text' && <textarea placeholder="提交日志..." value={text} onChange={(e) => setText(e.target.value)} />}
      {tab === 'link' && <input placeholder="链接 URL" value={url} onChange={(e) => setUrl(e.target.value)} />}
      {tab === 'file' && <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />}
      <button onClick={submit}>提交</button>
    </div>
  );
}

function DayView({ date }) {
  const [tasks, setTasks] = useState([]);
  const [subs, setSubs] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/tasks/by-date?date=${date}`, { credentials: 'include' })
      .then((r) => r.json()).then((d) => setTasks(d.tasks || []));
    fetch(`${API_BASE}/submissions/by-date?date=${date}`, { credentials: 'include' })
      .then((r) => r.json()).then((d) => setSubs(d.submissions || []));
  }, [date]);
  return (
    <div>
      <h3>{date} 今日项目</h3>
      {tasks.length === 0 && <div className="muted">暂无任务</div>}
      {tasks.map((t) => (
        <div key={t.id} className="card">
          <div className="row space-between">
            <div>
              <div className="title">{t.title}</div>
              <div className="muted">{t.frequency}</div>
            </div>
            {t.require_submission ? <SubmissionForm task={t} /> : <div className="muted">无需提交</div>}
          </div>
        </div>
      ))}
      <h3>提交历史</h3>
      {subs.length === 0 && <div className="muted">今天还没有提交</div>}
      {subs.map((s) => (
        <div key={s.id} className="card">
          <div className="title">{s.username} 提交 - {s.type}</div>
          {s.content_text && <div className="muted">{s.content_text}</div>}
          {s.link_url && <a href={s.link_url} target="_blank" rel="noreferrer">打开链接</a>}
          {s.file_path && <a href={`${API_BASE}/${s.file_path}`} target="_blank" rel="noreferrer">查看文件</a>}
        </div>
      ))}
    </div>
  );
}

function Calendar({ onSelectDate }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  return (
    <div className="calendar">
      {days.map((d) => (
        <div key={d} className="day" onClick={() => onSelectDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)}>
          {d}
        </div>
      ))}
    </div>
  );
}

function Home() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="grid">
      <div className="panel">
        <h2>日历视图</h2>
        <Calendar onSelectDate={setSelectedDate} />
      </div>
      <div className="panel">
        <h2>今日项目</h2>
        <button onClick={() => setShowAdd((v) => !v)}>{showAdd ? '关闭' : '添加任务 +'}</button>
        {showAdd && <AddTaskForm onCreated={() => {}} />}
        <DayView date={selectedDate} />
        <SharePanel />
      </div>
    </div>
  );
}

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { user, setUser, loading } = useAuth();
  if (loading) return <div className="container">加载中...</div>;
  return (
    <Routes>
      <Route path="/login" element={<LoginPage onAuthed={setUser} />} />
      <Route path="/" element={<ProtectedRoute user={user}><Home /></ProtectedRoute>} />
    </Routes>
  );
}

export default App
