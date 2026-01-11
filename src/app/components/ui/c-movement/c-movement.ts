import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Movement } from '../../../models/movement'

@Component({
  selector: 'c-movement',
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './c-movement.html',
  styleUrl: './c-movement.scss',
})
export class CMovement {
  @Input({ required: true }) movement!: Movement;
}
