import React, { useState, useCallback } from 'react';

interface ConfirmState {
  payload: unknown;
  message: string;
  resolve: (value: boolean) => void;
}

export function useConfirmDialog<T = void>(): {
  confirm: (payload: T, message: string) => Promise<boolean>;
  ConfirmDialog: React.FC;
} {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((payload: T, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ payload, message, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state?.resolve(true);
    setState(null);
  }, [state]);

  const handleCancel = useCallback(() => {
    state?.resolve(false);
    setState(null);
  }, [state]);

  const ConfirmDialog: React.FC = () => {
    if (!state) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-surface rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
          <p className="text-sm text-body mb-5">{state.message}</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="py-2 px-4 border border-line rounded-lg bg-page text-sm text-muted cursor-pointer hover:bg-surface transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirm}
              className="py-2 px-4 border-none rounded-lg bg-red-500 text-white text-sm font-semibold cursor-pointer hover:bg-red-600 transition-colors"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    );
  };

  return { confirm, ConfirmDialog };
}
