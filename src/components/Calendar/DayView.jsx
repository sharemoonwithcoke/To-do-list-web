import React, { useState } from 'react';
import TaskCompletionModal from '../Tasks/TaskCompletionModal';
import './DayView.css';

function DayView({ date, tasks, onClose, onTaskComplete, onAddTask, username }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('zh-CN', options);
  };

  const handleTaskClick = (task) => {
    if (!task.completed) {
      setSelectedTask(task);
      setShowCompletionModal(true);
    }
  };

  const handleCompleteTask = async (completionData) => {
    await onTaskComplete(selectedTask.id, completionData);
    setShowCompletionModal(false);
    setSelectedTask(null);
  };

  const getTaskStatusIcon = (task) => {
    if (task.completed) {
      return <span className="status-icon completed">✓</span>;
    }
    return <span className="status-icon pending">○</span>;
  };

  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="day-view-overlay">
      <div className="day-view">
        <div className="day-view-header">
          <h3>{formatDate(date)}</h3>
          <div className="day-view-actions">
            <button className="add-task-btn" onClick={onAddTask}>
              <span>+</span>
              添加任务
            </button>
            <button className="close-btn" onClick={onClose}>
              <span>×</span>
            </button>
          </div>
        </div>

        <div className="day-view-content">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p>今天还没有任务</p>
              <button className="add-first-task-btn" onClick={onAddTask}>
                添加第一个任务
              </button>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="task-status">
                    {getTaskStatusIcon(task)}
                  </div>
                  
                  <div className="task-content">
                    <div className="task-header">
                      <h4 className="task-title">{task.title}</h4>
                      {task.priority && (
                        <span 
                          className="task-priority"
                          style={{ backgroundColor: getTaskPriorityColor(task.priority) }}
                        >
                          {task.priority === 'high' ? '高' : 
                           task.priority === 'medium' ? '中' : '低'}
                        </span>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    
                    <div className="task-meta">
                      {task.frequency && (
                        <span className="task-frequency">
                          📅 {task.frequency === 'daily' ? '每天' : 
                              task.frequency === 'weekly' ? '每周' : '每月'}
                        </span>
                      )}
                      
                      {task.completed && task.completedBy && (
                        <span className="task-completed-by">
                          ✅ 由 {task.completedBy} 完成
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showCompletionModal && selectedTask && (
          <TaskCompletionModal
            task={selectedTask}
            onClose={() => setShowCompletionModal(false)}
            onSubmit={handleCompleteTask}
            username={username}
          />
        )}
      </div>
    </div>
  );
}

export default DayView;