import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [reportedBugs, setReportedBugs] = useState([]);
  const [testReports, setTestReports] = useState([]);
  const [stats, setStats] = useState({
    reported: 0,
    inProgress: 0,
    resolved: 0,
    tested: 0
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [currentUser, navigate]);

  const fetchUserData = async () => {
    try {
      // Mock data for demonstration
      setReportedBugs([
        { id: 1, title: 'Login page UI issue', priority: 'MEDIUM', status: 'OPEN', reportedDate: '2023-12-15' },
        { id: 2, title: 'Performance lag on dashboard', priority: 'HIGH', status: 'IN_PROGRESS', reportedDate: '2023-12-16' },
        { id: 3, title: 'Mobile responsive bug', priority: 'LOW', status: 'RESOLVED', reportedDate: '2023-12-14' }
      ]);

      setTestReports([
        { id: 3, title: 'Mobile responsive bug', status: 'PASSED', testDate: '2023-12-14', tester: 'QA Tester' },
        { id: 4, title: 'Payment gateway issue', status: 'FAILED', testDate: '2023-12-13', tester: 'QA Tester' }
      ]);

      setStats({
        reported: 3,
        inProgress: 1,
        resolved: 1,
        tested: 2
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const viewBugDetails = (bugId) => {
    navigate(`/view/${bugId}`);
  };

  const viewTestReport = (bugId) => {
    const report = testReports.find(report => report.id === bugId);
    if (report) {
      alert(`Test Report for Bug #${bugId}\nTitle: ${report.title}\nStatus: ${report.status}\nTested by: ${report.tester}\nDate: ${report.testDate}`);
    }
  };

  return (
    <div className="home-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome, {currentUser?.firstName || 'User'}!
        </h1>
        <p className="dashboard-subtitle">Track your reported bugs and view test results</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.reported}</div>
          <div className="stat-label">Bugs Reported</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.tested}</div>
          <div className="stat-label">Tested</div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Reported Bugs Section */}
        <div className="recent-bugs-section">
          <h2>Your Reported Bugs</h2>
          {reportedBugs.length > 0 ? (
            <div className="bugs-list">
              {reportedBugs.map(bug => (
                <div key={bug.id} className="bug-item" onClick={() => viewBugDetails(bug.id)}>
                  <div className="bug-title">{bug.title}</div>
                  <div className="bug-meta">
                    <span className={`priority-badge priority-${bug.priority.toLowerCase()}`}>
                      {bug.priority}
                    </span>
                    <span className={`status-badge status-${bug.status.toLowerCase().replace('_', '-')}`}>
                      {bug.status}
                    </span>
                    <span className="reported-date">Reported: {bug.reportedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't reported any bugs yet.</p>
          )}
        </div>

        {/* Test Reports Section */}
        <div className="test-reports-section">
          <h2>Test Reports</h2>
          {testReports.length > 0 ? (
            <div className="reports-list">
              {testReports.map(report => (
                <div key={report.id} className="report-item">
                  <div className="report-title">{report.title}</div>
                  <div className="report-meta">
                    <span className={`status-badge status-${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                    <span className="tester">Tested by: {report.tester}</span>
                    <span className="test-date">Tested: {report.testDate}</span>
                  </div>
                  <div className="report-actions">
                    <button className="action-btn" onClick={() => viewTestReport(report.id)}>
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No test reports available yet.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button
            className="action-btn primary"
            onClick={() => navigate("/add")}
          >
            Report New Bug
          </button>
          <button
            className="action-btn secondary"
            onClick={() => navigate("/view")}
          >
            View All Bugs
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/profile")}
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose Bug Analyzer?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Issues</h3>
            <p>Monitor bugs throughout their lifecycle from discovery to resolution</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Resolution</h3>
            <p>Prioritize and assign bugs to ensure critical issues are fixed first</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Team Collaboration</h3>
            <p>Enable seamless collaboration between testers and developers</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;