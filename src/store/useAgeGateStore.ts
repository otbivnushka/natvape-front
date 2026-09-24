import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AgeGateStatus = 'pending' | 'ok' | 'denied';

interface AgeGateState {
  status: AgeGateStatus;
  accept: () => void;
  deny: () => void;
}

export const useAgeGateStore = create<AgeGateState>()(
  persist(
    (set) => ({
      status: 'pending',
      accept: () => set({ status: 'ok' }),
      deny: () => set({ status: 'denied' }),
    }),
    {
      name: 'age-gate',
      partialize: (state) => ({ status: state.status === 'ok' ? 'ok' : 'pending' }),
      onRehydrateStorage: () => (state) => {
        if (state && state.status === 'denied') {
          useAgeGateStore.setState({ status: 'pending' });
        }
      },
    },
  ),
);
