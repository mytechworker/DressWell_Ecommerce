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
  productMessages: { [key: string]: string } = {};

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
    this.productAddedtoCart(product.id);
  }

  navigateToProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }

  productAddedtoCart(productId: string) {
    this.productMessages[productId] = 'Product Added to Cart Successfully!';
    setTimeout(() => (this.productMessages[productId] = undefined), 3000);
  }

  getProductMessage(productId: string): string {
    return this.productMessages[productId] || '';
  }
}
