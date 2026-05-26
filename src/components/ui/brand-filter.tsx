import React from 'react';
import { Dropdown } from './dropdown';

interface BrandFilterProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({ value, options, onChange }) => {
  return (
    <Dropdown
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
