import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Address } from '../product';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  sortCriterion: any;
  sortSubject = new Subject();
  filteredBooks: any;
  getItem(key: string): any {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  getSortCriterion(criterion: any) {
    this.sortCriterion = criterion;
    this.sortSubject.next(this.sortCriterion);
  }

  private selectedAddressSubject = new BehaviorSubject<Address | null>(null);
  selectedAddress$: Observable<Address | null> =
    this.selectedAddressSubject.asObservable();

  private selectedRadioButtonKey = 'selectedRadioButton';

  setSelectedAddress(address: Address): void {
    this.selectedAddressSubject.next(address);
  }

  getSelectedRadioButton(): string | null {
    return localStorage.getItem(this.selectedRadioButtonKey);
  }

  setSelectedRadioButton(radioButton: string): void {
    localStorage.setItem(this.selectedRadioButtonKey, radioButton);
  }
}