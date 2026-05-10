import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { HomePage } from './home-page/home-page';
import { ProductDetailComponent } from './product-detail/product-detail';
import { AdminAddProduct } from './admin-add-product/admin-add-product';
import { AllProduct } from './all-product/all-product';
import { Checkout } from './checkout/checkout';
import { Cart } from './cart/cart';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: Register },
    { path:'login', component: Login },
    { path: 'home', component:HomePage},
    { path: 'admin/add-product', component: AdminAddProduct },
    { path: 'product/:id', component: ProductDetailComponent },
    { path : 'products', component:AllProduct},
    { path: 'cart', component: Cart},
    { path:'checkout',component:Checkout},
    { path: 'admin/dashboard',component:Dashboard},
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

