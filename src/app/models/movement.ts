export interface Movement {
    id: number;
    type: 'debit' | 'credit';
    originAccountId: number;
    destinationAccountId: number;
    amount: number;
    date: string;
    description: string;
}