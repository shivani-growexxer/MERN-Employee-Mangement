import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <nav>
        <ul>
          <li><button><Link to="/profile">Profile</Link></button></li>
          <li><button><Link to="/users">Users</Link></button></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;