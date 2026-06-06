import React from 'react';
import { useToastStore } from '@/store/useToastStore';

const ToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-200 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-primary text-on-primary py-2.5 px-4.5 rounded-lg text-[13px] font-medium animate-[slideIn_0.3s_cubic-bezier(0.16,1,0.3,1),fadeOut_0.3s_ease_2.2s_forwards] pointer-events-auto"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

export { ToastContainer };
