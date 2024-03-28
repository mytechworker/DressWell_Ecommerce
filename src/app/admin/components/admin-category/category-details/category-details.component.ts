import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryDetails } from '../../../../product';
@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css'],
})
export class CategoryDetailsComponent {
  private backupProduct: Partial<CategoryDetails> = { ...this.data.task };
  constructor(
    public dialogRef: MatDialogRef<CategoryDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryData
  ) {}
  displayedColumns: string[] = ['id', 'name', 'url', 'is_deleted', 'is_active'];
  cancel(): void {
    this.data.task.id = this.backupProduct.id;
    this.data.task.name = this.backupProduct.name;
    this.data.task.url = this.backupProduct.url;
    this.dialogRef.close(this.data);
  }
}
export interface CategoryData {
  task: Partial<CategoryDetails>;
  enableDelete: boolean;
  categories?: CategoryDetails[];
}
export interface CategoryResult {
  task: CategoryDetails;
  delete?: boolean;
}