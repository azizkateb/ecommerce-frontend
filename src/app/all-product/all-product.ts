import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Backend } from '../backend';
import { CartService } from '../cart/cart.service';
import { SearchService } from '../search.service';
import { TopNav } from '../top-nav/top-nav';

interface Product {
  id?: number | string;
  name?: string;
  slug?: string;
  image?: string;
  imageUrl?: string;
  description?: string;
  isNew?: boolean;
  price?: number;
}

@Component({
  selector: 'app-all-product',
  imports: [CommonModule, TopNav],
  templateUrl: './all-product.html',
  styleUrl: './all-product.css',
})
export class AllProduct implements OnInit {

  products: Product[] = [];
  allProducts: Product[] = [];
  searchQuery = '';

  categoryThumbnails = [
    { name: 'HEADPHONES', image: 'assets/shared/desktop/image-category-thumbnail-headphones.png' },
    { name: 'SPEAKERS', image: 'assets/shared/desktop/image-category-thumbnail-speakers.png' },
    { name: 'EARPHONES', image: 'assets/shared/desktop/image-category-thumbnail-earphones.png' }
  ];

  constructor(
    private router: Router, 
    private backend: Backend,
    private cartService: CartService,
    private searchService: SearchService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  addToCart(product: Product) {
    if (!product.id) {
      return;
    }

    this.cartService.addItem({
      id: String(product.id),
      name: product.name || 'Unknown Product',
      shortName: product.name || 'Product',
      price: Number(product.price || 0),
      quantity: 1,
      image: product.image || 'assets/phones.png'
    });
  }

  ngOnInit(): void {
    this.backend.getProducts().subscribe(
      (res: any) => {
        if (!Array.isArray(res)) return;
        this.allProducts = res.map((p: any) => ({
          id: p.id || p._id || null,
          name: p.name,
          slug: p.slug || (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          isNew: p.isNew || false,
          image: p.image_url || p.imageUrl || p.image || 'assets/phones.png',
          description: p.description || '',
          price: p.price || 0
        }));
        
        // Subscribe to query parameters for search
        this.activatedRoute.queryParams.subscribe(params => {
          const query = params['q'] || '';
          this.searchQuery = query;
          if (query) {
            this.products = this.searchService.filterProducts(this.allProducts, query);
          } else {
            this.products = this.allProducts;
          }
          this.cdr.detectChanges();
        });
        
        this.cdr.detectChanges();
      },
      (err) => {
        console.error('Failed to load products', err);
      }
    );
  }

  viewProduct(id?: number | string) {
    if (!id) return;
    this.router.navigate(['/product', id]);
  }

  goToCategory(name: string) {
    this.router.navigate(['/category', name.toLowerCase()]);
  }

}
