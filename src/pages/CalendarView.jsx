import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar/Calendar';
import TaskModal from '../components/Tasks/TaskModal';
import DayView from '../components/Calendar/DayView';
import './CalendarView.css';

function CalendarView({ username, authId }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/tasks', {
        headers: {
          'Authorization': `Bearer ${authId}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowDayView(true);
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authId}`
        },
        body: JSON.stringify({
          ...taskData,
          date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [...prev, newTask]);
        setShowTaskModal(false);
        setShowDayView(false);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('添加任务失败');
    }
  };

  const handleTaskComplete = async (taskId, completionData) => {
    try {
      const response = await fetch(`/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authId}`
        },
        body: JSON.stringify(completionData)
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => 
          prev.map(task => 
            task.id === taskId ? updatedTask : task
          )
        );
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      alert('完成任务失败');
    }
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateStr);
  };

  if (loading) {
    return <div className="calendar-view__loading">加载中...</div>;
  }

  return (
    <div className="calendar-view">
      <div className="calendar-view__header">
        <h2>日历视图</h2>
        <button 
          className="add-task-btn"
          onClick={() => setShowTaskModal(true)}
        >
          <span className="add-icon">+</span>
          添加任务
        </button>
      </div>

      <Calendar 
        currentDate={currentDate}
        onDateClick={handleDateClick}
        getTasksForDate={getTasksForDate}
        onMonthChange={setCurrentDate}
      />

      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleAddTask}
          selectedDate={selectedDate}
        />
      )}

      {showDayView && selectedDate && (
        <DayView
          date={selectedDate}
          tasks={getTasksForDate(selectedDate)}
          onClose={() => setShowDayView(false)}
          onTaskComplete={handleTaskComplete}
          onAddTask={() => {
            setShowDayView(false);
            setShowTaskModal(true);
          }}
          username={username}
        />
      )}
    </div>
  );
}

export default CalendarView;