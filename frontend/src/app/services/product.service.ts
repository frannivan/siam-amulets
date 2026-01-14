import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { Page, Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = '/api/catalog/products';

    constructor(private http: HttpClient) { }

    getProducts(page: number = 0, size: number = 10, search: string = ''): Observable<Page<Product>> {
        let url = `${this.apiUrl}?page=${page}&size=${size}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        console.log(`ProductService: Fetching products from ${url}`);
        return this.http.get<Page<Product>>(url)
            .pipe(timeout(5000));
    }

    getProductBySlug(slug: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${slug}`);
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/id/${id}`);
    }

    createProduct(product: any): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    updateProduct(id: number, product: any): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    uploadImage(file: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', file);
        // Backend returns the path as a plain string, so we need responseType: 'text'
        return this.http.post('/api/catalog/images/upload', formData, { responseType: 'text' });
    }
}
