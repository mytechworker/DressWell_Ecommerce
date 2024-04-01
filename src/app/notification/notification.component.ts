import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/orders.service';
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
    private ordersService: OrderService
  ) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firebaseService.getUserById(user.uid).subscribe(
          (userData) => {
            this.userDataService.setCurrentUser(userData);
            this.fetchAddresses(userData.userId);
            this.currentUser = userData as UserDocument;
            this.ordersService
              .getAcceptedOrdersByUser(user.uid)
              .subscribe((userAcceptedOrders) => {
                this.acceptedOrders$ = of(userAcceptedOrders);
              });
          },
          (error) => {
            console.error('Error fetching user data:', error);
            this.isDataLoaded = true;
          }
        );
      }
    });

    this.userDataService.userForm$.subscribe((userForm) => {
      if (userForm !== null) {
        this.userForm = userForm;
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

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification);
  }

  toggleReadNotifications() {
    this.showReadNotifications = !this.showReadNotifications;
  }
}