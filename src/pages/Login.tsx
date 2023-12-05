import React, { useState, useEffect } from "react";
import "../css/Login.modal.css";
import useAuth from "../hooks/useAuth";
import axios, { AxiosError } from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import SessionExpiredNotification from "../components/SessionExpiredNotification";
import { message } from "antd";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const { auth, setAuth } = useAuth();
  const { login } = useAuth();
  //const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const location = useLocation();
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Check if the isSessionExpired state is set in the location state
  useEffect(() => {
    const locationState = location.state;
    if (locationState && locationState.isSessionExpired) {
      setIsSessionExpired(true);
    }
  }, [location.state]);

  const handleCloseNotification = () => {
    setIsSessionExpired(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Login data object
    const loginData = {
      email: email,
      password: password,
    };

    // API URL in Azure
    const apiUrl =
      "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/login";

    try {
      const response = await axios.post(apiUrl, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("Data: ", data);

        const userToken = data.token;
        const roles = data.ovlast;
        const userId = data.id;
        const ustanovaId = data.skolskaUstanovaId;

        if (roles.includes("voditeljUstanove")) {
          login(userToken, roles, userId, ustanovaId);
          navigate("/admin", { replace: true, state: { userToken } });
        } else if (roles.includes("korisnik")) {
          login(userToken, roles, userId, ustanovaId);
          navigate("/", { replace: true, state: { userToken } });
        } else if (roles.includes("admin")) {
          login(userToken, roles, userId, ustanovaId);
          navigate("/developer", { replace: true, state: { userToken } });
        }
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data || "Došlo je do pogreške");
      }
    }
  };

  return (
    <div className="login-container">
      <div>
        {isSessionExpired && (
          <SessionExpiredNotification onClose={handleCloseNotification} />
        )}
      </div>
      <form className="form-main-login" onSubmit={handleSubmit}>
        <p className="heading">Prijava</p>
        <div className="inputContainer">
          <svg
            className="inputIcon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#2e2e2e"
            viewBox="0 0 16 16"
          >
            <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
          </svg>
          <input
            className="inputField"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            onInvalid={(e) => {
              e.currentTarget.setCustomValidity(
                "Molimo unesite vašu email adresu."
              );
            }}
            onInput={(e) => {
              e.currentTarget.setCustomValidity("");
            }}
          />
        </div>
        <div className="inputContainer">
          <svg
            className="inputIcon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#2e2e2e"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
          </svg>
          <input
            className="inputField"
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onInvalid={(e) => {
              e.currentTarget.setCustomValidity("Molimo unesite vašu lozinku.");
            }}
            onInput={(e) => {
              e.currentTarget.setCustomValidity("");
            }}
          />
        </div>

        <button className="button" type="submit">
          Prijavi se
        </button>
        <Link className="linkLogin" to="/register">
          Registriraj se
        </Link>
      </form>
    </div>
  );
};

export default Login;
