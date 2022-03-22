import React, { useRef, useState, useEffect } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ForgotPassword() {
    const emailRef = useRef()

    const { loggedIn, resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions.')
        } catch {
            setError('Unable to reset password for this user.')

        }
        setLoading(false)
    }

    
    useEffect(() => {
      if(loggedIn()){
       navigate("/")   
      }
    })

    return (
        <>
        <Card>
            <Card.Body>
                <h2 className='text-center mb-4'>Forgot Password</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email" className="p-1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Button 
                        className="w-100 m-1"
                        type="submit" 
                        disabled={loading}>
                        Reset Password
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/login">Log in</Link>
                </div>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/register">Register here</Link>
        </div>
        </>
    )
}
