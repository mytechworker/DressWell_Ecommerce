import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDocument } from '../../../../product';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent {
  private backupProduct: Partial<UserDocument> = { ...this.data.task };
  constructor(
    public dialogRef: MatDialogRef<UserAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserData
  ) {}
  cancel(): void {
    this.data.task.name = this.backupProduct.name;
    this.data.task.email = this.backupProduct.email;
    this.data.task.access = this.backupProduct.access;
    this.data.task.password = this.backupProduct.password;
    this.data.task.userId = this.backupProduct.userId;
    this.data.task.id = this.backupProduct.id;
    this.dialogRef.close(this.data);
  }
}
export interface UserData {
  task: Partial<UserDocument>;
  enableDelete: boolean;
  categories?: UserDocument[];
}

export interface UserResult {
  task: UserDocument;
  delete?: boolean;
}