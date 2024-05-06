import { Component, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { CategoryDetailsComponent, CategoryResult } from '../category-details/category-details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryDetails } from '../../../../product';

const getObservable = ( collection: AngularFirestoreCollection<CategoryDetails>) => {
  const subject = new BehaviorSubject<CategoryDetails[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: CategoryDetails[]) => {
      subject.next(val);
    });
  return subject;
};

@Component({
  selector: 'app-category-product',
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.css'],
})
export class CategoryProductComponent {
  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
  ) {}
  category = getObservable(this.store.collection('category')) as Observable<
    CategoryDetails[]
  >;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<CategoryDetails>([]);
  ngOnInit() {
    this.category.subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  editCategory(list: 'category', task: CategoryDetails) {
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      width: 'auto',
      maxHeight: '90vh',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: CategoryResult) => {
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

  newCategory(): void {
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      width: 'auto',
      data: {
        task: {},
      },
    });
    dialogRef.afterClosed().subscribe((result: CategoryResult) => {
      if (!result) {
        return;
      }
      const addedCategoryRef = this.store
        .collection('category')
        .add(result.task);

      addedCategoryRef.then((docRef) => {
        const addedCategoryId = docRef.id;
        docRef.update({
          id: addedCategoryId,
        });
      });
    });
  }

  navigateToExternalUrl(url: string): void {
    window.open(url, '_blank');
  }
}