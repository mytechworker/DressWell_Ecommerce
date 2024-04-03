import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Orders, Product } from '../product';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  constructor(private cartService: CartService) { }
  cartItems: Product[] = [];
  handler:any = null;
  totalAmount: number = 0;
  ngOnInit() {
 
    this.loadStripe();
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    this.calculateTotalAmount();
    });
  }
  calculateTotalAmount() {
    this.totalAmount = this.cartService.getTotalAmount();
  }
  pay(amount: number) {    
 
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51OUQ2YSBsRjMaYOe1phMU8RuXK3UsacqVQ9wdcdl8w53r3DXxHMkMZoFIqKH9lqiitvrqttRjfifDiBnXrc4C2eh00jlSA8Rl3',
      locale: 'auto',
      token: (token: any) => {
        if (token && token.error) {
          console.error('Stripe token creation error:', token.error);
          alert('Error occurred during payment: ' + token.error.message);
        } else {
          console.log('Token created:', token);
          alert('Payment Success!!');
        }
      },
      closed: (data: any) => {
        if (data && data.error) {
          console.error('Stripe Checkout closed with an error:', data.error);
          alert('Error occurred during payment. Please try again.');
        } else {
          console.log('Stripe Checkout closed without an error.');
        }
      }
    });
 
    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: amount * 100
    });
    console.log('amount',amount);
 
  }
 
  loadStripe() {
     
    if(!window.document.getElementById('stripe-script')) {
      var script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "";
      script.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51OUQ2YSBsRjMaYOe1phMU8RuXK3UsacqVQ9wdcdl8w53r3DXxHMkMZoFIqKH9lqiitvrqttRjfifDiBnXrc4C2eh00jlSA8Rl3',
          locale: 'auto',
          token: function (token: any) {
            console.log(token)
            alert('Payment Success!!');
          }
        });
      }
       
      window.document.body.appendChild(script);
    }
  }
}