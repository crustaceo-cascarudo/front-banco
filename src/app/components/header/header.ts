import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private auth = inject(AuthService);
  private router = inject(Router);

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();

  }

  logOut(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }


}
