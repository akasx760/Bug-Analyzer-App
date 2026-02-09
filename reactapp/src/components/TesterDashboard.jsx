import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const TesterDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bugsToTest, setBugsToTest] = useState([]);
  const [testedBugs, setTestedBugs] = useState([]);
  const [stats, setStats] = useState({
    toTest: 0,
    inTesting: 0,
    passed: 0,
    failed: 0
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [reportData, setReportData] = useState({
    testEnvironment: '',
    testSteps: '',
    actualResult: '',
    expectedResult: '',
    additionalComments: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetchTesterData();
  }, [currentUser, navigate]);

  const fetchTesterData = async () => {
    try {
      // Mock data for demonstration
      setBugsToTest([
        { id: 1, title: 'Login page not responsive', priority: 'HIGH', status: 'AWAITING_TESTING', developer: 'John Doe', fixedDate: '2023-12-15' },
        { id: 2, title: 'API endpoint returning 500', priority: 'URGENT', status: 'AWAITING_TESTING', developer: 'Jane Smith', fixedDate: '2023-12-16' },
      ]);

      setTestedBugs([
        { id: 3, title: 'Database connection timeout', priority: 'MEDIUM', status: 'PASSED', testDate: '2023-12-14', tester: currentUser.firstName },
        { id: 4, title: 'Mobile responsive issues', priority: 'HIGH', status: 'FAILED', testDate: '2023-12-13', tester: currentUser.firstName },
      ]);

      setStats({
        toTest: 2,
        inTesting: 0,
        passed: 1,
        failed: 1
      });
    } catch (error) {
      console.error('Error fetching tester data:', error);
    }
  };

  const markAsTested = (bugId, status) => {
    // Update bug status based on test result
    const updatedBugs = bugsToTest.filter(bug => bug.id !== bugId);
    const testedBug = bugsToTest.find(bug => bug.id === bugId);
    
    if (testedBug) {
      testedBug.status = status;
      testedBug.testDate = new Date().toISOString().split('T')[0];
      testedBug.tester = currentUser.firstName;
      setTestedBugs([...testedBugs, testedBug]);
      setBugsToTest(updatedBugs);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        toTest: prev.toTest - 1,
        [status.toLowerCase()]: prev[status.toLowerCase()] + 1
      }));
    }
  };

  const openReportModal = (bugId) => {
    const bug = testedBugs.find(b => b.id === bugId) || bugsToTest.find(b => b.id === bugId);
    if (bug) {
      setSelectedBug(bug);
      setShowReportModal(true);
    }
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedBug(null);
    setReportData({
      testEnvironment: '',
      testSteps: '',
      actualResult: '',
      expectedResult: '',
      additionalComments: ''
    });
  };

  const handleReportInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitTestReport = () => {
    // In a real app, this would submit the report to the backend
    console.log('Test report submitted:', {
      bug: selectedBug,
      reportData
    });
    
    // Show success message
    alert(`Test report for "${selectedBug.title}" has been generated successfully!`);
    
    // Close the modal
    closeReportModal();
  };

  const viewBugDetails = (bugId) => {
    navigate(`/view/${bugId}`);
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tester Dashboard</h1>
        <span className="user-welcome">
          Welcome, {currentUser.firstName}!
          <span className="role-badge role-tester">Tester</span>
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.toTest}</div>
          <div className="stat-label">Bugs to Test</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inTesting}</div>
          <div className="stat-label">In Testing</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.passed}</div>
          <div className="stat-label">Passed Tests</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.failed}</div>
          <div className="stat-label">Failed Tests</div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Bugs to Test Section */}
        <div className="bugs-section">
          <h2>Bugs Awaiting Testing</h2>
          {bugsToTest.length > 0 ? (
            <div className="bugs-list">
              {bugsToTest.map(bug => (
                <div key={bug.id} className="bug-item">
                  <div className="bug-title">{bug.title}</div>
                  <div className="bug-meta">
                    <span className={`priority-badge priority-${bug.priority.toLowerCase()}`}>
                      {bug.priority}
                    </span>
                    <span className={`status-badge status-${bug.status.toLowerCase().replace('_', '-')}`}>
                      {bug.status}
                    </span>
                    <span className="developer">Fixed by: {bug.developer}</span>
                    <span className="fixed-date">Fixed: {bug.fixedDate}</span>
                  </div>
                  <div className="bug-actions">
                    <button className="action-btn" onClick={() => viewBugDetails(bug.id)}>
                      View Details
                    </button>
                    <button className="action-btn success" onClick={() => markAsTested(bug.id, 'PASSED')}>
                      Mark as Passed
                    </button>
                    <button className="action-btn danger" onClick={() => markAsTested(bug.id, 'FAILED')}>
                      Mark as Failed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No bugs to test</h3>
              <p>All bugs have been tested or are being fixed by developers.</p>
            </div>
          )}
        </div>

        {/* Tested Bugs Section */}
        <div className="bugs-section">
          <h2>Tested Bugs</h2>
          {testedBugs.length > 0 ? (
            <div className="bugs-list">
              {testedBugs.map(bug => (
                <div key={bug.id} className="bug-item">
                  <div className="bug-title">{bug.title}</div>
                  <div className="bug-meta">
                    <span className={`priority-badge priority-${bug.priority.toLowerCase()}`}>
                      {bug.priority}
                    </span>
                    <span className={`status-badge status-${bug.status.toLowerCase().replace('_', '-')}`}>
                      {bug.status}
                    </span>
                    <span className="tester">Tested by: {bug.tester}</span>
                    <span className="test-date">Tested: {bug.testDate}</span>
                  </div>
                  <div className="bug-actions">
                    <button className="action-btn" onClick={() => viewBugDetails(bug.id)}>
                      View Details
                    </button>
                    <button className="action-btn primary" onClick={() => openReportModal(bug.id)}>
                      Generate Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No tested bugs yet</h3>
              <p>Bugs you test will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => navigate('/add')}>
            Report New Bug
          </button>
          <button className="action-btn" onClick={() => navigate('/view')}>
            View All Bugs
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content report-modal">
            <div className="modal-header">
              <h2>Generate Test Report</h2>
              <button className="close-btn" onClick={closeReportModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="bug-info">
                <h3>{selectedBug.title}</h3>
                <p>Priority: <span className={`priority-badge priority-${selectedBug.priority.toLowerCase()}`}>
                  {selectedBug.priority}
                </span></p>
              </div>
              
              <form className="report-form">
                <div className="form-group">
                  <label>Test Environment</label>
                  <input 
                    type="text" 
                    name="testEnvironment"
                    value={reportData.testEnvironment}
                    onChange={handleReportInputChange}
                    placeholder="e.g., Chrome v98, Windows 10"
                  />
                </div>
                
                <div className="form-group">
                  <label>Test Steps</label>
                  <textarea 
                    name="testSteps"
                    value={reportData.testSteps}
                    onChange={handleReportInputChange}
                    placeholder="Step-by-step instructions to reproduce the test"
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>Expected Result</label>
                  <textarea 
                    name="expectedResult"
                    value={reportData.expectedResult}
                    onChange={handleReportInputChange}
                    placeholder="What should have happened"
                    rows="2"
                  />
                </div>
                
                <div className="form-group">
                  <label>Actual Result</label>
                  <textarea 
                    name="actualResult"
                    value={reportData.actualResult}
                    onChange={handleReportInputChange}
                    placeholder="What actually happened"
                    rows="2"
                  />
                </div>
                
                <div className="form-group">
                  <label>Additional Comments</label>
                  <textarea 
                    name="additionalComments"
                    value={reportData.additionalComments}
                    onChange={handleReportInputChange}
                    placeholder="Any additional notes or observations"
                    rows="2"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="action-btn" onClick={closeReportModal}>Cancel</button>
              <button className="action-btn primary" onClick={submitTestReport}>Generate Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TesterDashboard;