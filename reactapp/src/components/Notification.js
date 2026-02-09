import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import "./Notification.css";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth();

  // Mock notifications data - replace with actual API calls
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Bug #1234 assigned to you",
        message: "A new bug has been assigned to you for fixing.",
        timestamp: "2023-05-15T10:30:00Z",
        read: false,
        type: "assignment"
      },
      {
        id: 2,
        title: "Bug #1235 status updated",
        message: "The status of bug #1235 has been changed to 'In Progress'.",
        timestamp: "2023-05-14T15:45:00Z",
        read: true,
        type: "status_change"
      },
      {
        id: 3,
        title: "New comment on Bug #1236",
        message: "John Doe added a new comment to bug #1236.",
        timestamp: "2023-05-13T09:15:00Z",
        read: true,
        type: "comment"
      }
    ];
    
    setNotifications(mockNotifications);
  }, [currentUser]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h2>Notifications</h2>
        {notifications.filter(n => !n.read).length > 0 && (
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="notification-time">{formatDate(notification.timestamp)}</span>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="mark-read-btn"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button 
                  className="delete-notification-btn"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;