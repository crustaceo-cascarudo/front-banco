export interface Movement {
  id: number;
  movementType: 'DEBIT' | 'CREDIT';
  paymentMethod: 'card' | 'transfer' | 'withdrawal' | 'deposit';
  originAccountIban: string;
  destinationAccountIban: string;
  amount: number;
  date: string;
  concept: string;
}
