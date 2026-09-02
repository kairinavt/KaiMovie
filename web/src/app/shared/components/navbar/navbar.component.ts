import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="navbar">
      <div class="container navbar-container">
        <!-- Brand Logo -->
        <a routerLink="/" class="logo" (click)="closeMobileMenu()">
          <div class="logo-badge">K</div>
          <span class="logo-text">Kai<span>Movie</span></span>
        </a>

        <!-- Desktop Nav Links -->
        <nav class="nav-menu">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Trang chủ</a>
          <a [routerLink]="['/the-loai', 'phim-bo']" routerLinkActive="active" class="nav-link">🎬 Phim Bộ</a>
          <a [routerLink]="['/the-loai', 'phim-le']" routerLinkActive="active" class="nav-link">📽️ Phim Lẻ</a>
          <a routerLink="/yeu-thich" routerLinkActive="active" class="nav-link">❤️ Yêu thích</a>

          <!-- Thể loại Dropdown -->
          <div class="dropdown">
            <span class="nav-link dropdown-toggle">Thể loại ▾</span>
            <div class="dropdown-menu">
              <a *ngFor="let cat of categories" [routerLink]="['/the-loai', cat.slug]" class="dropdown-item">
                {{ cat.name }}
              </a>
            </div>
          </div>

          <!-- Quốc gia Dropdown -->
          <div class="dropdown">
            <span class="nav-link dropdown-toggle">Quốc gia ▾</span>
            <div class="dropdown-menu">
              <a *ngFor="let country of countries" [routerLink]="['/quoc-gia', country.slug]" class="dropdown-item">
                {{ country.name }}
              </a>
            </div>
          </div>
        </nav>

        <!-- Right Side: APK Download, Search, User Auth & Mobile Toggle -->
        <div class="right-nav">
          <!-- Desktop APK Download Button -->
          <a href="http://192.168.100.115:5000/downloads/kaimovie-app.apk" download="kaimovie-app.apk" class="btn btn-apk-download desktop-only" title="Tải ứng dụng Android APK">
            <span>📱 Tải App APK</span>
          </a>

          <div class="search-box">
            <input
              type="text"
              placeholder="Tìm phim..."
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
            />
            <button (click)="onSearch()" class="search-btn" aria-label="Search">
              🔍
            </button>
          </div>

          <!-- Desktop User Menu -->
          <div class="user-menu desktop-only" *ngIf="currentUser; else loginBtn">
            <span class="user-name">👤 {{ currentUser.name }}</span>
            <button class="logout-btn" (click)="onLogout()" title="Đăng xuất">
              Đăng xuất
            </button>
          </div>

          <ng-template #loginBtn>
            <a routerLink="/dang-nhap" class="btn btn-primary btn-sm desktop-only">
              🔑 Đăng Nhập
            </a>
          </ng-template>

          <!-- Mobile Hamburger Menu Button -->
          <button class="mobile-toggle-btn" (click)="toggleMobileMenu()" aria-label="Toggle Navigation">
            <span *ngIf="!mobileMenuOpen">☰</span>
            <span *ngIf="mobileMenuOpen">✕</span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation Drawer -->
      <div class="mobile-drawer" *ngIf="mobileMenuOpen">
        <nav class="mobile-nav">
          <a href="http://192.168.100.115:5000/downloads/kaimovie-app.apk" download="kaimovie-app.apk" class="mobile-apk-banner" (click)="closeMobileMenu()">
            <span>📱 Tải App KaiMovie (Android APK)</span>
          </a>
          <a routerLink="/" class="mobile-nav-link" (click)="closeMobileMenu()">🏠 Trang chủ</a>
          <a [routerLink]="['/the-loai', 'phim-bo']" class="mobile-nav-link" (click)="closeMobileMenu()">🎬 Phim Bộ</a>
          <a [routerLink]="['/the-loai', 'phim-le']" class="mobile-nav-link" (click)="closeMobileMenu()">📽️ Phim Lẻ</a>
          <a [routerLink]="['/the-loai', 'hoat-hinh']" class="mobile-nav-link" (click)="closeMobileMenu()">🐉 Hoạt Hình</a>
          <a [routerLink]="['/the-loai', 'tv-shows']" class="mobile-nav-link" (click)="closeMobileMenu()">📺 TV Shows</a>
          <a routerLink="/yeu-thich" class="mobile-nav-link" (click)="closeMobileMenu()">❤️ Phim Yêu Thích</a>

          <!-- Mobile Categories Dropdown Section -->
          <div class="mobile-section-title">📂 Thể Loại Phim</div>
          <div class="mobile-chips-grid">
            <a
              *ngFor="let cat of categories"
              [routerLink]="['/the-loai', cat.slug]"
              class="mobile-chip"
              (click)="closeMobileMenu()">
              {{ cat.name }}
            </a>
          </div>

          <!-- Mobile Auth Actions -->
          <div class="mobile-auth-bar">
            <div *ngIf="currentUser; else mobileLogin" class="mobile-user-info">
              <span>👤 {{ currentUser.name }}</span>
              <button class="btn btn-secondary btn-sm" (click)="onLogout(); closeMobileMenu()">Đăng xuất</button>
            </div>
            <ng-template #mobileLogin>
              <a routerLink="/dang-nhap" class="btn btn-primary btn-block-mobile" (click)="closeMobileMenu()">
                🔑 Đăng Nhập / Đăng Ký
              </a>
            </ng-template>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(9, 11, 16, 0.9);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-bottom: 1px solid var(--border-color);
      padding: 0.8rem 0;
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .logo-badge {
      width: 38px;
      height: 38px;
      background: var(--primary-gradient);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.4rem;
      color: #fff;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
      span { color: var(--primary); }
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-link {
      font-weight: 600;
      color: var(--text-muted);
      font-size: 0.95rem;
      cursor: pointer;
      padding: 0.4rem 0;
      transition: color 0.25s ease;

      &:hover, &.active {
        color: #fff;
      }
    }

    .btn-apk-download {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 0.45rem 0.9rem;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);
      transition: all 0.3s ease;
      text-decoration: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
        color: #fff;
      }
    }

    .mobile-apk-banner {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      font-weight: 800;
      font-size: 0.95rem;
      padding: 0.8rem 1rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
      margin-bottom: 0.5rem;
      text-decoration: none;
      display: block;
    }

    .dropdown {
      position: relative;

      &:hover .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 240px;
      max-height: 360px;
      overflow-y: auto;
      background: rgba(18, 22, 34, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.6rem;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.25s ease;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.25rem;
    }

    .dropdown-item {
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      border-radius: var(--radius-sm);

      &:hover {
        background: var(--bg-hover);
        color: #fff;
      }
    }

    .right-nav {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-color);
      border-radius: 30px;
      padding: 0.25rem 0.5rem 0.25rem 1rem;
      width: 180px;
      transition: all 0.3s ease;

      &:focus-within {
        border-color: var(--primary);
        box-shadow: 0 0 12px var(--primary-glow);
        width: 220px;
      }
    }

    .search-box input {
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 0.88rem;
      width: 100%;
    }

    .search-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.2rem 0.4rem;
      color: var(--text-muted);

      &:hover { color: #fff; }
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(255,255,255,0.06);
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      border: 1px solid var(--border-color);
    }

    .user-name {
      font-size: 0.88rem;
      font-weight: 600;
      color: #fff;
    }

    .logout-btn {
      background: transparent;
      border: none;
      color: #ef4444;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;

      &:hover { text-decoration: underline; }
    }

    .mobile-toggle-btn {
      display: none;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--border-color);
      color: #fff;
      font-size: 1.25rem;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
    }

    /* Mobile Drawer */
    .mobile-drawer {
      display: block;
      background: rgba(14, 18, 28, 0.98);
      border-bottom: 1px solid var(--border-color);
      padding: 1.2rem;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8);
      max-height: 80vh;
      overflow-y: auto;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .mobile-nav-link {
      font-size: 1.05rem;
      font-weight: 600;
      color: #fff;
      padding: 0.5rem 0.8rem;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.04);
    }

    .mobile-section-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
      margin-top: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .mobile-chips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .mobile-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-muted);
      padding: 0.5rem;
      border-radius: 8px;
      font-size: 0.82rem;
      text-align: center;
    }

    .mobile-auth-bar {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .btn-block-mobile {
      width: 100%;
      text-align: center;
      padding: 0.75rem;
      border-radius: 25px;
    }

    .mobile-user-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      font-weight: 600;
    }

    @media (max-width: 850px) {
      .nav-menu { display: none; }
      .desktop-only { display: none; }
      .mobile-toggle-btn { display: flex; }
      .search-box { width: 130px; }
      .search-box:focus-within { width: 160px; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  searchQuery = '';
  categories: any[] = [];
  countries: any[] = [];
  currentUser: User | null = null;
  mobileMenuOpen = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.apiService.getCategories().subscribe({
      next: (res) => {
        if (Array.isArray(res)) this.categories = res;
      },
      error: () => {}
    });

    this.apiService.getCountries().subscribe({
      next: (res) => {
        if (Array.isArray(res)) this.countries = res;
      },
      error: () => {}
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.closeMobileMenu();
      this.router.navigate(['/tim-kiem'], { queryParams: { keyword: this.searchQuery.trim() } });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }
}
