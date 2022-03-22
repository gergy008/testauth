import React, { useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext"

export default function Profile() {
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  async function logMeHarderDaddeh() {
    setError('')

    try {
      await logout()
      navigate('/login')
    } catch {
      setError('Unable to log out')
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Welcome {currentUser.displayName}!</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3"
            type="button">
            Update Profile
          </Link>
          <Link to="/" className="btn btn-primary w-100 mt-3"
            type="button">
            Go Home
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-3">
          <Button variant="link" onClick={logMeHarderDaddeh}>Log out</Button>
      </div>
    </>
  )
}
