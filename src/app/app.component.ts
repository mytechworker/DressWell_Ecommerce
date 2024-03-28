import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'my-first-app';
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.init();
      }
}