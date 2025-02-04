
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  year: number;
  director: string;
  genre: string[];
  plot?: string;
  cast?: {
    actor: string;
    character: string;
  }[];
  oscars?: { [key: string]: string };
  rating?: number;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
  birthdate?: string;
  height?: number;
  nationality?: string;
  notable_works?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }


  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`);
  }
  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}`);
  }
  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/movies`, movie);
  }
  updateMovie(id: number, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/movies/${id}`, movie);
  }
  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/movies/${id}`);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}/genres`);
  }

  getActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.apiUrl}/actors`);
  }
  getActorById(id: number): Observable<Actor> {
    return this.http.get<Actor>(`${this.apiUrl}/actors/${id}`);
  }
  getActorByName(name: string): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${this.apiUrl}/actors?name=${encodeURIComponent(name)}`);
  }
}
