import { Component, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../../product';
import { HomeDialogComponent, HomeDialogResult } from '../../../home-dialog/home-dialog.component';

const getObservable = (collection: AngularFirestoreCollection<Product>) => {
  const subject = new BehaviorSubject<Product[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Product[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css'],
})
export class AdminProductComponent {
  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
    private router: Router
  ) {}
  product = getObservable(this.store.collection('product')) as Observable<
    Product[]
  >;
  products: Product[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<Product>([]);
  searchControl = new FormControl();
  searchInput: string = '';
  filteredProducts: Observable<Product[]>;

  ngOnInit() {
    this.product.subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  selectProduct(product: Product) {
    const productId = product.id;
    this.router.navigate(['/product-details', productId]);
    this.searchControl.setValue('');
  }

  editProduct(list: 'product', task: Product) {
    const dialogRef = this.dialog.open(HomeDialogComponent, {
      width: 'auto',
      maxHeight: '90vh',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: HomeDialogResult) => {
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

  newProduct(): void {
    const dialogRef = this.dialog.open(HomeDialogComponent, {
      width: 'auto',
      data: {
        task: {},
      },
    });

    dialogRef.afterClosed().subscribe((result: HomeDialogResult) => {
      if (!result) {
        return;
      }
      const addedProductRef = this.store.collection('product').add(result.task);
      addedProductRef.then((docRef) => {
        const addedProductId = docRef.id;
        docRef.update({
          id: addedProductId,
        });
      });
    });
  }

  toggleDescription(row: Product): void {
    row.showFullDescription = !row.showFullDescription;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}