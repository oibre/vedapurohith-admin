import React, { useContext, useState, useEffect } from 'react'
import { db, storage, auth, firebaseApp } from '../firebase'; 
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import { collection, addDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
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

export const getFirestoreDocumentById = async (collectionName: any, documentID: any) => {
  try {
    const docRef = doc(db, collectionName, documentID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('Document does not exist!');
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    return null;
  }
};

export function getUserData(uid: any) {
  return new Promise(async (resolve, reject) => {
    const usersCollection = db.collection('users');
    const query = usersCollection.where('uid', '==', uid);

    const querySnapshot = await query.get();
    let data = []
    for(const doc of querySnapshot.docs) {
      const userData = doc.data();
      userData.id = doc.id;
      data.push(userData)
    }
    resolve(data);
  })
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

export const deleteDocument = async (collectionName: any, documentID: any) => {
  try {
    const docRef = doc(db, collectionName, documentID);
    await deleteDoc(docRef);
    console.log('Document successfully deleted!');
    return true; // Indicate successful deletion
  } catch (error) {
    console.error('Error deleting document: ', error);
    return false; // Indicate failed deletion
  }
};

export const getAllItems = () => {
  return new Promise((resolve, reject) => {
    db.collection('items')
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

export const uploadDataToFirestore = (collectionName: any, payload: any) => {
  return db.collection(collectionName).add(payload)
}

export const uploadFileToFirebase = (e: any, location:any) => {
  return new Promise((resolve, reject) => {
    let storageInstance = storage(firebaseApp)
    let poojasImgRef = ref(storageInstance, location + Math.floor(10000 + Math.random() * 90000) + '-' + e.name)
    uploadBytes(poojasImgRef, e).then(snapshot => {
      console.log(snapshot)
      getDownloadURL(snapshot.ref).then(downloadURL => {
        resolve({url: downloadURL})
      })
    }).catch(err => reject({err}))
  })
}

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

export const getPandints = () => {
  return new Promise(async (resolve, reject) => {
    const usersCollection = db.collection('users');
    const query = usersCollection.where('role', '==', 'pandit');

    const querySnapshot = await query.get();
    let data = []
    for(const doc of querySnapshot.docs) {
      const userData = doc.data();
      userData.id = doc.id;
      data.push(userData)
    }
    resolve(data);
  })
}

export const updateSelectedPandit = (bookingId: any, panditId: any, panditName: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bookingRef = db.collection('bookings').doc(bookingId);
      await bookingRef.update({ panditId, panditName });
      resolve('Pandit assigned successfully.');
    } catch (error) {
      console.error('Error assigning pandit to booking: ', error);
      reject(error);
    }
  });
}

export const getUserDataFromFirestore = (uid: any) => {
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