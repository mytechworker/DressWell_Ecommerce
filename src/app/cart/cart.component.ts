import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../product';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/authenticate.service';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  totalAmount: number = 0;
  totalItems: number = 0;
  allSelected: boolean = false;
  delivery_charge: number = 100;

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private totalAmountService: PaymentService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotalAmount();
      localStorage.setItem('total_amount', this.totalAmount.toString());
      this.cartService.changeSubtotal(this.totalAmount);
      this.restoreCheckboxState();
      const selectAllState = localStorage.getItem('select_all');
      if (this.cartItems.length === 0) {
        this.allSelected = false;
        localStorage.setItem('select_all', JSON.stringify(this.allSelected));
      } else {
        this.allSelected = selectAllState ? JSON.parse(selectAllState) : false;
      }
    });
  }

  calculateTotalAmount() {
    this.totalAmount = 0;
    this.totalItems = 0;
    this.cartItems.forEach((item) => {
      const storedState = localStorage.getItem(`selected_${item.id}`);
      if (storedState && JSON.parse(storedState)) {
        this.totalAmount += item.price * item.count;
        this.totalItems += item.count;
      }
    });
    this.totalAmountService.updateTotalAmount(this.totalAmount);
  }

  addToCart(item: Product): void {
    item.selected = false;
    this.cartService.addToCart(item);
  }

  removeCart(item: Product): void {
    this.cartService.removeFromCart(item);
  }

  buyProduct() {
if (this.authService.isSignedIn == true) {
      this.router.navigate(['/buy']);
} else {
      this.router.navigate(['/auth']);
    }
  }

  navigateToProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }

  toggleSelection(item: Product): void {
    localStorage.setItem(`selected_${item.id}`, JSON.stringify(item.selected));
    this.calculateTotalAmount();
    const allSelected = this.cartItems.every((item) => item.selected);
    this.allSelected = allSelected;
    localStorage.setItem('select_all', JSON.stringify(this.allSelected));
    this.cdr.detectChanges();
  }

  toggleAllSelections(): void {
    this.cartItems.forEach((item) => {
      item.selected = this.allSelected;
      localStorage.setItem(
        `selected_${item.id}`,
        JSON.stringify(item.selected)
      );
    });
    localStorage.setItem('select_all', JSON.stringify(this.allSelected));
    this.calculateTotalAmount();
  }

  restoreCheckboxState(): void {
    this.cartItems.forEach((item) => {
      const storedState = localStorage.getItem(`selected_${item.id}`);
      if (storedState) {
        item.selected = JSON.parse(storedState);
      }
    });
    this.cdr.detectChanges();
  }
}
