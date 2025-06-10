import React, { useState } from 'react';
import './login-signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        showNotification('Signup successful!', 'success');

        //create a token
        const res = await axios.post('http://localhost:8000/login', {
          username,
          password
        });
  
        // Save the token and navigate to home page
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } else {
        showNotification(data.message || 'Signup failed', 'error');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showNotification('Signup failed', 'error');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <p className="login-signup">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
