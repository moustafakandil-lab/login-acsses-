// src/context/AuthContext.jsx
// This is the single source of truth for "who is logged in" and "what role they have".
// Any component can call useAuth() to read { currentUser, role, loading }.
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase fires this any time login state changes (login, logout, refresh)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Role never comes from the client's memory or a form —
        // it is always re-read from Firestore, which only Cloud
        // Functions / an admin can write to (see firestore.rules).
        const snap = await getDoc(doc(db, 'users', user.uid));
        setRole(snap.exists() ? snap.data().role : null);
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, role, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
