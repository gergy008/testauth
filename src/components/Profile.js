import React, { useState, useEffect } from 'react'
import { Card, Button, Alert, Image, Placeholder } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext"

export default function Profile() {

  const navigate = useNavigate()
  const { currentUser, logout, getUserProfilePicture } = useAuth()

  const [error, setError] = useState("")
  const [pp, setPP] = useState("...")

  async function logMeHarderDaddeh() {
    setError('')

    try {
      await logout()
      navigate('/login')
    } catch {
      setError('Unable to log out')
    }
  }

  useEffect(() => {
      async function changePP(){
        setPP(await getUserProfilePicture())
      }
      changePP()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Welcome {currentUser.displayName}!</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {pp==="..."?
          <Placeholder as="div" animation="glow">
              <Placeholder className="mx-auto my-3" style={{display: "block", border: 0, width:"96px", height:"96px", "borderRadius":"50%"}}/>
          </Placeholder>
          :
          <Image roundedCircle className="mx-auto my-3" style={{display: "block", border: 0}} width="96" height="96" src={pp} />
          }
          <p className=""><strong>Email: </strong> {currentUser.email}</p>
          <Link to="/update-profile" className="btn btn-primary w-100 mt-1"
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
