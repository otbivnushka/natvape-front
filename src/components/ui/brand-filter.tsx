import React from 'react';
import { CustomDropdown } from './custom-dropdown';

interface BrandFilterProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({ value, options, onChange }) => {
  return (
    <CustomDropdown
      value={value}
      options={[
        { value: '', label: 'Все бренды' },
        ...options.map((b) => ({ value: b, label: b })),
      ]}
      onChange={onChange}
      placeholder="Бренд"
    />
  );
};

export { BrandFilter };
