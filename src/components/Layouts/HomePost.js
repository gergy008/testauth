import React, { useState, useEffect } from 'react'
import { Col, Row, ListGroup, Placeholder } from 'react-bootstrap'
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs'
import { useAuth } from '../../contexts/AuthContext';
import { usePost } from '../../contexts/PostContext';
import Moment from 'react-moment';

export default function HomePost({ keyid, post }) {
    const { currentUser } = useAuth()
    const { toggleThumbOnPost, getNameForUid } = usePost()
    const [loading, setLoading] = useState(false)
    const [isThumbed, setIsThumbed] = useState(false)
    const [thumbCount, setThumbCount] = useState(0)
    const [posterName, setPosterName] = useState("...")

    async function toggleThumb(){
      try {
        await toggleThumbOnPost(post.id).then(() => {
            setIsThumbed(!isThumbed)
            setThumbCount(thumbCount + (isThumbed?1:-1))
        })
      } catch(er){
        console.error(er)
      }
    }

    useEffect(() => {
        setIsThumbed(!(post.thumbs && post.thumbs[currentUser.uid]))
    }, []);

    useEffect(() => {
        setThumbCount(post.thumbCount)
    }, []);

    useEffect(() => {
        updateName()
    }, [])

    async function updateName() {
        try {
            const name = await getNameForUid(post.poster.id)
            setPosterName(name)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <ListGroup.Item key={keyid} className="">
            <Row>
                <Col>
                    {posterName==="..."?
                    <Placeholder as="h4" animation="glow" style={{display: "inline"}}>
                        <Placeholder xs={3} />
                    </Placeholder>
                    :
                    <h4 style={{display: "inline"}}>{posterName}</h4>
                    }
                    &nbsp;
                    <small className="inline">
                        posted <Moment fromNow>{post.timestamp}</Moment>
                    </small>
                </Col>
            </Row>
            <Row>
                <Col className="m-2">{post.text}</Col>
            </Row>
            <Row>
                <Col className="">
                    {isThumbed?<BsHandThumbsUp
                        className='mb-2' 
                        onClick={toggleThumb}
                    />:<BsHandThumbsUpFill 
                        className='mb-2' 
                        onClick={toggleThumb}
                    />} {thumbCount}
                </Col>
            </Row>
        </ListGroup.Item>
    )
}
