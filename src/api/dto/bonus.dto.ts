export interface ApiBonusHistoryItem {
  id: number;
  amount: number;
  type: 'accrual' | 'spend' | 'expire' | 'admin_adjustment';
  orderId: number | null;
  description: string;
  createdAt: string;
}

export interface ApiBonus {
  balance: number;
  spendable: number;
  history: ApiBonusHistoryItem[];
}
