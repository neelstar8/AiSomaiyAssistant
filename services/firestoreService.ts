
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db, isDbAvailable, disableNetwork } from "../firebase";
import { User, InfraReport, WithdrawalRequest } from "../types";

const COLLECTIONS = {
  USERS: 'users',
  REPORTS: 'infra_reports',
  WITHDRAWALS: 'withdrawals',
  RAG_DOCS: 'rag_docs'
};

// Internal state to track if we've switched to demo mode
let isDemoMode = !isDbAvailable;

/**
 * Proactively kills the network connection if we hit a persistent permission error.
 */
const killNetworkOnFailure = async (error: any) => {
  const isPermissionDenied = error?.code === 'permission-denied' || error?.message?.includes('permission-denied');
  // Only kill if it's still failing after fixing the ID
  if (isPermissionDenied && !isDemoMode) {
    console.info("[Somaiya AI] Still hitting restriction. Using Local Verified Curriculum.");
    isDemoMode = true;
    try {
      if (db) await disableNetwork(db);
    } catch (e) {}
  }
  return isDemoMode;
};

export const getRagMetadata = async () => {
  if (isDemoMode) return [];
  try {
    const q = query(collection(db, COLLECTIONS.RAG_DOCS), where("enabled", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    await killNetworkOnFailure(error);
    return [];
  }
};

export const syncUserProfile = async (userData: Omit<User, 'credits'>): Promise<User> => {
  if (isDemoMode) return { ...userData, credits: 150 };
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userData.email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { ...userData, ...userSnap.data() } as User;
    } else {
      const newUser: User = { ...userData, credits: 0 };
      await setDoc(userRef, newUser);
      return newUser;
    }
  } catch (error) {
    await killNetworkOnFailure(error);
    return { ...userData, credits: 150 };
  }
};

export const saveInfraReport = async (report: Omit<InfraReport, 'id' | 'timestamp' | 'status'>) => {
  if (isDemoMode) return "demo-report-id";
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.REPORTS), {
      ...report,
      status: 'pending',
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    await killNetworkOnFailure(error);
    return "demo-report-id";
  }
};

export const saveWithdrawalRequest = async (request: Omit<WithdrawalRequest, 'id' | 'timestamp' | 'status'>) => {
  if (isDemoMode) return "demo-withdrawal-id";
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.WITHDRAWALS), {
      ...request,
      status: 'pending',
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    await killNetworkOnFailure(error);
    return "demo-withdrawal-id";
  }
};

export const isFirebaseBlocked = () => isDemoMode;
