import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly TOKEN_KEY = 'token';
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

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    logout(): Observable<any> {
        const token = this.getToken();
        return this.httpClient.post(`${this.baseUrl}/users/logout`, { token }).pipe(
            tap(() => {
                this.removeToken();
            })
        );
    }
}