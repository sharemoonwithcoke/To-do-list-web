import React, { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [category, setCategory] = useState('other');
  const [frequency, setFrequency] = useState('none'); // none|daily|weekly|monthly
  const [weeklyDays, setWeeklyDays] = useState([]); // ['Mon','Tue',...]

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({ 
      title, 
      description,
      priority,
      category,
      completed: false,
      schedule: {
        frequency,
        weeklyDays,
      },
    });
    setTitle('');
    setDescription('');
    setPriority('low');
    setCategory('other');
    setFrequency('none');
    setWeeklyDays([]);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
    <div className="form-group">
      <label className="form-label">
        Task Title: <span className="required">*</span>
        <input
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
    </div>
    
    <div className="form-group">
      <label className="form-label">
        Description:
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </label>
    </div>
    
    <div className="form-group">
      <label className="form-label">
        Category:
        <select 
          className="form-select"
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="study">Study</option>
          <option value="work">Work</option>
          <option value="life">Life</option>
          <option value="other">Other</option>
        </select>
      </label>
    </div>
    
    <div className="form-group">
      <label className="form-label">
        Priority:
        <select 
          className="form-select"
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
    </div>

    <div className="form-group">
      <label className="form-label">
        Frequency:
        <select 
          className="form-select"
          value={frequency} 
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="none">One-time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </label>
    </div>

    {frequency === 'weekly' && (
      <div className="form-group">
        <label className="form-label">Days of Week:</label>
        <div className="form-checkbox-group">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <label key={d} className="checkbox-label">
              <input
                type="checkbox"
                checked={weeklyDays.includes(d)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setWeeklyDays(prev => checked ? [...prev, d] : prev.filter(x => x !== d));
                }}
              />
              <span>{d}</span>
            </label>
          ))}
        </div>
      </div>
    )}
    
    <button type="submit" className="form-submit">Create Task</button>
  </form>
  );
}

export default TaskForm;