import React from 'react'
import { Navbar } from "react-bootstrap";

export default function GreetingLoggedIn({children}) {
  return (
    <Navbar.Text>
      Welcome <a href="/profile">{children?children:"User"}</a>! -&nbsp;
      <a href="/logout">Logout</a>
    </Navbar.Text>
  )
}
