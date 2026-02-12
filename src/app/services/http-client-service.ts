import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private httpClient = inject(HttpClient);
  private baseUrl = "https://api-bank-class.ishimi.es/api";


  // ========== USERS ==========
  getCurrentUser(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/users/me`);
  }

  // ========== BANK ACCOUNTS ==========
  getMyAccounts(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/bank-accounts/me`);
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
