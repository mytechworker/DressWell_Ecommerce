import { Component } from '@angular/core';
import { AddressComponent, AddressResult } from '../address/address.component';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Address } from '../../product';
import { FirebaseService } from '../../services/firebase.service';

const getObservable = (collection: AngularFirestoreCollection<Address>) => {
  const subject = new BehaviorSubject<Address[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Address[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-address-adds',
  templateUrl: './address-adds.component.html',
  styleUrls: ['./address-adds.component.css'],
})
export class AddressAddsComponent {
  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
    private firebaseService: FirebaseService
  ) {}
  address = getObservable(this.store.collection('address')) as Observable<
    Address[]
  >;

  ngOnInit() {}

  editAddress(list: 'address', task: Address) {
    const dialogRef = this.dialog.open(AddressComponent, {
      width: 'auto',
      maxHeight: '90vh',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: AddressResult) => {
      if (!result) {
        return;
      }
      if (result.delete) {
        this.store.collection(list).doc(task.id).delete();
      } else {
        this.store.collection(list).doc(task.id).update(task);
      }
    });
  }

  drop(event: any): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  newAddress(): void {
    const dialogRef = this.dialog.open(AddressComponent, {
      width: 'auto',
      data: {
        task: {},
      },
    });
    dialogRef.afterClosed().subscribe((result: AddressResult) => {
      if (!result) {
        return;
      }
      this.firebaseService.getCurrentUser().subscribe((user) => {
        if (user) {
          const newAddressId = this.store.createId();
          this.store
            .collection('address')
            .doc(newAddressId)
            .set({
              ...result.task,
              userId: user.userId,
              id: newAddressId,
            })
            .then(() => {
              console.log('Document successfully added!');
            })
            .catch((error) => {
              console.error('Error adding document:', error);
            });
        }
      });
    });
  }
}