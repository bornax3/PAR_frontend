import useAuth from "../hooks/useAuth";
import UserList from "../components/UserList";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";

const SchoolAdmin = () => {
  const { userToken, userId, ustanovaId } = useAuth();

  return (
    <main>
      <Nav />
      <Sidebar />
      <UserList userId={userId} userToken={userToken} ustanovaId={ustanovaId} />
    </main>
  );
};

export default SchoolAdmin;
