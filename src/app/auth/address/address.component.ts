import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Address } from '../../product';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent {
  private backupProduct: Partial<Address> = { ...this.data.task };
  constructor(
    public dialogRef: MatDialogRef<AddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddressData
  ) {}

  cancel(): void {
    this.data.task.country = this.backupProduct.country;
    this.data.task.pincode = this.backupProduct.pincode;
    this.data.task.house = this.backupProduct.house;
    this.data.task.area = this.backupProduct.area;
    this.data.task.landmark = this.backupProduct.landmark;
    this.data.task.city = this.backupProduct.city;
    this.data.task.state = this.backupProduct.state;
    this.dialogRef.close(this.data);
  }
}

export interface AddressData {
  task: Partial<Address>;
  enableDelete: boolean;
}

export interface AddressResult {
  task: Address;
  delete?: boolean;
}
