
import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.components';
import { FooterComponent } from './components/footer/footer.components';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .container {
      margin: 20px;
      padding-bottom: 60px;  
    }
  `]
})
export class AppComponent { }
