import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    
    console.log(user);
    return <Navigate to="/signin" />;
  }

  return children; 
};

export default ProtectedRoute;
