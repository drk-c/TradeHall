import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    axios.get('http://localhost:8000/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setUser(res.data);
        setFormData({ username: res.data.username, email: res.data.email });
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch profile. Please login again.');
      });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setSuccess('');
    setError('');
  };

  const handleLogout = async (e) => {
    localStorage.setItem('token', '');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.put('http://localhost:8000/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(res.data);
      setEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
  };

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
  
      <div className="profile-section">
        <label>
          <strong>Username:</strong>
          {editing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          ) : (
            <span>{user.username}</span>
          )}
        </label>
  
        <label>
          <strong>Email:</strong>
          {editing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          ) : (
            <span>{user.email}</span>
          )}
        </label>
      </div>
  
      <div className="profile-buttons">
        {editing ? (
          <>
            <button type="submit" onClick={handleSubmit}>Save Changes</button>
            <button type="button" onClick={handleEditToggle}>Cancel</button>
          </>
        ) : (
          <button onClick={handleEditToggle}>Edit Profile</button>
        )}
      </div>
  
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
  
}

export default Profile;