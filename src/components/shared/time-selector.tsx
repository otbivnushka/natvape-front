import clsx from 'clsx';
import React, { useEffect } from 'react';
import { PrimaryButton } from '@/components/ui';

interface TimeSelectorProps {
  time: 'soon' | 'whenever' | null;
  setTime: (time: 'soon' | 'whenever' | null) => void;
  className?: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ time, setTime, className }) => {
  useEffect(() => {
    console.log(time, time === 'whenever');
  }, [time]);
  return (
    <div className={clsx('mb-6', className)}>
      <h2 className="text-sm font-semibold text-muted mb-2.5">Время</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        <PrimaryButton
          className="bg-surface text-primary"
          selected={time === 'soon'}
          onClick={() => setTime('soon')}
        >
          Как можно скорее
        </PrimaryButton>
        <h2 className="text-sm font-semibold text-primary">ИЛИ</h2>
        <PrimaryButton
          className="bg-surface text-primary"
          selected={time === 'whenever'}
          onClick={() => setTime('whenever')}
        >
          Не важно когда
        </PrimaryButton>
      </div>
    </div>
  );
};

export { TimeSelector };
