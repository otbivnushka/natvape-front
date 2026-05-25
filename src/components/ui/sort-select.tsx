import React from 'react';
import type { SortOption } from '../../types';
import { CustomDropdown } from './custom-dropdown';

interface SortSelectProps {
  value: SortOption;
  onChange: (val: SortOption) => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: 'name', label: 'А-Я' },
  { value: 'price-asc', label: 'Цена ↑' },
  { value: 'price-desc', label: 'Цена ↓' },
  { value: 'rating', label: 'Рейтинг' },
];

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <CustomDropdown value={value} options={options} onChange={onChange} />
  );
};

export { SortSelect };
