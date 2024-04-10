import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'timestampToDate' })
export class TimestampToDatePipe implements PipeTransform {
  transform(timestamp: any): string | null {
    if (timestamp && timestamp.seconds && typeof timestamp.seconds === 'number') {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(timestamp.seconds * 1000, 'medium'); // Convert seconds to milliseconds
    }
    return null;
  }
}