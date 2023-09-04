import useAuth from "../hooks/useAuth";
import UserList from "../components/UserList";

const SchoolAdmin = () => {
  const { userToken, userId } = useAuth();

  return (
    <main>
      <UserList userId={userId} userToken={userToken} />
    </main>
  );
};

export default SchoolAdmin;
