import React, { useState, useEffect } from 'react';
import CalendarView from '../components/Calendar/CalendarView';
import TaskManager from '../components/Tasks/TaskManager';
import './Dashboard.css';

function Dashboard({ user }) {
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' or 'tasks'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/tasks', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取任务失败');
      }
      
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('获取任务失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        throw new Error('添加任务失败');
      }

      const task = await response.json();
      setTasks(prev => [...prev, task]);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('添加任务失败:', err);
    }
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await fetch(`/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedTask)
      });

      if (!response.ok) {
        throw new Error('更新任务失败');
      }

      const task = await response.json();
      setTasks(prev => 
        prev.map(t => t.id === task.id ? task : t)
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('更新任务失败:', err);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('删除任务失败');
      }

      setTasks(prev => prev.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('删除任务失败:', err);
    }
  };

  const handleTaskSubmit = async (taskId, submission) => {
    try {
      const response = await fetch(`/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        throw new Error('提交任务失败');
      }

      const updatedTask = await response.json();
      setTasks(prev => 
        prev.map(t => t.id === updatedTask.id ? updatedTask : t)
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('提交任务失败:', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>欢迎, {user.username}</h1>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveView('calendar')}
          >
            📅 日历视图
          </button>
          <button 
            className={`toggle-btn ${activeView === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveView('tasks')}
          >
            📝 任务管理
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="dashboard-content">
        {activeView === 'calendar' ? (
          <CalendarView 
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskSubmit={handleTaskSubmit}
            onAddTask={handleAddTask}
          />
        ) : (
          <TaskManager 
            tasks={tasks}
            onAddTask={handleAddTask}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskSubmit={handleTaskSubmit}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;