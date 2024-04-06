import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../product';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})

export class OrdersComponent implements OnInit {
  totalAmount: number = 0;
  cartItems: Product[];

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private productService: FirebaseService
  ) {}

  ngOnInit() {
    this.paymentService.totalAmount$.subscribe((amount) => {
      this.totalAmount = amount;
    });

    this.route.params.subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.productService.getProductById(productId).subscribe((product) => {
          this.cartItems = [product];
          this.calculateTotalAmount();
        });
      } else {
        this.calculateTotalAmount();
      }
    });
  }

  calculateTotalAmount() {
    if (this.cartItems && this.cartItems.length > 0) {
      this.totalAmount = this.cartItems.reduce((total, item) => {
        if (item && item.price) {
          return total + item.price;
        } else {
          return total;
        }
      }, 0);
    }
  }
}