import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslatePipe],
    templateUrl: './cart.component.html'
})
export class CartComponent {
    cartService = inject(CartService);
    cart = this.cartService.cartSignal;

    getFormattedImageUrl(url: string | undefined): string {
        if (!url) return 'https://images.unsplash.com/photo-1620400308241-d52f6d2b3805?q=80&w=400';
        if (url.startsWith('/uploads')) {
            return `${url}`;
        }
        return url;
    }

    updateQuantity(productId: number, delta: number) {
        const item = this.cart().items.find(i => i.product.id === productId);
        if (item) {
            const newQty = item.quantity + delta;
            if (newQty > 0) {
                this.cartService.addToCart(item.product, delta);
            }
        }
    }

    removeItem(itemId: number) {
        this.cartService.removeItem(itemId);
    }

    get subtotal() {
        return this.cartService.getCartTotal();
    }

    get shipping() {
        return this.subtotal > 0 ? 15 : 0; // Fixed shipping for now
    }

    get total() {
        return this.subtotal + this.shipping;
    }
}
