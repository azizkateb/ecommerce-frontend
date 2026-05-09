import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart/cart.service';
import { SearchService } from '../search.service';
import { Backend } from '../backend';

@Component({
  selector: 'app-top-nav',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav {
  menuOpen = false;
  cartCount = 0; // placeholder, wire to cart service later
  isDark = false;
  isAdmin = false;
  searchQuery = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private searchService: SearchService,
    private backend: Backend,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cartService.itemCount$.subscribe(count => {
      this.cartCount = count;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.loadUserRole();

      try {
        const stored = localStorage.getItem('theme');
        this.isDark = stored === 'dark' || document.documentElement.classList.contains('dark-theme');
      } catch (e) {
        this.isDark = document.documentElement.classList.contains('dark-theme');
      }
      // ensure DOM reflects stored value
      if (this.isDark) document.documentElement.classList.add('dark-theme');
      else document.documentElement.classList.remove('dark-theme');
    }
  }

  private loadUserRole() {
    this.backend.getProfile().subscribe({
      next: (user) => {
        this.isAdmin = user?.role === 'ADMIN';
      },
      error: () => {
        this.isAdmin = false;
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  toggleTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.isDark = !this.isDark;
        if (this.isDark) {
          document.documentElement.classList.add('dark-theme');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark-theme');
          localStorage.setItem('theme', 'light');
        }
      } catch (e) {}
    }
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchService.setSearchQuery(this.searchQuery);
      this.router.navigate(['/products'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = '';
    }
  }
}
