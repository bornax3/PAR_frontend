import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaUsers, FaTrash } from "react-icons/fa";
import EditSchoolModal from "../modals/EditSchoolModal";
import SchoolUserModal from "../modals/SchoolUserModal";
import "../css/List.css";
import { message } from "antd";

interface SchoolListProps {
  userToken: string | null;
}

export interface School {
  id: number | null;
  naziv: string | null;
  email: string | null;
  adresa: string | null;
  web: string | null;
  kontakt: string | null;
}

const SchoolList: React.FC<SchoolListProps> = ({ userToken }) => {
  const myApiUrl = `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/SkolskeUstanove`;
  const [schools, setSchools] = useState<School[]>([]);
  const [isSchoolEditModalOpen, setIsSchoolEditModalOpen] = useState(false);
  const [isSchoolUserModalOpen, setIsSchoolUserModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSchools, setFilteredSchools] = useState<School[]>(schools);

  useEffect(() => {
    // Make a GET request to fetch schools
    axios
      .get(myApiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setSchools(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const refreshSchoolList = () => {
    // Refresh after edit school
    axios
      .get(myApiUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setSchools(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const toggleSchoolEditModal = (school: School) => {
    setSelectedSchool(school);
    console.log("School information: ", school);
    setIsSchoolEditModalOpen(!isSchoolEditModalOpen);
  };

  const toggleSchoolUserModal = (school: School) => {
    setSelectedSchool(school);
    setIsSchoolUserModalOpen(!isSchoolUserModalOpen);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  useEffect(() => {
    // Filter schools based on the search query
    const filtered = schools.filter((school) => {
      const naziv = school.naziv || ""; // Use an empty string if 'naziv' is null or undefined
      const email = school.email || ""; // Use an empty string if 'email' is null or undefined
      return (
        naziv.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredSchools(filtered);
  }, [searchQuery, schools]);

  const handleDelete = (schoolId: number | null) => {
    // Show a confirmation dialog before deleting the school
    const confirmDelete = window.confirm(
      `Jeste li sigurni da želite obrisati školu?`
    );

    if (confirmDelete) {
      axios
        .delete(
          `http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/SkolskeUstanove/${schoolId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then(() => {
          // Remove the deleted school from the list
          setSchools((prevSchools) =>
            prevSchools.filter((school) => school.id !== schoolId)
          );

          console.log("School deleted successfully");
          message.success("Škola uspješno obrisana!");
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            message.error(error.response?.data || "Došlo je do pogreške");
          }
        });
    }
  };

  return (
    <div className="listContent">
      <input
        className="listSearch"
        type="text"
        placeholder="Pretraži škole"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <ul className="itemList">
        {filteredSchools.length > 0 ? (
          filteredSchools.map((school, index) => (
            <li className="listItem" key={index}>
              <div className="listItemDetails">
                <div className="listItemName">{school.naziv}</div>
                <div className="listItemDescription">
                  <span className="listItemSection">{school.email}</span>
                </div>
              </div>
              <div className="itemControl">
                <button
                  type="button"
                  title="Korisnici"
                  className="itemButton"
                  onClick={() => toggleSchoolUserModal(school)}
                >
                  <FaUsers />
                </button>
                <button
                  type="button"
                  title="Uredi"
                  className="itemButton"
                  onClick={() => toggleSchoolEditModal(school)}
                >
                  <FaEdit />
                </button>
                <button
                  type="button"
                  title="Obriši"
                  className="itemButton"
                  onClick={() => handleDelete(school.id)}
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
      {isSchoolEditModalOpen && (
        <EditSchoolModal
          isOpen={isSchoolEditModalOpen}
          onClose={() => setIsSchoolEditModalOpen(false)}
          userToken={userToken}
          school={selectedSchool}
          refreshSchoolList={refreshSchoolList}
        />
      )}
      {isSchoolUserModalOpen && (
        <SchoolUserModal
          isOpen={isSchoolUserModalOpen}
          onClose={() => setIsSchoolUserModalOpen(false)}
          userToken={userToken}
          ustanovaId={selectedSchool?.id}
          school={selectedSchool}
        />
      )}
    </div>
  );
};

export default SchoolList;
