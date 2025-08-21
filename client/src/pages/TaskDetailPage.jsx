import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { api } from '../services/api'

export default function TaskDetailPage() {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [subs, setSubs] = useState([])
  const [shareEmail, setShareEmail] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/tasks/${id}`)
        setTask(res.task)
        setSubs(res.submissions)
      } catch (e) {
        setErr(e.message)
      }
    })()
  }, [id])

  const onShare = async () => {
    setErr('')
    try {
      await api.post(`/tasks/${id}/share`, { email: shareEmail })
      alert('分享成功')
      setShareEmail('')
    } catch (e) { setErr(e.message) }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    const form = new FormData(e.currentTarget)
    try {
      const res = await api.postForm(`/tasks/${id}/submit`, form)
      setSubs(s => [res.submission, ...s])
      e.currentTarget.reset()
    } catch (e) { setErr(e.message) }
  }

  if (!task) return <div style={{ padding: 16 }}>加载中...</div>

  return (
    <div style={{ padding: 16 }}>
      <h2>{task.title}</h2>
      <div style={{ marginBottom: 12, color: '#666' }}>频率：{task.frequency}
        {task.frequency === 'weekly' && task.weekly_days ? `（周${JSON.parse(task.weekly_days).map(d => '日一二三四五六'[d]).join('、')}）` : ''}
      </div>

      <section style={{ border: '1px solid #eee', padding: 12, marginBottom: 16 }}>
        <h3>分享任务</h3>
        <div>
          <input placeholder="输入对方邮箱" value={shareEmail} onChange={e => setShareEmail(e.target.value)} />
          <button onClick={onShare} style={{ marginLeft: 8 }}>分享</button>
        </div>
      </section>

      <section style={{ border: '1px solid #eee', padding: 12, marginBottom: 16 }}>
        <h3>提交任务</h3>
        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <input name="date" type="date" defaultValue={dayjs().format('YYYY-MM-DD')} />
            <input name="detailText" placeholder="提交说明（可选）" />
            <input name="linkUrl" placeholder="链接（可选）" />
            <input name="image" type="file" accept="image/*" />
          </div>
          <button type="submit">提交</button>
        </form>
      </section>

      {err && <div style={{ color: 'red', marginBottom: 12 }}>{err}</div>}

      <section style={{ border: '1px solid #eee', padding: 12 }}>
        <h3>提交历史</h3>
        {subs.length === 0 ? <div>暂无提交</div> : (
          <ul>
            {subs.map(s => (
              <li key={s.id} style={{ marginBottom: 8 }}>
                <div>
                  <strong>{s.date}</strong> · 用户ID {s.submitter_user_id}
                </div>
                {s.detail_text && <div>说明：{s.detail_text}</div>}
                {s.link_url && <div>链接：<a href={s.link_url} target="_blank">{s.link_url}</a></div>}
                {s.image_path && <div><img src={`http://localhost:4000${s.image_path}`} alt="upload" style={{ maxWidth: 240 }}/></div>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

