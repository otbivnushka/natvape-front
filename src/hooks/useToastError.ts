import { useCallback } from 'react';
import { useToastStore } from '../store/useToastStore';

export function useToastError(): (context: string) => void {
  const addToast = useToastStore((s) => s.addToast);

  return useCallback((context: string) => addToast(`Ошибка при ${context}`), [addToast]);
}
