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
  private readNotificationsSubject = new BehaviorSubject<Notification[]>([]);

  constructor(
    private firestore: AngularFirestore,
    private notificationsService: NotificationsService
  ) {
    this.notificationsCollection = this.firestore.collection<Notification>('notifications');
  }

  sendNotification(notification: Notification, userId: string): void {
    notification.userId = userId;
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

  private updateNotificationCount(userId: string): void {
    this.firestore.collection<Notification>('notifications', (ref) =>ref.where('userId', '==', userId))
      .snapshotChanges()
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

  init(userId: string): void {
    this.updateNotificationCount(userId);
    this.updateNotifications();
  }

  private updateNotifications(): void {
    this.notificationsCollection.valueChanges({ idField: 'id' })
      .subscribe((notifications) => {
        this.notificationsSubject.next(notifications);
      });
  }

  getTotalCount() {
    const notifications = this.notificationsSubject.value;
    return notifications.reduce((total, item) => total + item.count, 0);
  }

  markAsRead(notification: Notification, userId: string): void {
    const updatedNotifications = this.notificationsSubject.value.filter(
      (n) => n.id !== notification.id
    );
    this.notificationsSubject.next(updatedNotifications);
    this.readNotificationsSubject.next([
      ...this.readNotificationsSubject.value,
      notification,
    ]);

    this.firestore.collection(`readNotifications/${userId}/notifications`).add(notification);
    const notificationsCollectionRef = this.firestore.collection('notifications');
    notificationsCollectionRef.doc(notification.id).delete()
      .then(() => {
        console.log('Notification removed from notifications collection');
      })
      .catch((error) => {
        console.error(
          'Error removing notification from notifications collection:',
          error
        );
      });
  }

  getReadNotifications(userId: string): Observable<Notification[]> {
    return this.firestore.collection<Notification>(`readNotifications/${userId}/notifications`)
      .valueChanges({ idField: 'id' });
  }

  sendNotificationToUser(userId: string, notification: Notification) {
    notification.userId = userId;
    this.firestore.collection(`userNotifications/${userId}/notifications`).add(notification);
  }

  getUserNotifications(userId: string): Observable<Notification[]> {
    return this.firestore.collection<Notification>(`userNotifications/${userId}/notifications`)
      .valueChanges({ idField: 'id' });
  }

  getNotificationsByUserId(userId: string): Observable<Notification[]> {
    return this.firestore.collection<Notification>('notifications', (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges({ idField: 'id' });
  }
}