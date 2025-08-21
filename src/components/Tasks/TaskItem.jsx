import React, { useState, useEffect } from 'react';
import './TaskItem.css';

function TaskItem({ task, onTaskUpdate, onTaskDelete }) {
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [submissionType, setSubmissionType] = useState('link');
  const [submissionDetails, setSubmissionDetails] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (showSubmissions) {
      const ownerKey = task.ownerUserId ? task.ownerUserId : 'me';
      fetch(`/submissions/${ownerKey}/${task.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(setSubmissions)
        .catch(() => {});
    }
  }, [showSubmissions, task.id, task.ownerUserId]);
  const handleStatusChange = () => {
    if (task.completed) return;
    
    fetch(`/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...task,
        completed: !task.completed
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    })
    .then(updatedTask => {
      onTaskUpdate(updatedTask);
    })
    .catch(err => alert(err.message));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      fetch(`/tasks/${task.id}`, {
        method: 'DELETE',
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete task');
        onTaskDelete(task.id);
      })
      .catch(err => alert(err.message));
    }
  };

  const handleSubmitSubmission = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', submissionType);
    formData.append('details', submissionDetails);
    if (file) formData.append('file', file);
    const ownerKey = task.ownerUserId ? task.ownerUserId : 'me';
    fetch(`/submissions/${ownerKey}/${task.id}`, {
      method: 'POST',
      body: formData
    })
    .then(res => res.ok ? res.json() : res.json().then(e=>{ throw new Error(e.error || 'submit failed'); }))
    .then(sub => {
      setSubmissionDetails('');
      setFile(null);
      setSubmissions(prev => [sub, ...prev]);
    })
    .catch(err => alert(err.message));
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-item__content">
        <label className="task-item__status-label">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleStatusChange}
            className="task-item__checkbox"
            disabled={task.completed}
          />
          <div className="task-item__text">
            <span className="task-item__title">{task.title}</span>
            {task.description && (
              <p className="task-item__description">{task.description}</p>
            )}
          </div>
        </label>
        <div className="task-item__details">
          <span className={`task-item__category task-item__category--${task.category}`}>
            {task.category}
          </span>
          <span className={`task-item__priority task-item__priority--${task.priority}`}>
            Priority: {task.priority}
          </span>
          <span className="task-item__status-badge">
            {task.completed ? '✓ Completed' : '⌛ In Progress'}
          </span>
          {task.schedule?.frequency && task.schedule.frequency !== 'none' && (
            <span className="task-item__schedule">{task.schedule.frequency === 'weekly' ? `Weekly(${(task.schedule.weeklyDays||[]).join(',')})` : task.schedule.frequency}</span>
          )}
        </div>
      </div>
      {!task.completed && (
        <button
          onClick={handleDelete}
          className="task-item__delete-btn"
          title="Delete task"
        >
          ×
        </button>
      )}

      <div style={{ marginTop: '8px' }}>
        <button onClick={() => setShowSubmissions(v => !v)}>
          {showSubmissions ? 'Hide Submissions' : 'Show Submissions'}
        </button>
      </div>
      {showSubmissions && (
        <div className="task-submissions">
          <form onSubmit={handleSubmitSubmission} style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            <select value={submissionType} onChange={e => setSubmissionType(e.target.value)}>
              <option value="link">Link</option>
              <option value="log">Log</option>
              <option value="screenshot">Screenshot</option>
            </select>
            <input placeholder="details or URL" value={submissionDetails} onChange={e => setSubmissionDetails(e.target.value)} />
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
            <button type="submit">Submit</button>
          </form>
          <ul style={{ marginTop: 8 }}>
            {submissions.map(s => (
              <li key={s.id}>
                <strong>{s.type}</strong> · {new Date(s.dateISO).toLocaleString()} · details: {s.details} {s.filePath ? (<a href={s.filePath} target="_blank" rel="noreferrer">file</a>) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default TaskItem;