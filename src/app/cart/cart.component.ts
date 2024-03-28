import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  totalCartPrice: number = 0;
  totalAmount: number = 0;
  totalItems: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotalAmount();
    });
  }

  addToCart(item: Product): void {
    this.cartService.addToCart(item);
  }

  removeCart(item: Product): void {
    this.cartService.removeFromCart(item);
  }
  calculateTotalAmount() {
    this.totalAmount = this.cartService.getTotalAmount();
    this.totalItems = this.cartService.getTotalItems();
  }
  buyProduct() {
    this.router.navigate(['/buy']);
  }
}