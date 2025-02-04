
import { Component, OnInit } from '@angular/core';
import { ApiService, Movie, Genre } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="movie">
      <h1>Edit Movie</h1>
      <form (ngSubmit)="saveMovie()">
        <div>
          <label>ID:</label>
          <input type="text" [value]="movie.id" readonly />
        </div>
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
        
        <div *ngIf="movie.oscars">
          <h3>Oscars</h3>
          <div *ngFor="let key of getOscarKeys()">
            <label>{{ formatOscar(key) }}:</label>
            <input type="text" [(ngModel)]="movie.oscars[key]" [name]="'oscar_' + key" />
            <button type="button" (click)="removeOscar(key)">Remove</button>
          </div>
          <div>
            <input type="text" [(ngModel)]="newOscarKey" placeholder="Oscar Type" name="newOscarKey" />
            <input type="text" [(ngModel)]="newOscarValue" placeholder="Recipient" name="newOscarValue" />
            <button type="button" (click)="addOscar()">Add Oscar</button>
          </div>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  `,
  styles: [`
    div { margin-bottom: 10px; }
    label { display: inline-block; width: 100px; }
    input, textarea, select { width: 300px; }
  `]
})
export class MovieEditComponent implements OnInit {
  movie: Movie | null = null;
  genres: Genre[] = [];
  selectedGenre: string = '';
  newOscarKey: string = '';
  newOscarValue: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getMovieById(id).subscribe(movie => {
      this.movie = movie;
      if (!this.movie.oscars) {
        this.movie.oscars = {};
      }
    });
  }
  

  saveMovie(): void {
    if (this.movie) {
      
      this.movie.genre = [this.selectedGenre];
      this.apiService.updateMovie(this.movie.id, this.movie).subscribe(updated => {
        this.router.navigate(['/movies', updated.id]);
      });
    }
  }

  getOscarKeys(): string[] {
    return this.movie && this.movie.oscars ? Object.keys(this.movie.oscars) : [];
  }
  formatOscar(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
  removeOscar(key: string): void {
    if (this.movie && this.movie.oscars) {
      delete this.movie.oscars[key];
    }
  }
  addOscar(): void {
    if (this.newOscarKey && this.newOscarValue && this.movie) {
      if (!this.movie.oscars) { this.movie.oscars = {}; }
      this.movie.oscars[this.newOscarKey] = this.newOscarValue;
      this.newOscarKey = '';
      this.newOscarValue = '';
    }
  }
}
