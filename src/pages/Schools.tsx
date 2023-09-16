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

  // Function to open AddSchoolModal
  const handleAddSchool = () => {
    setIsAddSchoolModalOpen(true);
  };

  // Function to close AddSchoolModal
  const handleCloseModal = () => {
    setIsAddSchoolModalOpen(false);
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
      <h1 className="header">Schools</h1>
      <SchoolList userToken={userToken} />
      <button onClick={handleAddSchool}>+</button>

      {/* Render the AddSchoolModal when isAddSchoolModalOpen is true */}
      {isAddSchoolModalOpen && (
        <div ref={modalRef}>
          <AddSchoolModal onClose={handleCloseModal} userToken={userToken} />
        </div>
      )}
    </div>
  );
};

export default Schools;
