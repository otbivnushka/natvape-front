import React from 'react';

interface AdminTabPickerButtonProps {
  onClick: () => void;
  isActive: boolean;
  text: string;
}

const AdminTabPickerButton: React.FC<AdminTabPickerButtonProps> = ({ onClick, isActive, text }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
        isActive ? 'bg-primary text-on-primary' : 'text-muted hover:text-body'
      }`}
    >
      {text}
    </button>
  );
};

export { AdminTabPickerButton };
