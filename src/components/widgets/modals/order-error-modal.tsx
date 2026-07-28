import React from 'react';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface OrderErrorModalProps {
  open: boolean;
  onClose: () => void;
  errors: string[];
}

const OrderErrorModal: React.FC<OrderErrorModalProps> = ({ open, onClose, errors }) => {
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-body">Не удалось оформить заказ</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-dim hover:text-body hover:bg-line transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <ul className="flex flex-col gap-2 mb-6">
          {errors.map((msg, i) => (
            <li key={i} className="text-sm text-muted leading-relaxed pl-4 relative before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-red-400">
              {msg}
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 border-none rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-85 transition-opacity"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export { OrderErrorModal };
