import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensClothingComponent } from './mens-clothing.component';

describe('MensClothingComponent', () => {
  let component: MensClothingComponent;
  let fixture: ComponentFixture<MensClothingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MensClothingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensClothingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
