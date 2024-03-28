import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from '../../../../services/orders.service';
import { Orders } from '../../../../product';

@Component({
  selector: 'app-orders-decline',
  templateUrl: './orders-decline.component.html',
  styleUrls: ['./orders-decline.component.css']
})
export class OrdersDeclineComponent {
  acceptedOrders$: Observable<Orders[]>;
  declinedOrders$: Observable<Orders[]>;

  constructor(private ordersService: OrderService) { }

  ngOnInit() {
    this.acceptedOrders$ = this.ordersService.getAcceptedOrders();
    this.declinedOrders$ = this.ordersService.getDeclinedOrders();
  }
}
