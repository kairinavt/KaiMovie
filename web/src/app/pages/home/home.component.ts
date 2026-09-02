import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService, MovieItem, Pagination } from '../../core/services/api.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent],
  template: `
    <div class="home-page">
      <!-- Cinematic Hero Banner Slider -->
      <section class="hero-banner" *ngIf="heroMovie">
        <div class="banner-backdrop">
          <img [src]="getHeroBackdrop()" [alt]="heroMovie.name" />
          <div class="backdrop-gradient"></div>
        </div>

        <div class="container hero-content">
          <div class="hero-tag">🔥 TOP TRENDING PHIM MỚI</div>
          <h1 class="hero-title">{{ heroMovie.name }}</h1>
          <p class="hero-sub">{{ heroMovie.origin_name }} <span *ngIf="heroMovie.year">({{ heroMovie.year }})</span></p>

          <div class="hero-badges">
            <span class="badge badge-quality" *ngIf="heroMovie.quality">{{ heroMovie.quality }}</span>
            <span class="badge badge-ep" *ngIf="heroMovie.episode_current">{{ heroMovie.episode_current }}</span>
            <span class="badge badge-gold" *ngIf="heroMovie.tmdb?.vote_average">⭐ {{ heroMovie.tmdb?.vote_average }}</span>
          </div>

          <div class="hero-actions">
            <a [routerLink]="['/xem-phim', heroMovie.slug]" class="btn btn-primary btn-play">
              <span>▶ Xem Phim Ngay</span>
            </a>
            <a [routerLink]="['/phim', heroMovie.slug]" class="btn btn-secondary btn-info">
              <span>ℹ️ Chi Tiết</span>
            </a>
          </div>

          <!-- Hero Slider Dots -->
          <div class="hero-dots" *ngIf="featuredMovies.length > 1">
            <button
              *ngFor="let m of featuredMovies; let i = index"
              class="dot-btn"
              [class.active]="heroMovie.slug === m.slug"
              (click)="setHeroMovie(m)"
              [title]="m.name">
            </button>
          </div>
        </div>
      </section>

      <!-- Main Movies Section -->
      <section class="container movies-section">
        <!-- Quick Filter Chips -->
        <div class="filter-chips-bar">
          <button
            class="chip-btn"
            [class.active]="!categorySlug && !countrySlug"
            (click)="filterCategory(null)">
            🔥 Tất Cả
          </button>
          <button
            class="chip-btn"
            [class.active]="categorySlug === 'phim-bo'"
            (click)="filterCategory('phim-bo')">
            🎬 Phim Bộ
          </button>
          <button
            class="chip-btn"
            [class.active]="categorySlug === 'phim-le'"
            (click)="filterCategory('phim-le')">
            📽️ Phim Lẻ
          </button>
          <button
            class="chip-btn"
            [class.active]="categorySlug === 'hoat-hinh'"
            (click)="filterCategory('hoat-hinh')">
            🐉 Hoạt Hình
          </button>
          <button
            class="chip-btn"
            [class.active]="categorySlug === 'tv-shows'"
            (click)="filterCategory('tv-shows')">
            📺 TV Shows
          </button>
        </div>

        <div class="section-header">
          <h2 class="section-title">{{ pageTitle }}</h2>
          <div class="pagination-info" *ngIf="pagination">
            Trang {{ pagination.currentPage }} / {{ pagination.totalPages }}
          </div>
        </div>

        <!-- Skeleton Loaders -->
        <div class="movie-grid" *ngIf="loading">
          <div class="skeleton-card" *ngFor="let item of [1,2,3,4,5,6,7,8,9,10,11,12]">
            <div class="skeleton poster-skeleton"></div>
            <div class="skeleton title-skeleton"></div>
          </div>
        </div>

        <!-- Movies List -->
        <div class="movie-grid" *ngIf="!loading && movies.length > 0">
          <app-movie-card *ngFor="let movie of movies" [movie]="movie"></app-movie-card>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!loading && movies.length === 0">
          <p>Không tìm thấy phim nào trong danh mục này.</p>
        </div>

        <!-- Android Mobile App APK Download Banner -->
        <div class="apk-banner-card">
          <div class="apk-banner-content">
            <div class="apk-icon-badge">📱</div>
            <div class="apk-info">
              <h3>Tải Ứng Dụng KaiMovie Cho Android</h3>
              <p>Trải nghiệm xem phim 4K mượt mà, hỗ trợ cửa sổ thu nhỏ Picture-in-Picture (PiP), không quảng cáo trên di động.</p>
              <div class="apk-features">
                <span>⚡ Siêu Mượt 120 FPS</span>
                <span>📺 Hỗ Trợ PiP</span>
                <span>🔒 Đăng Nhập Server</span>
              </div>
            </div>
            <div class="apk-action">
              <a href="http://192.168.100.115:5000/downloads/kaimovie-app.apk" download="kaimovie-app.apk" class="btn-apk-download-hero">
                ⬇️ Tải APK Miễn Phí (87MB)
              </a>
            </div>
          </div>
        </div>

        <!-- Pagination Bar -->
        <div class="pagination-bar" *ngIf="pagination && pagination.totalPages > 1">
          <button
            class="btn btn-secondary nav-page-btn"
            [disabled]="pagination.currentPage <= 1"
            (click)="goToPage(pagination.currentPage - 1)">
            ‹ Trước
          </button>

          <div class="page-numbers">
            <button
              *ngFor="let p of getPagesArray()"
              class="page-num-btn"
              [class.active]="p === pagination.currentPage"
              (click)="goToPage(p)">
              {{ p }}
            </button>
          </div>

          <button
            class="btn btn-secondary nav-page-btn"
            [disabled]="pagination.currentPage >= pagination.totalPages"
            (click)="goToPage(pagination.currentPage + 1)">
            Sau ›
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      padding-bottom: 4rem;
    }

    /* Cinematic Hero Banner */
    .hero-banner {
      position: relative;
      height: 520px;
      display: flex;
      align-items: center;
      overflow: hidden;
      margin-bottom: 3rem;

      @media (max-width: 768px) {
        height: 420px;
      }
    }

    .banner-backdrop {
      position: absolute;
      inset: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 20%;
        filter: brightness(0.7);
        transition: all 0.5s ease;
      }
    }

    .backdrop-gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 70% 30%, transparent 0%, rgba(7, 9, 14, 0.85) 70%),
                  linear-gradient(180deg, rgba(7, 9, 14, 0.3) 0%, rgba(7, 9, 14, 1) 100%),
                  linear-gradient(90deg, rgba(7, 9, 14, 0.95) 0%, transparent 65%);
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 680px;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .hero-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.3rem 0.9rem;
      background: rgba(255, 42, 95, 0.2);
      border: 1px solid rgba(255, 42, 95, 0.5);
      color: var(--primary);
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      width: fit-content;
      box-shadow: 0 0 15px rgba(255, 42, 95, 0.2);
    }

    .hero-title {
      font-family: var(--font-heading);
      font-size: 2.8rem;
      font-weight: 800;
      line-height: 1.15;
      color: #fff;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);

      @media (max-width: 768px) {
        font-size: 1.9rem;
      }
    }

    .hero-sub {
      font-size: 1.1rem;
      color: #cbd5e1;
    }

    .hero-badges {
      display: flex;
      gap: 0.6rem;

      .badge {
        background: rgba(20, 24, 36, 0.85);
        border: 1px solid var(--border-color);
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 700;
        backdrop-filter: blur(10px);
      }

      .badge-quality {
        background: rgba(239, 68, 68, 0.9);
        color: #fff;
        border: none;
      }

      .badge-ep {
        background: rgba(168, 85, 247, 0.85);
        color: #fff;
        border: none;
      }

      .badge-gold {
        color: #fbbf24;
        border-color: rgba(251, 191, 36, 0.4);
      }
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-top: 0.75rem;

      .btn {
        padding: 0.8rem 1.6rem;
        font-size: 1rem;
        border-radius: 30px;
      }

      .btn-play {
        box-shadow: 0 4px 25px var(--primary-glow);
      }
    }

    .hero-dots {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }

    .dot-btn {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        width: 32px;
        border-radius: 10px;
        background: var(--primary-gradient);
        box-shadow: 0 0 10px var(--primary-glow);
      }
    }

    /* Filter Chips Bar */
    .filter-chips-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;

      &::-webkit-scrollbar {
        height: 4px;
      }
    }

    .chip-btn {
      background: rgba(20, 24, 36, 0.8);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 0.6rem 1.2rem;
      border-radius: 30px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(30, 37, 56, 0.9);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: var(--primary-gradient);
        color: #fff;
        border-color: transparent;
        box-shadow: 0 4px 15px var(--primary-glow);
      }
    }

    /* APK Download Banner Section */
    .apk-banner-card {
      margin-top: 3rem;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(14, 18, 28, 0.9) 100%);
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .apk-banner-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;

      @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
      }
    }

    .apk-icon-badge {
      font-size: 3.5rem;
      background: rgba(16, 185, 129, 0.2);
      width: 80px;
      height: 80px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(16, 185, 129, 0.5);
      flex-shrink: 0;
    }

    .apk-info {
      flex: 1;

      h3 {
        font-family: var(--font-heading);
        font-size: 1.4rem;
        font-weight: 800;
        color: #fff;
        margin-bottom: 0.4rem;
      }

      p {
        color: #94a3b8;
        font-size: 0.92rem;
        margin-bottom: 0.8rem;
      }
    }

    .apk-features {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        justify-content: center;
      }

      span {
        background: rgba(255, 255, 255, 0.08);
        padding: 0.3rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        color: #e2e8f0;
      }
    }

    .btn-apk-download-hero {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      font-weight: 800;
      font-size: 1rem;
      padding: 0.9rem 1.8rem;
      border-radius: 30px;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
      white-space: nowrap;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
        color: #fff;
      }
    }

    /* Skeleton Loading */
    .skeleton-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .poster-skeleton {
      aspect-ratio: 2 / 3;
      width: 100%;
    }

    .title-skeleton {
      height: 20px;
      width: 80%;
    }

    .pagination-info {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--text-muted);
    }

    /* Pagination Bar */
    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 3.5rem;
      flex-wrap: wrap;
    }

    .nav-page-btn {
      padding: 0.6rem 1.2rem;
      border-radius: 25px;
    }

    .page-numbers {
      display: flex;
      gap: 0.4rem;
    }

    .page-num-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(20, 24, 36, 0.8);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(30, 37, 56, 0.9);
        color: #fff;
      }

      &.active {
        background: var(--primary-gradient);
        color: #fff;
        border-color: transparent;
        box-shadow: 0 4px 15px var(--primary-glow);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  movies: MovieItem[] = [];
  featuredMovies: MovieItem[] = [];
  heroMovie: MovieItem | null = null;
  pagination: Pagination | null = null;
  loading = true;
  pageTitle = '🔥 Phim Mới Cập Nhật';
  currentPage = 1;
  categorySlug: string | null = null;
  countrySlug: string | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categorySlug = params['slug'] || null;
      this.countrySlug = params['countrySlug'] || null;
      this.currentPage = 1;
      this.loadMovies();
    });
  }

  filterCategory(slug: string | null): void {
    if (slug) {
      this.router.navigate(['/the-loai', slug]);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadMovies(page: number = this.currentPage): void {
    this.loading = true;
    this.currentPage = page;

    let request$;
    if (this.categorySlug) {
      this.pageTitle = `Danh Mục: ${this.formatTitle(this.categorySlug)}`;
      request$ = this.apiService.getByCategory(this.categorySlug, page);
    } else if (this.countrySlug) {
      this.pageTitle = `Quốc Gia: ${this.formatTitle(this.countrySlug)}`;
      request$ = this.apiService.getByCountry(this.countrySlug, page);
    } else {
      this.pageTitle = '🔥 Phim Mới Cập Nhật';
      request$ = this.apiService.getLatestMovies(page);
    }

    request$.subscribe({
      next: (res) => {
        this.movies = res.items || [];
        this.pagination = res.pagination || null;
        if (this.movies.length > 0) {
          this.featuredMovies = this.movies.slice(0, 5);
          if (!this.heroMovie || !this.featuredMovies.some(m => m.slug === this.heroMovie?.slug)) {
            this.heroMovie = this.featuredMovies[0];
          }
        }
        this.loading = false;
      },
      error: () => {
        this.movies = [];
        this.loading = false;
      }
    });
  }

  setHeroMovie(movie: MovieItem): void {
    this.heroMovie = movie;
  }

  getHeroBackdrop(): string {
    if (!this.heroMovie) return '';
    const path = this.heroMovie.poster_url || this.heroMovie.thumb_url;
    return this.apiService.getImageUrl(path);
  }

  getPagesArray(): number[] {
    if (!this.pagination) return [1];
    const total = this.pagination.totalPages;
    const current = this.pagination.currentPage;
    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && (!this.pagination || page <= this.pagination.totalPages)) {
      this.loadMovies(page);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  }

  private formatTitle(slug: string): string {
    return slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
