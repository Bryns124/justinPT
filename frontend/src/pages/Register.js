import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'
import './LoginRegisterForm.css'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ error, setError ] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("Register form submitted", name, email, password);
    e.preventDefault();
    setError('');
    if (password !== confirmPassword ) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Try a different email', error);
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Create Your Account</h1>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder='Name'
            />
          </div>
          <div className="login-field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder='Email'
            />
          </div>
          <div className="login-field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Password'
            />
          </div>
          <div className="login-field">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder='Confirm Password'
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn">
            Register
          </button>
        </form>
        <div className="login-footer">
          <span>Already have an account?</span>
          <a href="/login" className="login-link">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register