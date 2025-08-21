import React, { useState } from 'react';
import './TaskModal.css';

function TaskModal({ onClose, onSubmit, selectedDate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    frequency: 'once',
    requiresSubmission: false,
    sharedWith: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('请输入任务标题');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '今天';
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">
        <div className="task-modal-header">
          <h3>添加新任务</h3>
          <button className="close-btn" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <form className="task-modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">任务标题 *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="请输入任务标题"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">任务描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="请输入任务描述（可选）"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">优先级</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="frequency">频率</label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
              >
                <option value="once">一次性</option>
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </select>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requiresSubmission"
                checked={formData.requiresSubmission}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              需要提交完成证明（截图/链接/日志）
            </label>
          </div>

          {formData.requiresSubmission && (
            <div className="form-group">
              <label htmlFor="sharedWith">分享给（用户名）</label>
              <input
                id="sharedWith"
                name="sharedWith"
                type="text"
                value={formData.sharedWith}
                onChange={handleInputChange}
                placeholder="输入要分享的用户名（可选）"
              />
            </div>
          )}

          <div className="task-date-info">
            <span>📅 任务日期：{formatDate(selectedDate)}</span>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              取消
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !formData.title.trim()}
            >
              {loading ? '添加中...' : '添加任务'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;