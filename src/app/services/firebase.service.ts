import { Address, CardDetails, Product } from './../product';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { UserDocument } from '../product';
import { AuthService } from './authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  getConfig() {}
  addresses: Address[] = [];
  currentUser: Observable<UserDocument>;
  isLoggedIn = false;
  constructor(
    private firebaseAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.currentUser = this.firebaseAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.collection('users').doc<UserDocument>(user.uid).valueChanges();
        } else {
          return of(null);
        }
      }),
      catchError((error) => {
        console.error('Error getting current user details:', error);
        return of(null);
      })
    );
    this.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  async signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password).then((res) => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      });
  }

  async signup(email: string, password: string): Promise<any> {
    try {
        const res = await this.firebaseAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user));
      return { userId: res.user?.uid };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  getProducts(): Observable<Product[]> {
    return this.firestore.collection<Product>('product').valueChanges();
  }

  forgotPassword(email: string) {
    return this.firebaseAuth.sendPasswordResetEmail(email).then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  async storeUserInfo(
    userId: string,
    name: string,
    email: string
  ): Promise<void> {
    return this.firestore.collection('users').doc(userId).set({
      name,
      userId,
      email,
      access: false,
    });
  }

  updateUser(user: UserDocument): Promise<void> {
    const userRef = this.firestore.collection('users').doc(user.userId);
    const userToUpdate = { ...user };
    delete userToUpdate.userId;
    return userRef.update(userToUpdate);
  }

  updateUserAccess(userId: string, access: boolean): Promise<void> {
    return this.firestore.collection('users').doc(userId).update({ access });
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    this.authService.isSignedIn = false;
  }

  getAllUsernames(): Observable<UserDocument[]> {
    return this.firestore.collection('users').valueChanges().pipe(
        map((userDocuments: UserDocument[]) => userDocuments),
        catchError((error) => {
          console.error('Error fetching users:', error);
          throw error;
        })
      );
  }

  getUserCardDetails(): Observable<CardDetails[]> {
    return this.firestore.collection('cardDetails').valueChanges().pipe(
        map((cardDetails: CardDetails[]) => cardDetails),
        catchError((error) => {
          console.error('Error fetching card details: ', error);
          throw error;
        })
      );
  }

  addUser(user: UserDocument): Observable<UserDocument> {
    return new Observable((observer) => {
      this.firestore.collection('users')
        .add({
          ...user,
          userId: this.firestore.createId(),
        })
        .then((docRef) => {
          const addedUser: UserDocument = { ...user, id: docRef.id };
          observer.next(addedUser);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error adding user to Firestore:', error);
          observer.error(error);
        });
    });
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  hasAccess(userId: string): Observable<boolean> {
    const userRef = this.firestore.collection('users').doc(userId);
    return userRef.get().pipe(
      map((doc) => {
        if (doc.exists) {
          const user = doc.data() as UserDocument;
          return user.access === true;
        } else {
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error fetching user details:', error);
        return of(false);
      })
    );
  }

  getUserById(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  getAddressById(userId: string): Observable<Address[]> {
    return this.firestore.collection<Address>('address', (ref) =>
        ref.where('userId', '==', userId)
      ).valueChanges().pipe(
        catchError((error) => {
          console.error('Error fetching addresses:', error);
          throw error;
        })
      );
  }

  getCurrentUser(): Observable<UserDocument> {
    return this.currentUser;
  }

  getAddressByIds(
    userIds: string[]
  ): Observable<{ [userId: string]: Address[] }> {
    const addressesByUser: { [userId: string]: Address[] } = {};
    const observables = userIds.map((userId) =>
      this.firestore.collection<Address>('address', (ref) =>
          ref.where('userId', '==', userId)
        ).valueChanges()
    );

    return combineLatest(observables).pipe(
      map((addressesArray) => {
        userIds.forEach((userId, index) => {
          addressesByUser[userId] = addressesArray[index];
        });
        return addressesByUser;
      }),
      catchError((error) => {
        console.error('Error fetching addresses:', error);
        throw error;
      })
    );
  }
}