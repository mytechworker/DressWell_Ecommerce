import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStartComponent } from './home-start.component';

describe('HomeStartComponent', () => {
  let component: HomeStartComponent;
  let fixture: ComponentFixture<HomeStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
