import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddProduct } from './admin-add-product';

describe('AdminAddProduct', () => {
  let component: AdminAddProduct;
  let fixture: ComponentFixture<AdminAddProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAddProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
