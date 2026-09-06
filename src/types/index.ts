export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Education'
  | 'Shopping'
  | 'Entertainment'
  | 'Other';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt?: string;
}

export interface BudgetSettings {
  monthlyBudget: number;
  updatedAt?: string;
}

export interface ExpenseFilter {
  searchQuery: string;
  category: string; // 'All' or ExpenseCategory
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
  color: string;
  icon: string;
}
