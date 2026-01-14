import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    credentials: LoginRequest = { email: 'admin@amulets.siam', password: 'admin123' };
    errorMessage = '';

    constructor(private authService: AuthService) { }

    onSubmit() {
        this.authService.login(this.credentials).subscribe({
            next: () => {
                // Redirect handled by auth service
            },
            error: (err) => {
                console.error('Login failed', err);
                this.errorMessage = 'Invalid email or password';
            }
        });
    }
}
