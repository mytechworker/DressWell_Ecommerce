import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentSuccessSubject = new Subject<void>();
  private totalAmountSubject = new BehaviorSubject<number>(0);
  totalAmount$ = this.totalAmountSubject.asObservable();

  paymentSuccess$ = this.paymentSuccessSubject.asObservable();

  constructor() {
    const storedTotalAmount = localStorage.getItem('total_amount');
    if (storedTotalAmount) {
      const totalAmount = parseFloat(storedTotalAmount);
      this.updateTotalAmount(totalAmount);
    }
  }

  updateTotalAmount(amount: number) {
    this.totalAmountSubject.next(amount);
    localStorage.setItem('total_amount', amount.toString());
  }

  emitPaymentSuccess() {
    this.paymentSuccessSubject.next();
  }
}
