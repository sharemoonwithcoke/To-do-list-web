import React, { useState, useEffect } from 'react';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import TaskFilter from '../components/Tasks/TaskFilter';
import './Dashboard.css';

function Dashboard({ username }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    fetch('/tasks')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        alert(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = (newTask) => {
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask)
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to add task');
      return res.json();
    })
    .then(task => {
      setTasks(prev => [...prev, task]);
      setError(null);
    })
    .catch(err => {
      setError(err.message);
      alert(err.message);
    });
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.category === filter;
  });

  if (loading) {
    return <div className="dashboard__loading">Loading tasks...</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">Welcome, {username}</h2>
      {error && (
        <div className="dashboard__error">Error: {error}</div>
      )}
      <div className="dashboard__form-section">
      <TaskForm onAddTask={handleAddTask} />
      </div>
     
      <TaskFilter onFilterChange={handleFilterChange} />
      <div className="dashboard__list-section">
      <TaskList 
        tasks={filteredTasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
      </div>
    </div>
  );
}

export default Dashboard;