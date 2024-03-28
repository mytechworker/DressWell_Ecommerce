import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {}

  forgotPassword() {
    this.firebaseService.forgotPassword(this.email);
    this.email = '';
  }
}