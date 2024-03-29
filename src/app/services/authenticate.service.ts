import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isSignedIn = localStorage.getItem('isSignedIn') === 'true' || false;
  authState: any;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(auth => {
      this.authState = auth;
      this.isSignedIn = !!auth;
      localStorage.setItem('isSignedIn', this.isSignedIn.toString());
    });
  }

  updateAuthState(isSignedIn: boolean) {
    this.isSignedIn = isSignedIn;
    localStorage.setItem('isSignedIn', isSignedIn.toString());
  }
}