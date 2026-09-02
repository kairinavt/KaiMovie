import { Component, OnInit, HostListener } from '@angular/core';
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
    <header class="navbar" [class.scrolled]="isScrolled">
      <div class="container navbar-container">
        <!-- Brand Logo -->
        <a routerLink="/" class="logo" (click)="closeMobileMenu()">
          <div class="logo-badge">K</div>
          <span class="logo-text">Kai<span>Movie</span></span>
        </a>

        <!-- Desktop Navigation Menu -->
        <nav class="nav-menu">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <span>Trang Chủ</span>
          </a>
          <a [routerLink]="['/the-loai', 'phim-bo']" routerLinkActive="active" class="nav-link">
            <span>Phim Bộ</span>
          </a>
          <a [routerLink]="['/the-loai', 'phim-le']" routerLinkActive="active" class="nav-link">
            <span>Phim Lẻ</span>
          </a>
          <a [routerLink]="['/the-loai', 'hoat-hinh']" routerLinkActive="active" class="nav-link">
            <span>Hoạt Hình</span>
          </a>
          <a routerLink="/yeu-thich" routerLinkActive="active" class="nav-link">
            <span>Yêu Thích</span>
          </a>

          <!-- Thể loại Mega Dropdown -->
          <div class="dropdown">
            <span class="nav-link dropdown-toggle">
              <span>Thể Loại</span> <i class="chevron">▾</i>
            </span>
            <div class="dropdown-menu mega-menu">
              <div class="dropdown-header">DANH SÁCH THỂ LOẠI</div>
              <div class="dropdown-grid">
                <a *ngFor="let cat of categories" [routerLink]="['/the-loai', cat.slug]" class="dropdown-item">
                  <span class="item-dot">•</span> {{ cat.name }}
                </a>
              </div>
            </div>
          </div>

          <!-- Quốc gia Mega Dropdown -->
          <div class="dropdown">
            <span class="nav-link dropdown-toggle">
              <span>Quốc Gia</span> <i class="chevron">▾</i>
            </span>
            <div class="dropdown-menu mega-menu">
              <div class="dropdown-header">QUỐC GIA PHÁT HÀNH</div>
              <div class="dropdown-grid">
                <a *ngFor="let country of countries" [routerLink]="['/quoc-gia', country.slug]" class="dropdown-item">
                  <span class="item-dot">•</span> {{ country.name }}
                </a>
              </div>
            </div>
          </div>
        </nav>

        <!-- Right Navigation Utilities -->
        <div class="right-nav">
          <!-- Desktop APK Download Button -->
          <a href="http://192.168.100.115:5000/downloads/kaimovie-app.apk" download="kaimovie-app.apk" class="btn-apk-download desktop-only" title="Tải ứng dụng KaiMovie APK cho Android">
            <span class="pulse-dot"></span>
            <span>📱 Tải App APK</span>
          </a>

          <!-- Search Box Input -->
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm phim..."
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
            />
            <button *ngIf="searchQuery" (click)="searchQuery = ''" class="clear-btn">✕</button>
          </div>

          <!-- Desktop User Profile Badge & Menu -->
          <div class="user-profile desktop-only" *ngIf="currentUser; else loginBtn">
            <a routerLink="/trang-ca-nhan" class="avatar-pill" title="Trang Cá Nhân">
              <div class="avatar-circle">{{ getInitials(currentUser.name) }}</div>
              <span class="user-name">{{ currentUser.name }}</span>
            </a>
            <button class="logout-icon-btn" (click)="onLogout()" title="Đăng xuất">
              🚪
            </button>
          </div>

          <ng-template #loginBtn>
            <a routerLink="/dang-nhap" class="btn btn-primary btn-sm desktop-only login-badge-btn">
              🔑 Đăng Nhập
            </a>
          </ng-template>

          <!-- Mobile Hamburger Toggle Button -->
          <button class="mobile-toggle-btn" (click)="toggleMobileMenu()" aria-label="Toggle Mobile Navigation">
            <span *ngIf="!mobileMenuOpen">☰</span>
            <span *ngIf="mobileMenuOpen">✕</span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div class="mobile-drawer" *ngIf="mobileMenuOpen">
        <nav class="mobile-nav">
          <a href="http://192.168.100.115:5000/downloads/kaimovie-app.apk" download="kaimovie-app.apk" class="mobile-apk-banner" (click)="closeMobileMenu()">
            <span class="pulse-dot-light"></span>
            <span>📱 Tải App KaiMovie Cho Android (87MB)</span>
          </a>

          <a routerLink="/" class="mobile-nav-link" (click)="closeMobileMenu()">🏠 Trang Chủ</a>
          <a [routerLink]="['/the-loai', 'phim-bo']" class="mobile-nav-link" (click)="closeMobileMenu()">🎬 Phim Bộ Hot</a>
          <a [routerLink]="['/the-loai', 'phim-le']" class="mobile-nav-link" (click)="closeMobileMenu()">📽️ Phim Lẻ Chiếu Rạp</a>
          <a [routerLink]="['/the-loai', 'hoat-hinh']" class="mobile-nav-link" (click)="closeMobileMenu()">🐉 Hoạt Hình Anime</a>
          <a [routerLink]="['/the-loai', 'tv-shows']" class="mobile-nav-link" (click)="closeMobileMenu()">📺 TV Shows & Reality</a>
          <a routerLink="/yeu-thich" class="mobile-nav-link" (click)="closeMobileMenu()">❤️ Phim Yêu Thích</a>
          <a routerLink="/trang-ca-nhan" class="mobile-nav-link" (click)="closeMobileMenu()">👤 Trang Cá Nhân</a>

          <!-- Mobile Categories Chips Section -->
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

          <!-- Mobile Auth Actions Bar -->
          <div class="mobile-auth-bar">
            <div *ngIf="currentUser; else mobileLogin" class="mobile-user-info">
              <a routerLink="/trang-ca-nhan" class="avatar-pill" (click)="closeMobileMenu()">
                <div class="avatar-circle">{{ getInitials(currentUser.name) }}</div>
                <span>{{ currentUser.name }}</span>
              </a>
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
      background: rgba(10, 13, 20, 0.9);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border-color);
      padding: 0.75rem 0;
      transition: all 0.35s ease;
    }

    .navbar.scrolled {
      background: rgba(7, 9, 14, 0.96);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
      padding: 0.55rem 0;
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      gap: 0.8rem;
      white-space: nowrap;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .logo-badge {
      width: 36px;
      height: 36px;
      background: var(--primary-gradient);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-weight: 900;
      font-size: 1.35rem;
      color: #ffffff;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.45rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
    }

    .logo-text span {
      color: var(--primary);
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }

    .nav-link {
      font-weight: 600;
      color: var(--text-muted);
      font-size: 0.88rem;
      cursor: pointer;
      padding: 0.4rem 0.1rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      position: relative;
      transition: all 0.25s ease;
      white-space: nowrap;
    }

    .nav-link:hover, .nav-link.active {
      color: #ffffff;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--primary-gradient);
      border-radius: 2px;
      box-shadow: 0 0 10px var(--primary-glow);
    }

    .chevron {
      font-style: normal;
      font-size: 0.75rem;
      opacity: 0.7;
    }

    .dropdown {
      position: relative;
    }

    .dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .mega-menu {
      position: absolute;
      top: 100%;
      left: 0;
      width: 270px;
      background: rgba(15, 19, 30, 0.98);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.9rem;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.9);
      opacity: 0;
      visibility: hidden;
      transform: translateY(12px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dropdown-header {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: 1px;
      margin-bottom: 0.7rem;
    }

    .dropdown-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.35rem;
      max-height: 300px;
      overflow-y: auto;
    }

    .dropdown-item {
      padding: 0.4rem 0.55rem;
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .dropdown-item .item-dot {
      opacity: 0.4;
    }

    .dropdown-item:hover {
      background: rgba(255, 42, 95, 0.15);
      color: #ffffff;
    }

    .dropdown-item:hover .item-dot {
      opacity: 1;
      color: var(--primary);
    }

    .right-nav {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-shrink: 0;
    }

    .btn-apk-download {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 0.45rem 0.85rem;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);
      transition: all 0.3s ease;
      text-decoration: none;
      white-space: nowrap;
    }

    .btn-apk-download:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 22px rgba(16, 185, 129, 0.55);
      color: #ffffff;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 0 8px #ffffff;
      animation: pulse 1.8s infinite;
    }

    .pulse-dot-light {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ffffff;
      margin-right: 5px;
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }

    .search-box {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-color);
      border-radius: 30px;
      padding: 0.2rem 0.5rem 0.2rem 0.75rem;
      width: 140px;
      transition: all 0.35s ease;
    }

    .search-box:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 14px var(--primary-glow);
      width: 180px;
      background: rgba(255, 255, 255, 0.1);
    }

    .search-icon {
      font-size: 0.8rem;
      margin-right: 0.35rem;
      opacity: 0.7;
    }

    .search-box input {
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 0.82rem;
      width: 100%;
    }

    .clear-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.75rem;
      cursor: pointer;
      padding: 0 0.15rem;
    }

    .clear-btn:hover {
      color: #ffffff;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255, 255, 255, 0.06);
      padding: 0.25rem 0.6rem 0.25rem 0.35rem;
      border-radius: 25px;
      border: 1px solid var(--border-color);
      white-space: nowrap;
    }

    .avatar-pill {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      text-decoration: none;
      cursor: pointer;
    }

    .avatar-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--primary-gradient);
      color: #ffffff;
      font-weight: 800;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: #ffffff;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logout-icon-btn {
      background: transparent;
      border: none;
      font-size: 0.88rem;
      cursor: pointer;
      padding: 0.15rem;
      transition: transform 0.2s ease;
    }

    .logout-icon-btn:hover {
      transform: scale(1.2);
    }

    .login-badge-btn {
      padding: 0.45rem 0.95rem;
      border-radius: 20px;
      font-size: 0.82rem;
      white-space: nowrap;
    }

    .mobile-toggle-btn {
      display: none;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-color);
      color: #ffffff;
      font-size: 1.2rem;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* Mobile Drawer */
    .mobile-drawer {
      background: rgba(10, 13, 20, 0.98);
      backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border-color);
      padding: 1.2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.9);
      max-height: 85vh;
      overflow-y: auto;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .mobile-apk-banner {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      font-weight: 800;
      font-size: 0.9rem;
      padding: 0.8rem 1rem;
      border-radius: 14px;
      text-align: center;
      box-shadow: 0 4px 18px rgba(16, 185, 129, 0.45);
      margin-bottom: 0.35rem;
      text-decoration: none;
      display: block;
    }

    .mobile-nav-link {
      font-size: 0.98rem;
      font-weight: 700;
      color: #ffffff;
      padding: 0.55rem 0.85rem;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.04);
    }

    .mobile-section-title {
      font-size: 0.78rem;
      font-weight: 800;
      color: var(--primary);
      margin-top: 0.55rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .mobile-chips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.45rem;
    }

    .mobile-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 0.5rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
      text-align: center;
    }

    .mobile-auth-bar {
      margin-top: 0.9rem;
      padding-top: 0.9rem;
      border-top: 1px solid var(--border-color);
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
      color: #ffffff;
      font-weight: 700;
    }

    @media (max-width: 1150px) {
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
  isScrolled = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }

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

  getInitials(name: string): string {
    if (!name) return 'K';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
