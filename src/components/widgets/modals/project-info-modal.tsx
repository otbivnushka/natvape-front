import React from 'react';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface ProjectInfoModalProps {
  open: boolean;
  onClose: () => void;
}

const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ open, onClose }) => {
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
          <h2 className="text-lg font-bold text-body">NatShop</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-dim hover:text-body hover:bg-line transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-muted mb-4 leading-relaxed">
          тг мини апп{' '}
          <span className="text-sm underline text-red-600 mt-8 leading-relaxed">18+</span>
        </p>

        <div className="text-sm">
          <span className="font-semibold text-body">Поддержка: </span>
          <span className="font-bold text-body underline">
            <a href="https://t.me/NatManagerr">@NatManagerr</a>
          </span>
        </div>

        <p
          onClick={() => {
            window.localStorage.clear();
          }}
          className="text-sm text-muted mt-8 leading-relaxed"
        >
          © Все права уже защищены. Вообще ничего не нарушено
        </p>
      </div>
    </div>
  );
};

export { ProjectInfoModal };
