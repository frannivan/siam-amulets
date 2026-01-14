import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    loading = false;

    constructor(
        private productService: ProductService,
        public authService: AuthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        console.log('ProductListComponent: ngOnInit. Auth State:', this.authService.isAuthenticated());
        // Small delay to ensure everything is initialized
        setTimeout(() => {
            this.loadProducts();
        }, 300);
    }

    loadProducts() {
        console.log('ProductListComponent: Loading products...');
        this.loading = true;
        this.cdr.detectChanges();

        this.productService.getProducts(0, 100).subscribe({
            next: (page) => {
                console.log('ProductListComponent: Received:', page);
                if (page && page.content) {
                    this.products = page.content;
                } else {
                    this.products = [];
                }
                this.loading = false;
                this.cdr.detectChanges(); // Force UI update
            },
            error: (err) => {
                console.error('ProductListComponent: Error:', err);
                this.products = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deleteProduct(id: number) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe(() => {
                this.loadProducts(); // Refresh list
            });
        }
    }

    getPrimaryImage(product: Product): string {
        if (!product.images || product.images.length === 0) {
            return 'https://images.unsplash.com/photo-1620400308241-d52f6d2b3805?q=80&w=400';
        }
        const thumb = product.images.find(img => img.isThumbnail);
        const url = thumb ? thumb.imageUrl : product.images[0].imageUrl;

        // If it's a local path, prepend the backend URL
        if (url.startsWith('/uploads')) {
            return `${url}`;
        }
        return url;
    }
}
