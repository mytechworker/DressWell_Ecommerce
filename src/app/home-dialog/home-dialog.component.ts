import { Component, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoryDetails, Product } from '../product';

const getObservable = (collection: AngularFirestoreCollection<CategoryDetails>) => {
  const subject = new BehaviorSubject<CategoryDetails[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: CategoryDetails[]) => {
      subject.next(val);
    });
  return subject;
};

@Component({
  selector: 'app-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.css'],
})
export class HomeDialogComponent {
  private backupProduct: Partial<Product> = { ...this.data.task };
  selectedCategoryId: string = '';
  selectedCategory: string = '';
  categories: CategoryDetails[] = [];
  category = getObservable(this.store.collection('category')) as Observable<CategoryDetails[]>;
  searchInput: string = '';
  searchControl = new FormControl();
  constructor(
    private store: AngularFirestore,
    public dialogRef: MatDialogRef<HomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HomeDialogData
  ) {
    this.selectedCategory = this.data.task.category || '';
  }

  ngOnInit() {
    this.generateCategories();

    if (this.data.task.category) {
      const selectedCategory = this.categories.find(
        (category) => category.id === this.data.task.category
      );
      if (selectedCategory) {
        this.selectedCategory = selectedCategory.name;
      }
    } else if (this.categories && this.categories.length > 0) {
      this.selectedCategory = this.categories[0].name;
    }
  }

  generateCategories() {
    this.category.subscribe((response) => {
      this.categories = response;
    });
  }

  cancel(): void {
    this.data.task.image = this.backupProduct.image;
    this.data.task.name = this.backupProduct.name;
    this.data.task.price = this.backupProduct.price;
    this.data.task.color = this.backupProduct.color;
    this.data.task.category = this.backupProduct.category;
    this.data.task.description = this.backupProduct.description;
    this.dialogRef.close(this.data);
  }

  categoryChange(value: string) {
    this.selectedCategoryId = value;
    this.data.task.category = value;
  }
}

export interface HomeDialogData {
  task: Partial<Product>;
  enableDelete: boolean;
}

export interface HomeDialogResult {
  task: Product;
  delete?: boolean;
}