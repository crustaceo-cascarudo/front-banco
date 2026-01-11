import { Component } from '@angular/core';
import { CPanelAccount } from '../../ui/c-panel-account/c-panel-account';

@Component({
  selector: 'app-dashboard',
  imports: [CPanelAccount],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
