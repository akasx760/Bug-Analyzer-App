import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import Toast from "./Toast";
import "./ViewBugs.css";

function ViewBugs() {
  const [bugs, setBugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [sortBy, setSortBy] = useState("createdDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchBugs = async (page = currentPage, size = pageSize) => {
    try {
      let url;
      if (filter === "all") {
        url = `${API_BASE_URL}/bugs?page=${page}&size=${size}&sortBy=${sortBy}&direction=${sortDirection}`;
      } else {
        url = `${API_BASE_URL}/bugs?status=${filter}`;
      }
  
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        
        if (filter === "all") {
          // Paginated response (Page object)
          setBugs(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        } else {
          // Non-paginated response (List)
          setBugs(data);
          setTotalPages(1);
          setTotalElements(data.length);
        }
      } else {
        console.error("Failed to fetch bugs");
        showToast("Failed to load bugs.", "error");
      }
    } catch (err) {
      console.error("Error fetching bugs:", err);
      showToast("Error loading bugs.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs(0); // Reset to first page when filter changes
  }, [filter, sortBy, sortDirection]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bug?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/bugs/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          showToast("Bug deleted successfully!");
          fetchBugs(currentPage);
        } else {
          showToast("Failed to delete bug.", "error");
        }
      } catch (error) {
        console.error("Error deleting bug:", error);
        showToast("Error deleting bug.", "error");
      }
    }
  };

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

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      fetchBugs(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when page size changes
    fetchBugs(0, newSize);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column, default to descending
      setSortBy(column);
      setSortDirection("desc");
    }
    setCurrentPage(0); // Reset to first page when sort changes
  };

  const getSortIndicator = (column) => {
    if (sortBy === column) {
      return sortDirection === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  const filteredBugs = filter === "all" 
    ? bugs 
    : bugs.filter(bug => bug.status === filter);

  if (isLoading) {
    return (
      <div className="view-bugs-container">
        <div className="loading-spinner">Loading bugs...</div>
      </div>
    );
  }

  return (
    <div className="view-bugs-container">
      <div className="view-bugs-header">
        <h2>All Bugs</h2>
        <div className="controls-row">
          <div className="filter-controls">
            <label>Filter by status:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div className="page-size-controls">
            <label>Items per page:</label>
            <select 
              value={pageSize} 
              onChange={handlePageSizeChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pagination-info">
        Showing {filteredBugs.length} of {totalElements} bugs
        {filter !== "all" && ` (filtered by ${filter})`}
      </div>

      {filteredBugs.length === 0 ? (
        <div className="no-bugs-message">
          {filter === "all" 
            ? "No bugs found. Add a new bug to get started!" 
            : `No bugs with status "${filter}" found.`}
        </div>
      ) : (
        <>
          <div className="bugs-table-container">
            <table className="bugs-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("bugId")} className="sortable">
                    ID{getSortIndicator("bugId")}
                  </th>
                  <th onClick={() => handleSort("title")} className="sortable">
                    Title{getSortIndicator("title")}
                  </th>
                  <th>Description</th>
                  <th onClick={() => handleSort("status")} className="sortable">
                    Status{getSortIndicator("status")}
                  </th>
                  <th onClick={() => handleSort("priority")} className="sortable">
                    Priority{getSortIndicator("priority")}
                  </th>
                  <th onClick={() => handleSort("reporter")} className="sortable">
                    Reporter{getSortIndicator("reporter")}
                  </th>
                  <th onClick={() => handleSort("createdDate")} className="sortable">
                    Created Date{getSortIndicator("createdDate")}
                  </th>
                  <th>Attachments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBugs.map((bug) => (
                  <tr key={bug.bugId}>
                    <td>{bug.bugId}</td>
                    <td>{bug.title}</td>
                    <td className="description-cell">{bug.description}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(bug.status)}`}>
                        {bug.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(bug.priority)}`}>
                        {bug.priority}
                      </span>
                    </td>
                    <td>{bug.reporter}</td>
                    <td>{bug.createdDate}</td>
                    <td>
                      <div className="attachments-info">
                        {bug.imageUrls && bug.imageUrls.length > 0 && (
                          <span className="attachment-count">
                            {bug.imageUrls.length} image(s)
                          </span>
                        )}
                        {bug.documentUrls && bug.documentUrls.length > 0 && (
                          <span className="attachment-count">
                            {bug.documentUrls.length} document(s)
                          </span>
                        )}
                        {(!bug.imageUrls || bug.imageUrls.length === 0) && 
                         (!bug.documentUrls || bug.documentUrls.length === 0) && (
                          <span className="no-attachments">No attachments</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => navigate(`/view/${bug.bugId}`)}
                        >
                          View
                        </button>
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => navigate(`/update/${bug.bugId}`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(bug.bugId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filter === "all" && totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0}
              >
                « First
              </button>
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                ‹ Previous
              </button>
              
              <span className="pagination-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                Next ›
              </button>
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
              >
                Last »
              </button>
            </div>
          )}
        </>
      )}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default ViewBugs;