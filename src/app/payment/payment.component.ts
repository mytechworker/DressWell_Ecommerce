import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../product';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  constructor(private cartService: CartService) {}
  cartItems: Product[] = [];
  handler: any = null;
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
      key: 'pk_test_51OQMS8SBmrKIRoJWhVgg6myQKYC6OSEFOCcVQLT3TMBs7LWV30GvB9MZkKYAKBOzdnLQQTta3ZlQYTIcrJmfqNbs00NlzjPYwh',
      locale: 'auto',
      token: (token: any) => {
        if (token && token.error) {
          console.error('Stripe token creation error:', token.error);
          alert('Error occurred during payment: ' + token.error.message);
        } else {
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
          key: 'pk_test_51OQMS8SBmrKIRoJWhVgg6myQKYC6OSEFOCcVQLT3TMBs7LWV30GvB9MZkKYAKBOzdnLQQTta3ZlQYTIcrJmfqNbs00NlzjPYwh',
          locale: 'auto',
          token: function (token: any) {
            alert('Payment Success!!');
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }
}