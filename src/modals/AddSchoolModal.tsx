import React, { useState, useEffect, useRef } from "react";
import "../css/AddSchoolModal.css"; // Add your custom modal styles here
import axios from "axios";

interface AddSchoolModalProps {
  onClose: () => void;
  userToken: string | null;
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  onClose,
  userToken,
}) => {
  const [schoolInfo, setSchoolInfo] = useState({
    adresa: "",
    naziv: "",
    web: "",
    kontakt: "",
    email: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchoolInfo({
      ...schoolInfo,
      [name]: value,
    });
  };

  const handleAddSchool = () => {
    // Send a POST request to add a school
    axios
      .post(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/skolskeustanove",
        schoolInfo,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        console.log("School added successfully:", response.data);
        // You can perform additional actions here if needed
        handleClose(); // Close the modal
      })
      .catch((error) => {
        console.error("Error adding school:", error);
      });
  };

  // Add an event listener to handle clicks outside the modal
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="modal-background">
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Add School</h2>
          <button className="close-button" onClick={handleClose}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Naziv</label>
            <input
              type="text"
              name="naziv"
              placeholder="Enter school name"
              value={schoolInfo.naziv}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Adresa</label>
            <input
              type="text"
              name="adresa"
              placeholder="Enter school address"
              value={schoolInfo.adresa}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Web</label>
            <input
              type="text"
              name="web"
              placeholder="Enter school website"
              value={schoolInfo.web}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Kontakt</label>
            <input
              type="text"
              name="kontakt"
              placeholder="Enter school contact information"
              value={schoolInfo.kontakt}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter school email"
              value={schoolInfo.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button className="add-button" onClick={handleAddSchool}>
            Add School
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSchoolModal;
