// Toast.jsx - Improved error display
import React, { useEffect } from "react";
import "./Toast.css";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Extract just the meaningful part of error messages
  const getDisplayMessage = (msg) => {
    if (typeof msg !== 'string') return 'An error occurred';
    
    // If it's a long JSON string, try to parse it
    if (msg.startsWith('{') && msg.includes('message')) {
      try {
        const parsed = JSON.parse(msg);
        return parsed.message || msg;
      } catch (e) {
        return msg;
      }
    }
    
    return msg;
  };

  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === "success" ? "✓" : type === "error" ? "✕" : "ⓘ"}
        </span>
        <span className="toast-message">{getDisplayMessage(message)}</span>
      </div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export default Toast;