// RankingList.jsx
import React from 'react';
import RankingItem from './RankingItem';
import './RankingList.css';

function RankingList({ rankings }) {
  return (
    <ul className="ranking-list">
      {rankings.map((user, index) => (
        <li key={index} className="ranking-item">
          <span className="ranking-item__rank">{index + 1}</span>
          <p className="ranking-item__username">{user.username}</p>
          <p className="ranking-item__score">Completed Tasks: {user.completedCount}</p>
        </li>
      ))}
    </ul>
  );
}

export default RankingList;
