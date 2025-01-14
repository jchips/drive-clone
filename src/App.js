import React from "react";
import SignUp from "./components/authentication/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./components/authentication/Profile";
import Login from "./components/authentication/Login";
import Dashboard from "./components/google-drive/Dashboard";
import PrivateRoute from "./components/authentication/PrivateRoute";
import ForgotPassword from "./components/authentication/ForgotPassword";
import UpdateLogin from "./components/authentication/UpdateLogin";
import VerifyEmail from "./components/authentication/VerifyEmail";
import './App.scss';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Drive */}
          <Route exact path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route exact path="/folder/:folderId" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Profile */}
          <Route path="/user" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/update-login" element={
            <PrivateRoute>
              <UpdateLogin />
            </PrivateRoute>
          } />

          {/* Auth */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
