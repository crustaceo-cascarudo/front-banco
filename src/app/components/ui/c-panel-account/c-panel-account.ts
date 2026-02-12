import { Component, inject, OnInit, OnDestroy, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';
import { Account } from '../../../models/account';
import { Movement } from '../../../models/movement';
import { CMovement } from '../c-movement/c-movement'
import { HttpClientService } from '../../../services/http-client-service';
import { AuthService } from '../../../services/auth-service';
import { User } from '../../../models/user/user';

@Component({
  selector: 'c-panel-account',
  imports: [DecimalPipe, CMovement],
  templateUrl: './c-panel-account.html',
  styleUrl: './c-panel-account.scss',
})
export class CPanelAccount implements OnInit, OnDestroy, AfterViewInit {
  private httpService = inject(HttpClientService);
  private authService = inject(AuthService);

  @Output() currentAccountOn = new EventEmitter<Account | null>();

  userName: string = '';
  userDni: string | null = null;
  user?: User;
  accounts: Account[] = [];
  currentAccountIndex: number = 0;
  movements: Movement[] = [];

  private subscriptions: Subscription = new Subscription();
  private scrollTimeout: any;
  private isScrolling: boolean = false;

  get currentAccount(): Account | null {
    return this.accounts[this.currentAccountIndex] || null;
  }

  ngOnInit(): void {
    console.log('Cargando datos del usuario autenticado');
    this.loadUserAccounts();
    this.loadUser();
  }

  private loadUserAccounts(): void {
    const accountSub = this.httpService.getMyAccounts().subscribe({
      next: (accounts: Account[]) => {
        if (accounts && accounts.length > 0) {
          this.accounts = accounts;
          console.log('Cuentas cargadas:', this.accounts);
          this.loadMovements(this.accounts[0].iban);
          this.currentAccountOn.emit(this.accounts[0]);
        } else {
          console.log('No se encontraron cuentas para el usuario');
        }
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      }
    });
    this.subscriptions.add(accountSub);
  }

  private loadUser(): void {
    const userSub = this.httpService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.user = user;
        this.userName = `${user.name}`;
        console.log('Usuario cargado:', this.user);
      }
      ,
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
    this.subscriptions.add(userSub);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToAccount(0);
    }, 150);
  }

  private loadMovements(accountIban: string): void {
    const origin$ = this.httpService.getMovementsByAccountIbanOrigin(accountIban);
    const recipient$ = this.httpService.getMovementsByAccountIbanRecipient(accountIban);

    const movementSub = forkJoin([origin$, recipient$]).subscribe({
      next: ([originMovements, recipientMovements]) => {

        const allMovements = [...originMovements, ...recipientMovements];

        this.movements = allMovements
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        console.log('Movimientos para cuenta', accountIban, ':', this.movements);
      },
      error: (error) => {
        console.error('Error loading movements:', error);
      }
    });

    this.subscriptions.add(movementSub);
  }

  onScroll(event: Event): void {
    if (this.isScrolling) return;

    const container = event.target as HTMLElement;

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const cardWidth = Math.min(Math.max(containerWidth * 0.9, 280), 420);
      const gap = 16;

      const scrollPosition = scrollLeft + (containerWidth / 2);
      const padding = (containerWidth - cardWidth) / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      this.accounts.forEach((_, index) => {
        const cardCenter = padding + (index * (cardWidth + gap)) + (cardWidth / 2);
        const distance = Math.abs(scrollPosition - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== this.currentAccountIndex) {
        this.currentAccountIndex = closestIndex;
        this.loadMovements(this.accounts[closestIndex].iban);
        this.currentAccountOn.emit(this.accounts[closestIndex]);
      }
    }, 100);
  }

  scrollToAccount(index: number): void {
    if (index < 0 || index >= this.accounts.length) return;

    this.isScrolling = true;
    const container = document.querySelector('.c-panel-account__carousel') as HTMLElement;

    if (container) {
      const containerWidth = container.offsetWidth;
      const cardWidth = Math.min(Math.max(containerWidth * 0.9, 280), 420);
      const gap = 16;
      const padding = (containerWidth - cardWidth) / 2;

      const scrollPosition = padding + (index * (cardWidth + gap)) - (containerWidth - cardWidth) / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      this.currentAccountIndex = index;
      this.loadMovements(this.accounts[index].iban);
      this.currentAccountOn.emit(this.accounts[index]);

      setTimeout(() => {
        this.isScrolling = false;
      }, 500);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.subscriptions.unsubscribe();
  }
}
