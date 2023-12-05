import React from "react";
//import "../css/SessionExpiredNotification.css";

interface SessionExpiredNotificationProps {
  onClose: () => void;
}

const SessionExpiredNotification: React.FC<SessionExpiredNotificationProps> = ({
  onClose,
}) => {
  return (
    <div className="session-expired-notification">
      <p>Sesija je istekla. Molimo Vas da se ponovno prijavite.</p>
      <button onClick={onClose}>U redu</button>
    </div>
  );
};

export default SessionExpiredNotification;
