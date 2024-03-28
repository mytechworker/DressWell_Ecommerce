import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem('user'));

    if (this.firebaseService.isAuthenticated() && user) {
      return this.firebaseService.hasAccess(user.uid).pipe(
        map((hasAccess) => {
          if (hasAccess) {
            return true;
          } else {
            this.router.navigate(['/auth']);
            return false;
          }
        })
      );
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
