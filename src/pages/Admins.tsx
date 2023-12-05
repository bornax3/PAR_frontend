import React, { useEffect, useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import EditUserModal from "../modals/EditUserModal";
import AddAdminModal from "../modals/AddAdminModal";
import "../css/Admins.css";
import { School } from "../components/SchoolList";
import UserList from "../components/UserList";

export interface Admin {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  ovlast: string;
  skolskaUstanova: string;
  brojMobitela: string;
}

const Admins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const { userToken } = useAuth();
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [schoolOptions, setSchoolOptions] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>(admins);

  useEffect(() => {
    // Fetch all admins
    axios
      .get(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/getsvevoditeljeustanove",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [userToken, admins]);

  useEffect(() => {
    // Fetch all adminless school options
    axios
      .get(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/SkolskeUstanove/GetSkolskeUstanoveBezVoditelja",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        setSchoolOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching school options:", error);
      });
  }, [userToken, schoolOptions]);

  useEffect(() => {
    // Filter admins based on the search query
    const filtered = admins.filter((admin) => {
      const ime = admin.ime || "";
      const prezime = admin.prezime || "";
      const email = admin.email || "";
      const skolskaUstanova = admin.skolskaUstanova || "";
      return (
        ime.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prezime.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skolskaUstanova.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredAdmins(filtered);
  }, [searchQuery, admins]);

  const handleAdminDelete = (adminId: number) => {
    // Show a confirmation dialog before deleting the admin
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );

    if (confirmDelete) {
      axios
        .delete(
          `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then(() => {
          // Remove the deleted admin from the list
          setAdmins((prevAdmins) =>
            prevAdmins.filter((admin) => admin.id !== adminId)
          );
        })
        .catch((error) => {
          console.error("Error deleting data: ", error);
        });
    }
  };

  const handleAdminEdit = (admin: Admin) => {
    setAdminData(admin);
    setIsEditAdminModalOpen(true);
  };

  const handleEditAdminClose = () => {
    setIsEditAdminModalOpen(false);
  };

  useEffect(() => {
    // Close the modal when clicking outside of it
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleEditAdminClose();
      }
    };

    if (isEditAdminModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isEditAdminModalOpen]);

  const handleAddAdmin = () => {
    setIsAddAdminModalOpen(true);
  };

  return (
    <div className="usersContent">
      <UserList
        userId={null}
        userToken={userToken}
        ustanovaId={null}
        filterByRole={true}
        filterFetchOption={"voditeljUstanove"}
      />
    </div>
  );
};

export default Admins;
