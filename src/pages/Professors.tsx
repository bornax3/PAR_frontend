import UserList from "../components/UserList";
import useAuth from "../hooks/useAuth";
import "../css/Admins.css";

const Professors = () => {
  const { userToken, userId, ustanovaId } = useAuth();

  return (
    <div className="usersContent">
      <div className="user-list-container">
        <UserList
          userId={userId}
          userToken={userToken}
          ustanovaId={ustanovaId}
          filterByRole={true}
          filterFetchOption={"korisnik"}
        />
      </div>
    </div>
  );
};

export default Professors;
