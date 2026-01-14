import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
    private cartService = inject(CartService);
    private orderService = inject(OrderService);
    private router = inject(Router);

    cart = this.cartService.cartSignal;
    currentStep = signal(1);
    loading = signal(false);

    shippingInfo = {
        address: '',
        city: '',
        zipCode: '',
        country: 'Thailand'
    };

    paymentMethod = signal('');

    getFormattedImageUrl(url: string | undefined): string {
        if (!url) return 'https://images.unsplash.com/photo-1620400308241-d52f6d2b3805?q=80&w=400';
        if (url.startsWith('/uploads')) {
            return `${url}`;
        }
        return url;
    }

    get subtotal() { return this.cartService.getCartTotal(); }
    get shipping() { return 15; }
    get total() { return this.subtotal + this.shipping; }

    nextStep() {
        if (this.currentStep() < 3) {
            this.currentStep.update(s => s + 1);
        }
    }

    prevStep() {
        if (this.currentStep() > 1) {
            this.currentStep.update(s => s - 1);
        }
    }

    setPaymentMethod(method: string) {
        this.paymentMethod.set(method);
        this.nextStep();
    }

    placeOrder() {
        this.loading.set(true);
        const request = {
            shippingAddress: `${this.shippingInfo.address}, ${this.shippingInfo.city}, ${this.shippingInfo.zipCode}, ${this.shippingInfo.country}`,
            billingAddress: `${this.shippingInfo.address}, ${this.shippingInfo.city}, ${this.shippingInfo.zipCode}, ${this.shippingInfo.country}`,
            paymentMethod: this.paymentMethod()
        };

        this.orderService.checkout(request).subscribe({
            next: (order) => {
                this.cartService.clearCart();
                this.router.navigate(['/']); // TODO: Success page
                alert('Order placed successfully! Order #' + order.orderNumber);
            },
            error: (err) => {
                console.error('Checkout failed', err);
                this.loading.set(false);
                alert('Checkout failed. Please try again.');
            }
        });
    }
}
