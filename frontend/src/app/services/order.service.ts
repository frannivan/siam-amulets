import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckoutRequest {
    shippingAddress: string;
    billingAddress: string;
    paymentMethod: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = '/api/orders';
    private http = inject(HttpClient);

    checkout(request: CheckoutRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/checkout`, request);
    }

    getMyOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my-orders`);
    }
}
