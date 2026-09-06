import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type { BudgetSettings } from '../types';

export const DEFAULT_BUDGET = 20000;
const LOCAL_STORAGE_BUDGET_KEY_PREFIX = 'student_expense_tracker_budget_';

const getLocalBudget = (userId: string): BudgetSettings => {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_BUDGET_KEY_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    monthlyBudget: DEFAULT_BUDGET,
    updatedAt: new Date().toISOString(),
  };
};

const saveLocalBudget = (userId: string, budget: BudgetSettings) => {
  try {
    localStorage.setItem(
      `${LOCAL_STORAGE_BUDGET_KEY_PREFIX}${userId}`,
      JSON.stringify(budget)
    );
  } catch (err) {
    console.error('Failed to save budget locally:', err);
  }
};

/**
 * Subscribe to real-time budget updates
 */
export const subscribeToBudget = (
  userId: string,
  onUpdate: (budget: BudgetSettings) => void
): (() => void) => {
  const isDemoUser = userId === 'student_demo_user_101' || userId.startsWith('local_');

  if (isFirebaseConfigured && db && !isDemoUser) {
    const budgetDocRef = doc(db, 'users', userId, 'settings', 'budget');

    const unsubscribe = onSnapshot(
      budgetDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          onUpdate({
            monthlyBudget: Number(data.monthlyBudget) || DEFAULT_BUDGET,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          });
        } else {
          // Initialize default budget if not set yet
          saveBudget(userId, DEFAULT_BUDGET).catch(console.error);
          onUpdate({
            monthlyBudget: DEFAULT_BUDGET,
            updatedAt: new Date().toISOString(),
          });
        }
      },
      (error) => {
        console.error('Budget subscription error:', error);
        onUpdate(getLocalBudget(userId));
      }
    );

    return unsubscribe;
  }

  // Local fallback
  const localBudget = getLocalBudget(userId);
  onUpdate(localBudget);

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === `${LOCAL_STORAGE_BUDGET_KEY_PREFIX}${userId}`) {
      onUpdate(getLocalBudget(userId));
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener('storage', handleStorageEvent);
  };
};

/**
 * Save / update monthly budget for a user
 */
export const saveBudget = async (
  userId: string,
  monthlyBudget: number
): Promise<void> => {
  const budgetValue = Math.max(0, Number(monthlyBudget) || 0);
  const isDemoUser = userId === 'student_demo_user_101' || userId.startsWith('local_');

  if (isFirebaseConfigured && db && !isDemoUser) {
    const budgetDocRef = doc(db, 'users', userId, 'settings', 'budget');
    await setDoc(
      budgetDocRef,
      {
        monthlyBudget: budgetValue,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return;
  }

  // Local storage mode
  const newBudget: BudgetSettings = {
    monthlyBudget: budgetValue,
    updatedAt: new Date().toISOString(),
  };
  saveLocalBudget(userId, newBudget);
};
