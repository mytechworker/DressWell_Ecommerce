import { Component, OnInit } from '@angular/core';
import { Address, Notification, Orders, UserDocument } from '../product';
import { NotificationService } from '../services/notification.service';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from '../services/firebase.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  showReadNotifications = false;
  notifications: Notification[] = [];
  acceptedOrders$: Observable<Orders[]>;
  userForm: FormGroup | null = null;
  addresses: Address[] = [];
  isDataLoaded = false;
  currentUser: UserDocument | null = null;
  constructor(
    private notificationService: NotificationService,
    private afAuth: AngularFireAuth,
    private userDataService: UserDataService,
    private firebaseService: FirebaseService,
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firebaseService.getUserById(user.uid).subscribe(
          (userData) => {
            this.currentUser = userData;
            this.fetchNotifications();
          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        );
      }
    });
  }

  fetchNotifications() {
    if (this.currentUser) {
      this.notificationService.getNotificationsByUserId(this.currentUser.userId)
        .subscribe((notifications) => { this.notifications = notifications });
    }
  }

  fetchAddresses(userId: string) {
    this.firebaseService.getAddressById(userId).subscribe((addresses) => {
      this.userDataService.setAddresses(addresses);
      this.addresses = addresses;
      this.isDataLoaded = true;
    });
  }

  markAsRead(notification: Notification): void {
    if (this.currentUser) {
      this.notificationService.markAsRead(
        notification,
        this.currentUser.userId
      );
    } else {
      console.error('User is not logged in');
    }
  }

  toggleReadNotifications() {
    this.showReadNotifications = !this.showReadNotifications;
  }
}