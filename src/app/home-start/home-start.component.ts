import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../product';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

const getObservable = (collection: AngularFirestoreCollection<Product>) => {
  const subject = new BehaviorSubject<Product[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Product[]) => {
    subject.next(val);
  });
  return subject;
};
@Component({
  selector: 'app-home-start',
  templateUrl: './home-start.component.html',
  styleUrl: './home-start.component.css',
})
export class HomeStartComponent {
  @Input() task: Product | null = null;
  constructor(private store: AngularFirestore) {}
  product = getObservable(this.store.collection('product')) as Observable<Product[]>;
}
