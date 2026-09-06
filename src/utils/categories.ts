import type { ExpenseCategory } from '../types';

export interface CategoryMeta {
  label: ExpenseCategory;
  color: string;
  textColor: string;
  badgeClass: string;
  chartColor: string;
  iconName: string;
  description: string;
}

export const CATEGORIES: Record<ExpenseCategory, CategoryMeta> = {
  Food: {
    label: 'Food',
    color: 'bg-amber-100',
    textColor: 'text-amber-800',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    chartColor: '#f59e0b',
    iconName: 'Utensils',
    description: 'Meals, groceries, snacks, coffee & canteen',
  },
  Travel: {
    label: 'Travel',
    color: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    chartColor: '#10b981',
    iconName: 'Bus',
    description: 'Bus, metro, train, auto, fuel & cabs',
  },
  Education: {
    label: 'Education',
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    chartColor: '#3b82f6',
    iconName: 'BookOpen',
    description: 'Books, course fees, stationery, photocopy & supplies',
  },
  Shopping: {
    label: 'Shopping',
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    chartColor: '#8b5cf6',
    iconName: 'ShoppingBag',
    description: 'Clothing, gadgets, personal care & essentials',
  },
  Entertainment: {
    label: 'Entertainment',
    color: 'bg-rose-100',
    textColor: 'text-rose-800',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    chartColor: '#f43f5e',
    iconName: 'Film',
    description: 'Movies, gaming, outings & subscriptions',
  },
  Other: {
    label: 'Other',
    color: 'bg-slate-100',
    textColor: 'text-slate-800',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
    chartColor: '#64748b',
    iconName: 'Tag',
    description: 'Miscellaneous, emergency & unplanned expenses',
  },
};

export const CATEGORY_LIST: ExpenseCategory[] = [
  'Food',
  'Travel',
  'Education',
  'Shopping',
  'Entertainment',
  'Other',
];
