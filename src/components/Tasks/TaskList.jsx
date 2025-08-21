import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ tasks, onTaskUpdate, onTaskDelete }) {
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  if (!tasks.length) {
    return <p className="task-list__empty">No tasks available.</p>;
  }

  return (
    <div className="task-list-container">
      <section className="task-section">
        <h3 className="task-section__title">Tasks In Progress ({incompleteTasks.length})</h3>
        <ul className="task-list task-list--incomplete">
          {incompleteTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
            />
          ))}
        </ul>
      </section>

      <section className="task-section">
        <h3 className="task-section__title">Completed Tasks ({completedTasks.length})</h3>
        <ul className="task-list task-list--completed">
          {completedTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default TaskList;