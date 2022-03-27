import React, { useState, useEffect } from 'react'
import { Col, Row, ListGroup, Placeholder, Image } from 'react-bootstrap'
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs'
import { useAuth } from '../../contexts/AuthContext';
import { usePost } from '../../contexts/PostContext';
import Moment from 'react-moment';
import '../../css/HomePost.css';

export default function HomePost({ keyid, post }) {
    const { currentUser, getUserProfilePicture } = useAuth()
    const { toggleThumbOnPost, getNameForUid } = usePost()
    const [isThumbed, setIsThumbed] = useState(false)
    const [thumbCount, setThumbCount] = useState(0)
    const [posterName, setPosterName] = useState("...")
    const [pp, setPP] = useState("...")

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
    }, [currentUser.uid, post.thumbs]);

    useEffect(() => {
        setThumbCount(post.thumbCount)
    }, [post.thumbCount]);

    useEffect(() => {
        async function updateName() {
            try {
                const name = await getNameForUid(post.poster.id)
                setPosterName(name)
            } catch (err) {
                console.log(err);
            }
        }
        updateName()
    }, [getNameForUid, post.poster.id])

    useEffect(() => {
        async function changePP(){
          setPP(await getUserProfilePicture(post.poster.id))
        }
        changePP()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ListGroup.Item key={keyid} className="">
            <Row>
                <Col>
                    <div className='postitem'>
                        {pp==="..."?
                        <Placeholder className="poster" as="div" animation="glow">
                            <Placeholder />
                        </Placeholder>
                        :
                        <Image className="poster" roundedCircle width="32" height="32" src={pp} />
                        }
                        {posterName==="..."?
                        <Placeholder as="h4" animation="glow">
                            <Placeholder className="w-10" />
                        </Placeholder>
                        :
                        <h4>{posterName}</h4>
                        }
                        &nbsp;
                        <small>
                            posted <Moment fromNow>{post.timestamp}</Moment>
                        </small>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col className="m-2">{post.text}</Col>
            </Row>
            <Row>
                <Col>
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
