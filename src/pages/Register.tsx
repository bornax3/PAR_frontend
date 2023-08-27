import React from 'react'
import '../css/Register.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const navigate = useNavigate();

    const validateEmail = (email: string): boolean => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };
    
    /*const validatePassword = (password: string): boolean => {
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
        return passwordPattern.test(password);
    };*/

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validate email and password
        const isEmailValid = validateEmail(email);
        //const isPasswordValid = validatePassword(password);

        if (!isEmailValid) {
            setEmailError('Invalid email format');
        } else {
            setEmailError(null);
        }

        /*if (!isPasswordValid) {
            setPasswordError(
                'Password must be at least 8 characters long and contain at least one upper case, one lower case, one number, and one special character.'
            );
        } else {
            setPasswordError(null);
        }*/

        // Continue with registration if both email and password are valid
        if (isEmailValid /*&& isPasswordValid*/) {
            // Register data object
            const registerData = {
                ime: name || null,
                prezime: surname || null,
                email: email,
                lozinkaHash: password,
                broj: phoneNumber || null
            }

            // API URL in Azure
            const apiUrl = 'http://parapibackend.fwfre3f6f6arc6f3.westeurope.azurecontainer.io/api/korisnici';

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(registerData)
                })

                if (response.ok) {
                    const data = await response.json()
                    console.log(data)
                    // can use history instead of navigate
                    navigate('/');
                } else {
                    console.log('Register failed')
                }
            } catch (error) {
                console.log("Error: ", error)
            }
        }
    }

    return (
        <div className='form'>
            <form onSubmit={handleRegister}>
                <label>Name</label>
                <input
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Surname</label>
                <input
                    type='text'
                    placeholder='Surname'
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <label>Email *</label>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {emailError && <p className='error'>{emailError}</p>}
                <label>Password *</label>
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {passwordError && <p className='error'>{passwordError}</p>}
                <label>Phone number</label>
                <input
                    type='number'
                    placeholder='Phone number'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <button 
                    type='submit'>
                    Register
                </button>
                <button 
                    type='button' 
                    onClick={() => navigate('/')}>
                    Login
                </button>
            </form>
        </div>
    )
}

export default Register;
