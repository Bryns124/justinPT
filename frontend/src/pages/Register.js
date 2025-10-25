import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/LoginRegisterForm.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ error, setError ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Password'
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
            </button>
          </div>
          <div className="login-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder='Confirm Password'
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={showConfirmPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
            </button>
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