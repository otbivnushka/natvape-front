import React, { useState } from 'react';
import type { AttributeValuesItem } from '@/api/dto/product.dto';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AttributeFilterProps {
  attributes: AttributeValuesItem[];
  selected: Record<string, string>;
  onChange: (selected: Record<string, string>) => void;
}

const AttributeFilter: React.FC<AttributeFilterProps> = ({ attributes, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  if (attributes.length === 0) return null;

  const toggle = (key: string, value: string) => {
    const next = { ...selected };
    if (next[key] === value) {
      delete next[key];
    } else {
      next[key] = value;
    }
    onChange(next);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-muted cursor-pointer bg-transparent border-none py-1"
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        По характеристикам
        {Object.keys(selected).length > 0 && (
          <span className="text-primary font-semibold ml-1">
            ({Object.keys(selected).length})
          </span>
        )}
      </button>

      {open && (
        <div className="flex flex-col gap-3 mt-2">
          {attributes.map((attr) => (
            <div key={attr.key}>
              <div className="text-xs text-muted font-semibold mb-1.5">{attr.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {attr.values.map((val) => {
                  const active = selected[attr.key] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => toggle(attr.key, val)}
                      className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                        active
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface text-body border-line hover:border-primary'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { AttributeFilter };
