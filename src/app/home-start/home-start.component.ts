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
  productCollection: AngularFirestoreCollection<Product>;
  product: Observable<Product[]>;

  ngOnInit() {
    this.productCollection = this.store.collection<Product>('product', ref => ref.limit(3));
    this.product = getObservable(this.productCollection);
  }
}