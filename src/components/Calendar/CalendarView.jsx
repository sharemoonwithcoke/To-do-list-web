import React, { useState } from 'react';
import './CalendarView.css';

function CalendarView({ tasks, onTaskUpdate, onTaskSubmit, onAddTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayView, setShowDayView] = useState(false);

  // 获取当前月份的第一天和最后一天
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 获取月份第一天是星期几（0是星期日）
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // 生成日历网格
  const generateCalendarDays = () => {
    const days = [];
    
    // 添加上个月的剩余天数
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const prevDate = new Date(firstDayOfMonth);
      prevDate.setDate(prevDate.getDate() - (i + 1));
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        tasks: getTasksForDate(prevDate)
      });
    }
    
    // 添加当前月份的天数
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push({
        date,
        isCurrentMonth: true,
        tasks: getTasksForDate(date)
      });
    }
    
    // 添加下个月的开头几天以填满网格
    const remainingDays = 42 - days.length; // 6行7列 = 42
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(lastDayOfMonth);
      nextDate.setDate(nextDate.getDate() + day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        tasks: getTasksForDate(nextDate)
      });
    }
    
    return days;
  };

  // 获取指定日期的任务
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (task.frequency === 'daily') return true;
      if (task.frequency === 'weekly') {
        const taskDate = new Date(task.startDate);
        const daysDiff = Math.floor((date - taskDate) / (1000 * 60 * 60 * 24));
        return daysDiff % 7 === 0;
      }
      if (task.frequency === 'monthly') {
        return date.getDate() === new Date(task.startDate).getDate();
      }
      // 一次性任务
      return task.dueDate === dateStr;
    });
  };

  // 导航到上个月
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // 导航到下个月
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 处理日期点击
  const handleDateClick = (day) => {
    setSelectedDate(day.date);
    setShowDayView(true);
  };

  // 关闭日视图
  const closeDayView = () => {
    setShowDayView(false);
    setSelectedDate(null);
  };

  // 格式化日期显示
  const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long'
    });
  };

  const calendarDays = generateCalendarDays();

  if (showDayView && selectedDate) {
    return (
      <DayView 
        date={selectedDate}
        tasks={getTasksForDate(selectedDate)}
        onClose={closeDayView}
        onTaskUpdate={onTaskUpdate}
        onTaskSubmit={onTaskSubmit}
        onAddTask={onAddTask}
      />
    );
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="nav-btn" onClick={goToPreviousMonth}>
          ‹
        </button>
        <h2 className="month-title">{formatDate(currentDate)}</h2>
        <button className="nav-btn" onClick={goToNextMonth}>
          ›
        </button>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="days">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`day ${!day.isCurrentMonth ? 'other-month' : ''} ${
                day.date.toDateString() === new Date().toDateString() ? 'today' : ''
              }`}
              onClick={() => handleDateClick(day)}
            >
              <span className="day-number">{day.date.getDate()}</span>
              {day.tasks.length > 0 && (
                <div className="task-indicators">
                  {day.tasks.slice(0, 3).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`task-dot ${task.completed ? 'completed' : 'pending'}`}
                      title={task.title}
                    />
                  ))}
                  {day.tasks.length > 3 && (
                    <div className="task-dot more">+{day.tasks.length - 3}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 日视图组件
function DayView({ date, tasks, onClose, onTaskUpdate, onTaskSubmit, onAddTask }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    frequency: 'once',
    requiresSubmission: false
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    const taskData = {
      ...newTask,
      dueDate: date.toISOString().split('T')[0],
      startDate: date.toISOString().split('T')[0],
      completed: false,
      submissions: []
    };
    onAddTask(taskData);
    setNewTask({ title: '', description: '', frequency: 'once', requiresSubmission: false });
    setShowAddForm(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="day-view">
      <div className="day-view-header">
        <h2>{formatDate(date)}</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="day-view-content">
        <div className="tasks-section">
          <div className="section-header">
            <h3>今日任务</h3>
            <button 
              className="add-task-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              +
            </button>
          </div>

          {showAddForm && (
            <form className="add-task-form" onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="任务标题"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
              <textarea
                placeholder="任务描述（可选）"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
              <select
                value={newTask.frequency}
                onChange={(e) => setNewTask({...newTask, frequency: e.target.value})}
              >
                <option value="once">一次性</option>
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  checked={newTask.requiresSubmission}
                  onChange={(e) => setNewTask({...newTask, requiresSubmission: e.target.checked})}
                />
                需要提交证明
              </label>
              <div className="form-buttons">
                <button type="submit">添加</button>
                <button type="button" onClick={() => setShowAddForm(false)}>取消</button>
              </div>
            </form>
          )}

          <div className="tasks-list">
            {tasks.length === 0 ? (
              <p className="no-tasks">今天没有任务</p>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={onTaskUpdate}
                  onSubmit={onTaskSubmit}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 任务项组件
function TaskItem({ task, onUpdate, onSubmit }) {
  const [showSubmission, setShowSubmission] = useState(false);
  const [submission, setSubmission] = useState({
    type: 'text',
    content: '',
    file: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task.id, submission);
    setShowSubmission(false);
    setSubmission({ type: 'text', content: '', file: null });
  };

  const toggleComplete = () => {
    onUpdate({ ...task, completed: !task.completed });
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={toggleComplete}
          />
          <span className="checkmark"></span>
        </label>
        <h4 className="task-title">{task.title}</h4>
        <span className="task-frequency">{task.frequency}</span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.requiresSubmission && !task.completed && (
        <button 
          className="submit-btn"
          onClick={() => setShowSubmission(!showSubmission)}
        >
          提交证明
        </button>
      )}

      {showSubmission && (
        <form className="submission-form" onSubmit={handleSubmit}>
          <select
            value={submission.type}
            onChange={(e) => setSubmission({...submission, type: e.target.value})}
          >
            <option value="text">文字描述</option>
            <option value="link">链接</option>
            <option value="file">文件上传</option>
          </select>
          
          {submission.type === 'text' && (
            <textarea
              placeholder="请描述任务完成情况..."
              value={submission.content}
              onChange={(e) => setSubmission({...submission, content: e.target.value})}
              required
            />
          )}
          
          {submission.type === 'link' && (
            <input
              type="url"
              placeholder="请输入相关链接..."
              value={submission.content}
              onChange={(e) => setSubmission({...submission, content: e.target.value})}
              required
            />
          )}
          
          {submission.type === 'file' && (
            <input
              type="file"
              onChange={(e) => setSubmission({...submission, file: e.target.files[0]})}
              required
            />
          )}
          
          <div className="submission-buttons">
            <button type="submit">提交</button>
            <button type="button" onClick={() => setShowSubmission(false)}>取消</button>
          </div>
        </form>
      )}

      {task.submissions && task.submissions.length > 0 && (
        <div className="submissions-history">
          <h5>提交历史</h5>
          {task.submissions.map((sub, index) => (
            <div key={index} className="submission-item">
              <span className="submission-date">
                {new Date(sub.date).toLocaleDateString()}
              </span>
              <span className="submission-content">{sub.content}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarView;