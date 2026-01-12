import { Component, inject, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Card } from '../../../models/card';
import { Movement } from '../../../models/movement';
import { CCard } from '../c-card/c-card';
import { JsonServerService } from '../../../services/json-server-service';

@Component({
  selector: 'c-panel-cards',
  imports: [CCard],
  templateUrl: './c-panel-cards.html',
  styleUrl: './c-panel-cards.scss',
})
export class CPanelCards implements OnInit, OnDestroy, OnChanges {
  private jsonHttp = inject(JsonServerService);

  @Input() accountId: number | null = null;

  cards: Card[] = [];
  currentCardIndex: number = 0;
  cardBalances: Map<number, number> = new Map();
  
  private subscriptions: Subscription = new Subscription();
  private scrollTimeout: any;
  private isScrolling: boolean = false;
  private cardLoadSubscription: Subscription | null = null;

  get currentCard(): Card | null {
    return this.cards[this.currentCardIndex] || null;
  }

  ngOnInit(): void {
    this.loadCards();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accountId']) {
      console.log('AccountId changed from', changes['accountId'].previousValue, 'to', changes['accountId'].currentValue);
      this.currentCardIndex = 0;
      this.cards = [];
      this.cardBalances.clear();
      this.loadCards();
    }
  }

  private loadCards(): void {
    if (this.cardLoadSubscription) {
      this.cardLoadSubscription.unsubscribe();
    }

    const cardService = this.jsonHttp as JsonServerService<Card>;
    this.cardLoadSubscription = cardService.getAll('cards').subscribe({
      next: (cards: Card[]) => {
        const accountIdNum = this.accountId !== null ? Number(this.accountId) : null;
        
        this.cards = cards.filter(card => 
          card.status === 'active' && 
          (accountIdNum === null || Number(card.accountId) === accountIdNum)
        );
        console.log('Filtered cards for account', accountIdNum, ':', this.cards);
        if (this.cards.length > 0) {
          this.loadCardBalances();
        }
      },
      error: (error) => {
        console.error('Error loading cards:', error);
      }
    });
    this.subscriptions.add(this.cardLoadSubscription);
  }

  private loadCardBalances(): void {
    const movementService = this.jsonHttp as JsonServerService<Movement>;
    const movementSub = movementService.getAll('movements').subscribe({
      next: (movements: Movement[]) => {
        this.cardBalances.clear();
        
        this.cards.forEach(card => {
          const cardMovements = movements.filter(m => 
            m.type === 'debit' && 
            (m.originAccountId === card.accountId || m.destinationAccountId === card.accountId)
          );
          const total = cardMovements.reduce((sum, m) => sum + m.amount, 0);
          this.cardBalances.set(card.id, total);
          console.log(`Balance for card ${card.id}:`, total);
        });
      },
      error: (error) => {
        console.error('Error loading movements:', error);
      }
    });
    this.subscriptions.add(movementSub);
  }

  getCardBalance(cardId: number): number {
    return this.cardBalances.get(cardId) || 0;
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
      const cardWidth = 340;
      const gap = 16;
      
      const scrollPosition = scrollLeft + (containerWidth / 2);
      const padding = (containerWidth - cardWidth) / 2;
      
      let closestIndex = 0;
      let minDistance = Infinity;
      
      this.cards.forEach((_, index) => {
        const cardCenter = padding + (index * (cardWidth + gap)) + (cardWidth / 2);
        const distance = Math.abs(scrollPosition - cardCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      
      if (closestIndex !== this.currentCardIndex) {
        this.currentCardIndex = closestIndex;
      }
    }, 100);
  }

  scrollToCard(index: number): void {
    if (index < 0 || index >= this.cards.length) return;
    
    this.isScrolling = true;
    const container = document.querySelector('.c-panel-cards__carousel') as HTMLElement;
    
    if (container) {
      const containerWidth = container.offsetWidth;
      const cardWidth = 340;
      const gap = 16;
      const padding = (containerWidth - cardWidth) / 2;
      
      const scrollPosition = padding + (index * (cardWidth + gap)) - (containerWidth - cardWidth) / 2;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      this.currentCardIndex = index;
      
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