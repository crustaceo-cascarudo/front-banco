import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth-service';
import { LoginResponse } from '../models/user/loginResponse';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  url = 'http://bank-back-crustaceo-cascarudo.preproducciondaw.cip.fpmislata.com/api/users/';
  loginUrl = this.url + 'login';
  registerUrl = this.url + 'register';

  logIn(dni: string, plainPassword: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { dni, plainPassword }).pipe(
      tap({
        next: (datos) => {
          console.log('Login response:', datos);
          if (datos.token != null && datos.token != "" && datos.user) {
            this.authService.setToken(datos.token);
            this.authService.setUserId(datos.user.id);
            console.log('Token y userId guardados:', datos.user.id);
            this.router.navigate(['/dashboard']);
          } else {
            this.authService.removeToken();
            this.authService.removeUserId();
            alert("Contraseña incorrecta");
          }
        },
        error: (error) => console.log('ERROR LOGIN:', error.status)
      })
    );
  }


  register(name: string, surname: string, surname2: string, dni: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.registerUrl, { name, surname, surname2, dni, password }).pipe(
      tap({
        next: (datos) => {
          console.log(datos);
          this.logIn(dni, password).subscribe();
        },
        error: (error) => console.log('ERROR JSON SERVER' + error.status)
      })
    );
  }

  logOut(): Observable<any> {
    return this.authService.logout();
  }
}
