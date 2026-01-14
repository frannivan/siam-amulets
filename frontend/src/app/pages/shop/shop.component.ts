import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop.component.html',
  styles: []
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  debugMessage = 'Initializing...';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.debugMessage = 'Fetching products from Service...';
    this.productService.getProducts().subscribe({
      next: (page) => {
        this.debugMessage = `Success! Loaded ${page.content.length} products.`;
        this.products = page.content;
        this.loading = false;
      },
      error: (err) => {
        const msg = err.message || JSON.stringify(err);
        this.debugMessage = `Error: ${msg}`;
        console.error('Failed to load products', err);
        this.loading = false;
        // Mock data for demo if backend not running
        this.products = [
          {
            id: 1, name: 'Phra Somdej (Demo)', description: 'Demo amulet', price: 150, sku: 'D1', slug: 'demo-1', active: true,
            images: [{ imageUrl: 'https://images.unsplash.com/photo-1620400308241-d52f6d2b3805?q=80&w=400', isThumbnail: true }]
          },
          {
            id: 2, name: 'Bronze Buddha (Demo)', description: 'Demo statue', price: 299, sku: 'D2', slug: 'demo-2', active: true,
            images: [{ imageUrl: 'https://images.unsplash.com/photo-1562678564-9bd4b84081c7?q=80&w=400', isThumbnail: true }]
          }
        ];
      }
    });
  }

  getPrimaryImage(product: Product): string {
    if (!product.images || product.images.length === 0) {
      return 'https://images.unsplash.com/photo-1620400308241-d52f6d2b3805?q=80&w=400';
    }
    // Always use index 0 as main/cover logic
    const url = product.images[0].imageUrl;

    // If it's a local path, prepend the backend URL
    if (url.startsWith('/uploads')) {
      return `${url}`;
    }
    return url;
  }
}
