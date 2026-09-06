import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type { Expense } from '../types';
import { generateDemoExpenses } from './demoDataService';

const LOCAL_STORAGE_EXPENSES_KEY_PREFIX = 'student_expense_tracker_expenses_';

// Local storage helpers for demo/offline mode
const getLocalExpenses = (userId: string): Expense[] => {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_EXPENSES_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalExpenses = (userId: string, expenses: Expense[]) => {
  try {
    localStorage.setItem(
      `${LOCAL_STORAGE_EXPENSES_KEY_PREFIX}${userId}`,
      JSON.stringify(expenses)
    );
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

const shouldUseFirestore = (userId: string): boolean => {
  return Boolean(
    isFirebaseConfigured &&
    db &&
    userId !== 'student_demo_user_101' &&
    !userId.startsWith('local_')
  );
};

/**
 * Subscribe to real-time updates of user expenses
 */
export const subscribeToExpenses = (
  userId: string,
  onUpdate: (expenses: Expense[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  if (shouldUseFirestore(userId) && db) {
    const expensesRef = collection(db, 'users', userId, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const expenses: Expense[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || '',
            amount: Number(data.amount) || 0,
            category: data.category || 'Other',
            date: data.date || '',
            note: data.note || '',
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          };
        });
        onUpdate(expenses);
      },
      (error) => {
        console.error('Firestore onSnapshot error:', error);
        if (onError) onError(error);
        // Fallback to local on error
        onUpdate(getLocalExpenses(userId));
      }
    );

    return unsubscribe;
  }

  // Fallback: local storage mode
  const localList = getLocalExpenses(userId);
  onUpdate(localList);

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === `${LOCAL_STORAGE_EXPENSES_KEY_PREFIX}${userId}`) {
      onUpdate(getLocalExpenses(userId));
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener('storage', handleStorageEvent);
  };
};

/**
 * Add an expense for the user
 */
export const addExpense = async (
  userId: string,
  expense: Omit<Expense, 'id' | 'createdAt'>
): Promise<string> => {
  const cleanNote = expense.note ? expense.note.trim() : '';

  if (shouldUseFirestore(userId) && db) {
    try {
      const expensesRef = collection(db, 'users', userId, 'expenses');
      const cleanPayload: Record<string, any> = {
        title: expense.title.trim(),
        amount: Number(expense.amount) || 0,
        category: expense.category || 'Other',
        date: expense.date,
        note: cleanNote,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(expensesRef, cleanPayload);
      return docRef.id;
    } catch (err) {
      console.warn('Firestore addDoc error, falling back to local storage:', err);
    }
  }

  // Local storage mode
  const current = getLocalExpenses(userId);
  const newId = 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newExpense: Expense = {
    ...expense,
    id: newId,
    amount: Number(expense.amount),
    note: cleanNote,
    createdAt: new Date().toISOString(),
  };
  saveLocalExpenses(userId, [newExpense, ...current]);
  return newId;
};

/**
 * Update an existing expense
 */
export const updateExpense = async (
  userId: string,
  expenseId: string,
  expenseData: Partial<Omit<Expense, 'id'>>
): Promise<void> => {
  if (shouldUseFirestore(userId) && db) {
    try {
      const expenseDocRef = doc(db, 'users', userId, 'expenses', expenseId);
      const updatePayload: Record<string, any> = {
        updatedAt: serverTimestamp(),
      };
      if (expenseData.title !== undefined) updatePayload.title = expenseData.title.trim();
      if (expenseData.amount !== undefined) updatePayload.amount = Number(expenseData.amount);
      if (expenseData.category !== undefined) updatePayload.category = expenseData.category;
      if (expenseData.date !== undefined) updatePayload.date = expenseData.date;
      if (expenseData.note !== undefined) {
        updatePayload.note = expenseData.note ? expenseData.note.trim() : '';
      }

      await updateDoc(expenseDocRef, updatePayload);
      return;
    } catch (err) {
      console.warn('Firestore updateDoc error, falling back to local storage:', err);
    }
  }

  // Local storage mode
  const current = getLocalExpenses(userId);
  const updated = current.map((item) =>
    item.id === expenseId
      ? {
          ...item,
          ...expenseData,
          amount:
            expenseData.amount !== undefined
              ? Number(expenseData.amount)
              : item.amount,
          note:
            expenseData.note !== undefined
              ? expenseData.note.trim()
              : item.note,
        }
      : item
  );
  saveLocalExpenses(userId, updated);
};

/**
 * Delete an expense
 */
export const deleteExpense = async (
  userId: string,
  expenseId: string
): Promise<void> => {
  if (shouldUseFirestore(userId) && db) {
    try {
      const expenseDocRef = doc(db, 'users', userId, 'expenses', expenseId);
      await deleteDoc(expenseDocRef);
      return;
    } catch (err) {
      console.warn('Firestore deleteDoc error, falling back to local storage:', err);
    }
  }

  // Local storage mode
  const current = getLocalExpenses(userId);
  const filtered = current.filter((item) => item.id !== expenseId);
  saveLocalExpenses(userId, filtered);
};

/**
 * Load realistic demo data for the current user
 */
export const seedDemoExpenses = async (userId: string): Promise<number> => {
  const sampleItems = generateDemoExpenses();

  if (shouldUseFirestore(userId) && db) {
    try {
      const expensesRef = collection(db, 'users', userId, 'expenses');
      for (const item of sampleItems) {
        await addDoc(expensesRef, {
          title: item.title,
          amount: Number(item.amount),
          category: item.category,
          date: item.date,
          note: item.note ? item.note.trim() : '',
          createdAt: serverTimestamp(),
        });
      }
      return sampleItems.length;
    } catch (err) {
      console.warn('Firestore seedDemoExpenses error, falling back to local storage:', err);
    }
  }

  // Local storage mode
  const current = getLocalExpenses(userId);
  const newItems: Expense[] = sampleItems.map((item, index) => ({
    ...item,
    id: `local_demo_${Date.now()}_${index}`,
    note: item.note || '',
    createdAt: new Date().toISOString(),
  }));
  saveLocalExpenses(userId, [...newItems, ...current]);
  return sampleItems.length;
};


