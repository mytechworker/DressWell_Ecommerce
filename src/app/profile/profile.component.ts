import { Component } from '@angular/core';
import { Address, UserDocument } from '../product';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserDataService } from '../services/user-data.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  currentUser: UserDocument | null = null;
  userForm: FormGroup | null = null;
  addresses: Address[] = [];
  isDataLoaded = false;

  constructor(
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
    this.userDataService.userForm$.subscribe((userForm) => {
      if (userForm !== null) {
        this.userForm = userForm;
      }
    });
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firebaseService.getUserById(user.uid).subscribe(
          (userData) => {
            this.userDataService.setCurrentUser(userData);
            this.fetchAddresses(userData.userId);
          },
          (error) => {
            console.error('Error fetching user data:', error);
            this.isDataLoaded = true;
          }
        );
      }
    });
  }

  fetchAddresses(userId: string) {
    this.firebaseService.getAddressById(userId).subscribe((addresses) => {
      this.userDataService.setAddresses(addresses);
      this.addresses = addresses;
      this.isDataLoaded = true;
    });
  }
}
