import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { Product } from '../product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartProducts: any[] = [];
  cartItemsSubject = new BehaviorSubject<Product[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private storageKey = 'cartItems';

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.firestore.collection('users').doc(user.uid).valueChanges()
          .subscribe((userData: any) => {
            const cartItems: Product[] =
              userData && userData.cartItems ? userData.cartItems : [];
            this.cartItemsSubject.next(cartItems);
          });
      } else {
        const storedItems = localStorage.getItem(this.storageKey);
        const cartItems: Product[] = storedItems ? JSON.parse(storedItems) : [];
        this.cartItemsSubject.next(cartItems);
      }
    });
  }

  getAllCartItems() {
    return this.cartProducts;
  }

  private updateLocalStorage(cartItems: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cartItems));
  }

  private updateFirestore(cartItems: Product[]): void {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.firestore.collection('users').doc(user.uid).update({ cartItems: cartItems });
      }
    });
  }

  addToCart(item: Product): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].count++;
    } else {
      item.count = 1;
      currentItems.push(item);
    }

    this.cartItemsSubject.next([...currentItems]);
    this.updateLocalStorage([...currentItems]);
    this.updateFirestore([...currentItems]);
  }

  removeFromCart(item: Product): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);

    if (existingItemIndex !== -1) {
      if (currentItems[existingItemIndex].count > 1) {
        currentItems[existingItemIndex].count--;
      } else {
        currentItems.splice(existingItemIndex, 1);
      }
    } else {
      item.count = 1;
      currentItems.push(item);
    }

    this.cartItemsSubject.next([...currentItems]);
    this.updateLocalStorage([...currentItems]);
    this.updateFirestore([...currentItems]);
  }

  getTotalAmount(): number {
    const cartItems = this.cartItemsSubject.value;
    return cartItems.reduce(
      (total, item) => total + item.price * item.count,
      0
    );
  }

  getTotalItems() {
    const cartItems = this.cartItemsSubject.value;
    return cartItems.reduce((total, item) => total + item.count, 0);
  }

  getOrders() {
    return this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.collection('orders').doc(user.uid).valueChanges();
        } else {
          return of([]);
        }
      })
    );
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cartItems');
  }
}
