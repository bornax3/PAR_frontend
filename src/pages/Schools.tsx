import React, { useState, useEffect, useRef } from "react";
import SchoolList from "../components/SchoolList";
import useAuth from "../hooks/useAuth";
import "../css/Schools.css";
import AddSchoolModal from "../modals/AddSchoolModal";

const Schools: React.FC = () => {
  const { userToken } = useAuth();

  // State variables for AddSchoolModal
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);

  // Ref to access the modal container
  const modalRef = useRef<HTMLDivElement>(null);

  // State variable to trigger a refresh when a school is added
  const [refreshSchoolList, setRefreshSchoolList] = useState(false);

  // Function to open AddSchoolModal
  const handleAddSchool = () => {
    setIsAddSchoolModalOpen(true);
  };

  // Function to close AddSchoolModal and trigger a refresh
  const handleCloseModal = () => {
    setIsAddSchoolModalOpen(false);
    // Set the state variable to trigger a refresh
    setRefreshSchoolList(true);
  };

  // Close the modal when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    };

    if (isAddSchoolModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isAddSchoolModalOpen]);

  return (
    <div className="content">
      <h1 className="header">Škole</h1>
      <SchoolList
        key={refreshSchoolList ? "refresh" : "no-refresh"}
        userToken={userToken}
      />
      <button
        className="buttonAdd"
        title="Dodaj školu"
        onClick={handleAddSchool}
      >
        +
      </button>
      {isAddSchoolModalOpen && (
        <div ref={modalRef}>
          <AddSchoolModal
            onClose={handleCloseModal}
            userToken={userToken}
            // Pass the onSchoolAdded function to handle the notification
            onSchoolAdded={() => setRefreshSchoolList(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Schools;
