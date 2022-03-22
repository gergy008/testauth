import React, { useRef, useState } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function UpdateProfile() {
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordCRef = useRef()
    const passwordNRef = useRef()

    const { 
        currentUser, 
        updateUserEmail, 
        updateUserPassword, 
        updateUserDisplayName 
    } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState('')
    const [passwordNShowing, setPasswordNShowing] = useState('')

    console.error("Current user display name is: "+currentUser.displayName)

    function handleSubmit(e){
        e.preventDefault()

        const promises = []
        setError('')
        setMessage('')
        setLoading(true)
        if (passwordCRef.current.value !== '') {
            if (nameRef.current.value !== currentUser.displayName){
                promises.push(
                    updateUserDisplayName(nameRef.current.value)
                )
            }
            if (emailRef.current.value !== currentUser.email){
                promises.push(
                    updateUserEmail(
                        currentUser.email,
                        emailRef.current.value, 
                        passwordCRef.current.value
                    )
                )
            }
            if(passwordNRef.current.value){
                promises.push(
                    updateUserPassword(
                        emailRef.current.value, 
                        passwordCRef.current.value, 
                        passwordNRef.current.value
                    )
                )
            }
        } else
            setError('Please enter your current password')

        try {
            Promise.all(promises).then(() => {
                setMessage("Updated profile!")
            }).catch(error => {
                console.log(error.message)
                setError("Failed to update profile")
            }).finally(() => {
                setLoading(false)
            })
        } catch(e) {
            console.assert(e.message)
            setError("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const toggleNPassword = () => {
        setPasswordNShowing(!passwordNShowing)
    }

    return (
        <>
        <Card>
            <Card.Body>
                <h2 className='text-center mb-4'>Update Profile</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="name" className="p-1" aria-label='Email'>
                        <Form.Label>Display Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} defaultValue={currentUser.displayName} />
                    </Form.Group>
                    <Form.Group id="email" className="p-1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} defaultValue={currentUser.email} required />
                    </Form.Group>
                    <Form.Group id="currentPassword" className="p-1">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            className="w-100 m-1" 
                            type="password" 
                            ref={passwordCRef} 
                            placeholder="Required to make changes"
                            required 
                        />
                        
                    </Form.Group>
                    <hr/>
                    <Form.Group id="newPassword" className="p-1">
                        <Form.Label>Change Password</Form.Label>
                        <Form.Control
                            className="w-100 m-1" 
                            type={passwordNShowing? "text" : "password"} 
                            ref={passwordNRef} 
                            placeholder="Keep blank to not change password" 
                        />
                        <Form.Check 
                            className="mt-3 mb-2" 
                            type="switch"
                            label="Show Password"
                            onClick={toggleNPassword}
                        />
                        
                    </Form.Group>
                    <Button className="w-100 m-1"
                        type="submit" disabled={loading}>
                        Update profile
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            <Link to="/profile">Cancel</Link>
        </div>
        </>
    )
}
