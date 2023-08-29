import React from "react";
import "../css/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,30}$/;
    return emailPattern.test(email) && email.length <= 30;
  };

  const validatePassword = (password: string): boolean => {
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/;
    return (
      passwordPattern.test(password) &&
      password.length >= 8 &&
      password.length <= 30
    );
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const pattern = /^\+?[0-9]{9,14}$/;
    return (
      pattern.test(phoneNumber) &&
      phoneNumber.length >= 9 &&
      phoneNumber.length <= 14
    );
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate email, password and phone number
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

    if (!isEmailValid) {
      setEmailError("Invalid email format");
    } else {
      setEmailError(null);
    }

    if (!isPasswordValid) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one upper case, one lower case, one number, and one special character."
      );
    } else {
      setPasswordError(null);
    }

    if (!isPhoneNumberValid) {
      setPhoneNumberError("Invalid phone number format");
    } else {
      setPhoneNumberError(null);
    }

    //Clear out local storage
    localStorage.clear();

    // Continue with registration if both email and password are valid
    if (isEmailValid && isPasswordValid && isPhoneNumberValid) {
      // Register data object
      const registerData = {
        ime: name || null,
        prezime: surname || null,
        email: email,
        lozinkaHash: password,
        broj: phoneNumber || null,
      };

      const apiUrl =
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici";

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          navigate("/login");
        } else {
          console.log("Register failed");
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleRegister}>
        <label>Name</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Surname</label>
        <input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <label>Email *</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <p className="error">{emailError}</p>}
        <label>Password *</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && <p className="error">{passwordError}</p>}
        <label>Phone number</label>
        <input
          type="number"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {phoneNumberError && <p className="error">{phoneNumberError}</p>}

        <button type="submit">Register</button>
        <button type="button" onClick={() => navigate("/login")}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Register;
