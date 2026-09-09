import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  onAuthStateChanged,
  type User,
} from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
  authError: string | null;
  clearError: () => void;
  isSignInPromptOpen: boolean;
  openSignInPrompt: () => void;
  closeSignInPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSignInPromptOpen, setIsSignInPromptOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setIsSignInPromptOpen(false);
      }
      return user;
    } catch (err: any) {
      console.error('Sign in error:', err);
      setAuthError(err?.message || 'Google সাইন-ইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
      return null;
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOutUser();
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const clearError = () => setAuthError(null);
  const openSignInPrompt = () => setIsSignInPromptOpen(true);
  const closeSignInPrompt = () => setIsSignInPromptOpen(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        authError,
        clearError,
        isSignInPromptOpen,
        openSignInPrompt,
        closeSignInPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
