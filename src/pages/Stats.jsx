// Stats.jsx
import React, { useState, useEffect } from 'react';
import StatsCard from '../components/Stats/StatsCard';
import './Stats.css';

function Stats() {
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/tasks/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          inProgress: data.inProgress,
          completed: data.completed
        });
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="stats-page">Loading...</div>;
  }

  return (
    <div className="stats-page">
      <h2 className="stats-page__title">Personal Statistics</h2>
      <div className="stats-page__cards">
        <StatsCard title="Tasks In Progress" value={stats.inProgress} />
        <StatsCard title="Tasks Completed" value={stats.completed} />
      </div>
    </div>
  );
}

export default Stats;
