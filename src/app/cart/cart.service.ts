import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  shortName: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'shop-cart-items';
  private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());

  readonly cartItems$ = this.cartItemsSubject.asObservable();
  readonly itemCount$ = this.cartItems$.pipe(
    map(items => items.reduce((count, item) => count + item.quantity, 0))
  );

  get cartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addItem(item: CartItem): void {
    const existing = this.cartItems.find(cartItem => cartItem.id === item.id);
    const updatedItems = existing
      ? this.cartItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      : [...this.cartItems, item];

    this.updateCart(updatedItems);
  }

  changeQty(itemId: string, delta: number): void {
    const updatedItems = this.cartItems
      .map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter(item => item.quantity > 0);

    this.updateCart(updatedItems);
  }

  removeAll(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    this.saveCart(items);
    this.cartItemsSubject.next(items);
  }

  private loadCart(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
      // ignore storage write failures
    }
  }
}
