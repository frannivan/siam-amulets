import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    templateUrl: './footer.component.html',
    styles: [`
    .footer {
      background-color: var(--secondary-color);
      color: #999;
      padding: 2rem 0;
      margin-top: auto;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-links a {
      margin-left: 1rem;
      font-size: 0.9rem;
    }
    .footer-links a:hover {
      color: var(--white);
    }
  `]
})
export class FooterComponent { }
