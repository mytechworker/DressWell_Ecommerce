import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
isSignedIn = localStorage.getItem('isSignedIn') === 'true' || false;

constructor() { }

updateAuthState(isSignedIn: boolean) {
  this.isSignedIn = isSignedIn;
  localStorage.setItem('isSignedIn', isSignedIn.toString());
}
}