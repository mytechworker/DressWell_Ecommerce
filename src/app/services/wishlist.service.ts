import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, first, map } from 'rxjs';
import { Product } from '../product';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private firestore: AngularFirestore) {}

  addToWishlist(userId: string, product: Product): Promise<void> {
    const wishlistItem = { userId, product, productId: product.id };
    return this.firestore.collection(`wishlist/${userId}/items`).add(wishlistItem).then(() => {});
  }

  removeFromWishlist(userId: string, productId: string): Promise<void> {
    const wishlistRef = this.firestore.collection(`wishlist/${userId}/items`,(ref) => ref.where('productId', '==', productId));
    return wishlistRef
      .get()
      .pipe(first())
      .toPromise()
      .then((querySnapshot) => {
        const deletePromises: Promise<void>[] = [];

        querySnapshot.forEach((doc) => {
          deletePromises.push(doc.ref.delete());
        });

        return Promise.all(deletePromises).then(() => {});
      });
  }

  getWishlist(userId: string): Observable<any[]> {
    return this.firestore.collection(`wishlist/${userId}/items`).valueChanges();
  }

  isProductInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlistRef = this.firestore.collection(`wishlist/${userId}/items`, (ref) => ref.where('productId', '==', productId));
    return wishlistRef
      .get()
      .toPromise()
      .then((querySnapshot) => {
        return !querySnapshot.empty;
      });
  }

  submitRating(
    userId: string,
    productId: string,
    rating: number
  ): Promise<void> {
    const ratingItem = { userId, rating };
    return this.firestore.collection(`ratings`).doc(productId).set({ [userId]: rating }, { merge: true });
  }

  getRatingsForProduct(productId: string): Observable<any[]> {
    return this.firestore.collection(`ratings`).doc(productId)
      .get()
      .pipe(
        map((snapshot) => {
          const ratings = [];
          const data = snapshot.data();
          if (data) {
            Object.keys(data).forEach((userId) => {
              ratings.push({ userId, rating: data[userId] });
            });
          }
          return ratings;
        })
      );
  }
}
