import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.model';
import { switchMap } from 'rxjs/operators';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  product?: Product;
  loading = true;
  selectedImage: string | null = null;
  currentIndex = 0;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        if (slug) {
          return this.productService.getProductBySlug(slug);
        }
        throw new Error('No slug found');
      })
    ).subscribe({
      next: (product) => {
        this.product = product;
        if (product.images && product.images.length > 0) {
          this.selectedImage = this.getFormattedImageUrl(product.images[0].imageUrl);
          this.currentIndex = 0;
        }
        this.loading = false;
        this.cdr.detectChanges(); // Fix "Second Click" issue
      },
      error: (err) => {
        console.error('Failed to load product detail', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getFormattedImageUrl(url: string): string {
    if (!url) return 'https://images.unsplash.com/photo-1620400308241-d52f6d2b3805?q=80&w=800';
    if (url.startsWith('/uploads')) {
      return `${url}`;
    }
    return url;
  }

  selectImage(url: string, index: number) {
    this.selectedImage = this.getFormattedImageUrl(url);
    this.currentIndex = index;
  }

  nextImage() {
    if (this.product && this.product.images) {
      this.currentIndex = (this.currentIndex + 1) % this.product.images.length;
      this.selectedImage = this.getFormattedImageUrl(this.product.images[this.currentIndex].imageUrl);
    }
  }

  prevImage() {
    if (this.product && this.product.images) {
      this.currentIndex = (this.currentIndex - 1 + this.product.images.length) % this.product.images.length;
      this.selectedImage = this.getFormattedImageUrl(this.product.images[this.currentIndex].imageUrl);
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, 1);
      // Optional: Add a subtle toast or feedback here instead of alert
    }
  }
}
