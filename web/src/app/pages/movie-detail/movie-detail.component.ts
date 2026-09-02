import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="movie-detail-page">
      <!-- Loading Skeleton -->
      <div class="container loading-wrapper" *ngIf="loading">
        <div class="skeleton banner-skeleton"></div>
      </div>

      <div *ngIf="!loading && movieData">
        <!-- Detail Hero Section -->
        <section class="detail-hero">
          <div class="backdrop">
            <img [src]="getBackdropUrl()" [alt]="movieData.movie?.name" />
            <div class="backdrop-gradient"></div>
          </div>

          <div class="container hero-container">
            <!-- Poster -->
            <div class="poster-card">
              <img [src]="getPosterUrl()" [alt]="movieData.movie?.name" />
            </div>

            <!-- Movie Info -->
            <div class="info-content">
              <h1 class="movie-name">{{ movieData.movie?.name }}</h1>
              <h2 class="origin-name">{{ movieData.movie?.origin_name }} ({{ movieData.movie?.year }})</h2>

              <!-- Badges -->
              <div class="meta-row">
                <span class="badge badge-quality" *ngIf="movieData.movie?.quality">{{ movieData.movie?.quality }}</span>
                <span class="badge badge-lang" *ngIf="movieData.movie?.lang">{{ movieData.movie?.lang }}</span>
                <span class="badge badge-ep" *ngIf="movieData.movie?.episode_current">{{ movieData.movie?.episode_current }}</span>
                <span class="rating" *ngIf="movieData.movie?.tmdb?.vote_average">★ {{ movieData.movie?.tmdb?.vote_average }} (TMDB)</span>
              </div>

              <!-- Categories -->
              <div class="categories-row" *ngIf="movieData.movie?.category?.length">
                <span *ngFor="let cat of movieData.movie.category" class="cat-pill">
                  {{ cat.name }}
                </span>
              </div>

              <!-- Metadata list -->
              <div class="meta-grid">
                <div class="meta-item" *ngIf="movieData.movie?.director?.length">
                  <span class="label">Đạo diễn:</span>
                  <span class="value">{{ joinNames(movieData.movie.director) }}</span>
                </div>
                <div class="meta-item" *ngIf="movieData.movie?.actor?.length">
                  <span class="label">Diễn viên:</span>
                  <span class="value">{{ joinNames(movieData.movie.actor) }}</span>
                </div>
                <div class="meta-item" *ngIf="movieData.movie?.country?.length">
                  <span class="label">Quốc gia:</span>
                  <span class="value">{{ joinNames(movieData.movie.country) }}</span>
                </div>
              </div>

              <!-- Action Row: Watch & Favorite -->
              <div class="action-row">
                <button class="btn btn-primary btn-lg" *ngIf="firstEpisode" (click)="watchFirstEpisode()">
                  ▶ XEM PHIM NGAY
                </button>
                <button
                  class="btn btn-fav"
                  [class.active]="isFavorite"
                  (click)="toggleFavorite()">
                  {{ isFavorite ? '💔 Đã Thích' : '❤️ Thêm Yêu Thích' }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Content & Episodes Section -->
        <section class="container detail-body">
          <!-- Story Content -->
          <div class="section-box" *ngIf="movieData.movie?.content">
            <h3 class="box-title">Nội Dung Phim</h3>
            <div class="story-content" [innerHTML]="movieData.movie.content"></div>
          </div>

          <!-- Server & Episode Selection -->
          <div class="section-box" *ngIf="movieData.episodes?.length">
            <h3 class="box-title">Danh Sách Tập Phim</h3>

            <div *ngFor="let server of movieData.episodes; let sIdx = index" class="server-block">
              <div class="server-name">🖥 Server: {{ server.server_name }}</div>
              <div class="episode-grid">
                <a
                  *ngFor="let ep of server.server_data"
                  [routerLink]="['/xem-phim', movieData.movie.slug]"
                  [queryParams]="{ server: sIdx, ep: ep.slug }"
                  class="ep-btn">
                  {{ ep.name }}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .movie-detail-page {
      padding-bottom: 4rem;
    }

    .loading-wrapper {
      padding-top: 2rem;
    }

    .banner-skeleton {
      height: 400px;
      width: 100%;
    }

    .detail-hero {
      position: relative;
      padding: 3rem 0 2rem;
      min-height: 450px;
    }

    .backdrop {
      position: absolute;
      inset: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 20%;
        filter: blur(8px) brightness(0.4);
      }
    }

    .backdrop-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(9,11,16,0.6) 0%, rgba(9,11,16,0.98) 100%);
    }

    .hero-container {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 2.5rem;
      align-items: start;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        justify-items: center;
        text-align: center;
      }
    }

    .poster-card {
      width: 100%;
      aspect-ratio: 2 / 3;
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0,0,0,0.8), 0 0 20px rgba(255, 42, 95, 0.3);
      border: 2px solid rgba(255,255,255,0.1);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .movie-name {
      font-family: var(--font-heading);
      font-size: 2.4rem;
      font-weight: 800;
      color: #fff;
      line-height: 1.2;
    }

    .origin-name {
      font-size: 1.2rem;
      color: var(--text-muted);
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .badge-quality { background: #ef4444; color: #fff; }
    .badge-lang { background: #3b82f6; color: #fff; }
    .badge-ep { background: #8b5cf6; color: #fff; }

    .rating {
      color: var(--accent-gold);
      font-weight: 700;
      font-size: 0.95rem;
    }

    .categories-row {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .cat-pill {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-color);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      color: #cbd5e1;
    }

    .meta-grid {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.92rem;
      background: rgba(255,255,255,0.03);
      padding: 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
    }

    .meta-item .label {
      color: var(--text-muted);
      margin-right: 0.5rem;
    }

    .meta-item .value {
      color: #fff;
      font-weight: 500;
    }

    .action-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-lg {
      padding: 0.9rem 2.2rem;
      font-size: 1.1rem;
      border-radius: 30px;
    }

    .btn-fav {
      background: var(--bg-hover);
      color: #fff;
      border: 1px solid var(--border-color);
      padding: 0.85rem 1.6rem;
      border-radius: 30px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover, &.active {
        background: rgba(239, 68, 68, 0.2);
        border-color: #ef4444;
        color: #ef4444;
      }
    }

    .detail-body {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .section-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.5rem;
    }

    .box-title {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .story-content {
      color: #cbd5e1;
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .server-block {
      margin-bottom: 1.25rem;
    }

    .server-name {
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
    }

    .episode-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .ep-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.88rem;
      transition: all 0.2s ease;

      &:hover {
        background: var(--primary);
        border-color: var(--primary);
        box-shadow: 0 4px 12px var(--primary-glow);
      }
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  movieData: any = null;
  loading = true;
  firstEpisode: any = null;
  slug = '';
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      if (this.slug) {
        this.loadDetail();
        this.checkFavoriteStatus();
      }
    });
  }

  loadDetail(): void {
    this.loading = true;
    this.apiService.getMovieDetail(this.slug).subscribe({
      next: (res) => {
        this.movieData = res;
        this.loading = false;
        if (this.movieData?.episodes?.[0]?.server_data?.[0]) {
          this.firstEpisode = this.movieData.episodes[0].server_data[0];
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  checkFavoriteStatus(): void {
    if (this.authService.isLoggedIn()) {
      this.favoritesService.checkIsFavorite(this.slug).subscribe({
        next: (isFav) => this.isFavorite = isFav,
        error: () => this.isFavorite = false
      });
    }
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/dang-nhap']);
      return;
    }

    const movie = this.movieData?.movie;
    if (!movie) return;

    const snapshot = {
      name: movie.name,
      poster_url: movie.poster_url || movie.thumb_url,
      year: movie.year
    };

    this.favoritesService.toggleFavorite(this.slug, snapshot).subscribe({
      next: (res) => {
        this.isFavorite = res.isFavorite;
      }
    });
  }

  getBackdropUrl(): string {
    const path = this.movieData?.movie?.poster_url || this.movieData?.movie?.thumb_url;
    return this.apiService.getImageUrl(path);
  }

  getPosterUrl(): string {
    const path = this.movieData?.movie?.thumb_url || this.movieData?.movie?.poster_url;
    return this.apiService.getImageUrl(path);
  }

  joinNames(arr: any[]): string {
    if (!Array.isArray(arr)) return '';
    return arr.map(i => typeof i === 'string' ? i : i.name).join(', ');
  }

  watchFirstEpisode(): void {
    if (this.firstEpisode && this.movieData?.movie?.slug) {
      this.router.navigate(['/xem-phim', this.movieData.movie.slug], {
        queryParams: { server: 0, ep: this.firstEpisode.slug }
      });
    }
  }
}
