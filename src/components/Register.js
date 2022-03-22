import React, { useRef, useState } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
    const emailRef = useRef()
    const nameRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()

    const { register } = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')
    const [passwordShowing, setPasswordShowing] = useState('')

    async function handleSubmit(e){
        e.preventDefault()

        // Ensure that the form is submitted with the password NOT SHOWING
        // If the password is showing, then it won't trigger save password
        // on the password manager of the device.
        var oPasswordShowing = passwordShowing
        setPasswordShowing(false)
        try {
            setError('')
            setLoading(true)
            await register(
                nameRef.current.value, 
                emailRef.current.value, 
                passwordRef.current.value)
            navigate('/')
        } catch {
            setError('Unable to register user - Check your email and try again')
        } finally {
            setLoading(false)
            setPasswordShowing(oPasswordShowing)
        }
    }

    const togglePassword = () => {
        setPasswordShowing(!passwordShowing)
    }

    return (
        <>
        <Card>
            <Card.Body>
                <h2 className='text-center mb-4'>Register an Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="name" className="p-1" aria-label='Email'>
                        <Form.Label>Display Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} required />
                    </Form.Group>
                    <Form.Group id="email" className="p-1" aria-label='Full Name'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="password" className="p-1" aria-label='Password'>
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
                            aria-label="Show Password as Text"
                            onClick={togglePassword}
                        />
                        
                    </Form.Group>

                    <Button className="w-100 m-1" aria-label='Submit Button'
                        type="submit" disabled={loading}>
                        Register
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">Login here</Link>
        </div>
        </>
    )
}
