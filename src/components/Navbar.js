import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Adarsh Contractor
        </Link>
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/employees" className="navbar-link">Employees</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className="navbar-link">Admin Panel</Link>
          )}
          <div className="navbar-user">
            <span className="navbar-username">{user?.username}</span>
            <span className="navbar-role">({user?.role})</span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '10px', padding: '6px 12px', fontSize: '14px' }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

