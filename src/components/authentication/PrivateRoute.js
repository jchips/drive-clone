import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Wrapper for the private routes
 * If there's a currentUser, it displays the child element (the private route).
 * Otherwise, if there is no currentUser, it navigates to the login page.
 * @param {Object} {children} - (Prop) all the children components.
 * @returns - Either a component or navigation to a component.
 */
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to='/login' />;
}

export default PrivateRoute;

