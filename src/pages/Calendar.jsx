import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

function buildMonthGrid(year, month) {
  const start = dayjs().year(year).month(month).date(1);
  const startDay = start.day(); // 0 Sun
  const gridStart = start.subtract((startDay + 6) % 7, 'day'); // start on Monday
  const days = [];
  for (let i = 0; i < 42; i++) {
    days.push(gridStart.add(i, 'day'));
  }
  return days;
}

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [yearMonth, setYearMonth] = useState(dayjs());

  useEffect(() => {
    fetch('/tasks')
      .then(res => res.ok ? res.json() : [])
      .then(setTasks)
      .catch(() => {});
  }, []);

  const days = useMemo(() => buildMonthGrid(yearMonth.year(), yearMonth.month()), [yearMonth]);

  const tasksByDate = useMemo(() => {
    const map = {};
    const add = (d, t) => {
      const key = d.format('YYYY-MM-DD');
      (map[key] ||= []).push(t);
    };
    tasks.forEach(t => {
      const created = dayjs(t.createdAt || dayjs());
      const freq = t.schedule?.frequency || 'none';
      if (freq === 'none') {
        add(created, t);
      } else if (freq === 'daily') {
        days.forEach(d => add(d, t));
      } else if (freq === 'weekly') {
        const weeklyDays = (t.schedule?.weeklyDays) || [];
        days.forEach(d => {
          const mapDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.day()];
          if (weeklyDays.includes(mapDay)) add(d, t);
        });
      } else if (freq === 'monthly') {
        const dayOfMonth = created.date();
        days.forEach(d => { if (d.date() === dayOfMonth) add(d, t); });
      }
    });
    return map;
  }, [tasks, days]);

  const monthLabel = yearMonth.format('YYYY MMM');

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={() => setYearMonth(y => y.subtract(1, 'month'))}>Prev</button>
        <h2>{monthLabel}</h2>
        <button onClick={() => setYearMonth(y => y.add(1, 'month'))}>Next</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(h => (
          <div key={h} style={{ fontWeight: 'bold', textAlign: 'center' }}>{h}</div>
        ))}
        {days.map(d => {
          const key = d.format('YYYY-MM-DD');
          const list = tasksByDate[key] || [];
          const isCurrentMonth = d.month() === yearMonth.month();
          return (
            <div key={key} style={{ border: '1px solid #ddd', padding: 8, background: isCurrentMonth ? 'white' : '#fafafa' }}>
              <div style={{ fontSize: 12, marginBottom: 6 }}>{d.date()}</div>
              {list.length === 0 ? (
                <div style={{ color: '#999', fontSize: 12 }}>+</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 4 }}>
                  {list.map(t => (
                    <li key={t.id} style={{ fontSize: 12, padding: 4, background: '#f0f7ff', borderRadius: 4 }} title={t.title}>
                      {t.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;

