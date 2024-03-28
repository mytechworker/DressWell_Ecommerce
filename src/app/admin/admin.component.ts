import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/orders.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  showFiller = false;
  sidebarList: any = [
    {
      label: 'Category',
      link: 'category',
      active: true,
    },
    {
      label: 'Product',
      link: 'products',
      active: false,
    },
    {
      label: 'Users',
      link: 'users',
      active: false,
    },
    {
      label: 'Orders',
      link: 'product-orders',
      active: false,
    },
  ];
  constructor(private orderService: OrderService) {}

  changeRoute(index: number) {
    this.sidebarList.forEach((item: any, i: number) => {
      this.sidebarList[i].active = false;
    });
    this.sidebarList[index].active = true;
  }
  ngOnInit(): void {}
}
