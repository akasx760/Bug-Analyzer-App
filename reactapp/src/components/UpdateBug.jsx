import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import Toast from "./Toast";
import "./AddBug.css";

function UpdateBug() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    reporter: "",
    createdDate: "",
  });
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          setExistingImages(data.imageUrls || []);
          setExistingDocuments(data.documentUrls || []);
        } else {
          console.error("Failed to fetch bug");
          showToast("Failed to load bug details.", "error");
        }
      } catch (err) {
        console.error("Error fetching bug:", err);
        showToast("Error loading bug details.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBug();
  }, [id]);

  const handleChange = (e) => {
    setBug({ ...bug, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleDocumentChange = (e) => {
    setDocuments([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("bug", new Blob([JSON.stringify(bug)], { type: "application/json" }));
      
      // Append new images
      images.forEach((image) => {
        formData.append("images", image);
      });
      
      // Append new documents
      documents.forEach((document) => {
        formData.append("documents", document);
      });

      const res = await fetch(`${API_BASE_URL}/bugs/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        showToast("Bug updated successfully!");
        setTimeout(() => navigate("/view"), 1000);
      } else {
        showToast("Failed to update bug.", "error");
      }
    } catch (error) {
      console.error("Error updating bug:", error);
      showToast("Error updating bug.", "error");
    } finally {
      setIsSubmitting(false);
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
          // Update the state to remove the deleted attachment
          if (type === "image") {
            setExistingImages(existingImages.filter(img => img !== filename));
          } else {
            setExistingDocuments(existingDocuments.filter(doc => doc !== filename));
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
      <div className="update-bug-container">
        <div className="loading-spinner">Loading bug details...</div>
      </div>
    );
  }

  return (
    <div className="update-bug-container">
      <div className="form-card">
        <h2 className="form-title">Update Bug #{id}</h2>
        <form className="bug-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">Bug Title</label>
            <input
              id="title"
              name="title"
              placeholder="Enter bug title"
              value={bug.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the bug in detail"
              value={bug.description}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={bug.status}
              onChange={handleChange}
              required
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={bug.priority}
              onChange={handleChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="reporter">Reporter</label>
            <input
              id="reporter"
              name="reporter"
              placeholder="Reporter name"
              value={bug.reporter}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="createdDate">Created Date</label>
            <input
              type="date"
              id="createdDate"
              name="createdDate"
              value={bug.createdDate}
              onChange={handleChange}
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="form-group">
              <label>Existing Images</label>
              <div className="existing-attachments">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="attachment-item">
                    <img 
                      src={`${API_BASE_URL}/uploads/${imageUrl}`} 
                      alt={`Existing image ${index + 1}`}
                      className="existing-image"
                    />
                    <button 
                      type="button"
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

          {/* New Image Upload */}
          <div className="form-group">
            <label htmlFor="images">Add New Images</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {images.length > 0 && (
              <div className="file-preview">
                <p>Selected images: {images.length}</p>
              </div>
            )}
          </div>

          {/* Existing Documents */}
          {existingDocuments.length > 0 && (
            <div className="form-group">
              <label>Existing Documents</label>
              <div className="existing-attachments">
                {existingDocuments.map((documentUrl, index) => (
                  <div key={index} className="attachment-item">
                    <a 
                      href={`${API_BASE_URL}/uploads/${documentUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      Document {index + 1}
                    </a>
                    <button 
                      type="button"
                      className="delete-attachment-btn"
                      onClick={() => handleDeleteAttachment(documentUrl, "document")}
                      title="Delete document"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Document Upload */}
          <div className="form-group">
            <label htmlFor="documents">Add New Documents</label>
            <input
              type="file"
              id="documents"
              name="documents"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleDocumentChange}
            />
            {documents.length > 0 && (
              <div className="file-preview">
                <p>Selected documents: {documents.length}</p>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate("/view")}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : "Update Bug"}
            </button>
          </div>
        </form>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default UpdateBug;