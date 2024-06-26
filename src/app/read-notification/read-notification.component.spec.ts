import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadNotificationComponent } from './read-notification.component';

describe('ReadNotificationComponent', () => {
  let component: ReadNotificationComponent;
  let fixture: ComponentFixture<ReadNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReadNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
