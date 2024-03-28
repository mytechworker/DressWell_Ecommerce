import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, UserDocument } from '../../product';
import { WishlistService } from '../../services/wishlist.service';
import { FirebaseService } from '../../services/firebase.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/authenticate.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  isAuthenticated: boolean;
  productId: string;
  currentUser: UserDocument | null = null;
  product: Product | undefined;
  isAddedToWishlist: boolean = false;
  selectedRating: number = 0;
  stars = [
    { id: 1, icon: 'star', class: 'star-gray star-hover star' },
    { id: 2, icon: 'star', class: 'star-gray star-hover star' },
    { id: 3, icon: 'star', class: 'star-gray star-hover star' },
    { id: 4, icon: 'star', class: 'star-gray star-hover star' },
    { id: 5, icon: 'star', class: 'star-gray star-hover star' },
  ];
  averageRating: number = 0;
  productMessage: string;
  zoomLevel = 1;
  constructor(
    private route: ActivatedRoute,
    private store: AngularFirestore,
    private wishlistService: WishlistService,
    private afAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {
    const storedWishlistStatus = localStorage.getItem('isAddedToWishlist');
    this.isAddedToWishlist = storedWishlistStatus
      ? JSON.parse(storedWishlistStatus)
      : false;
  }
  ngOnInit() {
    this.isAuthenticated = this.authService.isSignedIn;
    console.log('this.isAuthenticated', this.isAuthenticated);
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.getProductDetails();
    });
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firebaseService.getUserById(user.uid).subscribe((userData) => {
          this.currentUser = userData as UserDocument;
          this.loadWishlistState();
          this.loadSelectedRating();
          this.loadRatings();
        });
      }
    });
    this.wishlistService
      .isProductInWishlist(this.currentUser.userId, this.productId)
      .then((isInWishlist) => {
        this.isAddedToWishlist = isInWishlist;
      });
  }

  loadSelectedRating(): void {
    const selectedRatingKey = `selectedRating_${this.currentUser.userId}_${this.productId}`;
    const storedSelectedRating = localStorage.getItem(selectedRatingKey);
    this.selectedRating = storedSelectedRating
      ? parseInt(storedSelectedRating, 10)
      : 0;
    this.updateStars();
  }

  saveSelectedRating(): void {
    const selectedRatingKey = `selectedRating_${this.currentUser.userId}_${this.productId}`;
    localStorage.setItem(selectedRatingKey, this.selectedRating.toString());
  }

  loadRatings(): void {
    this.wishlistService
      .getRatingsForProduct(this.productId)
      .subscribe((userRatings) => {
        const totalRatings = userRatings.length;
        if (totalRatings > 0) {
          const sumOfRatings = userRatings.reduce(
            (acc, userRating) => acc + userRating.rating,
            0
          );
          this.averageRating = sumOfRatings / totalRatings;
          this.updateStars();
        }
      });
  }

  updateStars(): void {
    this.stars.forEach((star) => {
      star.class =
        star.id <= this.averageRating ? 'star-gold star' : 'star-gray star';
    });
  }

  getProductDetails() {
    this.store
      .collection('product')
      .doc(this.productId)
      .valueChanges()
      .subscribe((product: Product) => {
        this.product = product;
      });
  }
  selectStar(value): void {
    this.selectedRating = value;
    this.saveSelectedRating();
    this.stars.forEach((star) => {
      star.class =
        star.id <= this.selectedRating ? 'star-gold star' : 'star-gray star';
    });
    this.wishlistService.submitRating(
      this.currentUser.userId,
      this.productId,
      this.selectedRating
    );
  }

  addToWishlist(product: Product): void {
    this.isAddedToWishlist = !this.isAddedToWishlist;
    if (this.isAddedToWishlist) {
      this.wishlistService.addToWishlist(this.currentUser.userId, product);
    } else {
      this.wishlistService.removeFromWishlist(
        this.currentUser.userId,
        product.id
      );
    }
    this.saveWishlistState();
  }

  private loadWishlistState(): void {
    const wishlistStateKey = `wishlistState_${this.currentUser.userId}`;
    const wishlistState =
      JSON.parse(localStorage.getItem(wishlistStateKey)) || {};
    this.isAddedToWishlist = wishlistState[this.productId] || false;
  }

  private saveWishlistState(): void {
    const wishlistStateKey = `wishlistState_${this.currentUser.userId}`;
    const wishlistState =
      JSON.parse(localStorage.getItem(wishlistStateKey)) || {};
    wishlistState[this.productId] = this.isAddedToWishlist;
    localStorage.setItem(wishlistStateKey, JSON.stringify(wishlistState));
  }

  buyProduct() {
    if (this.authService.isSignedIn == true) {
      this.cartService.addToCart(this.product);
      this.router.navigate(['/buy']);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  addToCart() {
    this.cartService.addToCart(this.product);
    this.productAddedtoCart();
  }

  productAddedtoCart() {
    this.productMessage = 'Product Added to Cart Successfully!';
    setTimeout(() => (this.productMessage = undefined), 3000);
  }
}