import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import Toast from "./Toast";
import "./ViewBugDetails.css";

function ViewBugDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  useEffect(() => {
    const fetchBug = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/bugs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBug(data);
        } else {
          console.error("Failed to fetch bug details");
          showToast("Failed to load bug details.", "error");
        }
      } catch (err) {
        console.error("Error fetching bug details:", err);
        showToast("Error loading bug details.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBug();
  }, [id]);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High": return "priority-high";
      case "Medium": return "priority-medium";
      case "Low": return "priority-low";
      case "Critical": return "priority-critical";
      default: return "priority-medium";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Open": return "status-open";
      case "In Progress": return "status-in-progress";
      case "Resolved": return "status-resolved";
      case "Closed": return "status-closed";
      default: return "status-open";
    }
  };

  const handleDeleteAttachment = async (filename, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const res = await fetch(`${API_BASE_URL}/bugs/${id}/attachments/${filename}?type=${type}`, {
          method: "DELETE",
        });

        if (res.ok) {
          showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
          // Refresh bug data
          const updatedRes = await fetch(`${API_BASE_URL}/bugs/${id}`);
          if (updatedRes.ok) {
            const updatedData = await updatedRes.json();
            setBug(updatedData);
          }
        } else {
          showToast(`Failed to delete ${type}.`, "error");
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        showToast(`Error deleting ${type}.`, "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bug-details-container">
        <div className="loading-spinner">Loading bug details...</div>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="bug-details-container">
        <div className="error-message">Bug not found</div>
        <button className="back-button" onClick={() => navigate("/view")}>
          ← Back to Bugs
        </button>
      </div>
    );
  }

  return (
    <div className="bug-details-container">
      <div className="bug-details-card">
        <div className="bug-details-header">
          <h2>Bug Details</h2>
          <button className="back-button" onClick={() => navigate("/view")}>
            ← Back to Bugs
          </button>
        </div>
        
        <div className="bug-details-content">
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">#{bug.bugId}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Title:</span>
            <span className="detail-value">{bug.title}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{bug.description}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className={`status-badge ${getStatusClass(bug.status)}`}>
              {bug.status}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Priority:</span>
            <span className={`priority-badge ${getPriorityClass(bug.priority)}`}>
              {bug.priority}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Reporter:</span>
            <span className="detail-value">{bug.reporter}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Created Date:</span>
            <span className="detail-value">{bug.createdDate}</span>
          </div>

          {/* Display Images */}
          {bug.imageUrls && bug.imageUrls.length > 0 && (
            <div className="attachments-section">
              <h3>Images</h3>
              <div className="image-grid">
                {bug.imageUrls.map((imageUrl, index) => (
                  <div key={index} className="image-item">
                    <img 
                      src={`${API_BASE_URL}/uploads/${imageUrl}`} 
                      alt={`Attachment ${index + 1}`}
                      className="bug-image"
                    />
                    <button 
                      className="delete-attachment-btn"
                      onClick={() => handleDeleteAttachment(imageUrl, "image")}
                      title="Delete image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Display Documents */}
          {bug.documentUrls && bug.documentUrls.length > 0 && (
            <div className="attachments-section">
              <h3>Documents</h3>
              <ul className="document-list">
                {bug.documentUrls.map((documentUrl, index) => (
                  <li key={index} className="document-item">
                    <a 
                      href={`${API_BASE_URL}/uploads/${documentUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      Document {index + 1} - {documentUrl}
                    </a>
                    <button 
                      className="delete-attachment-btn"
                      onClick={() => handleDeleteAttachment(documentUrl, "document")}
                      title="Delete document"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="bug-details-actions">
          <button 
            className="edit-btn"
            onClick={() => navigate(`/update/${bug.bugId}`)}
          >
            Edit Bug
          </button>
        </div>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default ViewBugDetails;