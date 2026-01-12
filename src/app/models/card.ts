export interface Card {
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvv: number;
    accountIban: string;
    type: 'debit' | 'credit';
    status: 'active' | 'blocked' | 'expired';
}