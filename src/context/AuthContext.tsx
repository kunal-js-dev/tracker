import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import type { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isDemoMode: boolean;
  isFirebaseReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithDemoAccount: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_DEMO_USER_KEY = 'student_expense_tracker_demo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isFirebaseConfigured);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  // Initialize auth state
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setFirebaseUser(fbUser);
          setIsDemoMode(false);

          // Retrieve or construct user profile
          if (db) {
            try {
              const userDocRef = doc(db, 'users', fbUser.uid);
              const userSnap = await getDoc(userDocRef);
              if (userSnap.exists()) {
                const data = userSnap.data();
                setCurrentUser({
                  userId: fbUser.uid,
                  name: data.name || fbUser.displayName || 'Student',
                  email: data.email || fbUser.email || '',
                  createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                });
              } else {
                const newUserProfile: UserProfile = {
                  userId: fbUser.uid,
                  name: fbUser.displayName || 'Student',
                  email: fbUser.email || '',
                  createdAt: new Date().toISOString(),
                };
                setCurrentUser(newUserProfile);
                await setDoc(userDocRef, {
                  name: newUserProfile.name,
                  email: newUserProfile.email,
                  createdAt: serverTimestamp(),
                });
              }
            } catch (err) {
              console.error('Error fetching user document:', err);
              setCurrentUser({
                userId: fbUser.uid,
                name: fbUser.displayName || 'Student',
                email: fbUser.email || '',
                createdAt: new Date().toISOString(),
              });
            }
          }
        } else {
          setFirebaseUser(null);
          // Check for saved demo user if not logged into Firebase
          const storedDemoUser = localStorage.getItem(LOCAL_DEMO_USER_KEY);
          if (storedDemoUser) {
            try {
              setCurrentUser(JSON.parse(storedDemoUser));
              setIsDemoMode(true);
            } catch {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        }
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Local/Demo mode initialization
      const storedDemoUser = localStorage.getItem(LOCAL_DEMO_USER_KEY);
      if (storedDemoUser) {
        try {
          setCurrentUser(JSON.parse(storedDemoUser));
        } catch {
          setCurrentUser(null);
        }
      }
      setIsDemoMode(true);
      setLoading(false);
    }
  }, []);

  // Register with Email and Password
  const register = async (name: string, email: string, password: string) => {
    setAuthError(null);
    if (!name.trim() || !email.trim() || !password) {
      throw new Error('Please fill in all required fields.');
    }
    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters.');
    }

    if (isFirebaseConfigured && auth && db) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: name.trim() });

        const profile: UserProfile = {
          userId: cred.user.uid,
          name: name.trim(),
          email: cred.user.email || email.trim(),
          createdAt: new Date().toISOString(),
        };

        // Create user document in users/{userId}
        try {
          await setDoc(doc(db, 'users', cred.user.uid), {
            name: profile.name,
            email: profile.email,
            createdAt: serverTimestamp(),
          });
        } catch (dbErr) {
          console.warn('Could not write user profile to Firestore (check rules):', dbErr);
        }

        setCurrentUser(profile);
      } catch (err: any) {
        let msg = 'Registration failed. Please try again.';
        if (err.code === 'auth/configuration-not-found') {
          msg = 'Firebase Authentication is not activated in project tracker-1ec76 yet. Open Firebase Console -> Authentication, click "Get started", and enable Email/Password.';
        } else if (err.code === 'auth/operation-not-allowed') {
          msg = 'Email/Password sign-in is not enabled in Firebase Console. Go to Firebase Console -> Authentication -> Sign-in method and enable Email/Password.';
        } else if (err.code === 'auth/email-already-in-use') {
          msg = 'An account with this email address already exists. Try logging in.';
        } else if (err.code === 'auth/invalid-email') {
          msg = 'Please enter a valid email address.';
        } else if (err.code === 'auth/weak-password') {
          msg = 'Password is too weak. Please use at least 6 characters.';
        } else if (err.code === 'auth/network-request-failed') {
          msg = 'Network error. Please check your internet connection.';
        } else if (err.message) {
          msg = err.message;
        }
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Local simulation mode
      const simulatedId = 'local_user_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
      const profile: UserProfile = {
        userId: simulatedId,
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_DEMO_USER_KEY, JSON.stringify(profile));
      setCurrentUser(profile);
      setIsDemoMode(true);
    }
  };

  // Login with Email and Password
  const login = async (email: string, password: string) => {
    setAuthError(null);
    if (!email.trim() || !password) {
      throw new Error('Please enter both email and password.');
    }

    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (err: any) {
        let msg = 'Invalid email or password.';
        if (err.code === 'auth/configuration-not-found') {
          msg = 'Firebase Authentication is not activated in project tracker-1ec76 yet. Open Firebase Console -> Authentication, click "Get started", and enable Email/Password.';
        } else if (err.code === 'auth/operation-not-allowed') {
          msg = 'Email/Password sign-in is not enabled in Firebase Console. Go to Firebase Console -> Authentication -> Sign-in method and enable Email/Password.';
        } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Invalid email or password. Please check your credentials or register a new account.';
        } else if (err.code === 'auth/too-many-requests') {
          msg = 'Too many failed login attempts. Please try again later.';
        } else if (err.code === 'auth/network-request-failed') {
          msg = 'Network error. Please check your internet connection.';
        } else if (err.message) {
          msg = err.message;
        }
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Local simulation login
      const simulatedId = 'local_user_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
      const profile: UserProfile = {
        userId: simulatedId,
        name: email.split('@')[0].replace(/[._]/g, ' ') || 'Student User',
        email: email.trim(),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_DEMO_USER_KEY, JSON.stringify(profile));
      setCurrentUser(profile);
      setIsDemoMode(true);
    }
  };

  // Quick 1-click Demo Account Login
  const loginWithDemoAccount = async () => {
    setAuthError(null);
    const demoProfile: UserProfile = {
      userId: 'student_demo_user_101',
      name: 'Aarav Sharma',
      email: 'student.demo@college.edu',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_DEMO_USER_KEY, JSON.stringify(demoProfile));
    setCurrentUser(demoProfile);
    setIsDemoMode(true);
  };

  // Logout
  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth && firebaseUser) {
        await firebaseSignOut(auth);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem(LOCAL_DEMO_USER_KEY);
      setCurrentUser(null);
      setFirebaseUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        isDemoMode,
        isFirebaseReady: isFirebaseConfigured,
        login,
        register,
        loginWithDemoAccount,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
