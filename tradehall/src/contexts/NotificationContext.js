import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });
  const [cartCount, setCartCount] = useState(0);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const updateCartCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const cartData = await response.json();
        const count = cartData.items ? cartData.items.reduce((total, item) => total + item.quantity, 0) : 0;
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartCount(0);
    }
  }, []);

  const value = {
    showNotification,
    hideNotification,
    cartCount,
    updateCartCount,
    setCartCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 