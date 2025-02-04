
import { Component, OnInit } from '@angular/core';
import { ApiService, Movie } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Movies List</h1>
    <button (click)="addMovie()">Add Movie</button>
    
    <!-- Filters -->
    <div class="filters">
      <input type="text" placeholder="Title" [(ngModel)]="filterTitle" (input)="applyFilters()" />
      <input type="number" placeholder="Year" [(ngModel)]="filterYear" (input)="applyFilters()" />
      <select [(ngModel)]="filterGenre" (change)="applyFilters()">
        <option value="">All Genres</option>
        <option *ngFor="let genre of genres" [value]="genre.name">{{ genre.name }}</option>
      </select>
      <input type="number" placeholder="Rating" [(ngModel)]="filterRating" (input)="applyFilters()" />
    </div>

    <table>
      <thead>
        <tr>
          <th (click)="sort('id')">ID {{ getSortIcon('id') }}</th>
          <th (click)="sort('title')">Title {{ getSortIcon('title') }}</th>
          <th (click)="sort('year')">Year {{ getSortIcon('year') }}</th>
          <th (click)="sort('director')">Director {{ getSortIcon('director') }}</th>
          <th (click)="sort('genre')">Genre {{ getSortIcon('genre') }}</th>
          <th (click)="sort('oscars')">Oscars {{ getSortIcon('oscars') }}</th>
          <th (click)="sort('rating')">Rating {{ getSortIcon('rating') }}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let movie of filteredMovies">
          <td>{{ movie.id }}</td>
          <td>{{ movie.title }}</td>
          <td>{{ movie.year }}</td>
          <td>{{ movie.director }}</td>
          <td>{{ movie.genre ? movie.genre.join(' / ') : '' }}</td>
          <td>{{ getOscarsCount(movie) }}</td>
          <td>{{ movie.rating }}</td>
          <td>
            <button (click)="viewMovie(movie.id)">View</button>
            <button (click)="editMovie(movie.id)">Edit</button>
            <button (click)="deleteMovie(movie.id)">Delete</button>
          
            <button (click)="addCast(movie.id)">Add Cast</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th { cursor: pointer; border-bottom: 1px solid #ccc; padding: 5px; }
    td { border-bottom: 1px solid #eee; padding: 5px; }
    .filters input, .filters select { margin-right: 10px; }
  `]
})
export class MoviesListComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  genres: { id: string, name: string }[] = [];


  filterTitle: string = '';
  filterYear: number | null = null;
  filterGenre: string = '';
  filterRating: number | null = null;


  sortField: string = '';
  sortAsc: boolean = true;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadMovies();
    this.apiService.getGenres().subscribe(genres => this.genres = genres);
  }

  loadMovies(): void {
    this.apiService.getMovies().subscribe(movies => {
      this.movies = movies;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesTitle = this.filterTitle ? movie.title.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;
      const matchesYear = this.filterYear ? movie.year === this.filterYear : true;
      const matchesGenre = this.filterGenre ? (movie.genre && movie.genre.includes(this.filterGenre)) : true;
      const matchesRating = this.filterRating ? (movie.rating !== undefined && movie.rating >= this.filterRating) : true;
      return matchesTitle && matchesYear && matchesGenre && matchesRating;
    });
    this.sortMovies();
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.sortMovies();
  }

  sortMovies(): void {
    this.filteredMovies.sort((a, b) => {
      let aField: any = a[this.sortField as keyof Movie];
      let bField: any = b[this.sortField as keyof Movie];
  
   
      if (this.sortField === 'oscars') {
        aField = a.oscars ? Object.keys(a.oscars).length : 0;
        bField = b.oscars ? Object.keys(b.oscars).length : 0;
      }
      if (this.sortField === 'genre') {
        aField = a.genre ? a.genre.length : 0;
        bField = b.genre ? b.genre.length : 0;
      }
  
      if (aField < bField) return this.sortAsc ? -1 : 1;
      if (aField > bField) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }
  

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '';
    return this.sortAsc ? '↑' : '↓';
  }

  getOscarsCount(movie: Movie): number {
    return movie.oscars ? Object.keys(movie.oscars).length : 0;
  }

  viewMovie(id: number): void {
    this.router.navigate(['/movies', id]);
  }
  editMovie(id: number): void {
    this.router.navigate(['/movies', id, 'edit']);
  }
  deleteMovie(id: number): void {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.apiService.deleteMovie(id).subscribe(() => {
        this.loadMovies();
      });
    }
  }
  addMovie(): void {
    this.router.navigate(['/movies/create']);
  }
  addCast(id: number): void {
    this.router.navigate(['/movies', id, 'cast', 'add']);
  }
}
