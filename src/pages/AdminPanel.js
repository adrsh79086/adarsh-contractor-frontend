import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const AdminPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const [employeesRes, statsRes] = await Promise.all([
        axios.get('/api/admin/employees', { params: statusFilter ? { status: statusFilter } : {} }),
        axios.get('/api/admin/dashboard')
      ]);
      setEmployees(employeesRes.data.employees);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/employees/${id}/approve`);
      fetchData();
    } catch (error) {
      alert('Failed to approve employee');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this employee?')) {
      return;
    }
    try {
      await axios.post(`/api/admin/employees/${id}/reject`);
      fetchData();
    } catch (error) {
      alert('Failed to reject employee');
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/admin/export');
      const data = response.data.employees;
      
      // Convert to CSV
      const headers = ['ID', 'Name', 'Age', 'Mobile', 'UAN', 'Aadhaar', 'Bank Account', 'IFSC', 'Bank Name', 'Salary', 'Advance', 'Status', 'Created At'];
      const csvRows = [headers.join(',')];
      
      data.forEach(emp => {
        const row = [
          emp.id,
          `"${emp.name}"`,
          emp.age,
          emp.mobile_number,
          emp.uan_number,
          emp.aadhaar_number,
          emp.bank_account_number || '',
          emp.bank_ifsc || '',
          `"${emp.bank_name || ''}"`,
          emp.salary_amount || 0,
          emp.advance_amount || 0,
          emp.status,
          emp.created_at
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data');
    }
  };

  const handlePrint = () => {
    window.print();
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
        <div className="page-header">
          <h1>⚙️ Admin Panel</h1>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-success" onClick={handleExport}>
              <span>📥</span> Export CSV
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              <span>🖨️</span> Print
            </button>
          </div>
        </div>

        <div className="stats-grid">
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

        <div className="card">
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: 600, color: '#475569', fontSize: '14px' }}>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-group"
              style={{ 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '2px solid var(--gray-light)',
                fontSize: '15px',
                minWidth: '200px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <option value="">All Employees</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {employees.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>📊</div>
              <h3>No employees found</h3>
              <p>No employees match the current filter criteria</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Mobile</th>
                    <th>UAN</th>
                    <th>Aadhaar</th>
                    <th>Bank Details</th>
                    <th>Salary</th>
                    <th>Advance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.name}</td>
                      <td>{employee.age}</td>
                      <td>{employee.mobile_number}</td>
                      <td>{employee.uan_number}</td>
                      <td>{employee.aadhaar_number}</td>
                      <td>
                        {employee.bank_account_number && (
                          <div style={{ fontSize: '12px' }}>
                            <div>A/C: {employee.bank_account_number}</div>
                            {employee.bank_ifsc && <div>IFSC: {employee.bank_ifsc}</div>}
                            {employee.bank_name && <div>{employee.bank_name}</div>}
                          </div>
                        )}
                      </td>
                      <td>₹{parseFloat(employee.salary_amount || 0).toLocaleString()}</td>
                      <td>₹{parseFloat(employee.advance_amount || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td>
                        {employee.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-success"
                              onClick={() => handleApprove(employee.id)}
                              style={{ padding: '8px 16px', fontSize: '13px' }}
                            >
                              <span>✅</span> Approve
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleReject(employee.id)}
                              style={{ padding: '8px 16px', fontSize: '13px' }}
                            >
                              <span>❌</span> Reject
                            </button>
                          </div>
                        )}
                        {employee.status !== 'pending' && (
                          <span className={`badge ${getStatusBadge(employee.status)}`} style={{ fontSize: '12px' }}>
                            {employee.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

