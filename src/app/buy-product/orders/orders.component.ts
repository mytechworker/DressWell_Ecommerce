import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../product';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  authStateSubscription: Subscription | null = null;
  totalAmount: number = 0;
  orderId: string = '';
  cartItems: Product[];
  alertShown: boolean = false;

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.paymentService.totalAmount$.subscribe(amount => {
      this.totalAmount = amount;
    });
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      if (item.selected) {
        return total + item.price * item.count;
      } else {
        return total;
      }
    }, 0);
  }
}
