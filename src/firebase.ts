import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  disableNetwork,
  getDocFromServer,
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  addDoc
} from 'firebase/firestore';

// Get config from firebase-applet-config.json values
const firebaseConfig = {
  apiKey: "AIzaSyCeSU11fbjNcojjlfgKudsjq4vIv8C3oSw",
  authDomain: "polynomial-node-c2gpt.firebaseapp.com",
  projectId: "polynomial-node-c2gpt",
  storageBucket: "polynomial-node-c2gpt.firebasestorage.app",
  messagingSenderId: "397253837002",
  appId: "1:397253837002:web:7ebe7dbe248c8c72f0b433",
  firestoreDatabaseId: "ai-studio-f483728e-7470-4ffe-9c68-de9d95e70213"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with robust local persistent cache
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, firebaseConfig.firestoreDatabaseId);

// Fast connectivity check to automatically fall back to local offline mode if unreachable
async function testAndGracefullyVerifyConnection() {
  try {
    // Check if the server is responsive within 2.5 seconds
    const connectionCheck = getDocFromServer(doc(db, 'test_connection', 'ping'));
    const timeout = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Connection timed out')), 2500)
    );
    await Promise.race([connectionCheck, timeout]);
    console.log("Firestore connection successfully established with backend.");
  } catch (error) {
    console.warn("Firestore backend is unreachable (or in restricted sandbox). Engaging local offline-first mode instantly:", error);
    try {
      await disableNetwork(db);
      console.log("Firestore local offline-first mode active. App is stable and fully responsive.");
    } catch (e) {
      console.error("Failed to cleanly disable Firestore network:", e);
    }
  }
}

testAndGracefullyVerifyConnection();

// Local DB Synchronization Helpers
function getLocalCollection<T>(collectionName: string): T[] {
  try {
    const data = localStorage.getItem(`rukunin_db_${collectionName}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse local collection data", e);
    return [];
  }
}

function saveLocalCollection<T>(collectionName: string, items: T[]) {
  try {
    localStorage.setItem(`rukunin_db_${collectionName}`, JSON.stringify(items));
    // Trigger custom events to propagate data to any active listeners
    window.dispatchEvent(new CustomEvent(`rukunin_local_update_${collectionName}`, { detail: items }));
  } catch (e) {
    console.error("Failed to save local collection data", e);
  }
}

const activeLocalFallback: Record<string, boolean> = {};

/**
 * Generic Real-Time Firestore Sync Helper with Fault-Tolerant Local Storage Fallback
 * @param collectionName Firestore collection name
 * @param callback Callback function with updated array of items
 * @param orderField Optional field to order results by
 */
export function syncCollection<T extends { id: string }>(
  collectionName: string,
  callback: (items: T[]) => void,
  orderField?: string
) {
  const colRef = collection(db, collectionName);
  const q = orderField ? query(colRef) : colRef;

  // Handler for custom events that synchronizes UI update instantly on user interactions
  const handleLocalUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<T[]>;
    callback(customEvent.detail || []);
  };

  // Try real-time Firestore sync
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items: T[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as T);
    });
    
    // Smoothly cache standard data locally to keep state intact
    saveLocalCollection(collectionName, items);
    callback(items);
  }, (error) => {
    console.warn(`Firestore sync collection "${collectionName}" permission denied. Falling back to LocalStorage:`, error);
    
    // Register local fallback mode
    activeLocalFallback[collectionName] = true;
    
    // Deliver initial local or mock collection state
    const localItems = getLocalCollection<T>(collectionName);
    callback(localItems);

    // Bind real-time event listener for local writes
    window.addEventListener(`rukunin_local_update_${collectionName}`, handleLocalUpdate);
  });

  return () => {
    unsubscribe();
    window.removeEventListener(`rukunin_local_update_${collectionName}`, handleLocalUpdate);
  };
}

/**
 * Save or update a specific document in a collection with Local Fallback
 */
export async function saveDocument<T extends { id: string }>(
  collectionName: string,
  item: T
) {
  // Gracefully update local cache for latency-free experience
  const localItems = getLocalCollection<any>(collectionName);
  const idx = localItems.findIndex(x => x.id === item.id);
  if (idx > -1) {
    localItems[idx] = { ...localItems[idx], ...item };
  } else {
    localItems.push(item);
  }
  saveLocalCollection(collectionName, localItems);

  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, { ...item }, { merge: true });
  } catch (error) {
    console.warn(`Firestore document save failed for ${collectionName}/${item.id} (Saved locally):`, error);
  }
}

/**
 * Delete a specific document in a collection with Local Fallback
 */
export async function deleteDocument(collectionName: string, id: string) {
  // Update local storage first
  const localItems = getLocalCollection<any>(collectionName);
  const updatedItems = localItems.filter(x => x.id !== id);
  saveLocalCollection(collectionName, updatedItems);

  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn(`Firestore document delete failed inside ${collectionName}/${id} (Deleted locally):`, error);
  }
}

/**
 * Seeds a collection with initial mock data if the collection is empty
 */
export async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  initialData: T[]
) {
  // Initialize local storage copy if it does not exist already
  const localItems = getLocalCollection<T>(collectionName);
  if (localItems.length === 0) {
    console.log(`Initial seed populated locally for "${collectionName}" with ${initialData.length} items`);
    saveLocalCollection(collectionName, initialData);
  }

  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log(`Seeding empty Firestore collection "${collectionName}" with ${initialData.length} items...`);
      for (const item of initialData) {
        const docRef = doc(db, collectionName, item.id);
        await setDoc(docRef, item);
      }
    }
  } catch (error) {
    console.warn(`Firestore seeding skipped for "${collectionName}" due to permissions/connection:`, error);
  }
}

/**
 * Seed all tables with mock data if they are empty
 */
export async function initializeDatabase(initialSets: {
  citizens: any[],
  transactions: any[],
  iurans: any[],
  announcements: any[],
  events: any[],
  letters: any[],
  polls: any[],
  inventory: any[],
  borrows: any[],
  incidents: any[],
  suggestions: any[],
  users: any[]
}) {
  await seedCollectionIfEmpty('citizens', initialSets.citizens);
  await seedCollectionIfEmpty('transactions', initialSets.transactions);
  await seedCollectionIfEmpty('iurans', initialSets.iurans);
  await seedCollectionIfEmpty('announcements', initialSets.announcements);
  await seedCollectionIfEmpty('events', initialSets.events);
  await seedCollectionIfEmpty('letters', initialSets.letters);
  await seedCollectionIfEmpty('polls', initialSets.polls);
  await seedCollectionIfEmpty('inventory', initialSets.inventory);
  await seedCollectionIfEmpty('borrows', initialSets.borrows);
  await seedCollectionIfEmpty('incidents', initialSets.incidents);
  await seedCollectionIfEmpty('suggestions', initialSets.suggestions);
  await seedCollectionIfEmpty('users', initialSets.users);
  console.log('Database verification and seeding completed.');
}
