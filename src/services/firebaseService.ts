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

const EXPENSES_COLLECTION = 'expenses';

export class FirebaseService {
  static async addExpense(userId: string, expense: Omit<Expense, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
        ...expense,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  static async getExpenses(userId: string): Promise<Expense[]> {
    try {
      const q = query(
        collection(db, EXPENSES_COLLECTION),
        where('userId', '==', userId),
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

  static subscribeToExpenses(userId: string, callback: (expenses: Expense[]) => void) {
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

  static async deleteExpense(expenseId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, EXPENSES_COLLECTION, expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  static async uploadTempReceipt(file: File, userId: string): Promise<string> {
  try {
    const timestamp = Date.now();
    const filePath = `receipts/${userId}/temp_${timestamp}_${file.name}`;
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
