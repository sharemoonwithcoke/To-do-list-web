import React from 'react';
import './StatsCard.css';



function StatsCard({ title, value, className }) {
  return (
    <div className={`stats-card ${className || ''}`}>
      <h3 className="stats-card__title">{title}</h3>
      <p className="stats-card__value">{value}</p>
    </div>
  );
}

export default StatsCard;
