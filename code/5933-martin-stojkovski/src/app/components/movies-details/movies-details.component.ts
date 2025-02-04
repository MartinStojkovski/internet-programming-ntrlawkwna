import { Component, OnInit } from '@angular/core';
import { ApiService, Movie } from '../../services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="movie">
      <h1>{{ movie.title }} ({{ movie.year }})</h1>
      <p><strong>ID:</strong> {{ movie.id }}</p>
      <p><strong>Director:</strong> {{ movie.director }}</p>
      <p><strong>Plot:</strong> {{ movie.plot }}</p>
      <p><strong>Genres:</strong></p>
      <ul>
        <li *ngFor="let g of movie.genre">{{ g }}</li>
      </ul>
      <p><strong>Rating:</strong> {{ movie.rating }}</p>
      
    
      <div *ngIf="movie.oscars">
        <h3>Oscars:</h3>
        <ul>
          <li *ngFor="let oscar of sortedOscars()">
            {{ formatOscar(oscar.key) }}: {{ oscar.value }}
          </li>
        </ul>
      </div>
      
     
      <div *ngIf="movie.cast">
        <h3>Cast:</h3>
        <ul>
          <li *ngFor="let castMember of sortedCast()">
            <ng-container *ngIf="actorLinks[castMember.actor]; else plainName">
              <a [routerLink]="['/actor', actorLinks[castMember.actor]]">{{ castMember.actor }}</a>
            </ng-container>
            <ng-template #plainName>
              {{ castMember.actor }}
            </ng-template>
            as {{ castMember.character }}
          </li>
        </ul>
      </div>

     
      <div *ngIf="similarMovies.length">
        <h3>Similar Movies (Same Genre):</h3>
        <ul>
          <li *ngFor="let m of similarMovies">
            <a [routerLink]="['/movies', m.id]">{{ m.title }}</a>
          </li>
        </ul>
      </div>

    
      <div *ngIf="similarDirectorMovies.length">
        <h3>Other Movies by {{ movie.director }}:</h3>
        <ul>
          <li *ngFor="let m of similarDirectorMovies">
            <a [routerLink]="['/movies', m.id]">{{ m.title }}</a>
          </li>
        </ul>
      </div>

     
      <button (click)="editMovie()">Edit</button>
      <button (click)="deleteMovie()">Delete</button>
      <button (click)="addCast()">Add Cast</button>
    </div>
  `,
  styles: [`
    ul { list-style-type: none; padding: 0; }
    li { margin: 5px 0; }
  `]
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  similarMovies: Movie[] = [];
  similarDirectorMovies: Movie[] = [];
  actorLinks: { [name: string]: number } = {};

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
  }

  loadMovie(id: number): void {
    this.apiService.getMovieById(id).subscribe(movie => {
      this.movie = movie;
      this.loadSimilarMovies();
      this.loadSimilarDirectorMovies();
      this.loadActorLinks();
    });
  }

  loadSimilarMovies(): void {
    if (!this.movie) { return; }
    this.apiService.getMovies().subscribe(movies => {
      this.similarMovies = movies.filter(m =>
        m.id !== this.movie!.id &&
        m.genre &&
        this.movie!.genre &&
        m.genre.some(g => this.movie!.genre!.includes(g))
      ).sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  loadSimilarDirectorMovies(): void {
    if (!this.movie) { return; }
    this.apiService.getMovies().subscribe(movies => {
      this.similarDirectorMovies = movies.filter(m =>
        m.id !== this.movie!.id &&
        m.director === this.movie!.director
      ).sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  loadActorLinks(): void {
    if (!this.movie || !this.movie.cast) { return; }
    
    this.movie.cast.forEach(castMember => {
      this.apiService.getActorByName(castMember.actor).subscribe(actors => {
        if (actors && actors.length > 0) {
          this.actorLinks[castMember.actor] = actors[0].id;
        }
      });
    });
  }

  sortedOscars() {
    if (!this.movie || !this.movie.oscars) { return []; }
    const oscarsArray = Object.keys(this.movie.oscars).map(key => ({ key, value: this.movie!.oscars![key] }));
    return oscarsArray.sort((a, b) => a.key.localeCompare(b.key));
  }

  formatOscar(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  sortedCast() {
    if (!this.movie || !this.movie.cast) { return []; }
    return this.movie.cast.sort((a, b) => a.actor.localeCompare(b.actor));
  }

  editMovie(): void {
    if (this.movie)
      this.router.navigate(['/movies', this.movie.id, 'edit']);
  }
  deleteMovie(): void {
    if (this.movie && confirm('Are you sure you want to delete this movie?')) {
      this.apiService.deleteMovie(this.movie.id).subscribe(() => {
        this.router.navigate(['/movies']);
      });
    }
  }
  addCast(): void {
    if (this.movie)
      this.router.navigate(['/movies', this.movie.id, 'cast', 'add']);
  }
}
