export interface Movement {
    id: number;
    type: 'debit' | 'credit';
    paymentMethod: 'card' | 'transfer' | 'withdrawal' | 'deposit';
    originAccountIban: string;
    destinationAccountIban: string;
    amount: number;
    date: string;
    description: string;
}