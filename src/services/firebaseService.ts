// src/services/FirebaseService.ts

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
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Expense } from '../types/expense';

const EXPENSES_COLLECTION = 'expenses';

export class FirebaseService {
  /**
   * Subscribe to real-time expense updates for a user
   */
  static subscribeToExpenses(
    userId: string,
    callback: (expenses: Expense[]) => void
  ): Unsubscribe {
    const expensesRef = collection(db, EXPENSES_COLLECTION);
    const q = query(
      expensesRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const expenses: Expense[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[];
        callback(expenses);
      },
      (error) => {
        console.error('❌ Failed to fetch expenses:', error);
      }
    );
  }

  /**
   * Add a new expense
   */
  static async addExpense(userId: string, expense: Omit<Expense, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
        ...expense,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('❌ Error adding expense:', error);
      throw error;
    }
  }

  /**
   * Get all expenses for a user (non-realtime)
   */
  static async getExpenses(userId: string): Promise<Expense[]> {
    try {
      const q = query(
        collection(db, EXPENSES_COLLECTION),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[];
    } catch (error) {
      console.error('❌ Error getting expenses:', error);
      throw error;
    }
  }

  /**
   * Update an existing expense
   */
  static async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<void> {
    try {
      const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
      await updateDoc(expenseRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('❌ Error updating expense:', error);
      throw error;
    }
  }

  /**
   * Delete an expense by ID
   */
  static async deleteExpense(expenseId: string): Promise<void> {
    try {
      const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
      await deleteDoc(expenseRef);
    } catch (error) {
      console.error('❌ Error deleting expense:', error);
      throw error;
    }
  }

  /**
   * Upload a receipt and return its public URL
   */
  static async uploadReceipt(file: File, userId: string): Promise<string> {
    try {
      const fileName = `receipts/${userId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("file uploaded")
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading receipt:', error);
      throw error;
    }
  }
}
