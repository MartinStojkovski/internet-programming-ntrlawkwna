
import { Component } from '@angular/core';
import { ApiService, Movie } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cast-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h1>Add Cast Member</h1>
      <form (ngSubmit)="addCast()">
        <div>
          <label>Actor Name:</label>
          <input type="text" [(ngModel)]="actorName" name="actorName" required />
        </div>
        <div>
          <label>Character:</label>
          <input type="text" [(ngModel)]="character" name="character" required />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  `
})
export class CastCreateComponent {
  actorName: string = '';
  character: string = '';
  movieId: number = 0;
  movie: Movie | null = null;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.apiService.getMovieById(this.movieId).subscribe(movie => this.movie = movie);
  }

  addCast(): void {
    if (this.movie) {
      if (!this.movie.cast) { this.movie.cast = []; }
      this.movie.cast.push({ actor: this.actorName, character: this.character });
      this.apiService.updateMovie(this.movie.id, this.movie).subscribe(() => {
        this.router.navigate(['/movies', this.movie!.id]);
      });
    }
  }
}
