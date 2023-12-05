import React, { useState, useEffect, useRef } from "react";
import "../css/Modal.css"; // Add your custom modal styles here
import axios from "axios";
import { message } from "antd";

interface AddSchoolModalProps {
  onClose: () => void;
  userToken: string | null;
  onSchoolAdded: () => void;
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  onClose,
  userToken,
  onSchoolAdded,
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
        message.success("Škola uspješno dodana!");
        onSchoolAdded();
        handleClose();
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Došlo je do pogreške");
        }
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
    <div className="modalBackground">
      <div className="modal" ref={modalRef}>
        <div className="modalHeader">
          <h2>Dodaj školu</h2>
          <button className="closeButton" onClick={handleClose}>
            x
          </button>
        </div>
        <div className="modalBodyShort">
          <div className="formGroup">
            <label>Naziv</label>
            <input
              type="text"
              name="naziv"
              placeholder="Unesite ime škole"
              value={schoolInfo.naziv}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Adresa</label>
            <input
              type="text"
              name="adresa"
              placeholder="Unesite adresu škole"
              value={schoolInfo.adresa}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Web</label>
            <input
              type="text"
              name="web"
              placeholder="Unesite web stranicu škole"
              value={schoolInfo.web}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Kontakt</label>
            <input
              type="text"
              name="kontakt"
              placeholder="Unesite kontakt škole"
              value={schoolInfo.kontakt}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Unesite email škole"
              value={schoolInfo.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="modalFooter">
          <button className="cancelButton" onClick={handleClose}>
            Odustani
          </button>
          <button className="actionButton" onClick={handleAddSchool}>
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSchoolModal;
