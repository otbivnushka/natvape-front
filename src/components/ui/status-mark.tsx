import clsx from 'clsx';
import React from 'react';

type Status = 'sent' | 'end';

const statusLabels: Record<Status, string> = {
  sent: 'Отправлен',
  end: 'Завершён',
};

const statusStyles: Record<Status, string> = {
  sent: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10',
  end: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10',
};

interface StatusMarkProps {
  status: Status;
  className?: string;
}

const StatusMark: React.FC<StatusMarkProps> = ({ status, className }) => {
  return (
    <span
      className={clsx(
        className,
        'inline-block px-1.5 py-0.5 rounded-full text-[11px] font-semibold',
        statusStyles[status] || 'bg-surface text-primary border border-line',
      )}
    >
      {statusLabels[status]}
    </span>
  );
};

export { StatusMark };
