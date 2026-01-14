import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  langService = inject(LanguageService);

  switchLanguage(lang: string) {
    this.langService.setLanguage(lang);
  }

  logout() {
    this.authService.logout();
  }
}
