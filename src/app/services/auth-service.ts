import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly TOKEN_KEY = 'token';
    private readonly USER_ID_KEY = 'user_id';
    private readonly baseUrl = 'http://localhost:8080/api';
    private httpClient = inject(HttpClient);

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    getUserId(): number | null {
        const id = localStorage.getItem(this.USER_ID_KEY);
        return id ? parseInt(id, 10) : null;
    }

    setUserId(userId: number): void {
        localStorage.setItem(this.USER_ID_KEY, userId.toString());
    }

    removeUserId(): void {
        localStorage.removeItem(this.USER_ID_KEY);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    logout(): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}/users/logout`, {}).pipe(
            tap(() => {
                this.removeToken();
                this.removeUserId();
            })
        );
    }
}