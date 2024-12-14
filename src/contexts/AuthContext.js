import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateEmail as updateEmailFirebase,
  updatePassword as updatePasswordFirebase
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password); // Returns a promise
  }

  function emailVerification(currentUser) {
    console.log('here');
    return sendEmailVerification(currentUser);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    return updateEmailFirebase(currentUser, email);
  }

  function updatePassword(newPassword) {
    return updatePasswordFirebase(currentUser, newPassword);
  }

  /**
   * sets up event listener for when the auth state changes and then runs callback
   * method to change state. It returns a cleanup function for when the component unmounts.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // lets Firebase verify if there is a currentUser first
    })
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    emailVerification
  }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
