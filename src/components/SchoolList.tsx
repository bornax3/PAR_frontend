import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaUsers } from "react-icons/fa";
import SchoolEditModal from "../modals/SchoolEditModal";
import SchoolUserModal from "../modals/SchoolUserModal";
import "../css//SchoolList.css";

interface SchoolListProps {
  userToken: string | null;
}

export interface School {
  id: number | null;
  naziv: string | null; // Change to 'naziv' for school name
  email: string | null;
  adresa: string | null;
  web: string | null;
  kontakt: string | null;
  // Other fields...
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

  const toggleSchoolEditModal = (school: School) => {
    setSelectedSchool(school);
    console.log("School information: ", school);
    setIsSchoolEditModalOpen(!isSchoolEditModalOpen);
  };

  const toggleSchoolUserModal = (school: School) => {
    setSelectedSchool(school);
    console.log("School information When listing users: ", school);
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

  return (
    <div className="content">
      {/* Search input */}
      <input
        className="search-input"
        type="text"
        placeholder="Search schools"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <ul className="school-list">
        {filteredSchools.map((school, index) => (
          <li className="school-item" key={index}>
            <div className="school-details">
              <div>{school.naziv}</div>
              <div>
                <span>{school.email}</span>
              </div>
            </div>
            <div className="item-button">
              <button
                type="button"
                className="item-edit"
                onClick={() => toggleSchoolEditModal(school)}
              >
                <FaEdit />
              </button>
              <button
                type="button"
                className="item-users"
                onClick={() => toggleSchoolUserModal(school)}
              >
                <FaUsers />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {isSchoolEditModalOpen && (
        <SchoolEditModal
          isOpen={isSchoolEditModalOpen}
          onClose={() => setIsSchoolEditModalOpen(false)}
          userToken={userToken}
          school={selectedSchool}
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
