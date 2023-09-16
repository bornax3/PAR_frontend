import React, { useEffect, useRef, useState } from "react";
import { School } from "../components/SchoolList";
import axios from "axios"; // Import Axios for making API requests
import "../css/SchoolEditModal.css";

interface SchoolEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToken: string | null;
  school: School | null;
}

const SchoolEditModal: React.FC<SchoolEditModalProps> = ({
  isOpen,
  onClose,
  userToken,
  school,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [updatedSchool, setUpdatedSchool] = useState<School | null>(null);

  const handleCloseModal = () => {
    onClose();
  };

  useEffect(() => {
    if (school) {
      // Initialize the updatedSchool state with the current school data
      setUpdatedSchool(school);
    }
  }, [school]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, handleCloseModal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  };

  const handleSaveChanges = async () => {
    if (updatedSchool) {
      try {
        // Make an Axios PUT request to update the school data
        const response = await axios.put(
          `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/SkolskeUstanove/${updatedSchool.id}`,
          updatedSchool,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("School data updated:", response.data);

        // Close the modal after successful update
        onClose();
      } catch (error) {
        console.error("Error updating school data:", error);
      }
    }
  };

  return (
    <div className={`modal-container ${isOpen ? "open" : ""}`}>
      <div
        className={`school-edit-modal ${isOpen ? "open" : ""}`}
        ref={modalRef}
      >
        <div className="school-edit-modal-header">
          <h2>Edit School</h2>
        </div>
        <div className="school-edit-modal-details">
          <div>
            <label>Naziv:</label>
            <input
              type="text"
              name="naziv"
              value={updatedSchool?.naziv || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={updatedSchool?.email || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Adresa:</label>
            <input
              type="text"
              name="adresa"
              value={updatedSchool?.adresa || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Kontakt:</label>
            <input
              type="text"
              name="kontakt"
              value={updatedSchool?.kontakt || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Web:</label>
            <input
              type="text"
              name="web"
              value={updatedSchool?.web || ""}
              onChange={handleInputChange}
            />
          </div>
          {/* Add more input fields for other school properties */}
        </div>
        <div className="school-edit-modal-buttons">
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="cancel-button" onClick={handleCloseModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolEditModal;
