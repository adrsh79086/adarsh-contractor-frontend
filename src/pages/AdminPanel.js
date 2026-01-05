import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

const AdminPanel = () => {
  const [employees, setEmployees] = useState([]);

  // ✅ SAFE INITIAL STATE (prevents undefined error)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingApprovals: 0,
    totalSalary: 0,
    totalAdvances: 0
  });

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [employeesRes, statsRes] = await Promise.all([
        api.get('/api/admin/employees', {
          params: statusFilter ? { status: statusFilter } : {}
        }),
        api.get('/api/admin/dashboard')
      ]);

      setEmployees(employeesRes.data.employees || []);
      setStats(statsRes.data.stats || {});
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/admin/employees/${id}/approve`);
      fetchData();
    } catch (error) {
      alert('Failed to approve employee');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this employee?')) return;

    try {
      await api.put(`/api/admin/employees/${id}/reject`);
      fetchData();
    } catch (error) {
      alert('Failed to reject employee');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected'
    };
    return badges[status] || 'badge-pending';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <h1>⚙️ Admin Panel</h1>

        {/* ✅ SAFE STATS RENDER */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <p>{stats.totalEmployees}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <p>{stats.pendingApprovals}</p>
          </div>
          <div className="stat-card">
            <h3>Total Salary</h3>
            <p>₹{stats.totalSalary.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Total Advances</h3>
            <p>₹{stats.totalAdvances.toLocaleString()}</p>
          </div>
        </div>

        <div className="card">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>UAN</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.mobile_number}</td>
                  <td>{emp.uan_number}</td>
                  <td>{emp.status}</td>
                  <td>
                    {emp.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(emp._id)}>Approve</button>
                        <button onClick={() => handleReject(emp._id)}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
