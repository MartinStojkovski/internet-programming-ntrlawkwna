
import { Component, OnInit } from '@angular/core';
import { ApiService, Actor } from '../../services/api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actor-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="actor">
      <h1>{{ actor.name }}</h1>
      <p><strong>ID:</strong> {{ actor.id }}</p>
      <p><strong>Birthdate:</strong> {{ actor.birthdate }}</p>
      <p><strong>Height:</strong> {{ actor.height }} cm</p>
      <p><strong>Nationality:</strong> {{ actor.nationality }}</p>
      <div *ngIf="actor.notable_works && actor.notable_works.length">
        <h3>Notable Works</h3>
        <ul>
          <li *ngFor="let work of sortedNotableWorks()">
            <a [routerLink]="['/movies', getMovieId(work)]">{{ work }}</a>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class ActorDetailsComponent implements OnInit {
  actor: Actor | null = null;
  // In a real app, you would map movie titles to IDs.
  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apiService.getActorById(id).subscribe(actor => this.actor = actor);
  }

  sortedNotableWorks(): string[] {
    if (!this.actor || !this.actor.notable_works) { return []; }
    return this.actor.notable_works.sort((a, b) => a.localeCompare(b));
  }

  getMovieId(title: string): number {
    
    return 0;
  }
}
