import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import TrainerDashboard from './TrainerDashboard';
import ClientDashboard from './ClientDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === 'trainer') {
    return <TrainerDashboard/>;
  } else if (user.role === 'client') {
    return <ClientDashboard/>;
  } else {
    return <Navigate to="/" replace />;
  }
}

export default Dashboard;