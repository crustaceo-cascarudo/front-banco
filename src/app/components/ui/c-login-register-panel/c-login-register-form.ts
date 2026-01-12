import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/loginService';
import { UserLogin } from '../../../models/user/user-login';
import { UserRegister } from '../../../models/user/user-register';

@Component({
  selector: 'c-login-register-form',
  imports: [FormsModule],
  templateUrl: './c-login-register-form.html',
  styleUrl: './c-login-register-form.scss',
})
export class CLoginRegisterform {
  @Input() isLoginMode: boolean = true;

  loginService = inject(LoginService);

  loginData: UserLogin = {
    dni: '',
    plainPassword: ''
  };

  registerData: UserRegister = {
    name: '',
    surname: '',
    surname2: '',
    dni: '',
    password: ''
  };

  onLoginSubmit(form: any) {
    if (form.valid) {
      console.log('Login data:', this.loginData);
      this.loginService.logIn(this.loginData.dni, this.loginData.plainPassword);
    }
  }

  onRegisterSubmit(form: any) {
    if (form.valid) {
      console.log('Register data:', this.registerData);
      this.loginService.register(
        this.registerData.name,
        this.registerData.surname,
        this.registerData.dni,
        this.registerData.password
      );
    }
  }
}
