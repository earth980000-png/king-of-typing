import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously, 
  onAuthStateChanged,
  signOut 
} from "firebase/auth";
import { getDatabase, ref, set, get, child, onValue, push, remove, query, orderByChild, limitToLast } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC8yRjTbV40kxAxKWtVunKBes5iUQsuuvQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "king-of-typing-edbb2.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://king-of-typing-edbb2-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "king-of-typing-edbb2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "king-of-typing-edbb2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "186834381011",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:186834381011:web:678940dba06a7b872a0c26"
};

let app, auth, db;
let isFirebaseConfigured = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
  isFirebaseConfigured = true;
} catch (error) {
  console.warn("Firebase initialized in fallback mode:", error);
}

export const subscribeAuthState = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
};

export const checkRedirectResult = async () => {
  if (!isFirebaseConfigured || !auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      return result.user;
    }
  } catch (err) {
    console.error("Redirect result error:", err.code, err.message);
  }
  return null;
};

// 사용자별 개별 데이터 동기화 (골드, 캐릭터, 최고 CPM 보존)
export const saveUserData = async (uid, data) => {
  if (isFirebaseConfigured && db && uid) {
    try {
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
      const existing = snapshot.exists() ? snapshot.val() : {};

      await set(userRef, {
        ...existing,
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

// 명예의 전당 (리더보드) 조회
export const getLeaderboard = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await get(child(ref(db), 'users'));
      if (snapshot.exists()) {
        const usersObj = snapshot.val();
        const list = Object.keys(usersObj).map(key => ({
          uid: key,
          name: usersObj[key].displayName || '무명 격투가',
          maxCpm: usersObj[key].maxCpm || 0,
          equippedCharId: usersObj[key].equippedCharId || 'kyo'
        }));
        // CPM 내림차순 정렬
        list.sort((a, b) => b.maxCpm - a.maxCpm);
        return list.slice(0, 10);
      }
    } catch (err) {
      console.error("Get Leaderboard Error:", err);
    }
  }
  return [
    { name: "쿠사나리 큐", maxCpm: 680, equippedCharId: "kyo" },
    { name: "야가리 이오리", maxCpm: 620, equippedCharId: "iori" },
    { name: "테리 보가로", maxCpm: 550, equippedCharId: "terry" },
    { name: "백열각 춘리", maxCpm: 490, equippedCharId: "chunli" }
  ];
};

export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured || !auth) return mockLogin("Google Player");
  
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error("Google Auth Popup Error:", err.code, err.message);
    if (err.code === 'auth/unauthorized-domain' || err.code === 'auth/popup-blocked') {
      try {
        await signInWithRedirect(auth, provider);
        return null;
      } catch (redirectErr) {
        console.error("Redirect failed:", redirectErr);
      }
    }
    return mockLogin("Google Player");
  }
};

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
