import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null); // user info
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    axios.get('http://localhost:8000/profile', {
      headers: {
        Authorization: token  // send token here
      }
    })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch profile. Please login again.');
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {/* Add edit functionality here */}
    </div>
  );
}

export default Profile;