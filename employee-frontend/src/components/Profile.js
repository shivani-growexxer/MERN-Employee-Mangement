import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Profile.css';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/user/me');
      setUserData(response.data.result);
      setError('');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data.');
    }
  };

  return (
    <>
    <h2>Profile</h2>
    <div className="profile-container">
      {error && <div className="error-message">{error}</div>}
      {userData ? (
        <div className="profile-details">
          <p><strong>Name:</strong> <span>{userData.name}</span></p>
          <p><strong>Email:</strong> <span>{userData.email}</span></p>
          <p><strong>Role:</strong> <span>{userData.role}</span></p>
          {userData.role === 'employee' && userData.employeeDetails && (
            <div>
              <p><strong>Department:</strong> <span>{userData.employeeDetails[0].department}</span></p>
              <p><strong>Joining Date:</strong> <span>{new Date(userData.employeeDetails[0].joiningDate).toLocaleDateString()}</span></p>
              <p><strong>Projects:</strong> <span>{userData.employeeDetails[0].projects.join(', ')}</span></p>
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
    </>
  );
}

export default Profile;
