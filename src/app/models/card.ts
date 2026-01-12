export interface Card {
    id: number;
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvv: string;
    type: 'debit' | 'credit';
    status?: 'active' | 'blocked';
    accountId: number;
}