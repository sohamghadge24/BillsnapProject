// File: src/services/FirebaseService.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Expense } from '../types/expense';
import { getAuth } from 'firebase/auth';

const EXPENSES_COLLECTION = 'expenses';

export class FirebaseService {
  /** Add a new expense */
  static async addExpense(expense: Omit<Expense, 'id' | 'userId'>): Promise<string> {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
        ...expense,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  /** Get all expenses for the current user */
  static async getExpenses(): Promise<Expense[]> {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const q = query(
        collection(db, EXPENSES_COLLECTION),
        where('userId', '==', auth.currentUser.uid),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
    } catch (error) {
      console.error('Error getting expenses:', error);
      throw error;
    }
  }

  /**
   * Subscribe to expenses.
   * Usage:
   *    subscribeToExpenses((expenses) => {...}) // for current user
   *    subscribeToExpenses(userId, (expenses) => {...}) // for specific user
   */
  static subscribeToExpenses(
    userIdOrCallback: string | ((expenses: Expense[]) => void),
    maybeCallback?: (expenses: Expense[]) => void
  ) {
    let userId: string;
    let callback: (expenses: Expense[]) => void;

    // If the first argument is a function, use currentUser
    if (typeof userIdOrCallback === 'function') {
      const auth = getAuth();
      if (!auth.currentUser) {
        console.error('User not authenticated');
        return () => {};
      }
      userId = auth.currentUser.uid;
      callback = userIdOrCallback;
    }
    // If the first argument is a string, treat it as userId
    else if (typeof userIdOrCallback === 'string' && typeof maybeCallback === 'function') {
      userId = userIdOrCallback;
      callback = maybeCallback;
    } else {
      console.error('Invalid arguments passed to subscribeToExpenses');
      return () => {};
    }

    const q = query(
      collection(db, EXPENSES_COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const expenses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      callback(expenses);
    });
  }

  /** Update an expense */
  static async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<void> {
    try {
      const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
      await updateDoc(expenseRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  /** Delete an expense */
  static async deleteExpense(expenseId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, EXPENSES_COLLECTION, expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  /** Upload a temporary receipt to Firebase Storage */
  static async uploadTempReceipt(file: File): Promise<string> {
    try {
      const auth = getAuth();
      if (!auth.currentUser) throw new Error('User not authenticated');

      const timestamp = Date.now();
      const filePath = `receipts/${auth.currentUser.uid}/temp_${timestamp}_${file.name}`;
      const storageRef = ref(storage, filePath);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('📷 Temp receipt uploaded:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading temp receipt:', error);
      throw error;
    }
  }

  /** Placeholder for OCR extraction */
  static async extractDataFromImage(file: File): Promise<any> {
    console.warn("OCR is not implemented in this method. Use a Cloud Function or Tesseract.js.");
    return {
      amount: 123.45,
      description: 'Scanned from receipt',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    };
  }
}
