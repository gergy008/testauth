import React, { useContext, useState, useEffect } from 'react'
import { 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut, updateEmail, updatePassword,
    sendPasswordResetEmail, updateProfile
} from 'firebase/auth'
import { ref, update } from "firebase/database";
import { ref as sRef, getDownloadURL, uploadBytes } from "firebase/storage";
import { db } from '../database.js'
import { auth } from '../firebase.js'
import { storage } from '../cloudstore.js'
import DOMPurify from 'dompurify';

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    async function register(name, email, password) {
        console.table({dispname: name, uemail: email, upass: password})
        const clean = DOMPurify.sanitize(name)
        return await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            updateProfile(userCredential.user, {displayName: clean})
                .then(()=>{setName(name)})
            
        })
    }
    
    function setName(newName){
        const changes = {}
        changes[`/users/${auth.currentUser.uid}/name`] = newName
        return update(ref(db), changes)
      }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    function loggedIn() {
        return auth.currentUser ? true : false
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth, email)
    }

    function updateUserDisplayName(name){
        const clean = DOMPurify.sanitize(name)
        
        return updateProfile(auth.currentUser, {displayName: clean})
                .then(() => {setName(name)})
    }

    function getUserProfilePictureReference(userid) {
        return sRef(sRef(storage, `profilepictures`), `${userid}/profile.png`)
    }

    async function getUserProfilePicture(userid=auth.currentUser.uid){
        return await getDownloadURL(getUserProfilePictureReference(userid))
                            .catch((error) => {
                                console.error(`Unable to get profile picture with error: ${error.code}`)
                                return getDefaultProfilePicture()
                            })
    }

    async function setUserProfilePicture(file){
        var userid = auth.currentUser.uid
        return await uploadBytes(getUserProfilePictureReference(userid), file)
    }

    function getDefaultProfilePicture(){
        return getDownloadURL(sRef(storage, `profilepictures/default.png`))
    }

    async function updateUserEmail(currentEmail, newEmail, password){
        const userCredential = await signInWithEmailAndPassword(auth, currentEmail, password)
        return updateEmail(userCredential, newEmail)
    }

    async function updateUserPassword(email, currentPassword, newPassword){
        const userCredential = await signInWithEmailAndPassword(auth, email, currentPassword)
        return updatePassword(userCredential, newPassword)
    }

    useEffect(() => {
        return onAuthStateChanged(auth, user => {
            setCurrentUser(user)
            setLoading(false)
        })
    }, [])

    const value = {
        currentUser,
        register,
        login,
        logout,
        loggedIn,
        resetPassword,
        updateUserEmail,
        updateUserPassword,
        updateUserDisplayName,
        getUserProfilePicture,
        getDefaultProfilePicture,
        setUserProfilePicture
    }

  return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
  )
}


