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
  id: number;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  const toggleUserFileModal = (user: User) => {
    setSelectedUser(user);
    console.log("User information: ", user);
    setIsUserFileModalOpen(!isUserFileModalOpen);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  useEffect(() => {
    // Filter users based on the search query
    const filtered = users.filter(
      (user) =>
        user.imeIPrezime.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

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
      {/* Search input */}
      <input
        className="search-input"
        type="text"
        placeholder="Search users"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <ul className="user-list">
        {filteredUsers.map((user, index) => (
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
