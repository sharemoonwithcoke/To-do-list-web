// Rankings.jsx
import React, { useState, useEffect } from 'react';
import RankingList from '../components/Rankings/RankingList';

function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/tasks/rankings') 
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch rankings');
        return res.json();
      })
      .then((data) => {
        setRankings(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="rankings-page">
        <h2 className="rankings-page__title">Loading rankings...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rankings-page">
        <h2 className="rankings-page__title">Error</h2>
        <p className="rankings-page__error">{error}</p>
      </div>
    );
  }

  return (
    <div className="rankings-page">
      <h2 className="rankings-page__title">Leaderboard</h2>
      {rankings.length === 0 ? (
        <p className="rankings-page__empty">No rankings available</p>
      ) : (
        <RankingList rankings={rankings} />
      )}
    </div>
  );
}

export default Rankings;
