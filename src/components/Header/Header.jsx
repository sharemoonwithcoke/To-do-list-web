// Header.jsx
import React from 'react';
import './Header.css';

function Header({ username, onLogout, currentView, onViewChange }) {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">To-Do List</h1>
        
        <div className="header__nav">
          <button 
            onClick={() => onViewChange('calendar')}
            className={`header__nav-btn ${currentView === 'calendar' ? 'active' : ''}`}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-text">日历</span>
          </button>
          <button 
            onClick={() => onViewChange('tasks')}
            className={`header__nav-btn ${currentView === 'tasks' ? 'active' : ''}`}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">任务</span>
          </button>
        </div>
        
        <div className="header__user">
          <span className="header__username">{username}</span>
          <button className="header__logout" onClick={onLogout}>
            <span className="logout-icon">🚪</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;



