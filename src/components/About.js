import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Container, Card } from 'react-bootstrap'

const markdown = `
# Basic Social network built in React

This project is my first voyage into React and FSD. As a user with most of my web development in Backend PHP (writing e-commerce websites and RESTful APIs in frameworks such as Codeigniter), React is another realm compared to what I am normally used to.

## About the site

The site is pretty simple. You can register, login, reset password, change your profile, see other users posts and create new posts.

### Upcoming

I plan to add image content on posts, dark mode

### Why?

Post images for crude content distribution, dark mode for learning how to manage themes and retaining user-preferences.

## Site design

I'm using [\`react-boostrap\`](https://react-bootstrap.github.io/) (Available on npm & yarn). Design is nothing special and I'm working on the technology not the way that the site works right now. It's great for prototyping and putting ideas together quickly and easily with a great selection of components to choose from.

## Challenges

If I spent a particular amount of time doing something, it would be fun to explain how I thought about the problem and worked out a solution

### Image conversion

One thing that any JS-based site struggles with is image manipulation. I tried a number of ways to allow a user to upload virtually any image, but depending on the filetype depended on how I was going to handle format conversion of the image. I decided in the end to utilise my PHP knowledge and the powerful tools available with GD libaries in PHP to create a RESTful image conversion endpoint.

I can simply get and upload images from the react app to the endpoint; have the endpoint do its magic; and return a perfectly cropped & resized image with the correct aspect ratio for upload. There are multiple existing APIs for this, but I felt simply testing I would hit the very strict limits. Most only have less than 25 conversions before hitting paywalls.

Check it out and upload some of your own. There's a 5MB limit for the source file.

## New Methods learned

I've learned a number of things while creating this project, some of which thought I would list here (more for my own reference than anything else)

### React Custom Components

It took me quite a while to dynamically update and load each of the user posts. Posts are pulled from the DB then mapped onto a custom react component. The component will find and load the display name of the poster. You can actually see that the display name first loads as glowing placeholder object before being replaced.

### No-SQL

Not necessarily learned, but re-learned.

I particulary remember I've used MongoDB as part of a project to win a £125 Amazon voucher for 2nd prize in a hackathon contest at Manchester Met University. We created an online bicycle store, which would pull information from various document-oriented databases.

I'm confident in the use of MySQL, so using No-SQL is a good skill to have.

### Git version control

I'm a terrible person for never using version control before. I guess I've known _how_ to use git, why it's important for use in large teams to allow collaboration, plus I've seen it used extensively by friends. But - I've never actually used it myself.

This was a great oppurtunity to make that step. I've been studying more about technologies and tools I'm likely to encounter in the real world, I couldn't imagine not using git in a commercial setting.
`

export default function About() {
  return (
    <>
      <Container className="d-flex align-items-center justify-content-center">
        <Card className="w-100 mt-5 p-3" style={{ maxWidth: "800px" }}>
          <p><a href='https://github.com/gergy008/testauth' target="_blank" rel="noreferrer">Checkout the project on Github</a></p>
          <ReactMarkdown children={markdown} components={{
            h3: 'h5',
            h2: 'h4',
            h1: 'h2'
            }}/>
        </Card>
      </Container>
    </>
  )
}
