import React, { useEffect, useRef, useState } from "react";
import { School } from "../components/SchoolList";
import axios from "axios";
import "../css/Modal.css";
import { message } from "antd";

interface SchoolEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToken: string | null;
  school: School | null;
  refreshSchoolList: () => void;
}

const SchoolEditModal: React.FC<SchoolEditModalProps> = ({
  isOpen,
  onClose,
  userToken,
  school,
  refreshSchoolList,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update the updatedSchool state with the new value
    setUpdatedSchool((prevSchool) => ({
      ...prevSchool!,
      [name]: value,
    }));
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
        message.success("Škola uspješno ažurirana!");
        refreshSchoolList();

        // Close the modal after successful update
        onClose();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Došlo je do pogreške");
        }
      }
    }
  };

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
          <h2>Uredi školu</h2>
          <button className="closeButton" onClick={handleCloseModal}>
            x
          </button>
        </div>
        <div className="modalBodyShort">
          <div className="formGroup">
            <label>Naziv:</label>
            <input
              type="text"
              name="naziv"
              value={updatedSchool?.naziv || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={updatedSchool?.email || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Adresa:</label>
            <input
              type="text"
              name="adresa"
              value={updatedSchool?.adresa || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Kontakt:</label>
            <input
              type="text"
              name="kontakt"
              value={updatedSchool?.kontakt || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
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
        <div className="modalFooter">
          <button className="cancelButton" onClick={handleCloseModal}>
            Odustani
          </button>
          <button className="actionButton" onClick={handleSaveChanges}>
            Spremi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolEditModal;
