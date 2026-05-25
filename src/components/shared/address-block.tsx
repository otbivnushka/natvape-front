import React from 'react';
import { Plus, Trash } from 'lucide-react';
import type { Address } from '../../types';
import clsx from 'clsx';

interface AddressBlockProps {
  addresses: Address[];
  selectedId: number;
  onSelect: (id: number) => void;
  onAddNew?: () => void;
  onDelete?: (id: number) => void;
}

const radioBase =
  'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200';

const AddressBlock: React.FC<AddressBlockProps> = ({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  onDelete,
}) => {
  return (
    <div className="flex flex-col gap-2 mt-3">
      {addresses.map((addr) => {
        const selected = selectedId === addr.id;
        return (
          <label
            key={addr.id}
            className={clsx(
              radioBase,
              selected ? 'border-primary bg-primary/5' : 'border-line bg-surface hover:border-muted',
            )}
          >
            <input
              type="radio"
              name="address"
              value={addr.id}
              checked={selected}
              onChange={() => onSelect(addr.id)}
              className="sr-only"
            />
            <span
              className={clsx(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200',
                selected ? 'border-primary' : 'border-muted',
              )}
            >
              {selected && <span className="w-2 h-2 rounded-full bg-primary" />}
            </span>
            <span
              className={clsx('text-sm font-medium', selected ? 'text-body' : 'text-muted', 'flex-1')}
            >
              {addr.label}
            </span>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(addr.id);
                }}
                className="p-1.5 rounded-lg text-dim hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
              >
                <Trash size={14} />
              </button>
            )}
          </label>
        );
      })}
      {onAddNew && (
        <button
          type="button"
          onClick={onAddNew}
          className={clsx(
            radioBase,
            'border-dashed border-line bg-surface hover:border-primary hover:bg-primary/5 w-full',
          )}
        >
          <span className="w-4 h-4 rounded-full border-2 border-dashed border-muted flex items-center justify-center shrink-0">
            <Plus size={14} className="text-muted" />
          </span>
          <span className="text-sm font-medium text-muted">Добавить адрес</span>
        </button>
      )}
    </div>
  );
};

export { AddressBlock };
