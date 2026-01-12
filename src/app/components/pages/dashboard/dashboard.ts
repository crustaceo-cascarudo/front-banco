import { Component } from '@angular/core';
import { CPanelAccount } from '../../ui/c-panel-account/c-panel-account';
import { CPanelCards } from '../../ui/c-panel-cards/c-panel-cards';
import { Account } from '../../../models/account';

@Component({
  selector: 'app-dashboard',
  imports: [CPanelAccount, CPanelCards],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  currentAccount: Account | null = null;

  onAccountChange(account: Account | null): void {
    this.currentAccount = account;
    console.log('Dashboard - Current account changed to:', this.currentAccount);
  }
}
