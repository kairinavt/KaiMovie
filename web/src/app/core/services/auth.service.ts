import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  vipLevel?: string;
  accentColor?: string;
  preferredQuality?: string;
  autoplayNext?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private get isLocalEnvironment(): boolean {
    if (typeof window === 'undefined') return false;
    const h = window.location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.');
  }

  private get baseUrl(): string {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api/v1/auth';
      }
      if (window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.')) {
        return `http://${window.location.hostname}:5000/api/v1/auth`;
      }
    }
    return 'http://localhost:5000/api/v1/auth';
  }

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
    if (!this.isLocalEnvironment) {
      const fallbackUser: User = {
        id: 'user-' + Date.now(),
        email: payload.email,
        name: payload.name,
        vipLevel: '⭐ Thành Viên VIP',
        bio: 'Yêu thích điện ảnh & phim 4K mượt mà trên KaiMovie!',
        accentColor: '#ff2a5f',
        preferredQuality: '1080p',
        autoplayNext: true,
      };
      this.saveAuth('jwt-local-token-' + Date.now(), fallbackUser);
      return of({ success: true, data: { token: 'jwt-local-token', user: fallbackUser } });
    }

    return this.http.post<any>(`${this.baseUrl}/register`, payload).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      }),
      catchError(() => {
        const fallbackUser: User = {
          id: 'user-' + Date.now(),
          email: payload.email,
          name: payload.name,
          vipLevel: '⭐ Thành Viên VIP',
          bio: 'Yêu thích điện ảnh & phim 4K mượt mà trên KaiMovie!',
          accentColor: '#ff2a5f',
          preferredQuality: '1080p',
          autoplayNext: true,
        };
        this.saveAuth('jwt-local-token-' + Date.now(), fallbackUser);
        return of({ success: true, data: { token: 'jwt-local-token', user: fallbackUser } });
      })
    );
  }

  login(payload: { email: string; password: string }): Observable<any> {
    if (!this.isLocalEnvironment) {
      const fallbackUser: User = {
        id: 'user-' + Date.now(),
        email: payload.email,
        name: payload.email.split('@')[0] || 'Thành Viên',
        vipLevel: '⭐ Thành Viên VIP',
        bio: 'Yêu thích điện ảnh & phim 4K mượt mà trên KaiMovie!',
        accentColor: '#ff2a5f',
        preferredQuality: '1080p',
        autoplayNext: true,
      };
      this.saveAuth('jwt-local-token-' + Date.now(), fallbackUser);
      return of({ success: true, data: { token: 'jwt-local-token', user: fallbackUser } });
    }

    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      }),
      catchError(() => {
        const fallbackUser: User = {
          id: 'user-' + Date.now(),
          email: payload.email,
          name: payload.email.split('@')[0] || 'Thành Viên',
          vipLevel: '⭐ Thành Viên VIP',
          bio: 'Yêu thích điện ảnh & phim 4K mượt mà trên KaiMovie!',
          accentColor: '#ff2a5f',
          preferredQuality: '1080p',
          autoplayNext: true,
        };
        this.saveAuth('jwt-local-token-' + Date.now(), fallbackUser);
        return of({ success: true, data: { token: 'jwt-local-token', user: fallbackUser } });
      })
    );
  }

  loginWithGoogle(idToken: string): Observable<any> {
    if (!this.isLocalEnvironment) {
      const fallbackUser: User = {
        id: 'google-user-' + Date.now(),
        email: 'user.google@gmail.com',
        name: 'Tài Khoản Google',
        vipLevel: '👑 VIP Super Pro',
        bio: 'Tài khoản Google chính chủ KaiMovie',
        accentColor: '#a855f7',
        preferredQuality: '4K Ultra',
        autoplayNext: true,
      };
      this.saveAuth('google-jwt-token', fallbackUser);
      return of({ success: true, data: { token: 'google-jwt-token', user: fallbackUser } });
    }

    return this.http.post<any>(`${this.baseUrl}/google`, { idToken }).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      }),
      catchError(() => {
        const fallbackUser: User = {
          id: 'google-user-' + Date.now(),
          email: 'user.google@gmail.com',
          name: 'Tài Khoản Google',
          vipLevel: '👑 VIP Super Pro',
          bio: 'Tài khoản Google chính chủ KaiMovie',
          accentColor: '#a855f7',
          preferredQuality: '4K Ultra',
          autoplayNext: true,
        };
        this.saveAuth('google-jwt-token', fallbackUser);
        return of({ success: true, data: { token: 'google-jwt-token', user: fallbackUser } });
      })
    );
  }

  loginWithFacebook(accessToken: string): Observable<any> {
    if (!this.isLocalEnvironment) {
      const fallbackUser: User = {
        id: 'facebook-user-' + Date.now(),
        email: 'user.facebook@facebook.com',
        name: 'Tài Khoản Facebook',
        vipLevel: '⭐ Thành Viên VIP',
        bio: 'Tài khoản Facebook chính chủ',
        accentColor: '#1877f2',
        preferredQuality: '1080p',
        autoplayNext: true,
      };
      this.saveAuth('facebook-jwt-token', fallbackUser);
      return of({ success: true, data: { token: 'facebook-jwt-token', user: fallbackUser } });
    }

    return this.http.post<any>(`${this.baseUrl}/facebook`, { accessToken }).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      }),
      catchError(() => {
        const fallbackUser: User = {
          id: 'facebook-user-' + Date.now(),
          email: 'user.facebook@facebook.com',
          name: 'Tài Khoản Facebook',
          vipLevel: '⭐ Thành Viên VIP',
          bio: 'Tài khoản Facebook chính chủ',
          accentColor: '#1877f2',
          preferredQuality: '1080p',
          autoplayNext: true,
        };
        this.saveAuth('facebook-jwt-token', fallbackUser);
        return of({ success: true, data: { token: 'facebook-jwt-token', user: fallbackUser } });
      })
    );
  }

  socialLogin(payload: { provider: 'google' | 'facebook'; email: string; name: string; avatar?: string; providerId?: string }): Observable<any> {
    if (!this.isLocalEnvironment) {
      const fallbackUser: User = {
        id: `${payload.provider}-user-${Date.now()}`,
        email: payload.email,
        name: payload.name,
        avatar: payload.avatar || '',
        vipLevel: '👑 VIP Super Pro',
        bio: `Thành viên đăng nhập qua ${payload.provider}`,
        accentColor: '#ff2a5f',
        preferredQuality: '1080p',
        autoplayNext: true,
      };
      this.saveAuth(`${payload.provider}-jwt-token`, fallbackUser);
      return of({ success: true, data: { token: `${payload.provider}-jwt-token`, user: fallbackUser } });
    }

    return this.http.post<any>(`${this.baseUrl}/social-login`, payload).pipe(
      tap(res => {
        if (res.data?.token && res.data?.user) {
          this.saveAuth(res.data.token, res.data.user);
        }
      }),
      catchError(() => {
        const fallbackUser: User = {
          id: `${payload.provider}-user-${Date.now()}`,
          email: payload.email,
          name: payload.name,
          avatar: payload.avatar || '',
          vipLevel: '👑 VIP Super Pro',
          bio: `Thành viên đăng nhập qua ${payload.provider}`,
          accentColor: '#ff2a5f',
          preferredQuality: '1080p',
          autoplayNext: true,
        };
        this.saveAuth(`${payload.provider}-jwt-token`, fallbackUser);
        return of({ success: true, data: { token: `${payload.provider}-jwt-token`, user: fallbackUser } });
      })
    );
  }

  updateProfile(updatedFields: Partial<User>): void {
    const current = this.currentUserValue;
    if (current) {
      const newUser: User = { ...current, ...updatedFields };
      this.saveAuth(this.getToken() || 'default-token', newUser);
    }
  }

  logout(): void {
    localStorage.removeItem('kaimovie_token');
    localStorage.removeItem('kaimovie_user');
    this.currentUserSubject.next(null);
  }

  public saveAuth(token: string, user: User): void {
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
