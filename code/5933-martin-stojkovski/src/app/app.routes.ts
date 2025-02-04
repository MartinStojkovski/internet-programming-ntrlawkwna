
import { Routes } from '@angular/router';
import { MoviesListComponent } from './components/movies-list/movies-list.component';
import { MovieDetailsComponent } from './components/movies-details/movies-details.component';
import { MovieEditComponent } from './components/movie-edit/movie-edit.component';
import { MovieCreateComponent } from './components/movie-create/movie-create.component';
import { ActorDetailsComponent } from './components/actor-details/actor-details.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AboutComponent } from './components/about/about.component';
import { CastCreateComponent } from './components/cast-create/cast-create.component';

export const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
  { path: 'movies', component: MoviesListComponent },
  { path: 'movies/create', component: MovieCreateComponent },
  { path: 'movies/:id', component: MovieDetailsComponent },
  { path: 'movies/:id/edit', component: MovieEditComponent },
  { path: 'movies/:id/cast/add', component: CastCreateComponent },
  { path: 'actor/:id', component: ActorDetailsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '/movies' }
];
