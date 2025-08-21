import React, { useState } from 'react';
import './TaskManager.css';

function TaskManager({ tasks, onAddTask, onTaskUpdate, onTaskDelete, onTaskSubmit }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showShareForm, setShowShareForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    frequency: 'once',
    requiresSubmission: false
  });
  const [shareData, setShareData] = useState({
    username: ''
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    const taskData = {
      ...newTask,
      dueDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      completed: false,
      submissions: []
    };
    onAddTask(taskData);
    setNewTask({ title: '', description: '', frequency: 'once', requiresSubmission: false });
    setShowAddForm(false);
  };

  const handleShareTaskView = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/tasks/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ toUsername: shareData.username })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`成功分享任务视图给 ${shareData.username}！共分享了 ${result.sharedTasksCount} 个任务。`);
        setShareData({ username: '' });
        setShowShareForm(false);
      } else {
        alert(`分享失败: ${result.error}`);
      }
    } catch (error) {
      alert('分享失败: ' + error.message);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    if (filter === 'requiresSubmission') return task.requiresSubmission;
    return true;
  });

  const getFrequencyText = (frequency) => {
    const frequencyMap = {
      'once': '一次性',
      'daily': '每天',
      'weekly': '每周',
      'monthly': '每月'
    };
    return frequencyMap[frequency] || frequency;
  };

  return (
    <div className="task-manager">
      <div className="task-manager-header">
        <h2>任务管理</h2>
        <div className="header-actions">
          <button 
            className="share-btn"
            onClick={() => setShowShareForm(!showShareForm)}
          >
            📤 分享视图
          </button>
          <button 
            className="add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + 添加任务
          </button>
        </div>
      </div>

      {showShareForm && (
        <div className="share-form-overlay">
          <div className="share-form">
            <h3>分享任务视图</h3>
            <p className="share-description">
              将你的所有任务分享给其他用户，他们会收到你当前任务列表的副本。
            </p>
            <form onSubmit={handleShareTaskView}>
              <div className="form-group">
                <label>分享给用户:</label>
                <input
                  type="text"
                  placeholder="输入用户名"
                  value={shareData.username}
                  onChange={(e) => setShareData({...shareData, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit">分享视图</button>
                <button type="button" onClick={() => setShowShareForm(false)}>取消</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="task-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          全部
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          待完成
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          已完成
        </button>
        <button 
          className={`filter-btn ${filter === 'requiresSubmission' ? 'active' : ''}`}
          onClick={() => setFilter('requiresSubmission')}
        >
          需提交
        </button>
      </div>

      {showAddForm && (
        <div className="add-task-section">
          <h3>添加新任务</h3>
          <form onSubmit={handleAddTask} className="add-task-form">
            <div className="form-group">
              <label>任务标题</label>
              <input
                type="text"
                placeholder="输入任务标题"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>任务描述</label>
              <textarea
                placeholder="输入任务描述（可选）"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>任务频率</label>
              <select
                value={newTask.frequency}
                onChange={(e) => setNewTask({...newTask, frequency: e.target.value})}
              >
                <option value="once">一次性</option>
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={newTask.requiresSubmission}
                  onChange={(e) => setNewTask({...newTask, requiresSubmission: e.target.checked})}
                />
                需要提交证明（截图/链接/日志）
              </label>
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="submit-btn">添加任务</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>暂无任务</h3>
            <p>点击"添加任务"开始创建你的第一个任务</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
              onSubmit={onTaskSubmit}
              getFrequencyText={getFrequencyText}
            />
          ))
        )}
      </div>
    </div>
  );
}

// 任务卡片组件
function TaskCard({ task, onUpdate, onDelete, onSubmit, getFrequencyText }) {
  const [showSubmission, setShowSubmission] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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

  const handleDelete = () => {
    if (window.confirm('确定要删除这个任务吗？')) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <div className="task-info">
          <label className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={toggleComplete}
            />
            <span className="checkmark"></span>
          </label>
          <div className="task-details">
            <h4 className="task-title">{task.title}</h4>
            <div className="task-meta">
              <span className="task-frequency">{getFrequencyText(task.frequency)}</span>
              {task.requiresSubmission && (
                <span className="submission-badge">需提交</span>
              )}
              {task.sharedFrom && (
                <span className="shared-badge">来自 {task.sharedFrom}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="task-actions">
          <button 
            className="action-btn details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '收起' : '详情'}
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
          >
            删除
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="task-details-expanded">
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-dates">
            <span>开始日期: {new Date(task.startDate).toLocaleDateString()}</span>
            {task.dueDate && (
              <span>截止日期: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
          </div>

          {task.requiresSubmission && !task.completed && (
            <button 
              className="submit-proof-btn"
              onClick={() => setShowSubmission(!showSubmission)}
            >
              提交证明
            </button>
          )}

          {showSubmission && (
            <form className="submission-form" onSubmit={handleSubmit}>
              <h5>提交任务证明</h5>
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
                  <div className="submission-header">
                    <span className="submission-date">
                      {new Date(sub.date).toLocaleDateString()}
                    </span>
                    <span className="submission-type">{sub.type}</span>
                  </div>
                  <div className="submission-content">{sub.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskManager;