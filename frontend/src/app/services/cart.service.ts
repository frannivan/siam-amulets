import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = '/api/order/cart'; // Fixed path based on backend structure
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    // Reactive state
    cartSignal = signal<Cart>({ id: 0, items: [] });

    constructor() {
        this.loadInitialCart();

        // Auto-save to localStorage on signal changes (for guests)
        effect(() => {
            const currentCart = this.cartSignal();
            if (!this.authService.isAuthenticated()) {
                localStorage.setItem('gs_cart', JSON.stringify(currentCart));
            }
        });
    }

    private loadInitialCart() {
        const saved = localStorage.getItem('gs_cart');
        if (saved) {
            try {
                this.cartSignal.set(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse local cart', e);
            }
        }

        // If logged in, sync with server
        if (this.authService.isAuthenticated()) {
            this.fetchServerCart();
        }
    }

    fetchServerCart() {
        this.http.get<Cart>(this.apiUrl).subscribe({
            next: (cart) => this.cartSignal.set(cart),
            error: (err) => console.error('Failed to fetch server cart', err)
        });
    }

    addToCart(product: Product, quantity: number = 1): void {
        const current = this.cartSignal();
        const existingIndex = current.items.findIndex(i => i.product.id === product.id);

        if (existingIndex > -1) {
            // Update quantity locally
            const updatedItems = [...current.items];
            updatedItems[existingIndex].quantity += quantity;
            this.cartSignal.set({ ...current, items: updatedItems });
        } else {
            // Add new item locally
            const newItem: CartItem = {
                id: Date.now(), // Temp unique ID for local
                product: product,
                quantity: quantity
            };
            this.cartSignal.set({ ...current, items: [...current.items, newItem] });
        }

        // If logged in, sync to server as well
        if (this.authService.isAuthenticated()) {
            this.http.post<Cart>(`${this.apiUrl}/items`, {
                productId: product.id,
                quantity
            }).subscribe({
                next: (cart) => this.cartSignal.set(cart),
                error: (err) => console.warn('Failed to sync add-to-cart with server', err)
            });
        }
    }

    removeItem(itemId: number): void {
        const current = this.cartSignal();
        this.cartSignal.set({
            ...current,
            items: current.items.filter(i => i.id !== itemId)
        });

        if (this.authService.isAuthenticated()) {
            this.http.delete<Cart>(`${this.apiUrl}/items/${itemId}`).subscribe({
                next: (cart) => this.cartSignal.set(cart),
                error: (err) => console.warn('Failed to sync remove-from-cart with server', err)
            });
        }
    }

    clearCart() {
        this.cartSignal.set({ id: 0, items: [] });
        localStorage.removeItem('gs_cart');
    }

    getCartTotal(): number {
        return this.cartSignal().items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    }

    getItemCount(): number {
        return this.cartSignal().items.reduce((acc, item) => acc + item.quantity, 0);
    }
}
