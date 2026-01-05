import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>

        <div className="card fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              👋
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>
                Welcome back, {user?.username}!
              </h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '15px' }}>
                Role: <span style={{ 
                  fontWeight: 700, 
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{user?.role}</span>
              </p>
            </div>
          </div>

          {user?.role === 'admin' && stats && (
            <div className="stats-grid" style={{ marginTop: '32px' }}>
              <div className="stat-card">
                <h3>Total Employees</h3>
                <p>{stats.totalEmployees || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Approvals</h3>
                <p>{stats.pendingApprovals || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Salary</h3>
                <p>₹{parseFloat(stats.totalSalary || 0).toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>Total Advances</h3>
                <p>₹{parseFloat(stats.totalAdvances || 0).toLocaleString()}</p>
              </div>
            </div>
          )}

          <div style={{ 
            marginTop: '40px', 
            display: 'flex', 
            gap: '16px', 
            flexWrap: 'wrap' 
          }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/employees')}
              style={{ fontSize: '16px', padding: '14px 28px' }}
            >
              <span>👥</span>
              View All Employees
            </button>
            {user?.role === 'admin' && (
              <button
                className="btn btn-success"
                onClick={() => navigate('/admin')}
                style={{ fontSize: '16px', padding: '14px 28px' }}
              >
                <span>⚙️</span>
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
