import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private auth = inject(AuthService);
  private router = inject(Router);

  showLogoutPanel: boolean = false;

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();

  }

  logOut(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.showLogoutPanel = false;
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
