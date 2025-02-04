import { Component, OnInit } from '@angular/core';
import { ApiService, Movie, Actor, Genre } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Statistics</h1>
    <p><strong>Total Movies:</strong> {{ totalMovies }}</p>
    <p><strong>Total Actors:</strong> {{ totalActors }}</p>
    <p><strong>Total Genres:</strong> {{ totalGenres }}</p>
    <p><strong>Total Oscars:</strong> {{ totalOscars }}</p>
    
    <h3>Oscars per Type</h3>
    <ul>
      <li *ngFor="let key of oscarsPerTypeKeys()">
        {{ formatOscar(key) }}: {{ oscarsPerType[key] }}
      </li>
    </ul>

    <h3>Oscars per Genre</h3>
    <ul>
      <li *ngFor="let genre of genres">
        {{ genre.name }}: {{ oscarsPerGenre[genre.name] || 0 }}
      </li>
    </ul>

    <h3>Movies per Decade</h3>
    <ul>
      <li *ngFor="let decade of moviesPerDecadeKeys()">
        {{ decade }}: {{ moviesPerDecade[decade] }}
      </li>
    </ul>

    <h3>Movies per Genre</h3>
    <ul>
      <li *ngFor="let genre of genres">
        {{ genre.name }}: {{ moviesPerGenre[genre.name] || 0 }}
      </li>
    </ul>

    <p><strong>Actors with no details available:</strong> {{ actorsMissingDetails.length }}</p>
    <ul>
      <li *ngFor="let actor of actorsMissingDetails">
        {{ actor }}
      </li>
    </ul>

    <p><strong>Movies with no details available:</strong> {{ moviesMissingDetails.length }}</p>
    <ul>
      <li *ngFor="let movie of moviesMissingDetails">
        {{ movie }}
      </li>
    </ul>
  `
})
export class StatisticsComponent implements OnInit {
  totalMovies: number = 0;
  totalActors: number = 0;
  totalGenres: number = 0;
  totalOscars: number = 0;
  oscarsPerType: { [key: string]: number } = {};
  oscarsPerGenre: { [genre: string]: number } = {};
  moviesPerDecade: { [decade: string]: number } = {};
  moviesPerGenre: { [genre: string]: number } = {};
  actorsMissingDetails: string[] = [];
  moviesMissingDetails: string[] = [];
  movies: Movie[] = [];
  genres: Genre[] = [];
  actors: Actor[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getMovies().subscribe(movies => {
      this.movies = movies;
      this.totalMovies = movies.length;
      this.calculateOscars();
      this.calculateMoviesPerDecade();
      this.calculateMoviesPerGenre();
      this.findMoviesMissingDetails();
    });
    this.apiService.getGenres().subscribe(genres => {
      this.genres = genres;
      this.totalGenres = genres.length;
    });
    this.apiService.getActors().subscribe(actors => {
      this.actors = actors;
      this.totalActors = actors.length;
      this.findActorsMissingDetails();
    });
  }

  calculateOscars(): void {
    this.totalOscars = 0;
    this.oscarsPerType = {};
    this.movies.forEach(movie => {
      if (movie.oscars) {
        Object.keys(movie.oscars).forEach(key => {
          this.totalOscars++;
          this.oscarsPerType[key] = (this.oscarsPerType[key] || 0) + 1;
          movie.genre.forEach(g => {
            this.oscarsPerGenre[g] = (this.oscarsPerGenre[g] || 0) + 1;
          });
        });
      }
    });
  }
  oscarsPerTypeKeys(): string[] {
    return Object.keys(this.oscarsPerType);
  }
  formatOscar(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
  calculateMoviesPerDecade(): void {
    this.moviesPerDecade = {};
    this.movies.forEach(movie => {
      const decade = Math.floor(movie.year / 10) * 10;
      const decadeLabel = `${decade}s`;
      this.moviesPerDecade[decadeLabel] = (this.moviesPerDecade[decadeLabel] || 0) + 1;
    });
  }
  moviesPerDecadeKeys(): string[] {
    return Object.keys(this.moviesPerDecade);
  }
  calculateMoviesPerGenre(): void {
    this.moviesPerGenre = {};
    this.movies.forEach(movie => {
      movie.genre.forEach(g => {
        this.moviesPerGenre[g] = (this.moviesPerGenre[g] || 0) + 1;
      });
    });
  }
  findActorsMissingDetails(): void {

    this.actorsMissingDetails = this.actors.filter(actor => !actor.birthdate).map(actor => actor.name);
  }
  findMoviesMissingDetails(): void {

    this.moviesMissingDetails = this.movies.filter(movie => !movie.plot).map(movie => movie.title);
  }
}
