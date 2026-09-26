import React from 'react';
import { PrimaryButton } from '../ui';

interface BonusSelectorProps {
  spendable: number;
  max: number;
  value: number;
  onChange: (amount: number) => void;
}

const BonusSelector: React.FC<BonusSelectorProps> = ({ spendable, max, value, onChange }) => {
  const isEnabled = value > 0;

  const handleAmount = (isPlus: boolean) => {
    const next = isPlus ? value + 1 : value - 1;
    if (next < 0 || next > max) return;
    onChange(next);
  };

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-muted mb-2.5">Оплатить баллами</h2>
      <div className="text-xs text-muted mb-2.5">Доступно баллов: {spendable}</div>
      <div className="flex justify-center gap-4 flex-wrap">
        <PrimaryButton
          className="bg-surface text-primary"
          selected={!isEnabled}
          onClick={() => onChange(0)}
          disabled={spendable === 0}
        >
          Не списывать баллы
        </PrimaryButton>
        <PrimaryButton
          className="bg-surface text-primary"
          selected={isEnabled}
          onClick={() => onChange(Math.min(1, max))}
          disabled={spendable === 0}
        >
          Списать баллы
        </PrimaryButton>
      </div>
      {isEnabled && (
        <div className="flex justify-center gap-4 mt-4">
          <PrimaryButton disabled={value <= 0} onClick={() => handleAmount(false)}>
            -
          </PrimaryButton>
          <div className="font-semibold w-full py-3 rounded-xl text-[15px] text-primary text-center">
            {value}
          </div>
          <PrimaryButton disabled={value >= max} onClick={() => handleAmount(true)}>
            +
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export { BonusSelector };
