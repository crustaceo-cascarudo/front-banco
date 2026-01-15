import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private httpClient = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  // ========== USERS ==========
  getCurrentUser(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/users/current`);
  }

  // ========== BANK ACCOUNTS ==========
  getAccountsByUserId(userId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/bank-accounts/user/${userId}`);
  }

  // ========== CREDIT CARDS ==========
  getCards(accountIban: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/credit-cards/account/${accountIban}`);
  }

  // ========== BANK MOVEMENTS ==========
  getMovementsByAccountIbanRecipient(iban: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/bank-movements/recipient/${iban}`);
  }
  getMovementsByAccountIbanOrigin(iban: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/bank-movements/origin/${iban}`);
  }
}
