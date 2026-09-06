import React from 'react';
import type { ExpenseCategory } from '../../types';
import { CATEGORIES } from '../../utils/categories';
import { Utensils, Bus, BookOpen, ShoppingBag, Film, Tag } from 'lucide-react';

interface CategoryBadgeProps {
  category: ExpenseCategory;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  showIcon = true,
  size = 'md',
}) => {
  const meta = CATEGORIES[category] || CATEGORIES.Other;

  const renderIcon = () => {
    const iconProps = { className: size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5' };
    switch (category) {
      case 'Food':
        return <Utensils {...iconProps} />;
      case 'Travel':
        return <Bus {...iconProps} />;
      case 'Education':
        return <BookOpen {...iconProps} />;
      case 'Shopping':
        return <ShoppingBag {...iconProps} />;
      case 'Entertainment':
        return <Film {...iconProps} />;
      default:
        return <Tag {...iconProps} />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${meta.badgeClass} ${sizeClasses}`}
    >
      {showIcon && renderIcon()}
      {meta.label}
    </span>
  );
};
