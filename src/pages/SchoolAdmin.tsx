import useAuth from "../hooks/useAuth";
import UserList from "../components/UserList";

const SchoolAdmin = () => {
  const { userToken, userId, ustanovaId } = useAuth();

  return (
    <div className="usersContent">
      <UserList
        userId={userId}
        userToken={userToken}
        ustanovaId={ustanovaId}
        filterByRole={false}
      />
    </div>
  );
};

export default SchoolAdmin;
