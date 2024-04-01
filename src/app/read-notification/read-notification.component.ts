import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../product';
@Component({
  selector: 'app-read-notification',
  templateUrl: './read-notification.component.html',
  styleUrl: './read-notification.component.css'
})
export class ReadNotificationComponent {
  readNotifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getReadNotifications().subscribe((notifications) => {
      this.readNotifications = notifications;
    });
  }
}