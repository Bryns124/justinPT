import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './LoginRegisterForm.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/login');
    } catch (error) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome to JML Fitness</h1>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
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
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <div className="login-footer">
          <span>Forgot Password? </span>
          <a href="/register" className="login-link">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login