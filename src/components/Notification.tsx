import React, { useState, useEffect } from "react";
import "../css/Notification.css";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Close the notification after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification">
      <p>{message}</p>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default Notification;
