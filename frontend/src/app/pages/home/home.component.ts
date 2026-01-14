import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslatePipe],
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = true;
  errorMsg = '';
  searchQuery = '';

  // Carousel State
  currentSlide = 0;

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    this.loadProducts();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchQuery = query;
      this.loadProducts(query);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  loadProducts(search: string = '') {
    this.loading = true;
    this.productService.getProducts(0, 12, search).subscribe({
      next: (page) => {
        // Initialize currentIndex for each product for the per-card carousel
        this.products = page.content.map(p => ({ ...p, currentIndex: 0 }));
        this.loading = false;
        this.cdr.detectChanges(); // Force refresh on first load
      },
      error: (err) => {
        console.error('Failed to load products for home', err);
        this.errorMsg = 'Failed to load catalog.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getHeroImage(product: any): string {
    if (!product.images || product.images.length === 0) {
      return 'https://images.unsplash.com/photo-1620400308241-d52f6d2b3805?q=80&w=400';
    }
    const url = product.images[0].imageUrl; // Always index 0 for Hero
    if (url.startsWith('/uploads')) {
      return `${url}`;
    }
    return url;
  }

  getPrimaryImage(product: any): string {
    if (!product.images || product.images.length === 0) {
      return 'https://images.unsplash.com/photo-1620400308241-d52f6d2b3805?q=80&w=400';
    }
    // Use the per-card currentIndex if it exists, otherwise use 0
    const idx = product.currentIndex || 0;
    const url = product.images[idx]?.imageUrl || product.images[0].imageUrl;

    if (url.startsWith('/uploads')) {
      return `${url}`;
    }
    return url;
  }

  // Carousel Logic for Main Hero
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.products.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.products.length) % this.products.length;
  }

  // Carousel Logic for Individual Cards in Grid
  nextImage(event: MouseEvent, product: any) {
    event.stopPropagation();
    event.preventDefault();
    if (product.images && product.images.length > 0) {
      product.currentIndex = (product.currentIndex + 1) % product.images.length;
    }
  }

  prevImage(event: MouseEvent, product: any) {
    event.stopPropagation();
    event.preventDefault();
    if (product.images && product.images.length > 0) {
      product.currentIndex = (product.currentIndex - 1 + product.images.length) % product.images.length;
    }
  }

  addToCart(event: MouseEvent, product: any) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(product, 1);
  }
}
