import React, { useContext, useState, useEffect } from 'react'
import { 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut, updateEmail, updatePassword,
    sendPasswordResetEmail, updateProfile
} from 'firebase/auth'
import { ref, update } from "firebase/database";
import { db } from '../database.js'
import { auth } from '../firebase.js'
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
        updateUserDisplayName
    }

  return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
  )
}


