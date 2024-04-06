import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Orders } from '../../../product';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
@Component({
  selector: 'app-mini-orders',
  templateUrl: './mini-orders.component.html',
  styleUrls: ['./mini-orders.component.css'],
})
export class MiniOrdersComponent implements OnInit {
  @Input() task: Orders | null = null;
  @Output() edit = new EventEmitter<Orders>();
  @Output() accept = new EventEmitter<Orders>();
  @Output() decline = new EventEmitter<Orders>();
  productMessage: string;
  orderPlacedDate: Date | null = null;
  constructor() {}

  ngOnInit() {
    if ( this.task && this.task.orderPlacedAt instanceof firebase.firestore.Timestamp) 
      {
        this.orderPlacedDate = this.task.orderPlacedAt.toDate();
      }
  }

  onAccept() {
    this.accept.emit(this.task);
  }

  onDecline() {
    this.decline.emit(this.task);
  }
}