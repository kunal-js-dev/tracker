import React from 'react';
import type { ExpenseFilter } from '../../types';
import { CATEGORY_LIST } from '../../utils/categories';
import { Search, ArrowUpDown, Filter, X } from 'lucide-react';

interface ExpenseFilterBarProps {
  filter: ExpenseFilter;
  onChange: (filter: ExpenseFilter) => void;
  onReset: () => void;
  totalFiltered: number;
}

export const ExpenseFilterBar: React.FC<ExpenseFilterBarProps> = ({
  filter,
  onChange,
  onReset,
  totalFiltered,
}) => {
  const isFiltered = filter.searchQuery !== '' || filter.category !== 'All';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by expense title or note..."
            value={filter.searchQuery}
            onChange={(e) => onChange({ ...filter, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onChange({ ...filter, searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </span>
              <select
                value={filter.category}
                onChange={(e) => onChange({ ...filter, category: e.target.value })}
                className="w-full sm:w-auto pl-8 pr-8 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none cursor-pointer text-slate-700"
              >
                <option value="All">All Categories</option>
                {CATEGORY_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </span>
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  onChange({
                    ...filter,
                    sortBy: e.target.value as ExpenseFilter['sortBy'],
                  })
                }
                className="w-full sm:w-auto pl-8 pr-8 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none cursor-pointer text-slate-700"
              >
                <option value="date-desc">Newest Date</option>
                <option value="date-asc">Oldest Date</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Pills shortcut for fast filtering on tablets/mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Quick filter:</span>
        <button
          onClick={() => onChange({ ...filter, category: 'All' })}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter.category === 'All'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({totalFiltered})
        </button>
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange({ ...filter, category: cat })}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter.category === cat
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
