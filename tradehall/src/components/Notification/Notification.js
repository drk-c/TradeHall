import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-dismiss after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="notification-overlay">
      <div className={`notification ${type}`}>
        <div className="notification-content">
          <div className="notification-icon">
            {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
          </div>
          <p className="notification-message">{message}</p>
        </div>
        <button className="notification-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification; 