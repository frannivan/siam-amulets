import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';

    isAuthenticated = signal<boolean>(this.hasToken());
    isAdmin = signal<boolean>(this.checkIfAdmin());

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => this.setSession(response.token))
        );
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap(response => this.setSession(response.token))
        );
    }

    logout() {
        localStorage.removeItem('token');
        this.isAuthenticated.set(false);
        this.isAdmin.set(false);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    private setSession(token: string) {
        localStorage.setItem('token', token);
        this.isAuthenticated.set(true);
        this.isAdmin.set(this.checkIfAdmin());

        // Redirect based on role
        if (this.isAdmin()) {
            this.router.navigate(['/admin']);
        } else {
            this.router.navigate(['/']);
        }
    }

    private hasToken(): boolean {
        return !!localStorage.getItem('token');
    }

    private checkIfAdmin(): boolean {
        const token = this.getToken();
        if (!token) return false;
        try {
            // Simple base64 decode of JWT payload (2nd part)
            const p = JSON.parse(atob(token.split('.')[1]));
            const roles = p.role || p.roles || p.authorities || [];

            if (typeof roles === 'string') {
                return roles === 'ADMIN' || roles === 'ROLE_ADMIN';
            }
            if (Array.isArray(roles)) {
                return roles.some((r: string) => r === 'ADMIN' || r === 'ROLE_ADMIN');
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}
