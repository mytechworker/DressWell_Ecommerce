import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../product';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of, switchMap } from 'rxjs';
@Component({
  selector: 'app-read-notification',
  templateUrl: './read-notification.component.html',
  styleUrl: './read-notification.component.css'
})
// export class ReadNotificationComponent implements OnInit {
//   readNotifications: Notification[] = [];

//   constructor(
//     private notificationService: NotificationService,
//     private afAuth: AngularFireAuth
//   ) {}

//   ngOnInit(): void {
//     this.afAuth.authState.pipe(
//       switchMap(user => {
//         if (user) {
//           return this.notificationService.getReadNotifications(user.uid);
//         } else {
//           return [];
//         }
//       })
//     ).subscribe((notifications) => {
//       if (Array.isArray(notifications)) {
//         this.readNotifications = notifications;
//       } else {
//         this.readNotifications = [];
//       }
//     });
//   }
// }

export class ReadNotificationComponent implements OnInit {
  readNotifications: Notification[] = [];
  isAuthenticated = false;

  constructor(
    private notificationService: NotificationService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.notificationService.getReadNotifications(user.uid).subscribe(notifications => {
          this.readNotifications = notifications;
        });
      } else {
        this.isAuthenticated = false;
        this.readNotifications = [];
      }
    });
  }
}
