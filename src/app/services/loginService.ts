import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth-service';
import { LoginResponse } from '../models/loginResponse';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  url = 'http://localhost:8080/api/users/';
  loginUrl = this.url + 'login';
  registerUrl = this.url + 'register';

  logIn(name: string, plainPassword: string) {
    this.http.post<LoginResponse>(this.loginUrl, { name, plainPassword }).subscribe({
      next: (datos) => {
        console.log(datos);

        if (datos.token != null && datos.token != "") {
          this.authService.setToken(datos.token)
        } else {
          this.authService.removeToken()
          alert("Contraseña incorrecta");
        }
      },

      error: (error) => console.log('ERROR JSON SERVER' + error.status),
    });
  }

  register(name: string, surname: string, dni: string, plainPassword: string) {
    this.http.post<LoginResponse>(this.registerUrl, { name, surname, dni, plainPassword }).subscribe({
      next: (datos) => {
        console.log(datos);

        if (datos.token != null && datos.token != "") {
          this.authService.setToken(datos.token)
        } else {
          this.authService.removeToken()
          alert("Error en el registro");
        }
      }
      ,

      error: (error) => console.log('ERROR JSON SERVER' + error.status),
    });
  }

  logOut() {
    this.authService.logout().subscribe();
  }
}
