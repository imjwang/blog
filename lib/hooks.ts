import { auth, firestore } from '@/lib/firebase'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore'


export function useUserData() {
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    let unsubscribe

    if (user) {
      const usersRef = collection(firestore, 'users')
      const ref = doc(usersRef, user.uid)

      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username)
      })

    } else {
      setUsername(null)
    }

    return unsubscribe
  }, [user])

  return { user, username }

}