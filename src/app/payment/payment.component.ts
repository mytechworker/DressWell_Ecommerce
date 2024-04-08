import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Orders, Product } from '../product';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  authStateSubscription: Subscription | null = null;
  cartItems: Product[] = [];
  totalAmount: number = 0;
  orderId: string = '';
  alertShown: boolean = false;
  handler: any = null;
  delivery_charge: number = 100;
  constructor(
    private cartService: CartService,
    private store: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotalAmount();
    });
  
    this.paymentService.totalAmount$.subscribe(amount => {
      this.totalAmount = Number(amount) + this.delivery_charge;
    });
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.count);
    }, 0);
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
          alert('Payment Success!!');
          this.placeOrder();
          this.paymentService.emitPaymentSuccess();
        }
      },
      closed: (data: any) => {
        if (data && data.error) {
          console.error('Stripe Checkout closed with an error:', data.error);
          alert('Error occurred during payment. Please try again.');
        } else {
          console.log('Stripe Checkout closed without an error.');
        }
      },
    });

    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: amount * 100,
    });
  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = '';
      script.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51OUQ2YSBsRjMaYOe1phMU8RuXK3UsacqVQ9wdcdl8w53r3DXxHMkMZoFIqKH9lqiitvrqttRjfifDiBnXrc4C2eh00jlSA8Rl3',
          locale: 'auto',
          token: function (token: any) {
            alert('Payment Success!!');
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }

  placeOrder() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
    this.authStateSubscription = this.afAuth.authState.subscribe((user) => {
      if (user) {
        const orderPlacedAt = new Date();
        const order: Orders = {
          status: 'In Progress',
          userId: user.uid,
          userName: user.displayName || user.email,
          items: this.cartItems,
          totalAmount: this.totalAmount,
          orderPlacedAt: orderPlacedAt
        };
        this.store
          .collection('orders')
          .add(order)
          .then((docRef) => {
            const orderId = docRef.id;
            this.orderId = orderId;
            this.cartService.clearCart();
            localStorage.removeItem('cartItems');
            if (!this.alertShown) {
              alert('Your order is in Progress!');
              this.alertShown = true;
              if (this.authStateSubscription) {
                this.authStateSubscription.unsubscribe();
              }
            }
          })
          .catch((error) => {
            console.error('Error adding order: ', error);
          });
      } else {
        this.router.navigate(['/auth']);
      }
    });
  }
}
