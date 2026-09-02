import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private baseUrl = 'http://localhost:5000/api/v1/movies';

  constructor(private http: HttpClient) {}

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
}
