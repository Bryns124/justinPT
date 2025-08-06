import React, { createContext, useState, useEffect  } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL;

export const AuthProvider = (props) => {
  const [ user, setUser ] = useState(null);
  const [ token, setToken ] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // validate token and get user data
      validateTokenAndSetUser(storedToken);
    }
  }, []);

  const validateTokenAndSetUser = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Token validation error: ', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token, userId, role } = response.data;
      setToken(token);
      setUser({ userId, role });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ userId, role }));
      // document.cookie = `token=${token}`;
      console.log('response data is: ', token, userId, role);
    } catch (error) {
      console.error('Login error: ', error);
    }
  }

  const register = async (name, email, password) => {
    try {
      console.log("Register function called (AuthContext)", name, email, password);
      const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      return response.data;
    } catch (error) {
      console.error('Register error: ', error);
      throw error;
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // document.cookie='';
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      { props.children }
    </AuthContext.Provider>
  )
}