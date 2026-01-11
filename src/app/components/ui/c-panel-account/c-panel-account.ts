import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Account } from '../../../models/account';
import { Movement } from '../../../models/movement';
import { User } from '../../../models/user/user';
import { CMovement } from '../c-movement/c-movement'
import { JsonServerService } from '../../../services/json-server-service';


@Component({
  selector: 'c-panel-account',
  imports: [CurrencyPipe, CMovement],
  templateUrl: './c-panel-account.html',
  styleUrl: './c-panel-account.scss',
})
export class CPanelAccount implements OnInit, OnDestroy {
  private jsonHttp = inject(JsonServerService);

  userName: string = '';
  account: Account | null = null;
  movements: Movement[] = [];
  
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const userService = this.jsonHttp as JsonServerService<User>;
    const userSub = userService.getById('users', 1).subscribe({
      next: (user: User) => {
        this.userName = user.name;
        console.log('userName:', this.userName);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    this.subscriptions.add(userSub);

    const accountService = this.jsonHttp as JsonServerService<Account>;
    const accountSub = accountService.search('accounts', { userId: 1 }).subscribe({
      next: (accounts: Account[]) => {
        if (accounts && accounts.length > 0) {
          this.account = accounts[0];
          console.log('account:', this.account);
          this.loadMovements(accounts[0].id);
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    this.subscriptions.add(accountSub);
  }

  private loadMovements(accountId: number | string): void {
    const movementService = this.jsonHttp as JsonServerService<Movement>;
    const movementSub = movementService.getAll('movements').subscribe({
      next: (allMovements: Movement[]) => {
        const accountIdNum = Number(accountId);
        this.movements = allMovements
          .filter(m => Number(m.originAccountId) === accountIdNum || Number(m.destinationAccountId) === accountIdNum)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        console.log('movements:', this.movements);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
    this.subscriptions.add(movementSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
