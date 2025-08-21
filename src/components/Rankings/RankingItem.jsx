import React from 'react';
import './RankingItem.css';


function RankingItem({ user, rank }) {
  return (
    <li className={`ranking-item ${rank <= 3 ? `ranking-item--top-${rank}` : ''}`}>
  
    <div className="ranking-item__rank">{rank}</div>
    <div className="ranking-item__content">
      <p className="ranking-item__username">{user.username}</p>
      <p className="ranking-item__score">Completed Tasks: {user.completedCount}</p>
    </div>
  </li>
  );
}

export default RankingItem;
