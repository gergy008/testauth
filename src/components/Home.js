import React, { useRef, useState, useEffect } from 'react'
import { Container, Card, Form, Button, Col, Row, ListGroup } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { usePost } from '../contexts/PostContext';
import { ImBubble2 } from 'react-icons/im'
import HomePost from './Layouts/HomePost';

export default function Home() {
  const { currentUser } = useAuth()
  const { 
    makePost, 
    getUserPosts, 
    setUserThumbedPost } = usePost()
  const updateRef = useRef()
  const updateButtonRef = useRef()
  const [posting, setPosting] = useState('')
  const [postData, setPostData] = useState('')
  const [loading, setLoading] = useState('')

  var getData

  async function sendAThing(e) {
    e.preventDefault()
    return await makePost(updateRef.current.value).then(()=>{updatePosts()})
  }

  async function updatePosts(){
    if(loading) return
    setLoading(true)
    console.log("Updating posts")
    getData = await getUserPosts()
    var temp = []
    if(getData !== undefined)
    Object.keys(getData).forEach(function(item) {
      var len = temp.length
      if(len < 10)
        temp.push(getData[item]);
    });
 
    setPostData(temp)
    setLoading(false)
  }

  useEffect(() => {
    updatePosts();
  }, [])

  if(currentUser)
    return (
      <>
        <Container className="d-flex flex-wrap align-items-center justify-content-center">
          <Card className="w-100 mt-5 p-3" style={{ maxWidth: "800px" }}>
              <h4><ImBubble2 className='mb-2'/> What's on your mind?</h4>
              <Form onSubmit={sendAThing}>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Control type="text" ref={updateRef} className='' />
                    </Col>
                    <Col xs='auto'>
                      <Button type="submit" ref={updateButtonRef} disabled={posting}>
                        Post
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
          </Card>
          <Card className="w-100 mt-5" style={{ maxWidth: "800px" }}>
            <Card.Header>Your feed</Card.Header>
            <ListGroup variant="flush">
              {postData && postData.map(post => (
                <HomePost keyid={post.id} post={post}/>
              ))}
            </ListGroup>
          </Card>
        </Container>
      </>
    )
  else
    return (
      <>
        <Container className="d-flex align-items-center justify-content-center">
          <Card className="w-100 mt-5 p-3" style={{ maxWidth: "800px" }}>
            <h2>You're missing out.</h2>
            <span className='mt-3'>Register an account to see stuff</span>
          </Card>
        </Container>
      </>
    )
}
