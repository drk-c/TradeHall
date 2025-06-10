import React, { useState } from 'react';
import './login-signup.css';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:8000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password recovery email sent! Please check your inbox.');
        setEmail('');
      } else {
        setError(data.message || 'Failed to send recovery email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <p className="forgot-description">
        Enter your email address and we'll send you your account information.
      </p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email Address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={loading}
          />
        </label>
        
        {error && (
          <div className="error-message">
            <p style={{ color: 'red', margin: '0.5rem 0' }}>{error}</p>
          </div>
        )}
        
        {message && (
          <div className="success-message">
            <p style={{ color: 'green', margin: '0.5rem 0' }}>{message}</p>
          </div>
        )}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Recovery Email'}
        </button>
        
        <div className="auth-links">
          <p className="login-signup">
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
          <p className="login-signup">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword; 