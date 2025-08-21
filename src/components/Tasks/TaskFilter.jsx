import React from 'react';
import './TaskFilter.css';

function TaskFilter({ onFilterChange }) {
  return (
    <div className="task-filter">
      <label className="task-filter__label">
        Filter by Category:
        <select className="task-filter__select" onChange={(e) => onFilterChange(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="study">Study</option>
          <option value="work">Work</option>
          <option value="life">Life</option>
          <option value="other">Other</option>
        </select>
      </label>
    </div>
  );
}

export default TaskFilter;
