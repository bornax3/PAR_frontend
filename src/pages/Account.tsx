import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const { userId, userToken } = useAuth();

  // Define state variables for user data
  const [userData, setUserData] = useState({
    id: userId || "",
    ime: "",
    prezime: "",
    brojMobitela: "",
  });

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/updateinfo/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const userDataFromApi = response.data; // Assuming your API response matches the structure of userData
        setUserData(userDataFromApi);
        console.log("User data fetched:", userDataFromApi);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Function to handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => {
      const updatedUserData = {
        ...prevUserData,
        [name]: value,
      };
      console.log("User data: ", updatedUserData); // Log the updated state
      return updatedUserData; // Return the updated state
    });
  };

  // Function to update user data
  const updateUserData = async () => {
    try {
      // Send a PUT request to your API to update user data
      const response = await axios.put(
        `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("User data updated:", response.data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Function to delete the user's account
  const deleteAccount = async () => {
    try {
      // Send a DELETE request to your API to delete the account
      const response = await axios.delete(
        `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("Account deleted:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div>
      <h1>Account Settings</h1>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="ime"
          value={userData.ime}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          name="prezime"
          value={userData.prezime}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="tel"
          name="brojMobitela"
          value={userData.brojMobitela}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={updateUserData}>Update</button>
      <button onClick={deleteAccount}>Delete Account</button>
    </div>
  );
};

export default AccountSettings;
