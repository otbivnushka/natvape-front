import React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import type { BonusHistoryEntry } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

interface BonusHistoryProps {
  history: BonusHistoryEntry[];
}

const BonusHistory: React.FC<BonusHistoryProps> = ({ history }) => {
  const [open, setOpen] = React.useState(false);

  if (history.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-surface rounded-xl">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between cursor-pointer"
      >
        <h2 className="text-sm font-semibold text-muted">История баллов</h2>
        <ChevronDown
          size={18}
          className={clsx('text-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto mt-3">
          {history.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex flex-col min-w-0">
                <span className="text-body truncate">{entry.description}</span>
                <span className="text-xs text-muted">{entry.createdAt?.slice(0, 10)}</span>
              </div>
              <span
                className={clsx(
                  'font-semibold shrink-0',
                  entry.amount >= 0 ? 'text-accent' : 'text-dim',
                )}
              >
                {entry.amount >= 0 ? '+' : ''}
                {formatPrice(entry.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { BonusHistory };
