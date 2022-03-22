import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RequireAuth({ children, redirectTo }) {
    const auth = useAuth();
    return auth.loggedIn() ? children : <Navigate to={redirectTo} />
  }