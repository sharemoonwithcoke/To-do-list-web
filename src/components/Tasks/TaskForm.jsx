import React, { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [category, setCategory] = useState('other');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({ 
      title, 
      description,
      priority,
      category,
      completed: false 
    });
    setTitle('');
    setDescription('');
    setPriority('low');
    setCategory('other');
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
    
    <button type="submit" className="form-submit">Create Task</button>
  </form>
  );
}

export default TaskForm;