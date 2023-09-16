import React, { useRef, useEffect } from "react";
import { School } from "../components/SchoolList";
import UserList from "../components/UserList";
import "../css/SchoolUserModal.css";

interface SchoolUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToken: string | null;
  ustanovaId: number | null | undefined;
  school: School | null;
}

const SchoolUserModal: React.FC<SchoolUserModalProps> = ({
  isOpen,
  onClose,
  userToken,
  ustanovaId,
  school,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    onClose();
  };

  // Add an event listener to handle clicks outside the modal
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className={`modal-container ${isOpen ? "open" : ""}`}>
      <div
        className={`school-user-modal ${isOpen ? "open" : ""}`}
        ref={modalRef}
      >
        <div className="content">
          <div className="modal-header">
            <h2 className="modal-title">Users</h2>
            <button className="close-button" onClick={handleCloseModal}>
              X
            </button>
          </div>
          {/* Render the UserList component with the necessary props */}
          <UserList
            userId={null}
            userToken={userToken}
            ustanovaId={ustanovaId}
          />
        </div>
      </div>
    </div>
  );
};

export default SchoolUserModal;
