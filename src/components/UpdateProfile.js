import React, { useRef, useState, useEffect } from 'react'
import axios from "axios";
import { Card, Button, Form, Alert, Placeholder } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../css/UpdateProfile.css';
import { set } from 'firebase/database';

export default function UpdateProfile() {
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordCRef = useRef()
    const passwordNRef = useRef()
    const inputFile = useRef() 

    const { 
        currentUser, 
        updateUserEmail, 
        updateUserPassword, 
        updateUserDisplayName,
        getUserProfilePicture,
        setUserProfilePicture
    } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState('')
    const [pp, setPP] = useState("...")
    const [ppReload, setPPReload] = useState(true)
    const [passwordNShowing, setPasswordNShowing] = useState('')

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

    const fileSelected = async(e) => {
        console.log("File selected")
        setError('')
        setLoading(true)
        setPPReload(false);
        setPP(null)
        var formData = new FormData();
        formData.append("userid", currentUser.uid);
        formData.append("file", inputFile.current.files[0]);
        var http = axios({
            baseURL: "https://gergy.co.uk/imageconvertendpoint.php",
            method: "POST",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            responseType: "blob",
        }).then( response => {
            console.log("Got a response!")
            console.log(response.data)
            setUserProfilePicture(response.data)
            setPPReload(true);
            console.log("Reloading image...")
        })
        setLoading(false)
    }

    function fileChoose(){
        console.log("PP clicked")
        inputFile.current.click();
    }

    const toggleNPassword = () => {
        setPasswordNShowing(!passwordNShowing)
    }

    useEffect(() => {
        async function changePP(){
            console.log(`Trigger profile pic change - ppreload is: ${ppReload}`)
            if(ppReload === false) return
            setPP(await getUserProfilePicture())
            setPPReload(false);
        }
        changePP()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pp, ppReload]);

    return (
        <>
        <Card>
            <Card.Body>
                <h2 className='text-center mb-4'>Update Profile</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <input type="file" id="ppfile" ref={inputFile} style={{display: 'none'}} accept="image/jpg,image/jpeg,image/png,image/bmp" onChange={fileSelected} />
                {pp==="..."?
                <Placeholder className="imageplaceholder" as="div" animation="glow">
                    <Placeholder className="mx-auto my-3" style={{}}/>
                </Placeholder>
                :
                <div className="mx-auto my-3 profileimage" style={{backgroundImage: `url(${pp})`}} onClick={fileChoose}>
                    <div className='inside w-100 h-100'>
                        <p className='w-100 m-0'>edit</p>
                    </div>
                </div>
                }
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="name" className="p-1" aria-label='Email'>
                        <Form.Label>Display Name</Form.Label>
                        <Form.Control type="text" ref={nameRef} defaultValue={currentUser.displayName} required/>
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
