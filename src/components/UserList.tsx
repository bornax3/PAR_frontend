import React, { useState, useEffect } from "react";
import "../css/List.css";
import { FaFolder, FaPowerOff } from "react-icons/fa";
import axios from "axios";
import UserFileModal from "../modals/UserFileModal";
import { useLocation } from "react-router-dom";
import { message } from "antd";

interface UserListProps {
  userId: number | null | undefined;
  userToken: string | null;
  ustanovaId: number | null | undefined;
  filterByRole: boolean;
  filterFetchOption?: string;
}

export interface User {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  brojMobitela: string;
  ovlast: string;
  aktivan: boolean;
}

const UserList: React.FC<UserListProps> = ({
  userId,
  userToken,
  ustanovaId,
  filterByRole,
  filterFetchOption,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isUserFileModalOpen, setIsUserFileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  //const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [filterOption, setFilterOption] = useState<string>("all");

  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState<string>("aktivan");
  //const [adminFetch, setAdminFetch] = useState<string>("all");
  const location = useLocation();
  const isAdminPage = location.pathname === "/admins";
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);

  const toggleUserFileModal = (user: User) => {
    setSelectedUser(user);
    console.log("User information: ", user);
    setIsUserFileModalOpen(!isUserFileModalOpen);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  // Handle radio button change and update filter option
  const handleFilterChange = (option: string) => {
    setFilterOption(option);
    setUserTypeFilter(
      filterFetchOption === "voditeljUstanove" ? "voditeljUstanove" : "korisnik"
    );
  };

  // Handle radio button change for active filter
  const handleActiveFilterChange = (option: string) => {
    setActiveFilter(option);
  };

  // Function to handle user activation/deactivation
  const toggleUserActivation = async (user: User) => {
    try {
      // Toggle the user's aktivan (active) status
      const updatedUser = { ...user, aktivan: !user.aktivan };
      const isActive = updatedUser.aktivan === false ? false : true; // Convert 1 to false and 0 to true
      const response = await axios.put(
        `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/Korisnici/IzmjenaStatusaKorisnika?id=${user.id}&isActive=${isActive}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // Update the users list with the updated user
      const updatedUsers = users.map((u) =>
        u.id === user.id ? updatedUser : u
      );
      setUsers(updatedUsers);

      console.log("User activation status updated:", response.data);
      message.success("Status korisnika uspješno ažuriran");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data || "Došlo je do pogreške");
      }
    }
  };

  useEffect(() => {
    const loggedInUserIdString = localStorage.getItem("userId");
    const loggedInUserId = loggedInUserIdString
      ? parseInt(loggedInUserIdString, 10)
      : 0;

    const apiUrl = filterByRole
      ? "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici"
      : `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/skolskeustanove/clanovi/${ustanovaId}`;

    // Make a GET request to fetch users when ustanovaId or userToken changes
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        const filteredUsers = response.data.filter(
          (user: { ovlast: string; aktivan: any; id: number }) => {
            const isFiltered =
              user.id !== loggedInUserId &&
              (filterOption === "all" || user.ovlast === filterOption) &&
              (activeFilter === "all" ||
                (activeFilter === "aktivan" && user.aktivan) ||
                (activeFilter === "neaktivan" && !user.aktivan));

            // If filterFetchOption is "voditeljUstanove", additionally filter by userTypeFilter
            if (filterFetchOption === "voditeljUstanove") {
              return isFiltered && user.ovlast === "voditeljUstanove";
            } else if (filterFetchOption === "korisnik") {
              return isFiltered && user.ovlast === "korisnik";
            } else {
              return isFiltered;
            }
          }
        );

        setUsers(filteredUsers);
        console.log(response.data);
        console.log("Filtered users: ", filteredUsers);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Došlo je do pogreške");
        }
      });
  }, [
    filterByRole,
    ustanovaId,
    userToken,
    filterOption,
    userTypeFilter,
    activeFilter,
    showInactiveUsers,
  ]);

  /**useEffect(() => {
    axios
      .get(
        `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/getsvevoditeljeustanove`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        setAdminFetch(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [isAdminPage, filterOption]);*/

  const lowerCaseQuery = searchQuery.toLowerCase();
  const filteredUsers = users.filter((user) => {
    const isFiltered =
      (filterOption === "all" || user.ovlast === filterOption) &&
      (activeFilter === "all" ||
        (activeFilter === "aktivan" && user.aktivan) ||
        (activeFilter === "neaktivan" && !user.aktivan)) &&
      (user.ime.toLowerCase().includes(lowerCaseQuery) ||
        user.prezime.toLowerCase().includes(lowerCaseQuery) ||
        user.email.toLowerCase().includes(lowerCaseQuery));

    return isFiltered;
  });

  return (
    <div className="listContent">
      {filterByRole ? (
        <>
          <div className="listFilter">
            <div className="filterSection">
              <button
                className={`filterButton ${
                  filterOption === "all" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("all")}
              >
                Svi
              </button>
              <button
                className={`filterButton ${
                  filterOption === "voditeljUstanove" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("voditeljUstanove")}
              >
                Voditelji
              </button>
              <button
                className={`filterButton ${
                  filterOption === "korisnik" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("korisnik")}
              >
                Profesori
              </button>
              <button
                className={`filterButton ${
                  activeFilter === "aktivan" ? "active" : ""
                }`}
                onClick={() => handleActiveFilterChange("aktivan")}
              >
                Aktivni
              </button>
              <button
                className={`filterButton ${
                  activeFilter === "neaktivan" ? "active" : ""
                }`}
                onClick={() => handleActiveFilterChange("neaktivan")}
              >
                Neaktivni
              </button>
            </div>
          </div>
        </>
      ) : null}

      <input
        className="listSearch"
        type="text"
        placeholder="Pretraži korisnike"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <ul className="itemList">
        {filteredUsers.length > 0 ? (
          activeFilter === "aktivan" ? (
            filteredUsers
              .filter((user) => user.aktivan === true)
              .map((user, index) => (
                <li className="listItem" key={index}>
                  <div className="listItemDetails">
                    <div className="listItemName">
                      {user.ime} {user.prezime}
                    </div>
                    <div className="listItemDescription">
                      <span className="listItemSection">{user.email}</span>
                    </div>
                  </div>
                  <div className="itemControl">
                    {filterByRole ? (
                      <button
                        type="button"
                        title="Deaktiviraj korisnika"
                        className="itemButton"
                        onClick={() => toggleUserActivation(user)}
                      >
                        <FaPowerOff />
                      </button>
                    ) : null}
                    {user.ovlast !== "voditeljUstanove" ? (
                      <button
                        type="button"
                        title="Datoteke"
                        className="itemButton"
                        onClick={() => toggleUserFileModal(user)}
                      >
                        <FaFolder />
                      </button>
                    ) : null}
                  </div>
                </li>
              ))
          ) : (
            filteredUsers
              .filter((user) => user.aktivan === false)
              .map((user, index) => (
                <li className="listItem" key={index}>
                  <div className="listItemDetails">
                    <div className="listItemName">
                      {user.ime} {user.prezime}
                    </div>
                    <div className="listItemDescription">
                      <span className="listItemSection">{user.email}</span>
                    </div>
                  </div>
                  <div className="itemControl">
                    {user.ovlast !== "voditeljUstanove" ? (
                      <button
                        type="button"
                        title="Datoteke"
                        className="itemButton"
                        onClick={() => toggleUserFileModal(user)}
                      >
                        <FaFolder />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      title="Aktiviraj korisnika"
                      className="itemButton"
                      onClick={() => toggleUserActivation(user)}
                    >
                      <FaPowerOff />
                    </button>
                  </div>
                </li>
              ))
          )
        ) : (
          <div className="noResults">Nema rezultata</div>
        )}
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
