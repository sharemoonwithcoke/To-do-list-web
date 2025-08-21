// Header.jsx
import React from 'react';
import './Header.css';

function Header({ username, onLogout, currentPage, onPageChange }) {
  return (
    <header className="header">
      <h1 className="header__title">Task Manager</h1>
      <nav className="header__nav">
        <button 
          onClick={() => onPageChange('dashboard')}
          className={`header__link ${currentPage === 'dashboard' ? 'active' : ''}`}
        >
          To-Do List
        </button>
        <button 
          onClick={() => onPageChange('stats')}
          className={`header__link ${currentPage === 'stats' ? 'active' : ''}`}
        >
          Personal Stats
        </button>
        <button 
          onClick={() => onPageChange('rankings')}
          className={`header__link ${currentPage === 'rankings' ? 'active' : ''}`}
        >
          Rankings
        </button>
      </nav>
      <div className="header__user">
        <p className="header__username">User: {username}</p>
        <button className="header__logout" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;



