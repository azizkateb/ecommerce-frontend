import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProduct } from './all-product';

describe('AllProduct', () => {
  let component: AllProduct;
  let fixture: ComponentFixture<AllProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(AllProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
