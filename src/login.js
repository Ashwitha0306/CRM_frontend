// src/login.js

import React, { useState } from 'react';
import './login.css'; // Keep your custom styles
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import navigate hook

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: email,
        password: password
      });

      console.log('Login successful:', response.data);
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Log in</h2>
        <input
          type="text"
          placeholder="johndoe"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log in</button>
        <p className="signup-text">or, <a href="#">sign up</a></p>
      </form>
    </div>
  );
}

export default Login;
