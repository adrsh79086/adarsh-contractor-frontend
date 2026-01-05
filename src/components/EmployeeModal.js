import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';

const EmployeeModal = ({ employee, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    mobile_number: '',
    aadhaar_number: '',
    uan_number: '',
    bank_account_number: '',
    bank_ifsc: '',
    bank_name: '',
    salary_amount: '',
    advance_amount: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        age: employee.age || '',
        mobile_number: employee.mobile_number || '',
        aadhaar_number: employee.aadhaar_number || '',
        uan_number: employee.uan_number || '',
        bank_account_number: employee.bank_account_number || '',
        bank_ifsc: employee.bank_ifsc || '',
        bank_name: employee.bank_name || '',
        salary_amount: employee.salary_amount || '',
        advance_amount: employee.advance_amount || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (employee) {
        await axios.put(`/api/employees/${employee.id}`, formData);
      } else {
        await axios.post('/api/employees', formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              type="text"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Aadhaar Number *</label>
            <input
              type="text"
              name="aadhaar_number"
              value={formData.aadhaar_number}
              onChange={handleChange}
              required
              disabled={!!employee}
            />
          </div>
          <div className="form-group">
            <label>UAN Number *</label>
            <input
              type="text"
              name="uan_number"
              value={formData.uan_number}
              onChange={handleChange}
              required
              disabled={!!employee}
            />
          </div>
          <div className="form-group">
            <label>Bank Account Number</label>
            <input
              type="text"
              name="bank_account_number"
              value={formData.bank_account_number}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bank IFSC</label>
            <input
              type="text"
              name="bank_ifsc"
              value={formData.bank_ifsc}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Salary Amount</label>
            <input
              type="number"
              name="salary_amount"
              value={formData.salary_amount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Advance Amount</label>
            <input
              type="number"
              name="advance_amount"
              value={formData.advance_amount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : employee ? 'Update' : 'Create'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;

