import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  onAuthStateChanged,
  signOut 
} from "firebase/auth";
import { getDatabase, ref, set, get, child, onValue, push, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app, auth, db;
let isFirebaseConfigured = false;

if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "") {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
    isFirebaseConfigured = true;
  } catch (error) {
    console.warn("Firebase initialized in fallback mode:", error);
  }
}

// 안전한 인증 상태 수신
export const subscribeAuthState = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
};

// 사용자별 개별 프로필 데이터 동기화 (유저 격리)
export const saveUserData = async (uid, data) => {
  if (isFirebaseConfigured && db && uid) {
    try {
      await set(ref(db, `users/${uid}`), {
        ...data,
        updatedAt: Date.now()
      });
    } catch (err) {
      console.error("Save User Data Error:", err);
    }
  }
};

export const loadUserData = async (uid) => {
  if (isFirebaseConfigured && db && uid) {
    try {
      const snapshot = await get(child(ref(db), `users/${uid}`));
      if (snapshot.exists()) {
        return snapshot.val();
      }
    } catch (err) {
      console.error("Load User Data Error:", err);
    }
  }
  return null;
};

// 구글 로그인
export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured || !auth) return mockLogin("Google");
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error("Google Auth Error:", err);
    return mockLogin("Google User");
  }
};

// 익명 로그인
export const loginAnonymously = async () => {
  if (!isFirebaseConfigured || !auth) return mockLogin("Guest Player");
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (err) {
    console.error("Anonymous Auth Error:", err);
    return mockLogin("Guest Player");
  }
};

// 로그아웃
export const logoutUser = async () => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
};

const mockLogin = (name) => {
  const uid = "user_" + Math.random().toString(36).substr(2, 9);
  return {
    uid,
    displayName: `${name}_${uid.substr(0, 4)}`,
    isAnonymous: true
  };
};

export { auth, db, ref, set, onValue, push, remove, isFirebaseConfigured };
