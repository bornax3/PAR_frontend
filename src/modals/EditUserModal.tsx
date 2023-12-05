import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Admin } from "../pages/Admins";
import { User } from "../components/UserList";
import "../css/Modal.css";

interface EditUserModalProps {
  onClose: () => void;
  userToken: string | null;
  admin?: Admin | null;
  user?: User | null;
}

const EditAdminModal: React.FC<EditUserModalProps> = ({
  onClose,
  userToken,
  admin,
  user,
}) => {
  const [updatedUser, setupdatedUser] = useState<Admin | User | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    onClose();
  };

  useEffect(() => {
    if (admin) {
      setupdatedUser(admin);
    } else if (user) {
      setupdatedUser(user);
    }
  }, [admin, user]);

  const handleInputChange = <T extends Admin | User>(
    name: keyof T,
    value: string | number
  ) => {
    setupdatedUser((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!updatedUser) {
      return; // Ensure updatedUser is not null before making the request
    }
    axios
      .put(
        `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Admin data updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating admin data:", error);
      });
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
          <h2>Ažuriraj člana</h2>
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
              value={updatedUser?.ime || ""}
              onChange={(e) => handleInputChange("ime", e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Prezime</label>
            <input
              type="text"
              name="prezime"
              placeholder="Unesi prezime"
              value={updatedUser?.prezime || ""}
              onChange={(e) => handleInputChange("prezime", e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Broj mobitela</label>
            <input
              type="text"
              name="brojMobitela"
              placeholder="Unesi broj mobitela"
              value={updatedUser?.brojMobitela || ""}
              onChange={(e) =>
                handleInputChange("brojMobitela", e.target.value)
              }
            />
          </div>

          <div className="modalFooter">
            <button className="cancelButton" onClick={handleCloseModal}>
              Odustani
            </button>
            <button className="actionButton" onClick={handleSubmit}>
              Ažuriraj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAdminModal;
