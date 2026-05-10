import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap, from, map } from 'rxjs';
import api from '../api';

@Injectable({
  providedIn: 'root',
})
export class Backend {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private getHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  register(data:{email:string, password:string,name:string}) {
    return from(api.post('users/register', data)).pipe(map(res => res.data));
  }

  login(data:{email:string, password:string}) {
    return from(api.post('users/login', data)).pipe(
      tap((res: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.data.token);
        }
      }),
      map(res => res.data)
    );
  }
  
  /** Create a new product via backend API */
  createProduct(data: {name:string, price:number, description:string, imageUrl?:string, image_url?:string}) {
    return from(api.post('products', data, { headers: this.getHeaders() })).pipe(map(res => res.data));
  }

  getProducts() {
    return from(api.get('products', { headers: this.getHeaders() })).pipe(map(res => res.data));
  }

  checkout(data: any) {
    return from(api.post('orders/checkout', data, { headers: this.getHeaders() })).pipe(map(res => res.data));
  }

  getMyOrders() {
    return from(api.get('orders', { headers: this.getHeaders() })).pipe(map(res => res.data));
  }

  getAllOrders() {
    return from(api.get('orders/admin/all', { headers: this.getHeaders() })).pipe(map(res => res.data));
  }

  getProfile() {
    return from(api.get('users/profile', { headers: this.getHeaders() })).pipe(map(res => res.data));
  }

  makeAdmin() {
    return from(api.post('users/make-admin', {}, { headers: this.getHeaders() })).pipe(map(res => res.data));
  }

  updateOrderStatus(orderId: string, status: string) {
    return from(api.patch('orders/admin/' + orderId + '/status', { status }, { headers: this.getHeaders() })).pipe(map(res => res.data));
  }

  deleteOrder(orderId: string) {
    return from(api.delete('orders/' + orderId, { headers: this.getHeaders() })).pipe(map(res => res.data));
  }

  getProduct(id: string) {
    return from(api.get('products/' + id, { headers: this.getHeaders() })).pipe(map(res => res.data));
  }
}
