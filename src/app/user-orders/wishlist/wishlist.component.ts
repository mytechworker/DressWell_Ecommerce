import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserDocument } from '../../product';
import { WishlistService } from '../../services/wishlist.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent {
  wishlistItems: any[] = [];
  userId: string = '';
  currentUser: UserDocument | null = null;

  constructor(
    private wishlistService: WishlistService,
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firebaseService.getUserById(user.uid).subscribe((userData) => {
          this.currentUser = userData as UserDocument;
          this.getWishlist();
        });
      }
    });
  }

  getWishlist(): void {
    if (this.currentUser?.userId) {
      this.wishlistService.getWishlist(this.currentUser.userId)
        .subscribe((items) => {
          this.wishlistItems = items;
        });
    }
  }

  navigateToProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }
}