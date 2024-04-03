import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'my-first-app';
  constructor(
    private notificationService: NotificationService,
    private authService: FirebaseService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        const userId = user.userId;
        this.notificationService.init(userId);
      }
    });
  }
}