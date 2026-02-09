import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const DeveloperDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [assignedBugs, setAssignedBugs] = useState([]);
  const [fixedBugs, setFixedBugs] = useState([]);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    fixed: 0,
    awaitingTesting: 0
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetchDeveloperData();
  }, [currentUser, navigate]);

  const fetchDeveloperData = async () => {
    try {
      // Mock data for demonstration
      setAssignedBugs([
        { id: 1, title: 'Login page not responsive', priority: 'HIGH', status: 'ASSIGNED', dueDate: '2023-12-20' },
        { id: 2, title: 'API endpoint returning 500', priority: 'URGENT', status: 'IN_PROGRESS', dueDate: '2023-12-18' },
      ]);

      setFixedBugs([
        { id: 3, title: 'Database connection timeout', priority: 'MEDIUM', status: 'FIXED', fixedDate: '2023-12-15' },
        { id: 4, title: 'Mobile responsive issues', priority: 'HIGH', status: 'FIXED', fixedDate: '2023-12-14' },
      ]);

      setStats({
        assigned: 2,
        inProgress: 1,
        fixed: 2,
        awaitingTesting: 2
      });
    } catch (error) {
      console.error('Error fetching developer data:', error);
    }
  };

  const markAsFixed = (bugId) => {
    // Update bug status to fixed and move to awaiting testing
    const updatedBugs = assignedBugs.filter(bug => bug.id !== bugId);
    const fixedBug = assignedBugs.find(bug => bug.id === bugId);
    
    if (fixedBug) {
      fixedBug.status = 'FIXED';
      fixedBug.fixedDate = new Date().toISOString().split('T')[0];
      setFixedBugs([...fixedBugs, fixedBug]);
      setAssignedBugs(updatedBugs);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        inProgress: prev.inProgress - 1,
        fixed: prev.fixed + 1,
        awaitingTesting: prev.awaitingTesting + 1
      }));
    }
  };

  const viewBugDetails = (bugId) => {
    navigate(`/view/${bugId}`);
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Developer Dashboard</h1>
        <span className="user-welcome">
          Welcome, {currentUser.firstName}!
          <span className="role-badge role-developer">Developer</span>
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.assigned}</div>
          <div className="stat-label">Assigned Bugs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.fixed}</div>
          <div className="stat-label">Fixed Bugs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.awaitingTesting}</div>
          <div className="stat-label">Awaiting Testing</div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Assigned Bugs Section */}
        <div className="bugs-section">
          <h2>Your Assigned Bugs</h2>
          {assignedBugs.length > 0 ? (
            <div className="bugs-list">
              {assignedBugs.map(bug => (
                <div key={bug.id} className="bug-item">
                  <div className="bug-title">{bug.title}</div>
                  <div className="bug-meta">
                    <span className={`priority-badge priority-${bug.priority.toLowerCase()}`}>
                      {bug.priority}
                    </span>
                    <span className={`status-badge status-${bug.status.toLowerCase().replace('_', '-')}`}>
                      {bug.status}
                    </span>
                    <span className="due-date">Due: {bug.dueDate}</span>
                  </div>
                  <div className="bug-actions">
                    <button className="action-btn" onClick={() => viewBugDetails(bug.id)}>
                      View Details
                    </button>
                    <button className="action-btn primary" onClick={() => markAsFixed(bug.id)}>
                      Mark as Fixed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No assigned bugs</h3>
              <p>You don't have any bugs assigned to you at the moment.</p>
            </div>
          )}
        </div>

        {/* Fixed Bugs Section */}
        <div className="bugs-section">
          <h2>Recently Fixed Bugs</h2>
          {fixedBugs.length > 0 ? (
            <div className="bugs-list">
              {fixedBugs.map(bug => (
                <div key={bug.id} className="bug-item">
                  <div className="bug-title">{bug.title}</div>
                  <div className="bug-meta">
                    <span className={`priority-badge priority-${bug.priority.toLowerCase()}`}>
                      {bug.priority}
                    </span>
                    <span className={`status-badge status-${bug.status.toLowerCase().replace('_', '-')}`}>
                      {bug.status}
                    </span>
                    <span className="fixed-date">Fixed: {bug.fixedDate}</span>
                  </div>
                  <div className="bug-actions">
                    <button className="action-btn" onClick={() => viewBugDetails(bug.id)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No fixed bugs yet</h3>
              <p>Bugs you fix will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => navigate('/view')}>
            View All Bugs
          </button>
          <button className="action-btn" onClick={() => navigate('/profile')}>
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;