import React from 'react';
import { useAgeGateStore } from '@/store/useAgeGateStore';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const AgeGate: React.FC = () => {
  const status = useAgeGateStore((s) => s.status);
  const accept = useAgeGateStore((s) => s.accept);
  const deny = useAgeGateStore((s) => s.deny);

  if (status === 'denied') {
    return (
      <div className="fixed inset-0 z-50 bg-page flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl p-6 max-w-sm w-full text-center">
          <ShieldAlert size={48} className="text-muted mx-auto mb-4" />
          <h1 className="text-lg font-bold text-body mb-2">Доступ ограничен</h1>
          <p className="text-sm text-muted leading-relaxed">
            К сожалению, доступ к приложению возможен только лицам, достигшим 18 лет.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-page flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl p-6 max-w-sm w-full text-center">
        <ShieldCheck size={48} className="text-primary mx-auto mb-4" />
        <h1 className="text-lg font-bold text-body mb-2">Вам уже есть 18 лет?</h1>
        <p className="text-sm text-muted leading-relaxed mb-6">
          Подтвердите, что вам уже есть 18 лет, чтобы продолжить использование приложения.
          Продажа товаров лицам, не достигшим 18 лет, запрещена.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={accept}
            className="w-full py-2.5 px-4 border-none rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-85 transition-opacity"
          >
            Мне есть 18
          </button>
          <button
            onClick={deny}
            className="w-full py-2.5 px-4 border border-line rounded-xl bg-transparent text-sm text-muted font-semibold cursor-pointer hover:bg-page transition-colors"
          >
            Мне нет 18
          </button>
        </div>
      </div>
    </div>
  );
};

export { AgeGate };
