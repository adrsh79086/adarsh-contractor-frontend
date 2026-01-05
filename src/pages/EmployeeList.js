import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import EmployeeModal from '../components/EmployeeModal';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uanFilter, setUanFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [uanFilter, searchTerm]);

  const fetchEmployees = async () => {
    try {
      const params = {};
      if (uanFilter) params.uan = uanFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('/api/employees', { params });
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await axios.delete(`/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      alert('Failed to delete employee');
    }
  };

  const approveEmployee = async (id) => {
    try {
      await axios.put(`/api/admin/employees/${id}/approve`);
      fetchEmployees();
    } catch (error) {
      console.error('Approve failed:', error);
      alert('Failed to approve employee');
    }
  };

  const rejectEmployee = async (id) => {
    try {
      await axios.put(`/api/admin/employees/${id}/reject`);
      fetchEmployees();
    } catch (error) {
      console.error('Reject failed:', error);
      alert('Failed to reject employee');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingEmployee(null);
    fetchEmployees();
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
          <h1>👥 Employee Records</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ Add New Employee
          </button>
        </div>

        <div className="card">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by UAN number..."
              value={uanFilter}
              onChange={(e) => setUanFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by name, mobile, Aadhaar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {employees.length === 0 ? (
            <div className="empty-state">
              <h3>No employees found</h3>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                ➕ Add Employee
              </button>
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
                    <th>Salary</th>
                    <th>Advance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.name}</td>
                      <td>{employee.age}</td>
                      <td>{employee.mobile_number}</td>
                      <td>{employee.uan_number}</td>
                      <td>{employee.aadhaar_number}</td>
                      <td>₹{Number(employee.salary_amount || 0).toLocaleString()}</td>
                      <td>₹{Number(employee.advance_amount || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleEdit(employee)}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(employee._id)}
                          >
                            🗑️ Delete
                          </button>

                          {employee.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-success"
                                onClick={() => approveEmployee(employee._id)}
                              >
                                ✅ Approve
                              </button>

                              <button
                                className="btn btn-warning"
                                onClick={() => rejectEmployee(employee._id)}
                              >
                                ❌ Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default EmployeeList;
