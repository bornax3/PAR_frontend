import React, { useState, useEffect } from "react";
import "../css/Register.modal.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skolskaUstanova, setSkolskaUstanova] = useState("");
  const [napredovanje, setNapredovanje] = useState("");
  const [oib, setOib] = useState("");
  const [skolskeUstanove, setSkolskeUstanove] = useState([]);
  const [nazivZvanja, setNazivZvanja] = useState([]);
  const navigate = useNavigate();
  const durationInSeconds = 8;

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

  const validateOiB = (oib: string): boolean => {
    const oibPattern = /^[0-9]{11}$/;
    return oibPattern.test(oib) && oib.length === 11;
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const pattern = /^[0-9]{9,14}$/;
    return (
      pattern.test(phoneNumber) &&
      phoneNumber.length >= 9 &&
      phoneNumber.length <= 14
    );
  };

  useEffect(() => {
    // Dohvati škole za padajući izbornik
    axios
      .get(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/skolskeustanove"
      )
      .then((response) => {
        console.log(response.data);
        setSkolskeUstanove(response.data);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju škola:", error);
      });
  }, []);

  useEffect(() => {
    // Dohvati napredovanja za padajući izbornik
    axios
      .get(
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/napredovanje"
      )
      .then((response) => {
        console.log(response.data);
        setNazivZvanja(response.data);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju napredovanja:", error);
      });
  }, []);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Provjeri valjanost emaila, lozinke, broja mobitela i OiB-a
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    const isOibValid = validateOiB(oib);

    if (!isEmailValid) {
      message.error("Neispravan format emaila", durationInSeconds);
      return;
    }

    if (!isPasswordValid) {
      message.error(
        "Lozinka mora sadržavati najmanje 8 znakova i mora sadržavati barem jedno veliko slovo, jedno malo slovo, jednu znamenku i jedan poseban znak.",
        durationInSeconds
      );
      return;
    }

    if (!isOibValid) {
      message.error("Neispravan format OiB-a", durationInSeconds);
      return;
    }

    if (!isPhoneNumberValid) {
      message.error("Neispravan format broja mobitela", durationInSeconds);
      return;
    }

    // Obriši lokalno spremljene podatke
    localStorage.clear();

    // Nastavi s registracijom ako su valjani email i lozinka
    if (isEmailValid && isPasswordValid && isPhoneNumberValid && isOibValid) {
      // Objekt s podacima za registraciju
      const registerData = {
        ime: name || null,
        prezime: surname || null,
        email: email || null,
        lozinka: password || null,
        brojMobitela: phoneNumber || null,
        napredovanjeId: parseInt(napredovanje) || null,
        skolskaUstanovaId: parseInt(skolskaUstanova) || null,
        OIB: oib || null,
      };

      const apiUrl =
        "http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici";

      try {
        console.log("Podaci za registraciju: ", registerData);

        // Use Axios to make the POST request
        const response = await axios.post(apiUrl, registerData);

        if (response.status === 200) {
          const data = response.data;
          message.success("Uspješno ste se registrirali!");
          navigate("/login");
        } else {
          message.error("Došlo je do pogreške");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "Došlo je do pogreške");
        }
      }
    }
  };

  return (
    <form className="form_main" onSubmit={handleRegister}>
      <p className="heading">Registracija</p>
      <div className="inputContainer">
        <input
          className="inputFieldMod"
          type="text"
          placeholder="Ime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          onInvalid={(e) => {
            e.currentTarget.setCustomValidity("Molimo unesite vaše ime.");
          }}
          onInput={(e) => {
            e.currentTarget.setCustomValidity("");
          }}
        />
        <input
          className="inputField"
          type="text"
          placeholder="Prezime"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
          onInvalid={(e) => {
            e.currentTarget.setCustomValidity("Molimo unesite vaše prezime.");
          }}
          onInput={(e) => {
            e.currentTarget.setCustomValidity("");
          }}
        />
      </div>
      <div className="inputContainer">
        <input
          className="inputField"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          onInvalid={(e) => {
            e.currentTarget.setCustomValidity("Molimo unesite email.");
          }}
          onInput={(e) => {
            e.currentTarget.setCustomValidity("");
          }}
        />
      </div>
      <div className="inputContainer">
        <input
          className="inputField"
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          onInvalid={(e) => {
            e.currentTarget.setCustomValidity("Molimo unesite lozinku.");
          }}
          onInput={(e) => {
            e.currentTarget.setCustomValidity("");
          }}
        />
      </div>
      <div className="inputContainer">
        <select
          className="inputField"
          value={skolskaUstanova}
          onChange={(e) => setSkolskaUstanova(e.target.value)}
          title="Odaberite školsku ustanovu"
        >
          <option value="" disabled>
            Školska ustanova
          </option>
          {skolskeUstanove.map((skolskaUstanova: any) => (
            <option key={skolskaUstanova.id} value={skolskaUstanova.id}>
              {skolskaUstanova.naziv}
            </option>
          ))}
          <option value="">-</option>
        </select>
      </div>
      <div className="inputContainer">
        <select
          className="inputField"
          value={napredovanje}
          onChange={(e) => setNapredovanje(e.target.value)}
          title="Odaberite zvanje"
          required
          onInvalid={(e) => {
            e.currentTarget.setCustomValidity("Molimo odaberite zvanje.");
          }}
          onInput={(e) => {
            e.currentTarget.setCustomValidity("");
          }}
        >
          <option value="" disabled>
            Zvanje
          </option>
          {nazivZvanja.map((nazivZvanja: any) => (
            <option key={nazivZvanja.id} value={nazivZvanja.id}>
              {nazivZvanja.nazivZvanja}
            </option>
          ))}
          <option value="">-</option>
        </select>
      </div>
      <div className="inputContainer">
        <input
          className="inputField"
          type="number"
          placeholder="OiB"
          value={oib}
          onChange={(e) => setOib(e.target.value)}
          required
          onInvalid={(e) => {
            e.currentTarget.setCustomValidity("Molimo unesite OiB.");
          }}
          onInput={(e) => {
            e.currentTarget.setCustomValidity("");
          }}
        />
      </div>
      <div className="inputContainer">
        <input
          className="inputField"
          type="string"
          placeholder="Broj mobitela"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <button className="button" type="submit">
        Registriraj se
      </button>
      <Link className="linkRegister" to="/login">
        Nazad na prijavu
      </Link>
    </form>
  );
};

export default Register;
