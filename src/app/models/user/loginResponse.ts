export interface LoginResponse {
    token: string;
    user: {
        id: number;
        dni: string;
        name: string;
        surname: string;
        surname2?: string;
    };
}