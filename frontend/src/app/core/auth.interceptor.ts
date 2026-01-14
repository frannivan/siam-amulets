import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Lazy injection to avoid circular dependency: AuthService -> HttpClient -> Interceptor -> AuthService
    const injector = inject(Injector);
    const authService = injector.get(AuthService);
    const token = authService.getToken();

    console.log('AuthInterceptor: Intercepting request to', req.url, 'Token found:', !!token);

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('AuthInterceptor: Token attached to request');
        return next(cloned);
    }

    return next(req);
};
