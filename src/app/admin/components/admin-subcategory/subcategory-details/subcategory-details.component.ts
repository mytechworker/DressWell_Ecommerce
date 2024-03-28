import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryData } from '../../admin-category/category-details/category-details.component';
import { CategoryDetails } from '../../../../product';

@Component({
  selector: 'app-subcategory-details',
  templateUrl: './subcategory-details.component.html',
  styleUrls: ['./subcategory-details.component.css'],
})
export class SubcategoryDetailsComponent implements OnInit {
  @Input() category: CategoryDetails;
  selectedCategory: string = '';
  selectedCategoryId: string = '';
  categories: CategoryDetails[] = [];
  private backupProduct: Partial<CategoryDetails> = { ...this.data.task };

  constructor(
    public dialogRef: MatDialogRef<SubcategoryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryData
  ) {}

  displayedColumns: string[] = ['id', 'name', 'url', 'is_deleted', 'is_active'];

  ngOnInit(): void {
    if (this.data && this.data.categories && this.data.categories.length) {
      this.categories = this.data.categories;
      this.selectedCategoryId = this.categories[0].id;
    }
  }

  cancel(): void {
    this.data.task.id = this.backupProduct.id;
    this.data.task.name = this.backupProduct.name;
    this.data.task.url = this.backupProduct.url;
    this.dialogRef.close(this.data);
  }

  categoryChange(value: string) {
    this.selectedCategoryId = value;
  }
}