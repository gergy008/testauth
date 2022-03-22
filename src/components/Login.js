import React, { useRef, useState, useEffect } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()

    const { login, loggedIn } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')
    const [passwordShowing, setPasswordShowing] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        setPasswordShowing(false)

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/')
        } catch {
            setError('Failed to log in')

        }
        setLoading(false)
        
    }

    const togglePassword = () => {
        setPasswordShowing(!passwordShowing)
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
                <h2 className='text-center mb-4'>Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email" className="p-1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="password" className="p-1">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            className="w-100 m-1" 
                            type={passwordShowing? "text" : "password"} 
                            ref={passwordRef} 
                            required 
                        />
                        <Form.Check 
                            className="mt-3 mb-2" 
                            type="switch"
                            label="Show Password"
                            onClick={togglePassword}
                        />
                        
                    </Form.Group>
                    <Button className="w-100 m-1"
                        type="submit" disabled={loading}>
                        Login
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/register">Register here</Link>
        </div>
        </>
    )
}
