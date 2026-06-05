import React from 'react';
import { AdminTabPickerButton } from './admin-tab-picker-button';

export type AdminTab = 'products' | 'orders' | 'stories';

interface AdminTabPickerProps {
  tab: string;
  setTab: (tab: AdminTab) => void;
}

const AdminTabPicker: React.FC<AdminTabPickerProps> = ({ tab, setTab }) => {
  return (
    <div className="flex gap-1 mb-6 bg-surface rounded-xl p-1">
      <AdminTabPickerButton
        onClick={() => setTab('products')}
        isActive={tab === 'products'}
        text="Товары"
      />
      <AdminTabPickerButton
        onClick={() => setTab('orders')}
        isActive={tab === 'orders'}
        text="Заказы"
      />
      <AdminTabPickerButton
        onClick={() => setTab('stories')}
        isActive={tab === 'stories'}
        text="Сторис"
      />
    </div>
  );
};

export { AdminTabPicker };
