import React from 'react'
import { Container, Card } from 'react-bootstrap'

export default function NotFound() {
  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Card className="w-100 mt-5 p-3" style={{ maxWidth: "800px" }}>
          <h2>Page not found</h2>
          <span className='mt-3'>You've hit a broken link, sorry about that!
          <br/><a href="/">Take me home</a></span>
        </Card>
      </Container>
    </>
  )
}
