import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Address } from '../../product';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-address-home',
  templateUrl: './address-home.component.html',
  styleUrls: ['./address-home.component.css'],
})
export class AddressHomeComponent implements OnInit {
  @Input() task: Address | null = null;
  @Output() edit = new EventEmitter<Address>();
  addresses: Address[] = [];
  constructor(private firebaseService: FirebaseService) {}
  ngOnInit() {
    this.firebaseService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.firebaseService
          .getAddressById(user.userId)
          .subscribe((addresses) => {
            this.addresses = addresses;
          });
      }
    });
  }
}