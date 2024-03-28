import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../product';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsCollection: AngularFirestoreCollection<Notification>;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
  private countSubject = new BehaviorSubject<number>(0);
  public count$: Observable<number> = this.countSubject.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private notificationsService: NotificationsService
  ) {
    this.notificationsCollection =
      this.firestore.collection<Notification>('notifications');
  }

  sendNotification(notification: Notification): void {
    this.notificationsCollection.add(notification);
    this.showNotification(notification.message, notification.type);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsCollection.valueChanges({ idField: 'id' });
  }

  private showNotification(message: string, type: string): void {
    const title = 'Notification';
    switch (type) {
      case 'order_accepted':
        this.notificationsService.success(title, message);
        break;
      case 'order_declined':
        this.notificationsService.error(title, message);
        break;
      default:
        this.notificationsService.info(title, message);
        break;
    }
  }

  private updateNotificationCount(): void {
    this.firestore.collection<Notification>('notifications').snapshotChanges()
      .subscribe((changes) => {
        const notifications = changes.map((change) => {
          const data = change.payload.doc.data() as Notification;
          const id = change.payload.doc.id;
          return { id, ...data };
        });
        this.notificationsSubject.next(notifications);
        this.countSubject.next(notifications.length);
      });
  }
  init(): void {
    this.updateNotificationCount();
  }

  getTotalCount() {
    const notifications = this.notificationsSubject.value;
    return notifications.reduce((total, item) => total + item.count, 0);
  }

  markAsRead(notification: Notification): void {
    const updatedNotifications = this.notificationsSubject.value.map((n) => {
      if (n === notification) {
        return { ...n, read: true };
      }
      return n;
    });
    this.firestore.collection('notifications').doc(notification.id).update({ read: true });
    this.notificationsSubject.next(updatedNotifications);
  }

  handleMarkAsRead(notification: Notification): void {
    this.markAsRead(notification);
  }
}