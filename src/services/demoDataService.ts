import type { ExpenseCategory } from '../types';
import { getTodayDateString } from '../utils/formatters';

export interface DemoExpenseTemplate {
  title: string;
  amount: number;
  category: ExpenseCategory;
  dateOffsetDays: number;
  note?: string;
}

export const DEMO_EXPENSES_TEMPLATE: DemoExpenseTemplate[] = [
  {
    title: 'Campus Cafeteria Lunch',
    amount: 150,
    category: 'Food',
    dateOffsetDays: 0,
    note: 'Thali and cold beverage at main canteen',
  },
  {
    title: 'Metro Smart Card Recharge',
    amount: 80,
    category: 'Travel',
    dateOffsetDays: 1,
    note: 'Weekly metro pass top-up for college commute',
  },
  {
    title: 'Data Structures Reference Textbook',
    amount: 500,
    category: 'Education',
    dateOffsetDays: 2,
    note: 'Semester 3 textbook & lab manual photocopy',
  },
  {
    title: 'Casual College Backpack',
    amount: 300,
    category: 'Shopping',
    dateOffsetDays: 3,
    note: 'Stationery bag & notebook organizer',
  },
  {
    title: 'Weekend Cinema Ticket with Roommates',
    amount: 250,
    category: 'Entertainment',
    dateOffsetDays: 4,
    note: 'Student discount movie ticket',
  },
  {
    title: 'Evening Chai and Samosa',
    amount: 60,
    category: 'Food',
    dateOffsetDays: 5,
    note: 'Quick study break snack',
  },
  {
    title: 'Hostel WiFi & Printing Credits',
    amount: 120,
    category: 'Other',
    dateOffsetDays: 6,
    note: 'Printing assignment reports and hostel net recharge',
  },
  {
    title: 'Bus Pass Monthly Pass Ticket',
    amount: 110,
    category: 'Travel',
    dateOffsetDays: 8,
    note: 'City bus pass renewal',
  },
];

export const generateDemoExpenses = () => {
  const today = new Date();
  return DEMO_EXPENSES_TEMPLATE.map((template) => {
    const date = new Date(today);
    date.setDate(date.getDate() - template.dateOffsetDays);
    const dateStr = date.toISOString().split('T')[0];

    return {
      title: template.title,
      amount: template.amount,
      category: template.category,
      date: dateStr || getTodayDateString(),
      note: template.note || '',
    };
  });
};
