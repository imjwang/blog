import { auth, provider, firestore } from '@/lib/firebase'
import { signInWithPopup } from "firebase/auth";
import {useContext, useEffect, useState, useCallback} from 'react'
import debounce from 'lodash.debounce'
import {UserContext} from '@/lib/context'
import {getDoc, doc, collection, writeBatch} from 'firebase/firestore'

export default function Enter({}) {
  const {user, username} = useContext(UserContext)

  return (
    <main>
      <h1>Sign up for this amazing app!</h1>
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
    </main>
  );

}

const SignInButton = () => {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'@/public/google.png'} /> Sign in with Google
    </button>
  )
}

const SignOutButton = () => {
  return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    // Create refs for both documents
    const userDoc = doc(firestore, `users/${user.uid}`)
    const usernameDoc = doc(firestore, `usernames/${formValue}`)

    // Commit both docs together as a batch write.
    const batch = writeBatch(firestore);
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        // const collectionRef = collection(firestore, 'users')
        const ref = doc(firestore, `usernames/${username}`);
        const docSnap = await getDoc(ref);
        console.log('Firestore read executed!');
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

// change this to use toast
function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}