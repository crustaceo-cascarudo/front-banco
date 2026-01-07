import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Page } from '../models/page';


@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private baseUrl = "http://localhost:8080/api";

  httpClient = inject(HttpClient);

  constructor() { }

  getAll<T>(url: string): Observable<Page<T>> {
    return this.httpClient.get<Page<T>>(`${this.baseUrl + url}`);
  }

  getById<T>(url: string, id: number): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}${url}/${id}`);
  }

  getByName<T>(url: string, name: string): Observable<T[]> {
    return this.httpClient.get<Page<T>>(`${this.baseUrl + url}?name=${name}`)
      .pipe(
        map(response => response.data)
      );
  }

  create<T>(url: string, object: T): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl + url}`, object);
  }

  post(url: string, object: Record<string, any>) {
    return this.httpClient.post<Record<string, any>>(this.baseUrl + url, object);
  }

  put(url: string, id: number, object: Record<string, any>) {
    return this.httpClient.put<Record<string, any>>(this.baseUrl + url + '/' + id, object);
  }

  update(url: string, id: number, any: any): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl + url}${id}`, any);
  }

  delete(url: string, id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl + url}/${id}`);
  }
}
