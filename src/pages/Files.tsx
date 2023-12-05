import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import AddActivityModal from "../modals/AddActivityModal";
import "../css/List.css";
import EditActivityModal from "../modals/EditActivityModal";
import { message } from "antd";

interface Activity {
  id: number;
  opis: string;
  brojBodova: number;
  nazivKategorije: string;
}

const Files = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityId, setActivityId] = useState<number>(0);
  const { userToken } = useAuth();
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredActivities, setFilteredActivities] =
    useState<Activity[]>(activities);
  // Ref to access the modal container
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/aktivnosti",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [userToken, activities]);

  useEffect(() => {
    // Filter activities based on the search query
    const filtered = activities.filter((activity) => {
      const opis = activity.opis || "";
      return opis.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredActivities(filtered);
  }, [searchQuery, activities]);

  const handleActivityDelete = (activityId: number) => {
    // Show a confirmation dialog before deleting the activity
    const confirmDelete = window.confirm(
      `Jeste li sigurni da želite obrisati kriterij?`
    );

    if (confirmDelete) {
      axios
        .delete(
          `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/aktivnosti/${activityId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then(() => {
          // Remove the deleted activity from the list
          setActivities((prevActivities) =>
            prevActivities.filter((activity) => activity.id !== activityId)
          );

          console.log("Activity deleted successfully");
          message.success("Kriterij uspješno obrisan!");
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            message.error(error.response?.data || "Došlo je do pogreške");
          }
        });
    }
  };

  const handleActivityAdd = () => {
    // Show the AddActivityModal
    setIsAddActivityModalOpen(true);
  };

  const handleActivityEdit = (activityId: number) => {
    // Show the EditActivityModal
    setActivityId(activityId);
    setIsEditActivityModalOpen(true);
  };

  const handleEditActivityClose = () => {
    // Close the EditActivityModal
    setIsEditActivityModalOpen(false);
  };

  const handleAddActivityClose = () => {
    // Close the AddActivityModal
    setIsAddActivityModalOpen(false);
  };

  // Close the modal when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleAddActivityClose();
      }
    };

    if (isAddActivityModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isAddActivityModalOpen]);

  // Function to handle activity update and refresh the activities list
  const handleActivityUpdated = (updatedActivity: Activity) => {
    // Find the index of the updated activity in the activities array
    const updatedIndex = activities.findIndex(
      (activity) => activity.id === updatedActivity.id
    );

    if (updatedIndex !== -1) {
      // Clone the activities array to avoid directly modifying state
      const updatedActivities = [...activities];
      // Replace the old activity with the updated one
      updatedActivities[updatedIndex] = updatedActivity;
      // Update the state to trigger a re-render with the updated data
      setActivities(updatedActivities);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  return (
    <div className="content">
      <div className="listContent">
        <h1>Kriteriji</h1>
        <input
          className="listSearch"
          type="text"
          placeholder="Pretraži kriterije"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ul className="itemList">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <li className="listItem" key={activity.id}>
                <div className="listItemDetails">
                  <div className="listItemCategory">
                    {activity.nazivKategorije}
                  </div>
                  <br />
                  <div className="listItemName">{activity.opis}</div>
                  <div className="listItemDescription">
                    <span className="listItemSection">
                      Bodovi - [ {activity.brojBodova} ]
                    </span>
                  </div>
                </div>
                <div className="itemControl">
                  <button
                    className="itemButton"
                    onClick={() => handleActivityEdit(activity.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="itemButton"
                    onClick={() => handleActivityDelete(activity.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <div className="noResults">Nema rezultata</div>
          )}
        </ul>
        <button
          className="buttonAdd"
          title="Dodaj kriterij"
          onClick={handleActivityAdd}
        >
          +
        </button>
        {isAddActivityModalOpen && (
          <AddActivityModal
            onClose={handleAddActivityClose}
            userToken={userToken}
          />
        )}
        {isEditActivityModalOpen && (
          <div ref={modalRef}>
            <EditActivityModal
              activityId={activityId}
              onClose={handleEditActivityClose}
              userToken={userToken}
              onActivityUpdated={handleActivityUpdated}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;
