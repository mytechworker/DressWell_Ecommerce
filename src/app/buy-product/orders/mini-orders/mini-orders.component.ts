import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Orders } from '../../../product';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-mini-orders',
  templateUrl: './mini-orders.component.html',
  styleUrls: ['./mini-orders.component.css'],
})
export class MiniOrdersComponent {
  @Input() task: Orders | null = null;
  @Output() edit = new EventEmitter<Orders>();
  @Output() accept = new EventEmitter<Orders>();
  @Output() decline = new EventEmitter<Orders>();
  productMessage: string;

  constructor(private cartService: CartService) {}
  onAccept() {
    this.accept.emit(this.task);
  }

  onDecline() {
    this.decline.emit(this.task);
  }
}