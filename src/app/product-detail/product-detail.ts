import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Backend } from '../backend';
import { CartService } from '../cart/cart.service';
import { TopNav } from '../top-nav/top-nav';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, TopNav],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  protected product: any = null;
  protected quantity = 1;
  protected error = '';

  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly backend = inject(Backend);
  private readonly cart = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    
    // Only call backend if the ID is numeric to avoid Spring "Long" mismatch errors
    const isNumeric = productId && !isNaN(Number(productId));
    
    if (isNumeric) {
      this.backend.getProduct(productId!).subscribe({
        next: (res: any) => {
          this.product = {
            ...res,
            name: res.name,
            price: res.price || 0,
            isNew: res.isNew || false,
            image: res.image_url || res.imageUrl || res.image || 'assets/phones.png',
            description: res.description || '',
            features: res.features || 'Product features information coming soon.',
            includes: res.includes || []
          };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load product details', err);
        }
      });
    } else {
      console.warn('Invalid Product ID format:', productId);
      this.error = 'Invalid product ID. Please return to the shop.';
    }
  }

  protected goBack() { this.location.back(); }

  protected changeQty(val: number) {
    if (this.quantity + val >= 1) this.quantity += val;
  }

  protected addToCart() {
    if (!this.product) {
      return;
    }

    this.cart.addItem({
      id: String(this.product.id ?? this.product.slug ?? this.product.name),
      name: this.product.name,
      shortName: this.product.name,
      price: Number(this.product.price || 0),
      quantity: this.quantity,
      image: this.product.image || 'assets/phones.png'
    });
  }
}