import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // Redirect to login page if the user is not authenticated
    console.log(user);
    return <Navigate to="/signin" />;
  }

  return children; // Render the children (component) if authenticated
};

export default ProtectedRoute;
