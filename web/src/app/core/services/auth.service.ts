import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserValue;
  }

  getToken(): string | null {
    return localStorage.getItem('kaimovie_token');
  }

  register(payload: { email: string; password: string; name: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, payload).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      })
    );
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      })
    );
  }

  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/google`, { idToken }).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      })
    );
  }

  loginWithFacebook(accessToken: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/facebook`, { accessToken }).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      })
    );
  }

  socialLogin(payload: { provider: 'google' | 'facebook'; email: string; name: string; avatar?: string; providerId?: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/social-login`, payload).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('kaimovie_token');
    localStorage.removeItem('kaimovie_user');
    this.currentUserSubject.next(null);
  }

  private saveAuth(token: string, user: User): void {
    localStorage.setItem('kaimovie_token', token);
    localStorage.setItem('kaimovie_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem('kaimovie_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
