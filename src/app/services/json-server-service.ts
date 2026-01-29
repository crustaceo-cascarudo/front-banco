import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonServerService<T> {
  private apiUrl = "https://api-store-class.ishimi.es/api";
  http = inject(HttpClient);

  // CREATE - Crear un nuevo registro
  create(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  // READ - Obtener todos los registros
  getAll(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`);
  }

  // READ - Obtener un registro por ID
  getById(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  // UPDATE - Actualizar un registro
  update(endpoint: string, id: number | string, data: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  // DELETE - Eliminar un registro
  delete(endpoint: string, id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  // Operaciones avanzadas
  
  // Búsqueda con filtros
  search(endpoint: string, filters: any): Observable<T[]> {
    let query = `${this.apiUrl}/${endpoint}?`;
    Object.keys(filters).forEach((key, index) => {
      if (filters[key]) {
        query += `${index > 0 ? '&' : ''}${key}=${filters[key]}`;
      }
    });
    return this.http.get<T[]>(query);
  }

  // Paginación
  getPaginated(endpoint: string, page: number = 1, limit: number = 10): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}?_page=${page}&_limit=${limit}`);
  }
}
