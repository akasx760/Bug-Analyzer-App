import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Toast from './Toast';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password, role);

    if (result.success) {
      showToast('Login successful!');
      // Redirect based on role
      let redirectPath = '/';
      if (role === 'DEVELOPER') redirectPath = '/developer-dashboard';
      else if (role === 'TESTER') redirectPath = '/tester-dashboard';
      
      setTimeout(() => navigate(redirectPath), 1000);
    } else {
      showToast(result.error, 'error');
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Login to Bug Analyzer</h2>
          <div className="auth-logo">
            <span className="logo-icon">🐞</span>
          </div>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Login As</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="role-select"
            >
              <option value="USER">User</option>
              <option value="DEVELOPER">Developer</option>
              <option value="TESTER">Tester</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <div className="role-hint">
            <small>Select your role to access the appropriate dashboard</small>
          </div>
        </div>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Login;