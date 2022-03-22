import React from "react"
import { AuthProvider } from "../contexts/AuthContext";
import { PostProvider } from "../contexts/PostContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./Home";
import Profile from "./Profile";
import Register from "./Register"
import Login from "./Login";
import Logout from "./Logout";
import RequireAuth from "./RequireAuth";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import ProfileWrapper from "./Layouts/ProfileWrapper";
import Navigation from "./Layouts/Navigation";

function App() {
  return (
    <>
<AuthProvider>
  <Navigation></Navigation>

  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={
        <PostProvider><Home /></PostProvider>
      } />

      <Route path="/profile"
      element={
        <RequireAuth redirectTo="/login">
          <ProfileWrapper><Profile /></ProfileWrapper>
        </RequireAuth>
      } />

      <Route path="/update-profile"
      element={
        <RequireAuth redirectTo="/login">
          <ProfileWrapper><UpdateProfile /></ProfileWrapper>
        </RequireAuth>
      } />

      <Route path="/register" element={
        <ProfileWrapper><Register /></ProfileWrapper>
      } />

      <Route path="/login" element={
        <ProfileWrapper><Login /></ProfileWrapper>
      } />

      <Route path="/logout" element={
        <Logout />
      } />

      <Route path="/forgot-password" element={
        <ProfileWrapper><ForgotPassword /></ProfileWrapper>
      } />
    </Routes>
  </BrowserRouter>
</AuthProvider>
    </>
  )
}

export default App;