import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';
import { CartService, CartItem } from '../cart/cart.service';
import { Backend } from '../backend';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,TopNav],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  total = 0;
  shipping = 50; // Fixed shipping cost

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private cartService: CartService,
    private backend: Backend
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      zip: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      paymentMethod: ['e-money', Validators.required],
      shippingInfoId: [null]
    });
  }

  goBack() { this.location.back(); }

  onSubmit() {
    if (!this.checkoutForm.valid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const formValue = this.checkoutForm.value;
    const orderPayload = {
      fullName: formValue.fullName,
      address: formValue.address,
      phone: formValue.phone,
      paymentMethod: formValue.paymentMethod,
      totalPrice: this.total,
      shippingInfoId: formValue.shippingInfoId,
      items: this.cartItems.map(item => ({
        quantity: item.quantity,
        price: item.price,
        product: { id: Number(item.id) }
      }))
    };

    this.backend.checkout(orderPayload).subscribe({
      next: (res) => {
        console.log('Checkout complete', res);
        this.cartService.removeAll();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Checkout failed', err);
      }
    });
  }
}
