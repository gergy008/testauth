import React from 'react'
import { Container, Navbar, Nav } from "react-bootstrap";
import { useAuth } from '../../contexts/AuthContext';
import GreetingLoggedIn from './GreetingLoggedIn';
import GreetingLoggedOut from './GreetingLoggedOut';


export default function Navigation() {

    const { loggedIn, currentUser } = useAuth()
    const sitename = process.env.REACT_APP_SITE_SITENAME

    function greeting(){
        if(loggedIn())
            return <GreetingLoggedIn>{currentUser.displayName}</GreetingLoggedIn>
        else
            return <GreetingLoggedOut />
    }

    return (
        <Navbar bg="light" variant="light">
            <Container>
            <Navbar.Brand href="/">{sitename}</Navbar.Brand>
            <Nav className="me-right">
                {greeting()}
            </Nav>
            </Container>
        </Navbar>
    )
}
