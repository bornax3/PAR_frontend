import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Missing = () => {
  //const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const { userToken } = useAuth();

  const goBack = () => navigate(-1);

  const goLogin = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <main>
      <h2>Page Not Found</h2>

      <p>Sorry, but the page you were trying to view does not exist.</p>
      {userToken ? (
        <button onClick={goBack}>Go Back</button>
      ) : (
        <button onClick={goLogin}>Please Login</button>
      )}
    </main>
  );
};

export default Missing;
