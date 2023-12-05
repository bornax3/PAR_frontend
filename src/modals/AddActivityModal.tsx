import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/Modal.css";
import { message } from "antd";

interface AddActivityModalProps {
  onClose: () => void;
  userToken: string | null;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({
  onClose,
  userToken,
}) => {
  const [KategorijaAktivnostiId, setKategorijaAktivnostiId] = useState<
    number | null
  >(null);
  const [opis, setOpis] = useState("");
  const [brojBodova, setBrojBodova] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [activities, setActivities] = useState<any>([]);

  const handleSubmit = async () => {
    console.log(
      "Vrijednosti za submit:",
      KategorijaAktivnostiId,
      opis,
      brojBodova
    );
    if (selectedActivityId === null || opis === "" || brojBodova === null) {
      // Provjera valjanosti unesenih podataka
      console.error("Sva polja su obavezna.");
      return;
    }

    try {
      const response = await axios.post(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/Aktivnosti",
        {
          KategorijaAktivnostiId: selectedActivityId,
          opis,
          brojBodova: Number(brojBodova),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("Activity added:", response.data);
      message.success("Kriterij uspješno dodan!");
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data || "Došlo je do pogreške");
      }
    }
  };

  const handleCloseModal = () => {
    onClose();
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

  // Fetch activities for the dropdown
  useEffect(() => {
    axios
      .get(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/Aktivnosti/KategorijaAktivnosti",
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((response) => {
        setActivities(response.data);
        console.log("Activities:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  const [selectedActivityId, setSelectedActivityId] = useState("");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedActivityId(selectedId);
  };

  return (
    <div className="modalBackground">
      <div className="modal" ref={modalRef}>
        <div className="modalHeader">
          <h2>Dodaj kriterij</h2>
          <button className="closeButton" onClick={() => onClose()}>
            x
          </button>
        </div>
        <div className="modalBodyShort">
          <div className="formGroupDropdown">
            <div className="dropdown">
              <select
                className="inputField"
                value={selectedActivityId}
                title="Odaberite kategoriju datoteke"
                required
                onChange={handleSelectChange}
              >
                <option value="" disabled>
                  Odaberite kategoriju
                </option>
                {activities.map((activity: any) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.naziv}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="formGroup">
            <label>Opis</label>
            <input
              type="text"
              name="opis"
              placeholder="Unesi opis aktivnosti"
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Broj bodova</label>
            <input
              type="number"
              name="brojBodova"
              placeholder="Unesi bodove aktivnosti"
              value={brojBodova}
              onChange={(e) => setBrojBodova(e.target.value)}
            />
          </div>
        </div>
        <div className="modalFooter">
          <button className="cancelButton" onClick={() => onClose()}>
            Odustani
          </button>
          <button className="actionButton" onClick={handleSubmit}>
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddActivityModal;
