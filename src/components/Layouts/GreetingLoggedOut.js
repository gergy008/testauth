import React from 'react'
import { Navbar } from "react-bootstrap";

export default function GreetingLoggedOut() {
  return (
    <Navbar.Text>
      <a href="/login">Log in</a> or <a href="/register">Register</a>
    </Navbar.Text>
  )
}
