import clsx from 'clsx';
import React from 'react';

interface UserInfoProps {
  className?: string;
  displayName?: string;
  displayTelegram?: string;
  displayAvatar?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({
  className,
  displayName,
  displayTelegram,
  displayAvatar,
}) => {
  return (
    <div className={clsx('flex items-center gap-4 p-4 bg-surface rounded-xl mb-6', className)}>
      {displayAvatar ? (
        <img
          className="w-15 h-15 rounded-full object-cover"
          src={displayAvatar}
          alt={displayName ?? ''}
        />
      ) : (
        <div className="w-15 h-15 rounded-full bg-surface flex items-center justify-center text-lg font-bold text-muted shrink-0">
          {displayName?.charAt(0) ?? '?'}
        </div>
      )}
      <div className="flex-1">
        <div className="text-base font-semibold text-primary">{displayName}</div>
        {displayTelegram && <div className="text-[13px] text-muted mt-0.5">@{displayTelegram}</div>}
      </div>
    </div>
  );
};

export { UserInfo };
