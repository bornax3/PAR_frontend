import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../css/Modal.css";
import { message } from "antd";

interface EditActivityModalProps {
  activityId: number;
  userToken: string | null;
  onClose: () => void;
  onActivityUpdated: (updatedActivity: any) => void;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  activityId,
  onClose,
  userToken,
  onActivityUpdated,
}) => {
  const [activity, setActivity] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [activities, setActivities] = useState<any>([]);
  const [name, setName] = useState("");

  const handleCloseModal = () => {
    onClose();
  };

  useEffect(() => {
    // Fetch activity data to be edited
    axios
      .get(
        `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/aktivnosti/${activityId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        setActivity(response.data);
        setSelectedActivityId(response.data.KategorijaAktivnostiId); // Postavite odabrani ID kategorije na temelju aktivnosti
        setName(response.data.nazivKategorije);
        console.log("Activity data fetched:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [activityId]);

  const handleInputChange = (name: string, value: string | number) => {
    setActivity((prevActivity: any) => ({
      ...prevActivity,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!activity || !selectedActivityId) {
      message.error("Sva polja su obavezna.");
      return;
    }

    console.log("Activity data kod submita:", updatedActivity);

    axios
      .put(
        `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/aktivnosti/${activityId}`,
        updatedActivity,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        message.success("Kriterij uspješno ažuriran!");
        console.log("Activity data updated:", response.data);

        // Notify the parent component with the updated activity data
        onActivityUpdated(response.data);
        handleCloseModal();
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Došlo je do pogreške");
        }
      });
  };

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
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Došlo je do pogreške");
        }
      });
  }, []);

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

  const [selectedActivityId, setSelectedActivityId] = useState("");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedActivityId(selectedId);
  };

  const updatedActivity = {
    KategorijaAktivnostiId: parseInt(selectedActivityId, 10),
    opis: activity && activity.opis,
    brojBodova: parseInt(activity && activity.brojBodova, 10),
  };

  return (
    <div className="modalBackground">
      <div className="modalWide" ref={modalRef}>
        <div className="modalHeaderWide">
          <h2>Uredi kriterij</h2>
          <button className="closeButton" onClick={handleCloseModal}>
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
            <label htmlFor="activityName">Naziv kriterija</label>
            <input
              type="text"
              name="opis"
              id="opis"
              value={activity?.opis || ""}
              onChange={(e) => handleInputChange("opis", e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="activityBodovi">Bodovi</label>
            <input
              type="number"
              name="brojBodova"
              id="brojBodova"
              value={activity?.brojBodova || ""}
              onChange={(e) => handleInputChange("brojBodova", e.target.value)}
            />
          </div>
        </div>
        <div className="modalFooter">
          <button className="cancelButton" onClick={handleCloseModal}>
            Odustani
          </button>
          <button className="actionButton" onClick={handleSubmit}>
            Spremi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditActivityModal;
