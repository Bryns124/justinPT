import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = (props) => {
  const { token } = useContext(AuthContext);

  return token ? props.children : <Navigate to="/login"></Navigate>
}

export default ProtectedRoute