import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Backend } from '../backend';
import { TopNav } from '../top-nav/top-nav';

interface OrderItem {
  name: string;
  quantity: number;
}
interface Order {
  id: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterLink,TopNav],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit {
  orders: Order[] | null = null;

  constructor(
    private backend: Backend,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // no-op; loading only in browser after view init
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadOrders();
  }

  private loadOrders(): void {
    console.log('Dashboard: Starting to load orders...');
    
    // First check current user role and promote to admin if needed
    this.backend.getProfile().subscribe({
      next: (user: any) => {
        console.log('Dashboard: Current user role:', user.role);
        if (user.role !== 'ADMIN') {
          console.log('Dashboard: Promoting user to ADMIN...');
          this.backend.makeAdmin().subscribe({
            next: (updatedUser: any) => {
              console.log('Dashboard: User promoted to ADMIN', updatedUser);
              // Now load orders after promotion
              this.fetchOrders();
            },
            error: (err) => {
              console.error('Dashboard: Failed to promote user to admin', err);
              // Still try to load orders in case promotion failed but user has admin role
              this.fetchOrders();
            }
          });
        } else {
          // User is already admin, load orders directly
          this.fetchOrders();
        }
      },
      error: (err) => {
        console.error('Dashboard: Failed to get profile', err);
        // Try to load orders anyway
        this.fetchOrders();
      }
    });
  }

  private fetchOrders(): void {
    this.backend.getAllOrders().subscribe({
      next: (orders: any[]) => {
        console.log('Dashboard: Orders received:', orders);
        this.orders = orders.map(order => ({
          id: String(order.id),
          customerName: order.fullName || order.user?.name || order.user?.email || 'Unknown Customer',
          email: order.user?.email || '',
          shippingAddress: order.address || '',
          items: Array.isArray(order.items)
            ? order.items.map((item: any) => ({
                name: item.product?.name || item.name || 'Item',
                quantity: item.quantity || 0
              }))
            : [],
          total: order.totalPrice || order.total_price || 0,
          status: String(order.status || 'PENDING').toLowerCase()
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard: Failed to load orders', err);
        this.orders = [];
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  updateStatus(orderId: string, newStatus: 'confirmed' | 'declined'): void {
    if (!this.orders) {
      return;
    }

    // Map frontend action to a backend OrderStatus value.
    const backendStatus = newStatus === 'confirmed' ? 'PROCESSING' : 'CANCELLED';
    const localStatus = newStatus === 'confirmed' ? 'processing' : 'cancelled';

    this.backend.updateOrderStatus(orderId, backendStatus).subscribe({
      next: (updatedOrder: any) => {
        console.log(`Order ${orderId} updated to ${backendStatus}`, updatedOrder);
        
        // Update local state
        const order = this.orders?.find(o => o.id === orderId);
        if (order) {
          order.status = localStatus;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error(`Failed to update order ${orderId}`, err);
        alert('Failed to update order status');
      }
    });
  }

  deleteOrder(orderId: string): void {
    if (!this.orders) {
      return;
    }
    if (confirm('Are you sure you want to delete this order?')) {
      this.backend.deleteOrder(orderId).subscribe({
        next: () => {
          console.log(`Order ${orderId} deleted`);
          
          // Update local state
          this.orders = this.orders?.filter(o => o.id !== orderId) || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(`Failed to delete order ${orderId}`, err);
          alert('Failed to delete order');
        }
      });
    }
  }
}
