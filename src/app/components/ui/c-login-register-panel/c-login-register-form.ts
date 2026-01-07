import { Component, Input } from '@angular/core';

@Component({
  selector: 'c-login-register-form',
  imports: [],
  templateUrl: './c-login-register-form.html',
  styleUrl: './c-login-register-form.scss',
})
export class CLoginRegisterform {
  @Input() isLoginMode: boolean = true;

}
