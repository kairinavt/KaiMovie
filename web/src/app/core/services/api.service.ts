import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface MovieItem {
  _id?: string | number;
  name: string;
  origin_name: string;
  slug: string;
  poster_url: string;
  thumb_url: string;
  year?: number;
  quality?: string;
  lang?: string;
  episode_current?: string;
  tmdb?: { vote_average?: string | number };
  imdb?: { id?: string };
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: boolean;
  items: T[];
  pagination: Pagination | null;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private get baseUrl(): string {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api/v1/movies';
      }
      if (window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.')) {
        return `http://${window.location.hostname}:5000/api/v1/movies`;
      }
    }
    return 'https://vsmov.com/api';
  }

  private get serverBaseUrl(): string {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api/v1';
      }
      if (window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.')) {
        return `http://${window.location.hostname}:5000/api/v1`;
      }
    }
    return 'http://localhost:5000/api/v1';
  }

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('kaimovie_token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  private extractListResponse(res: any): ApiResponse<MovieItem> {
    const rawData = res?.data || res;
    const items = rawData?.items || rawData?.data?.items || (Array.isArray(rawData) ? rawData : []);
    const pagination = rawData?.pagination || rawData?.data?.pagination || null;
    return {
      status: true,
      items: Array.isArray(items) ? items : [],
      pagination
    };
  }

  getLatestMovies(page: number = 1): Observable<ApiResponse<MovieItem>> {
    return this.http.get<any>(`${this.baseUrl}/danh-sach/phim-moi-cap-nhat?page=${page}`).pipe(
      map(res => this.extractListResponse(res))
    );
  }

  getMovieList(slug: string, page: number = 1): Observable<ApiResponse<MovieItem>> {
    return this.http.get<any>(`${this.baseUrl}/danh-sach/${slug}?page=${page}`).pipe(
      map(res => this.extractListResponse(res))
    );
  }

  getByCategory(slug: string, page: number = 1): Observable<ApiResponse<MovieItem>> {
    const listSlugs = ['phim-bo', 'phim-le', 'hoat-hinh', 'tv-shows', 'phim-sap-chieu', 'phim-dang-chieu'];
    if (listSlugs.includes(slug)) {
      return this.getMovieList(slug, page);
    }
    return this.http.get<any>(`${this.baseUrl}/the-loai/${slug}?page=${page}`).pipe(
      map(res => this.extractListResponse(res))
    );
  }

  getByCountry(slug: string, page: number = 1): Observable<ApiResponse<MovieItem>> {
    return this.http.get<any>(`${this.baseUrl}/quoc-gia/${slug}?page=${page}`).pipe(
      map(res => this.extractListResponse(res))
    );
  }

  getByYear(year: string | number, page: number = 1): Observable<ApiResponse<MovieItem>> {
    return this.http.get<any>(`${this.baseUrl}/nam-phat-hanh/${year}?page=${page}`).pipe(
      map(res => this.extractListResponse(res))
    );
  }

  searchMovies(keyword: string, limit: number = 24): Observable<ApiResponse<MovieItem>> {
    return this.http.get<any>(`${this.baseUrl}/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=${limit}`).pipe(
      map(res => this.extractListResponse(res))
    );
  }

  getMovieDetail(slug: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/phim/${slug}`).pipe(
      map(res => {
        const rawData = res?.data || res;
        return {
          movie: rawData?.movie || null,
          episodes: rawData?.episodes || []
        };
      })
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/the-loai`).pipe(
      map(res => {
        const rawData = res?.data || res;
        const items = rawData?.data?.items || rawData?.items || (Array.isArray(rawData) ? rawData : []);
        return Array.isArray(items) ? items : [];
      })
    );
  }

  getCountries(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/quoc-gia`).pipe(
      map(res => {
        const rawData = res?.data || res;
        const items = rawData?.data?.items || rawData?.items || (Array.isArray(rawData) ? rawData : []);
        return Array.isArray(items) ? items : [];
      })
    );
  }

  getYears(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/nam-phat-hanh`).pipe(
      map(res => {
        const rawData = res?.data || res;
        const items = rawData?.data?.items || rawData?.items || (Array.isArray(rawData) ? rawData : []);
        return Array.isArray(items) ? items : [];
      })
    );
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return 'assets/placeholder-poster.png';
    if (typeof path === 'string' && (path.startsWith('http://') || path.startsWith('https://'))) {
      return path;
    }
    return `https://vsmov.com/storage/images/${path}`;
  }

  // Watch History Endpoints with Auth Header & Persistent Storage
  saveWatchProgress(payload: { movieSlug: string; movieName?: string; posterUrl?: string; episodeSlug?: string; episodeName?: string; currentTime: number; duration: number }): Observable<any> {
    return this.http.post<any>(`${this.serverBaseUrl}/history/progress`, payload, { headers: this.getAuthHeaders() }).pipe(
      catchError(() => {
        const localRaw = localStorage.getItem('kaimovie_local_history');
        let history = localRaw ? JSON.parse(localRaw) : [];
        history = history.filter((h: any) => h.movieSlug !== payload.movieSlug);
        history.unshift({
          ...payload,
          updatedAt: new Date().toISOString()
        });
        localStorage.setItem('kaimovie_local_history', JSON.stringify(history.slice(0, 30)));
        return of({ success: true });
      })
    );
  }

  getWatchHistory(): Observable<any[]> {
    return this.http.get<any>(`${this.serverBaseUrl}/history`, { headers: this.getAuthHeaders() }).pipe(
      map(res => {
        const serverItems = res?.data || [];
        const localRaw = localStorage.getItem('kaimovie_local_history');
        const localItems = localRaw ? JSON.parse(localRaw) : [];
        return [...localItems, ...serverItems];
      }),
      catchError(() => {
        const localRaw = localStorage.getItem('kaimovie_local_history');
        const localItems = localRaw ? JSON.parse(localRaw) : [];
        return of(localItems);
      })
    );
  }

  // Movie Comments & Rating Endpoints with Auth Header & Persistent Local Store
  getMovieComments(movieSlug: string): Observable<any> {
    return this.http.get<any>(`${this.serverBaseUrl}/comments/${movieSlug}`).pipe(
      map(res => {
        const serverComments = res?.data?.comments || [];
        const localKey = `kaimovie_comments_${movieSlug}`;
        const localRaw = localStorage.getItem(localKey);
        const localComments = localRaw ? JSON.parse(localRaw) : [];

        const combined = [...localComments, ...serverComments];
        let avg = 5;
        if (combined.length > 0) {
          const sum = combined.reduce((acc: number, curr: any) => acc + (curr.rating || 5), 0);
          avg = Number((sum / combined.length).toFixed(1));
        }

        return {
          comments: combined,
          totalComments: combined.length,
          avgRating: avg
        };
      }),
      catchError(() => {
        const localKey = `kaimovie_comments_${movieSlug}`;
        const localRaw = localStorage.getItem(localKey);
        const localComments = localRaw ? JSON.parse(localRaw) : [];
        let avg = 5;
        if (localComments.length > 0) {
          const sum = localComments.reduce((acc: number, curr: any) => acc + (curr.rating || 5), 0);
          avg = Number((sum / localComments.length).toFixed(1));
        }

        return of({
          comments: localComments,
          totalComments: localComments.length,
          avgRating: avg
        });
      })
    );
  }

  addMovieComment(movieSlug: string, content: string, rating: number): Observable<any> {
    return this.http.post<any>(`${this.serverBaseUrl}/comments/${movieSlug}`, { content, rating }, { headers: this.getAuthHeaders() }).pipe(
      catchError(() => {
        const storedUserRaw = localStorage.getItem('kaimovie_user');
        const user = storedUserRaw ? JSON.parse(storedUserRaw) : { name: 'Thành Viên' };

        const localKey = `kaimovie_comments_${movieSlug}`;
        const existingRaw = localStorage.getItem(localKey);
        const existing = existingRaw ? JSON.parse(existingRaw) : [];

        const newComment = {
          _id: 'c-' + Date.now(),
          userId: user.id || 'user-1',
          userName: user.name || 'Thành Viên',
          movieSlug,
          content,
          rating,
          createdAt: new Date().toISOString()
        };
        existing.unshift(newComment);
        localStorage.setItem(localKey, JSON.stringify(existing));

        return of({ success: true, data: newComment });
      })
    );
  }
}
