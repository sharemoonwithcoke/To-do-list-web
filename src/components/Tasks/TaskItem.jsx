import React from 'react';
import './TaskItem.css';

function TaskItem({ task, onTaskUpdate, onTaskDelete }) {
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
    </li>
  );
}

export default TaskItem;