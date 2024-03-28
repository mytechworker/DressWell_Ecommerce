import { Component, Inject } from '@angular/core';
import { CategoryResult } from '../admin-category/category-details/category-details.component';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { SubcategoryDetailsComponent } from './subcategory-details/subcategory-details.component';
import { CategoryDetails } from '../../../product';

const getObservable = (
  collection: AngularFirestoreCollection<CategoryDetails>) => {
  const subject = new BehaviorSubject<CategoryDetails[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: CategoryDetails[]) => {
      subject.next(val);
    });
  return subject;
};

@Component({
  selector: 'app-admin-subcategory',
  templateUrl: './admin-subcategory.component.html',
  styleUrls: ['./admin-subcategory.component.css'],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
})
export class AdminSubCategoryComponent {
  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  subcategory = getObservable(
    this.store.collection('subcategory')
  ) as Observable<CategoryDetails[]>;

  category = getObservable(this.store.collection('category')) as Observable<CategoryDetails[]>;
  categories: CategoryDetails[] = [];
  selectedCategory: string = '';
  selectedCategoryId: string = '';

  ngOnInit() {
    if (this.data && this.data.categories && this.data.categories.length) {
      this.categories = this.data.categories;
      this.selectedCategoryId = this.categories[0].id;
    }
    this.generateCategories();
  }

  generateCategories() {
    this.category.subscribe((response) => {
      this.categories = response;
      if (this.categories && this.categories.length > 0) {
        this.selectedCategory = this.categories[0].id;
      }
    });
  }

  editCategory(list: 'subcategory', task: CategoryDetails) {
    const dialogRef = this.dialog.open(SubcategoryDetailsComponent, {
      width: 'auto',
      maxHeight: '90vh',
      data: {
        task,
        enableDelete: true,
        categories: this.categories,
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

  newCategory(): void {
    const dialogRef = this.dialog.open(SubcategoryDetailsComponent, {
      width: 'auto',
      data: {
        task: {},
      },
    });
    dialogRef.afterClosed().subscribe((result: CategoryResult) => {
      if (!result) {
        return;
      }
      this.store.collection('subcategory').add(result.task);
    });
  }
  navigateToExternalUrl(url: string): void {
    window.open(url, '_blank');
  }
  categoryChange(value: string) {
    this.selectedCategoryId = value;
  }
}