import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../css/Modal.css";
import { School } from "../components/SchoolList";

interface AddAdminModalProps {
  onClose: () => void;
  userToken: string | null;
  schoolOptions: School[];
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  onClose,
  userToken,
  schoolOptions,
}) => {
  const [adminInfo, setAdminInfo] = useState({
    ime: "",
    prezime: "",
    email: "",
    ovlast: "voditeljUstanove",
    skolskaUstanova: "",
    brojMobitela: "",
    lozinkaHash: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAdminInfo({
      ...adminInfo,
      [name]: value,
    });
  };

  const handleAddAdmin = () => {
    // Send a POST request to add admin
    axios
      .post(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/novikorisnikadminunos/admin",
        adminInfo,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Admin added successfully:", response.data);
        // You can perform additional actions here if needed
        handleCloseModal(); // Close the modal
      })
      .catch((error) => {
        console.error("Error adding admin:", error);
      });
  };

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
          <h2>Dodaj voditelja ustanove</h2>
          <button className="closeButton" onClick={handleCloseModal}>
            x
          </button>
        </div>
        <div className="modalBodyShort">
          <div className="formGroup">
            <label>Ime</label>
            <input
              type="text"
              name="ime"
              placeholder="Unesi ime"
              value={adminInfo.ime}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Prezime</label>
            <input
              type="text"
              name="prezime"
              placeholder="Unesi prezime"
              value={adminInfo.prezime}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Unesi email"
              value={adminInfo.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Školska ustanova</label>
            <select
              name="skolskaUstanova"
              value={adminInfo.skolskaUstanova}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Odaberi školsku ustanovu
              </option>
              {schoolOptions.map((school) => (
                <option key={school.id} value={school.id?.toString()}>
                  {school.naziv}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label>Broj mobitela</label>
            <input
              type="text"
              name="brojMobitela"
              placeholder="Npr. 098100100"
              value={adminInfo.brojMobitela}
              onChange={handleInputChange}
            />
          </div>
          <div className="formGroup">
            <label>Lozinka</label>
            <input
              type="password"
              name="lozinka"
              placeholder="Unesi lozinku"
              value={adminInfo.lozinkaHash}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="modalFooter">
          <button className="cancelButton" onClick={handleCloseModal}>
            Odustani
          </button>
          <button className="actionButton" onClick={handleAddAdmin}>
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
