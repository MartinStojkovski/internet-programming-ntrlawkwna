
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <p>&copy; {{ currentYear }} - Student ID: 123456, Name: John Doe - <a routerLink="/about">About</a></p>
    </footer>
  `,
  styles: [`
    .footer {
      background: #eee;
      padding: 10px;
      text-align: center;
      position: fixed;
      bottom: 0;
      width: 100%;
    }
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
