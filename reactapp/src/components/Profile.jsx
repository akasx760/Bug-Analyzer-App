// Profile.jsx - Enhanced with password validation
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import "./Profile.css";

function Profile() {
  const { currentUser, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || ""
      });
    }
  }, [currentUser]);

  useEffect(() => {
    // Check password strength
    if (passwordData.newPassword) {
      checkPasswordStrength(passwordData.newPassword);
    } else {
      setPasswordStrength("");
    }
  }, [passwordData.newPassword]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Contains number
    if (/[0-9]/.test(password)) strength++;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) setPasswordStrength("weak");
    else if (strength < 5) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateProfile(formData);

    if (result.success) {
      showToast("Profile updated successfully!");
      setIsEditing(false);
    } else {
      showToast(result.error, "error");
    }

    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (passwordStrength === "weak") {
      showToast("Please choose a stronger password", "error");
      return;
    }

    setIsLoading(true);

    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

    if (result.success) {
      showToast("Password changed successfully!");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } else {
      showToast(result.error, "error");
    }

    setIsLoading(false);
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>User Profile</h2>
          <div className="profile-actions">
            {!isEditing && !isChangingPassword && (
              <>
                <button 
                  className="edit-toggle-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
                <button 
                  className="password-toggle-btn"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </button>
              </>
            )}
            {(isEditing || isChangingPassword) && (
              <button 
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="profile-content">
          {isEditing ? (
            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : isChangingPassword ? (
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                {passwordData.newPassword && (
                  <div className={`password-strength ${passwordStrength}`}>
                    Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                  <li>At least 8 characters long</li>
                  <li>Contains uppercase and lowercase letters</li>
                  <li>Includes at least one number</li>
                  <li>Includes at least one special character</li>
                </ul>
              </div>
              
              <button 
                type="submit" 
                className="save-btn"
                disabled={isLoading || passwordStrength === "weak"}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-avatar">
                {currentUser.firstName?.charAt(0) || currentUser.email.charAt(0).toUpperCase()}
              </div>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{currentUser.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Member Since:</span>
                <span className="detail-value">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="app-info-section">
          <h3>About Bug Analyzer</h3>
          <p>
            Bug Analyzer is a comprehensive bug tracking system that helps development teams 
            track, manage, and resolve software issues efficiently. Our platform provides 
            real-time collaboration, detailed reporting, and seamless integration with your 
            development workflow.
          </p>
        </div>

        <div className="terms-section">
          <h3>Terms of Service</h3>
          <div className="terms-content">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            <p>
              1. You agree to use Bug Analyzer only for lawful purposes and in accordance 
              with these Terms of Service.
            </p>
            <p>
              2. You are responsible for maintaining the confidentiality of your account 
              and password.
            </p>
            <p>
              3. We reserve the right to modify or terminate the service for any reason, 
              without notice at any time.
            </p>
            <p>
              4. Your use of the service is at your sole risk. The service is provided on 
              an "as is" and "as available" basis.
            </p>
            <p>
              5. You retain all ownership rights to your content, but grant us a license 
              to use it for providing the service.
            </p>
          </div>
        </div>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default Profile;