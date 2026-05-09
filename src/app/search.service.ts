import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  public searchQuery$ = this.searchQuerySubject.asObservable();

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  getSearchQuery(): string {
    return this.searchQuerySubject.value;
  }

  filterProducts(products: any[], query: string): any[] {
    if (!query || query.trim() === '') {
      return products;
    }

    const lowerQuery = query.toLowerCase().trim();

    return products.filter(product => {
      const productName = (product.name || '').toLowerCase();
      const productDescription = (product.description || '').toLowerCase();
      
      // Search by name or first letter
      return productName.includes(lowerQuery) || 
             productDescription.includes(lowerQuery) ||
             productName.startsWith(lowerQuery);
    });
  }
}
