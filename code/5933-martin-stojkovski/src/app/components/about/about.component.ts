
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>About</h1>
    <p>Name: John Doe</p>
    <p>Student ID: 123456</p>
    <p>Current Year: {{ currentYear }}</p>
    <p>GitHub Repository: <a href="https://github.com/username/repo" target="_blank">https://github.com/username/repo</a></p>
  `
})
export class AboutComponent {
  currentYear: number = new Date().getFullYear();
}
