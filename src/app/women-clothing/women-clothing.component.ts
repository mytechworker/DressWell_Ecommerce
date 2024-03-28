import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Product } from '../product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-women-clothing',
  templateUrl: './women-clothing.component.html',
  styleUrl: './women-clothing.component.css',
})
export class WomenClothingComponent {
  product$: Observable<Product[]>;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.product$ = this.firestore.collection<Product>('product', (ref) =>
        ref.where('category', '==', "Women's Clothing")).valueChanges();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  navigateToProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }
}