export interface Account {
    id: number;
    iban: string;
    balance: number;
    status: 'active' | 'blocked';
    userId: number;
}