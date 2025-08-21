import React from 'react';
import './Calendar.css';

function Calendar({ currentDate, onDateClick, getTasksForDate, onMonthChange }) {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const getNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const formatMonthYear = (date) => {
    const months = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    
    // 添加前一个月的天数
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
      days.push(
        <div 
          key={`prev-${day}`} 
          className="calendar-day prev-month"
          onClick={() => onDateClick(date)}
        >
          <span className="day-number">{day}</span>
        </div>
      );
    }
    
    // 添加当前月的天数
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const tasksForDay = getTasksForDate(date);
      const hasTasks = tasksForDay.length > 0;
      const completedTasks = tasksForDay.filter(task => task.completed).length;
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day current-month ${isToday(date) ? 'today' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <span className="day-number">{day}</span>
          {hasTasks && (
            <div className="task-indicator">
              <span className="task-count">
                {completedTasks}/{tasksForDay.length}
              </span>
            </div>
          )}
        </div>
      );
    }
    
    // 添加下一个月的前几天以填满网格
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);
      days.push(
        <div 
          key={`next-${day}`} 
          className="calendar-day next-month"
          onClick={() => onDateClick(date)}
        >
          <span className="day-number">{day}</span>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-btn" onClick={getPreviousMonth}>
          <span>‹</span>
        </button>
        <h3 className="month-year">{formatMonthYear(currentDate)}</h3>
        <button className="nav-btn" onClick={getNextMonth}>
          <span>›</span>
        </button>
      </div>
      
      <div className="calendar-weekdays">
        <div className="weekday">日</div>
        <div className="weekday">一</div>
        <div className="weekday">二</div>
        <div className="weekday">三</div>
        <div className="weekday">四</div>
        <div className="weekday">五</div>
        <div className="weekday">六</div>
      </div>
      
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>
    </div>
  );
}

export default Calendar;