import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FavoriteItem {
  movieSlug: string;
  movieSnapshot: {
    name: string;
    poster_url?: string;
    year?: number;
  };
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private baseUrl = 'http://localhost:5000/api/v1/favorites';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<FavoriteItem[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      })
    );
  }

  toggleFavorite(movieSlug: string, movieSnapshot: any): Observable<{ isFavorite: boolean; message: string }> {
    return this.http.post<any>(`${this.baseUrl}/toggle`, { movieSlug, movieSnapshot }).pipe(
      map(res => res.data || res)
    );
  }

  checkIsFavorite(movieSlug: string): Observable<boolean> {
    return this.http.get<any>(`${this.baseUrl}/check/${movieSlug}`).pipe(
      map(res => {
        const data = res.data || res;
        return !!data.isFavorite;
      })
    );
  }
}
