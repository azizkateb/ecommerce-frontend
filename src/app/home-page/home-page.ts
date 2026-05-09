import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TopNav } from '../top-nav/top-nav';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule,TopNav],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  private revealObserver?: IntersectionObserver;

  categories = [
    { id: 25, name: 'Vedio Games', image: 'assets/vediogames.png' },
    { id: 17, name: 'Pc Gamers', image: 'assets/PcGamer.png' },
    { id: 24, name: 'Phones', image: 'assets/phones.png' }
  ];
  slides = [
  {
    title: 'iPhone 17 Pro Max',
    subtitle: 'New Product',
    description: 'Experience natural, lifelike audio and exceptional build quality made for the passionate music enthusiast.',
    image: 'assets/phones.png',
    route: '/product/1'
  },
  {
    title: 'PC Gamers',
    subtitle: 'Power Setup',
    description: 'High-performance gaming rigs built for speed, power, and ultimate gaming experience.',
    image: 'assets/PcGamerHero.jpg',
    route: '/category/pc-gamers'
  },
  {
    title: 'Video Games',
    subtitle: 'Top Games',
    description: 'Discover the latest and greatest video games across all platforms.',
    // filename in the assets folder is spelled 'vediogames.png'
    image: 'assets/vediogames.png',
    route: '/category/video-games'
  }
];

  currentIndex = 0;
  private slideTimer: any = null;
  slideDelay = 5000; // ms (public so template can bind animation duration)

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  goToProduct(product: any) {
    // Ensure we pass the numeric ID to satisfy the backend Long requirement
    this.router.navigate(['/product', product.id]);
  }

  goToCategory(name: string) {
    this.router.navigate(['/category', name.toLowerCase()]);
  }
  ngOnInit() {
    this.startAutoPlay();
  }

  ngAfterViewInit() {
    if (typeof IntersectionObserver !== 'undefined') {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      document.querySelectorAll('.reveal-card, .reveal-section').forEach((element) => {
        this.revealObserver?.observe(element);
      });
    } else {
      document.querySelectorAll('.reveal-card, .reveal-section').forEach((element) => {
        element.classList.add('visible');
      });
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    this.revealObserver?.disconnect();
  }

  pauseAutoPlay() {
    this.stopAutoPlay();
  }

  resumeAutoPlay() {
    this.startAutoPlay();
  }

  /**
   * Start the autoplay loop using recursive timeouts. This is more reliable
   * than setInterval because it avoids overlapping ticks and throttling issues.
   */
  private startAutoPlay() {
    this.stopAutoPlay();
    this.slideTimer = setTimeout(() => {
      this.nextSlide();
      // schedule next tick recursively
      this.startAutoPlay();
    }, this.slideDelay);
  }

  stopAutoPlay() {
    if (this.slideTimer) {
      clearTimeout(this.slideTimer);
      this.slideTimer = null;
    }
  }

  /** Reset autoplay timer after a manual interaction so sliding continues smoothly. */
  private resetAutoPlay() {
    this.startAutoPlay();
  }
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.cdr.markForCheck();
  }

prevSlide() {
  this.currentIndex =
    (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  this.resetAutoPlay();
  this.cdr.markForCheck();
}

goToSlide(index: number) {
  this.currentIndex = index;
  this.resetAutoPlay();
  this.cdr.markForCheck();
}

goToSlideRoute(index?: number) {
  const idx = typeof index === 'number' ? index : this.currentIndex;
  this.router.navigateByUrl(this.slides[idx].route);
}

  goToProducts() {
    this.router.navigateByUrl('/products');
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

}
