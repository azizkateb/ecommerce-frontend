import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Backend } from '../backend';
import { TopNav } from '../top-nav/top-nav';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , RouterLink,TopNav],
  templateUrl: './admin-add-product.html',
  styleUrl: './admin-add-product.css',
})
export class AdminAddProduct implements OnInit {
  product = { name: '', price: 0, description: '', features: '', imageUrl: '' };
  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private backend: Backend,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      features: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onAddProduct() {
    if (this.productForm.valid) {
      const formValue = this.productForm.getRawValue();
      const productData = {
        name: formValue.name,
        price: Number(formValue.price),
        description: formValue.description,
        features: formValue.features,
        imageUrl: typeof this.imagePreview === 'string' ? this.imagePreview : undefined,
      };

      this.backend.createProduct(productData).subscribe({
        next: (product) => {
          console.log('Product added:', product);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Failed to add product', err);
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
