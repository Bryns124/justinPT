import React, { createContext, useState, useEffect  } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [ user, setUser ] = useState(null);
  const [ token, setToken ] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (token) {
      setToken(storedToken);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, userId, role } = response.data;
      setToken(token);
      setUser({ userId, role });
    } catch (error) {
      console.error('Login error: ', error);
    }
  }

  const register = async (name, email, password) => {
    try {
      console.log("Register function called (AuthContext)", name, email, password);
      const response = await axios.post('/api/auth/register', { name, email, password });
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
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      { props.children }
    </AuthContext.Provider>
  )
}