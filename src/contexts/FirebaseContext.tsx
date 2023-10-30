import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import { db } from '../firebase'; // Assuming you have a 'db' instance initialized for Firestore

import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import {
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from 'firebase/auth'

interface IAuthProviderProps {
  children: JSX.Element
}

const AuthContext = React.createContext({})

// auth

export function useAuth(): any {
  return useContext(AuthContext)
}

export function addUserToFirestore(user: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const usersCollection = collection(db, 'admin');
      const docRef = await addDoc(usersCollection, user);
      resolve(docRef.id);
    } catch (error) {
      console.error('Error adding user to Firestore: ', error);
      reject(error);
    }
  });
}

export function getUserData(uid: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        resolve(userDocSnap.data());
      } else {
        console.log('User document does not exist.');
        resolve(null);
      }
    } catch (error) {
      console.error('Error getting user data from Firestore: ', error);
      reject(error);
    }
  });
}

export function AuthProvider({ children }: IAuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<any>()
  const [loading, setLoading] = useState(true)

  function signup(email: string, password: string): Promise<any> {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function googleSignin(): Promise<any> {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  function githubSignin(): Promise<any> {
    const provider = new GithubAuthProvider()
    return signInWithPopup(auth, provider)
  }

  function login(email: string, password: string): Promise<any> {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout(): Promise<any> {
    return auth.signOut()
  }

  function resetPassword(email: string): Promise<any> {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email: string): Promise<any> {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password: string): Promise<any> {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    googleSignin,
    githubSignin,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// firestore

export const getAllPoojas = () => {
  return new Promise((resolve, reject) => {
    db.collection('poojas')
      .get()
      .then((querySnapshot) => {
        const poojaData: any = [];
        querySnapshot.forEach((doc) => {
          poojaData.push({ id: doc.id, ...doc.data() });
        });
        resolve(poojaData);
      })
      .catch((error) => {
        console.error('Error fetching poojas: ', error);
        reject(error);
      });
  });
};

export const getLatestPoojas = (n: number) => {
  return new Promise((resolve, reject) => {
    db.collection('poojas')
      .limit(n) // Get only the latest 3 poojas
      .get()
      .then((querySnapshot) => {
        const latestPoojas: any = [];
        querySnapshot.forEach((doc) => {
          latestPoojas.push({ id: doc.id, ...doc.data() });
        });
        resolve(latestPoojas);
      })
      .catch((error) => {
        console.error('Error fetching latest poojas: ', error);
        reject(error);
      });
  });
};

export const addEntryToBookings = (userId: any, poojaId: any, bookingDateTime: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bookedOn = new Date(); // Get the current date and time
      const cartCollection = collection(db, 'bookings');
      const cartItem = {
        userId: userId,
        poojaId: poojaId,
        bookingDateTime: bookingDateTime,
        status: 'booked',
        bookedOn: bookedOn, // Add the bookedOn date to the cartItem object
      };
      await addDoc(cartCollection, cartItem);
      resolve('Item added to cart successfully.');
    } catch (error) {
      console.error('Error adding item to cart: ', error);
      reject(error);
    }
  });
};

export const getAllBookings = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const bookingsCollection = db.collection('bookings');
      const query = bookingsCollection.where('userId', '!=', '');

      const userBookings = [];
      const querySnapshot = await query.get();

      for (const doc of querySnapshot.docs) {
        const bookingData = doc.data();
        const poojaId = bookingData.poojaId;
        const poojaRef = db.collection('poojas').doc(poojaId);
        const poojaDoc = await poojaRef.get();

        if (poojaDoc.exists) {
          const poojaDetails = poojaDoc.data();
          userBookings.push({
            id: doc.id,
            bookingData,
            poojaDetails,
          });
        } else {
          console.log(`Pooja with ID ${poojaId} does not exist.`);
        }
      }

      resolve(userBookings);
    } catch (error) {
      console.error('Error fetching bookings for user:', error);
      reject(error);
    }
  });
};