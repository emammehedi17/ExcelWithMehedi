import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection as mandated
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Helper to sign in with Google
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Sync user profile to Firestore
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        userId: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, `users/${result.user.uid}`);
      });
      return result.user;
    }
    return null;
  } catch (err: any) {
    // Popup closed by user or cancelled is normal
    if (err?.code === 'auth/popup-closed-by-user') {
      return null;
    }
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

// Helper to sign out
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// Helper to load user's custom saved sheet
export interface SavedSheetPayload {
  rows: (string | number)[][];
  headers?: string[];
  cols?: string[];
}

export async function loadUserSheet(
  userId: string,
  sheetId: string
): Promise<SavedSheetPayload | (string | number)[][] | null> {
  const path = `users/${userId}/sheets/${sheetId}`;
  try {
    const sheetDoc = await getDoc(doc(db, 'users', userId, 'sheets', sheetId));
    if (sheetDoc.exists()) {
      const data = sheetDoc.data();
      if (data?.dataJson) {
        return JSON.parse(data.dataJson);
      }
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

// Helper to save user's custom edited sheet (including rows, headers, cols)
export async function saveUserSheet(
  userId: string,
  sheetId: string,
  rowsOrPayload: (string | number)[][] | SavedSheetPayload,
  headers?: string[],
  cols?: string[]
): Promise<void> {
  const path = `users/${userId}/sheets/${sheetId}`;
  try {
    let payload: SavedSheetPayload;
    if (Array.isArray(rowsOrPayload)) {
      payload = { rows: rowsOrPayload, headers, cols };
    } else {
      payload = rowsOrPayload;
    }
    const jsonStr = JSON.stringify(payload);
    await setDoc(doc(db, 'users', userId, 'sheets', sheetId), {
      userId,
      sheetId,
      dataJson: jsonStr,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Helper to reset user's sheet back to default
export async function resetUserSheet(userId: string, sheetId: string): Promise<void> {
  const path = `users/${userId}/sheets/${sheetId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'sheets', sheetId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export { onAuthStateChanged, type User };
