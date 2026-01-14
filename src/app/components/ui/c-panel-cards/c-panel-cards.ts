import { Component, inject, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Card } from '../../../models/card';
import { CCard } from '../c-card/c-card';
import { HttpClientService } from '../../../services/http-client-service';

@Component({
  selector: 'c-panel-cards',
  imports: [CCard],
  templateUrl: './c-panel-cards.html',
  styleUrl: './c-panel-cards.scss',
})
export class CPanelCards implements OnInit, OnDestroy, OnChanges {
  private httpService = inject(HttpClientService);

  @Input() accountIban: string | null = null;

  cards: Card[] = [];
  currentCardIndex: number = 0;
  
  private subscriptions: Subscription = new Subscription();
  private scrollTimeout: any;
  private isScrolling: boolean = false;
  private cardLoadSubscription: Subscription | null = null;

  get currentCard(): Card | null {
    return this.cards[this.currentCardIndex] || null;
  }

  ngOnInit(): void {
    this.loadCards(this.accountIban);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accountIban']) {
      console.log('AccountIban changed from', changes['accountIban'].previousValue, 'to', changes['accountIban'].currentValue);
      this.currentCardIndex = 0;
      this.cards = [];
      this.loadCards(this.accountIban);
    }
  }

  private loadCards(iban: string | null): void {
    if (this.cardLoadSubscription) {
      this.cardLoadSubscription.unsubscribe();
    }

    this.cardLoadSubscription = this.httpService.getCards(iban ?? '').subscribe({
      next: (cards: Card[]) => {
        const accountIban = this.accountIban;
        
        this.cards = cards.filter(card => 
          accountIban === null || card.accountIban === accountIban
        );
        console.log('Filtered cards for account', accountIban, ':', this.cards);
      },
      error: (error) => {
        console.error('Error loading cards:', error);
      }
    });
    this.subscriptions.add(this.cardLoadSubscription);
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