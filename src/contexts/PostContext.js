import React, { useContext, useState, useEffect } from 'react'
import { ref, update, push, child, get, runTransaction, orderByChild } from "firebase/database";
import { useAuth } from "./AuthContext";
import { db } from '../database.js'
import DOMPurify from 'dompurify';
import { debugErrorMap } from 'firebase/auth';
import { DropdownButton } from 'react-bootstrap';

const PostContext = React.createContext()

export function usePost(){
    return useContext(PostContext)
}

export function PostProvider({ children }) {
    const { currentUser } = useAuth();

    function makePost(text){
      const newPostKey = push(child(ref(db), '/posts/')).key;
      
      const userData = {
        id: currentUser.uid,
        name: currentUser.displayName
      }
      const postData = {
        id: newPostKey,
        poster: userData,
        text: text,
        thumbs: {},
        thumbCount: 1,
        timestamp: Date.now()
      }
      postData.thumbs[currentUser.uid] = true

      const updates = {};
      updates['/posts/' + newPostKey] = postData;
      updates['/users/' + currentUser.uid + '/posts/' + postData.timestamp] = newPostKey;

      return update(ref(db), updates);
    }

    async function getUserPosts(){
      var ss = await get(child(ref(db), `/posts/`), orderByChild('timestamp')).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          console.warn("No posts available");
        }
      }).catch((error) => {
        console.error(error);
      });
      var sorted = arrayReverseObj(ss)
      return sorted
    }

    async function toggleThumbOnPost(postid){
      const postRef = ref(db, `/posts/${postid}`);
      const uid = currentUser.uid
      
      await runTransaction(postRef, (post) => {
        if (post) {
          if (post.thumbs && post.thumbs[uid]) {
            //console.log(`REMOVE THUMB FOR POST ${postid}`)
            post.thumbCount--;
            post.thumbs[uid] = null;
          } else {
            //console.log(`ADD THUMB FOR POST ${postid}`)
            post.thumbCount++;
            if (!post.thumbs) {
              post.thumbs = {};
            }
            post.thumbs[uid] = true;
          }
        }
        return post;
      });
    }

    const arrayReverseObj = (obj) => {
      var new_obj= {}
      var rev_obj = Object.keys(obj).reverse();
      rev_obj.forEach(function(i) { 
        new_obj[i] = obj[i];
      })
      return new_obj;
    }

    const value = {
        makePost,
        getUserPosts,
        toggleThumbOnPost
    }

  return (
      <PostContext.Provider value={value}>
        {children}
      </PostContext.Provider>
  )
}