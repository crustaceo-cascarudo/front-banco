import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../models/card';

@Component({
  selector: 'c-card',
  imports: [CommonModule],
  templateUrl: './c-card.html',
  styleUrl: './c-card.scss',
})
export class CCard {
  @Input({ required: true }) card!: Card;
  @Input() balance: number = 0;

  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  }
}