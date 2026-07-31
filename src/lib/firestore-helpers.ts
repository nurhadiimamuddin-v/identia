import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  runTransaction,
  QueryConstraint,
  DocumentData,
  setDoc,
} from 'firebase/firestore';
import { COUNTERS_COLLECTION } from './collections';

/**
 * Get next auto-increment ID for a collection.
 * Simulates MySQL AUTO_INCREMENT using a _counters collection.
 */
export async function getNextId(collectionName: string): Promise<number> {
  const counterRef = doc(db, COUNTERS_COLLECTION, collectionName);

  return await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let nextId = 1;

    if (counterDoc.exists()) {
      nextId = (counterDoc.data().current || 0) + 1;
      transaction.update(counterRef, { current: nextId });
    } else {
      transaction.set(counterRef, { current: nextId });
    }

    return nextId;
  });
}

/**
 * Generic: Get all documents from a collection with optional query constraints.
 */
export async function getAll(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<DocumentData[]> {
  const ref = collection(db, collectionName);
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    _docId: doc.id,
  }));
}

/**
 * Generic: Get a single document by its Firestore document ID.
 */
export async function getById(
  collectionName: string,
  docId: string
): Promise<DocumentData | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;
  return { ...docSnap.data(), _docId: docSnap.id };
}

/**
 * Generic: Get a single document by a specific field value.
 * Simulates: SELECT * FROM table WHERE field = value LIMIT 1
 */
export async function getByField(
  collectionName: string,
  field: string,
  value: any
): Promise<DocumentData | null> {
  const ref = collection(db, collectionName);
  const q = query(ref, where(field, '==', value), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { ...docSnap.data(), _docId: docSnap.id };
}

/**
 * Generic: Insert a new document with auto-increment ID.
 * The auto-increment ID is stored as the primary key field (e.g., id_account, id_occupant).
 * The Firestore document ID is set to the string version of the auto-increment ID.
 */
export async function insertWithAutoId(
  collectionName: string,
  primaryKeyField: string,
  data: Record<string, any>
): Promise<{ id: number; docId: string }> {
  const nextId = await getNextId(collectionName);
  const docId = String(nextId);

  await setDoc(doc(db, collectionName, docId), {
    [primaryKeyField]: nextId,
    ...data,
  });

  return { id: nextId, docId };
}

/**
 * Generic: Insert a document using addDoc (Firestore auto-generated ID).
 */
export async function insertDoc(
  collectionName: string,
  data: Record<string, any>
): Promise<string> {
  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, data);
  return docRef.id;
}

/**
 * Generic: Update a document by Firestore document ID.
 */
export async function updateById(
  collectionName: string,
  docId: string,
  data: Record<string, any>
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
}

/**
 * Generic: Delete a document by Firestore document ID.
 */
export async function deleteById(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

/**
 * Generic: Count documents matching constraints.
 * Simulates: SELECT COUNT(*) FROM table WHERE ...
 */
export async function countDocs(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<number> {
  const ref = collection(db, collectionName);
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * Convert a JS Date to Firestore Timestamp.
 */
export function toTimestamp(date: Date | string): Timestamp {
  if (typeof date === 'string') {
    return Timestamp.fromDate(new Date(date));
  }
  return Timestamp.fromDate(date);
}

/**
 * Convert a Firestore Timestamp to a formatted date string.
 * Simulates PHP's date() output format.
 */
export function fromTimestamp(
  timestamp: Timestamp | null,
  format: 'datetime' | 'date' | 'time' = 'datetime'
): string {
  if (!timestamp) return '';
  const d = timestamp.toDate();

  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const HH = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());

  switch (format) {
    case 'date':
      return `${yyyy}-${MM}-${dd}`;
    case 'time':
      return `${HH}:${mm}:${ss}`;
    default:
      return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  }
}

// Re-export commonly used Firestore query builders for convenience
export { where, orderBy, limit, startAfter, Timestamp };
