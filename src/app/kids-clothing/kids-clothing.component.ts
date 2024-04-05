import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kids-clothing',
  templateUrl: './kids-clothing.component.html',
  styleUrl: './kids-clothing.component.css',
})
export class KidsClothingComponent implements OnInit {
  product$: Observable<Product[]>;
  productMessages: { [key: string]: string } = {};
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.product$ = this.firestore
      .collection<Product>('product', (ref) =>
        ref.where('category', '==', 'Kids Clothing')
      )
      .valueChanges();
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
