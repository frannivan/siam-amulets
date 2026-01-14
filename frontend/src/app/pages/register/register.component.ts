import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    formData: RegisterRequest = { firstName: '', lastName: '', email: '', password: '' };
    errorMessage = '';

    constructor(private authService: AuthService) { }

    onSubmit() {
        this.authService.register(this.formData).subscribe({
            next: () => {
                // Redirect handled by auth service
            },
            error: (err) => {
                console.error('Registration failed', err);
                if (err.error && typeof err.error === 'string') {
                    this.errorMessage = err.error;
                } else {
                    this.errorMessage = 'Registration failed. Please try again.';
                }
            }
        });
    }
}
