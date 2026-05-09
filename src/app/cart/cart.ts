import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HomePage } from '../home-page/home-page';
import { CartService, CartItem } from './cart.service';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,HomePage],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  @Output() close = new EventEmitter<void>();

  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {
    this.cartItems = this.cartService.cartItems;
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  closeCart() {
    this.close.emit();
  }

  removeAll() {
    this.cartService.removeAll();
  }

  changeQty(item: CartItem, delta: number) {
    this.cartService.changeQty(item.id, delta);
  }

  calculateTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  goToCheckout() {
    this.closeCart();
    this.router.navigate(['/checkout']);
  }



}
