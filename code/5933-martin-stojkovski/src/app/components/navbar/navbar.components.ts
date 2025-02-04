
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <a routerLink="/movies">Movies</a> |
      <a routerLink="/statistics">Statistics</a> |
      <a routerLink="/about">About</a>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #eee;
      padding: 10px;
    }
    a {
      margin-right: 10px;
      text-decoration: none;
    }
  `]
})
export class NavbarComponent { }
