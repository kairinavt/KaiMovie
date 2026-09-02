import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService, FavoriteItem } from '../../core/services/favorites.service';
import { AuthService } from '../../core/services/auth.service';
import { ApiService, MovieItem } from '../../core/services/api.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent],
  template: `
    <div class="favorites-page page-wrapper container">
      <div class="page-header">
        <h1 class="section-title">Phim Yêu Thích Của Tôi ❤️</h1>
        <p class="sub-title" *ngIf="isLoggedIn">Danh sách các bộ phim bạn đã lưu để xem sau</p>
      </div>

      <!-- Not Logged In Prompt -->
      <div class="auth-prompt" *ngIf="!isLoggedIn">
        <div class="prompt-icon">🔒</div>
        <h3>Bạn chưa đăng nhập</h3>
        <p>Vui lòng đăng nhập hoặc đăng ký tài khoản để xem danh sách phim yêu thích đã lưu.</p>
        <a routerLink="/dang-nhap" class="btn btn-primary" style="margin-top: 1rem;">Đăng Nhập Ngay</a>
      </div>

      <!-- Loading Skeleton -->
      <div class="movie-grid" *ngIf="isLoggedIn && loading">
        <div class="skeleton-card" *ngFor="let item of [1,2,3,4]">
          <div class="skeleton poster-skeleton"></div>
          <div class="skeleton title-skeleton"></div>
        </div>
      </div>

      <!-- Favorites Grid -->
      <div class="movie-grid" *ngIf="isLoggedIn && !loading && favoriteMovies.length > 0">
        <div *ngFor="let fav of favoriteMovies" class="fav-card-wrapper">
          <app-movie-card [movie]="toMovieItem(fav)"></app-movie-card>
          <button class="remove-btn" (click)="removeFavorite(fav)" title="Xóa khỏi yêu thích">
            🗑 Xóa
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="isLoggedIn && !loading && favoriteMovies.length === 0">
        <div class="empty-icon">💔</div>
        <h3>Chưa có phim yêu thích nào</h3>
        <p>Khám phá trang chủ và bấm "Thêm vào yêu thích" để lưu phim vào danh sách này nhé!</p>
        <a routerLink="/" class="btn btn-primary" style="margin-top: 1rem;">Khám Phá Phim Ngay</a>
      </div>
    </div>
  `,
  styles: [`
    .favorites-page {
      padding-top: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .sub-title {
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .auth-prompt, .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      .prompt-icon, .empty-icon {
        font-size: 3.5rem;
      }
    }

    .fav-card-wrapper {
      position: relative;

      .remove-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(239, 68, 68, 0.9);
        color: #fff;
        border: none;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        z-index: 5;
        transition: all 0.2s ease;

        &:hover {
          background: #dc2626;
          transform: scale(1.05);
        }
      }
    }

    .skeleton-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .poster-skeleton { aspect-ratio: 2 / 3; width: 100%; }
    .title-skeleton { height: 20px; width: 80%; }
  `]
})
export class FavoritesComponent implements OnInit {
  isLoggedIn = false;
  favoriteMovies: FavoriteItem[] = [];
  loading = true;

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.loadFavorites();
    } else {
      this.loading = false;
    }
  }

  loadFavorites(): void {
    this.loading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (data) => {
        this.favoriteMovies = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toMovieItem(fav: FavoriteItem): MovieItem {
    return {
      name: fav.movieSnapshot?.name || fav.movieSlug,
      origin_name: fav.movieSlug,
      slug: fav.movieSlug,
      poster_url: fav.movieSnapshot?.poster_url || '',
      thumb_url: fav.movieSnapshot?.poster_url || '',
      year: fav.movieSnapshot?.year
    };
  }

  removeFavorite(fav: FavoriteItem): void {
    this.favoritesService.toggleFavorite(fav.movieSlug, fav.movieSnapshot).subscribe({
      next: () => {
        this.favoriteMovies = this.favoriteMovies.filter(f => f.movieSlug !== fav.movieSlug);
      }
    });
  }
}
