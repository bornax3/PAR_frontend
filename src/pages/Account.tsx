import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../css/Account.css";
import { message } from "antd";

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
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(
            error.response?.data ||
              "Došlo je do pogreške pri učitavanju podataka"
          );
        }
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
      message.success("Podaci uspješno ažurirani");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data || "Došlo je do pogreške");
      }
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
      message.success("Račun uspješno obrisan");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data || "Došlo je do pogreške");
      }
    }
  };

  return (
    <div className="accountContainer">
      <h1 className="accountHeader">Postavke profila</h1>
      <div className="accountContent">
        <div className="accountInput">
          <label>Ime</label>
          <input
            className="accountInputField"
            type="text"
            name="ime"
            value={userData.ime}
            onChange={handleInputChange}
          />
          <label>Prezime</label>
          <input
            className="accountInputField"
            type="text"
            name="prezime"
            value={userData.prezime}
            onChange={handleInputChange}
          />
          <label>Broj mobitela</label>
          <input
            className="accountInputField"
            type="tel"
            name="brojMobitela"
            value={userData.brojMobitela}
            onChange={handleInputChange}
          />
        </div>
        <div className="accountFooter">
          <button className="actionButton" onClick={updateUserData}>
            Ažuriraj
          </button>
          <button className="deleteButton" onClick={deleteAccount}>
            Obriši Račun
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
