import React, { useRef, useEffect } from "react";
import { School } from "../components/SchoolList";
import UserList from "../components/UserList";
//import "../css/SchoolUserModal.css";
import "../css/Modal.css";

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
  /*useEffect(() => {
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
  }, [isOpen]);*/

  // Add an event listener to handle clicks outside the modal
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="modalBackground">
      <div className="modal" ref={modalRef}>
        <div className="modalHeader">
          <h2 className="modalTitle">Članovi</h2>
          <button className="closeButton" onClick={handleCloseModal}>
            x
          </button>
        </div>
        <div className="modalBody">
          <UserList
            userId={null}
            userToken={userToken}
            ustanovaId={ustanovaId}
            filterByRole={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SchoolUserModal;
