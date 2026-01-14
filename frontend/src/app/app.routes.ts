import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ProductListComponent } from './pages/admin/product-list/product-list.component';
import { ProductFormComponent } from './pages/admin/product-form/product-form.component';
import { ProductDetailComponent } from './pages/shop/product-detail/product-detail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'product/:slug', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'products', component: ProductListComponent },
            { path: 'products/new', component: ProductFormComponent },
            { path: 'products/edit/:id', component: ProductFormComponent },
            {
                path: 'users',
                loadComponent: () => import('./pages/admin/users/users.component').then(m => m.AdminUsersComponent)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
