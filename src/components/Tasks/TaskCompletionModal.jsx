import React, { useState } from 'react';
import './TaskCompletionModal.css';

function TaskCompletionModal({ task, onClose, onSubmit, username }) {
  const [formData, setFormData] = useState({
    screenshot: null,
    link: '',
    log: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.screenshot && !formData.link && !formData.log) {
      alert('请至少提供一种完成证明（截图、链接或日志）');
      return;
    }

    setLoading(true);
    try {
      const completionData = {
        ...formData,
        completedBy: username,
        completedAt: new Date().toISOString()
      };
      
      await onSubmit(completionData);
    } catch (error) {
      console.error('Failed to submit completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('文件大小不能超过5MB');
        e.target.value = '';
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        e.target.value = '';
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        screenshot: file
      }));
    }
  };

  return (
    <div className="completion-modal-overlay">
      <div className="completion-modal">
        <div className="completion-modal-header">
          <h3>完成任务</h3>
          <button className="close-btn" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <div className="task-info">
          <h4>{task.title}</h4>
          {task.description && <p>{task.description}</p>}
        </div>

        <form className="completion-modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="screenshot">上传截图</label>
            <input
              id="screenshot"
              name="screenshot"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
            <div className="file-input-info">
              支持 JPG、PNG、GIF 格式，最大 5MB
            </div>
            {formData.screenshot && (
              <div className="file-preview">
                <span>已选择: {formData.screenshot.name}</span>
                <button 
                  type="button" 
                  className="remove-file-btn"
                  onClick={() => setFormData(prev => ({ ...prev, screenshot: null }))}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="link">相关链接</label>
            <input
              id="link"
              name="link"
              type="url"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="输入相关链接（可选）"
            />
          </div>

          <div className="form-group">
            <label htmlFor="log">完成日志</label>
            <textarea
              id="log"
              name="log"
              value={formData.log}
              onChange={handleInputChange}
              placeholder="描述任务完成过程（可选）"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">备注</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="其他备注信息（可选）"
              rows="3"
            />
          </div>

          <div className="completion-info">
            <span>✅ 完成者：{username}</span>
            <span>📅 完成时间：{new Date().toLocaleString('zh-CN')}</span>
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
              disabled={loading || (!formData.screenshot && !formData.link && !formData.log)}
            >
              {loading ? '提交中...' : '提交完成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskCompletionModal;