// AddBug.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import Toast from "./Toast";
import "./AddBug.css";

function AddBug() {
  const navigate = useNavigate();
  const [bug, setBug] = useState({
    title: "",
    description: "",
    status: "Open",
    priority: "Medium",
    reporter: "",
    createdDate: "",
  });
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

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

    const bugToSubmit = {
      ...bug,
      createdDate: bug.createdDate || new Date().toISOString().split("T")[0],
    };

    try {
      const formData = new FormData();
      formData.append("bug", new Blob([JSON.stringify(bugToSubmit)], { type: "application/json" }));
      
      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });
      
      // Append documents
      documents.forEach((document) => {
        formData.append("documents", document);
      });

      const res = await fetch(`${API_BASE_URL}/bugs`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showToast("Bug added successfully!");
        setBug({
          title: "",
          description: "",
          status: "Open",
          priority: "Medium",
          reporter: "",
          createdDate: "",
        });
        setImages([]);
        setDocuments([]);
        setTimeout(() => navigate("/view", { replace: true }), 1000);
      } else {
        showToast("Failed to add bug.", "error");
      }
    } catch (error) {
      console.error("Error adding bug:", error);
      showToast("Error adding bug.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-bug-container">
      <div className="form-card">
        <h2 className="form-title">Add New Bug</h2>
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
              placeholder="Your name"
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
          
          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
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
          
          {/* Document Upload */}
          <div className="form-group">
            <label htmlFor="documents">Upload Documents</label>
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
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Adding...
              </>
            ) : "Add Bug"}
          </button>
        </form>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default AddBug;