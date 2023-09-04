import React, { useState, useEffect } from "react";
import "../css/UserList.css";
import { FaTrash, FaFolder, FaCheckSquare } from "react-icons/fa";
import axios from "axios";
import UserFileModal from "../modals/UserFileModal";

interface UserListProps {
  userId: number | null;
  userToken: string | null;
}

export interface User {
  imeIPrezime: string;
  email: string;
  poz_broj: string;
  broj: string;
  ovlast: string;
  skolskaUstanova: string;
}

const UserList: React.FC<UserListProps> = ({ userId, userToken }) => {
  const myApiUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/skolskeustanove/clanovi?idUstanove=1`;
  const [users, setUsers] = useState<User[]>([]);
  const [isUserFileModalOpen, setIsUserFileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const toggleUserFileModal = (user: User) => {
    setSelectedUser(user);
    setIsUserFileModalOpen(!isUserFileModalOpen);
  };

  useEffect(() => {
    // Make a GET request to fetch users
    axios
      .get(myApiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <div>
      <ul className="user-list">
        {users.map((user, index) => (
          <li className="user-item" key={index}>
            <div className="user-details">
              <div>{user.imeIPrezime}</div>
              <div>
                <span>{user.email}</span>
              </div>
            </div>
            <div className="item-button">
              <button
                type="button"
                className="item-files"
                onClick={() => toggleUserFileModal(user)}
              >
                <FaFolder />
              </button>
              <button
                type="button"
                className="item-delete"
                onClick={() => {
                  // TODO: Implement deleting users
                }}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {isUserFileModalOpen && (
        <UserFileModal
          isOpen={isUserFileModalOpen}
          onClose={() => setIsUserFileModalOpen(false)}
          userToken={userToken}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UserList;
