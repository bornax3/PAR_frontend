import React, { useState, useEffect } from "react";
import "../css/Login.css";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const { auth, setAuth } = useAuth();
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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

        const userToken = data.token;
        const roles = data.ovlast;
        const userId = data.id;

        login(userToken, roles, userId);

        navigate(from, { replace: true, state: { userToken } });
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
