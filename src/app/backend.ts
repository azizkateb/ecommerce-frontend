import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Backend {

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private url = 'http://localhost:8080/api/'

  register(data:{email:string, password:string,name:string}) {
    return this.http.post(this.url + 'users/register', data);
}

  login(data:{email:string, password:string}) {
    return this.http.post<any>(this.url + 'users/login', data).pipe(
      tap((res) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }
  
  /** Create a new product via backend API */
  createProduct(data: {name:string, price:number, description:string, imageUrl?:string, image_url?:string}) {
    // AuthInterceptor handles the token.
    return this.http.post(this.url + 'products', data);
  }

  getProducts() {
    // AuthInterceptor handles the token.
    return this.http.get(this.url + 'products');
  }

  checkout(data: any) {
    return this.http.post(this.url + 'orders/checkout', data);
  }

  getMyOrders() {
    return this.http.get<any[]>(this.url + 'orders');
  }

  getAllOrders() {
    return this.http.get<any[]>(this.url + 'orders/admin/all');
  }

  getProfile() {
    return this.http.get<any>(this.url + 'users/profile');
  }

  makeAdmin() {
    return this.http.post<any>(this.url + 'users/make-admin', {});
  }

  updateOrderStatus(orderId: string, status: string) {
    return this.http.patch<any>(this.url + 'orders/admin/' + orderId + '/status', { status });
  }

  deleteOrder(orderId: string) {
    return this.http.delete<any>(this.url + 'orders/' + orderId);
  }

  getProduct(id: string) {
    return this.http.get(this.url + 'products/' + id);
  }
}
