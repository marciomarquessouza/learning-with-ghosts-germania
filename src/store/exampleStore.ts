import { create } from "zustand";

const DEFAULT_BALANCE = 25;

export type Stamp = {
  id: string;
  name: string;
  position: { x: number; y: number };
  price: number;
};

type StampStore = {
  availableStamps: Stamp[];
  setAvailableStamps: (stamps: Stamp[]) => void;
  boughtStamps: Stamp[];
  buyStamp: (stamp: Stamp) => void;
  balance: number;
  setBalance: (amount: number) => void;
};

export const useStampStore = create<StampStore>((set) => ({
  availableStamps: [],
  setAvailableStamps: (stamps) => set({ availableStamps: stamps }),
  boughtStamps: [],
  buyStamp: (stamp) =>
    set((state) => {
      const alreadyBought = state.boughtStamps.some((s) => s.id === stamp.id);
      const canAfford = state.balance >= stamp.price;

      if (alreadyBought || !canAfford) {
        return state;
      }

      return {
        boughtStamps: [...state.boughtStamps, stamp],
        balance: state.balance - stamp.price,
      };
    }),
  balance: DEFAULT_BALANCE,
  setBalance: (amount) => set({ balance: amount }),
}));

export const useTotalSpent = () => {
  const boughtStamps = useStampStore((state) => state.boughtStamps);
  return boughtStamps.reduce((total, stamp) => total + stamp.price, 0);
};

export const getTotalSpent = () => {
  const boughtStamps = useStampStore.getState().boughtStamps;
  return boughtStamps.reduce((total, stamp) => total + stamp.price, 0);
};
