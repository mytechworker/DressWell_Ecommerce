import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Address, UserDocument } from '../product';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(public firestore: AngularFirestore, private fb: FormBuilder) {}
  private currentUserSubject: BehaviorSubject<UserDocument | null> = new BehaviorSubject<UserDocument | null>(null);
  currentUser$: Observable<UserDocument | null> = this.currentUserSubject.asObservable();
  private addressesSubject: BehaviorSubject<Address[]> = new BehaviorSubject<Address[]>([]);
  addresses$: Observable<Address[]> = this.addressesSubject.asObservable();
  private userFormSubject: BehaviorSubject<FormGroup | null> = new BehaviorSubject<FormGroup | null>(null);
  userForm$: Observable<FormGroup | null> = this.userFormSubject.asObservable();

  setCurrentUser(user: UserDocument | null) {
    this.currentUserSubject.next(user);
    const userForm = this.createFormFromUserData(user);
    this.userFormSubject.next(userForm);
  }
  setAddresses(addresses: Address[]) {
    this.addressesSubject.next(addresses);
  }

  setUserForm(userForm: FormGroup | null) {
    this.userFormSubject.next(userForm);
  }

  createUser(userData: UserDocument): Promise<void> {
    const userRef = this.firestore.collection('users').doc(userData.userId);
    return userRef.set(userData);
  }

  updateUser(user: UserDocument): Promise<void> {
    const userRef = this.firestore.collection('users').doc(user.userId);
    return userRef.update(user);
  }
  getUserForm(): FormGroup | null {
    return this.userFormSubject.value;
  }

  getAddresses(): Address[] {
    return this.addressesSubject.value;
  }
  private createFormFromUserData(user: UserDocument): FormGroup {
    return this.fb.group({
      name: [user.name],
      mobile: [user.mobile],
      email: [user.email],
      dob: [user.dob],
    });
  }
}