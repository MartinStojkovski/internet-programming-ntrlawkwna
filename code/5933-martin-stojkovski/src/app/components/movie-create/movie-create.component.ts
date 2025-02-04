
import { Component } from '@angular/core';
import { ApiService, Movie, Genre } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Create New Movie</h1>
    <form (ngSubmit)="createMovie()">
      <div>
        <label>Title:</label>
        <input type="text" [(ngModel)]="movie.title" name="title" required />
      </div>
      <div>
        <label>Year:</label>
        <input type="number" [(ngModel)]="movie.year" name="year" required />
      </div>
      <div>
        <label>Plot:</label>
        <textarea [(ngModel)]="movie.plot" name="plot"></textarea>
      </div>
      <div>
        <label>Director:</label>
        <input type="text" [(ngModel)]="movie.director" name="director" required />
      </div>
      <div>
        <label>Genre:</label>
        <select [(ngModel)]="selectedGenre" name="genre">
          <option *ngFor="let genre of genres" [value]="genre.name">{{ genre.name }}</option>
        </select>
      </div>
      <div>
        <label>Rating:</label>
        <input type="number" [(ngModel)]="movie.rating" name="rating" />
      </div>
      
      <div>
        <h3>Oscars</h3>
        <div *ngFor="let key of getOscarKeys()">
          <label>{{ formatOscar(key) }}:</label>
          <input type="text" [(ngModel)]="movie.oscars![key]" [name]="'oscar_' + key" />

          <button type="button" (click)="removeOscar(key)">Remove</button>
        </div>
        <div>
          <input type="text" [(ngModel)]="newOscarKey" placeholder="Oscar Type" name="newOscarKey" />
          <input type="text" [(ngModel)]="newOscarValue" placeholder="Recipient" name="newOscarValue" />
          <button type="button" (click)="addOscar()">Add Oscar</button>
        </div>
      </div>
      <button type="submit">Create</button>
    </form>
  `,
  styles: [`
    div { margin-bottom: 10px; }
    label { display: inline-block; width: 100px; }
    input, textarea, select { width: 300px; }
  `]
})
export class MovieCreateComponent {
  movie: Movie = {
    id: 0,
    title: '',
    year: new Date().getFullYear(),
    director: '',
    genre: [],
    plot: '',
    cast: [],
    oscars: {},
    rating: 0
  };
  genres: Genre[] = [];
  selectedGenre: string = '';
  newOscarKey: string = '';
  newOscarValue: string = '';

  constructor(private apiService: ApiService, private router: Router) {
   
    this.movie.id = Date.now();
    this.movie.oscars = {};
  }

  ngOnInit(): void {
    this.apiService.getGenres().subscribe(genres => this.genres = genres);
  }

  createMovie(): void {
    this.movie.genre = [this.selectedGenre];
    this.apiService.createMovie(this.movie).subscribe(created => {
      this.router.navigate(['/movies', created.id]);
    });
  }

  getOscarKeys(): string[] {
    return this.movie.oscars ? Object.keys(this.movie.oscars) : [];
  }
  formatOscar(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
  removeOscar(key: string): void {
    if (this.movie.oscars) { delete this.movie.oscars[key]; }
  }
  addOscar(): void {
    if (this.newOscarKey && this.newOscarValue) {
      if (!this.movie.oscars) { this.movie.oscars = {}; }
      this.movie.oscars[this.newOscarKey] = this.newOscarValue;
      this.newOscarKey = '';
      this.newOscarValue = '';
    }
  }
}
