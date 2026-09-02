import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, MovieItem } from '../../../core/services/api.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="movie-card" *ngIf="movie">
      <a [routerLink]="['/phim', movie.slug]" class="poster-wrapper">
        <img
          [src]="getPosterUrl()"
          [alt]="movie.name"
          loading="lazy"
          (error)="onImgError($event)"
        />

        <!-- Quality / Episode Badges -->
        <div class="badge-list">
          <span class="badge badge-quality" *ngIf="movie.quality">{{ movie.quality }}</span>
          <span class="badge badge-ep" *ngIf="movie.episode_current">{{ movie.episode_current }}</span>
        </div>

        <!-- Rating Badge -->
        <div class="rating-badge" *ngIf="movie.tmdb?.vote_average">
          ⭐ {{ movie.tmdb?.vote_average }}
        </div>

        <!-- Hover Overlay Button -->
        <div class="play-overlay">
          <div class="play-btn-glow">
            <span class="play-icon">▶</span>
          </div>
          <span class="quick-watch-text">Xem Ngay</span>
        </div>
      </a>

      <div class="card-info">
        <h3 class="movie-title" [title]="movie.name">
          <a [routerLink]="['/phim', movie.slug]">{{ movie.name }}</a>
        </h3>
        <p class="movie-sub" [title]="movie.origin_name">
          {{ movie.origin_name }} <span *ngIf="movie.year">({{ movie.year }})</span>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .movie-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: rgba(20, 24, 36, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);

      &:hover {
        transform: translateY(-8px) scale(1.02);
        border-color: rgba(255, 42, 95, 0.5);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 42, 95, 0.25);

        .play-overlay { opacity: 1; }
        img { transform: scale(1.08); filter: brightness(0.85); }
      }
    }

    .poster-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 2 / 3;
      overflow: hidden;
      background: #0f121a;
      display: block;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease, filter 0.4s ease;
      }
    }

    .badge-list {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      z-index: 2;
    }

    .badge {
      font-size: 0.7rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }

    .badge-quality {
      background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
      color: #fff;
    }

    .badge-ep {
      background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
      color: #fff;
    }

    .rating-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(15, 18, 26, 0.85);
      color: #fbbf24;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(251, 191, 36, 0.3);
      z-index: 2;
    }

    .play-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, rgba(9, 11, 16, 0.4) 0%, rgba(9, 11, 16, 0.8) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      opacity: 0;
      transition: opacity 0.35s ease;
      z-index: 3;
    }

    .play-btn-glow {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: var(--primary-gradient);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      padding-left: 3px;
      box-shadow: 0 0 25px var(--primary-glow);
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.15);
      }
    }

    .quick-watch-text {
      color: #fff;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .card-info {
      padding: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      flex-grow: 1;
    }

    .movie-title {
      font-size: 0.95rem;
      font-weight: 700;
      line-height: 1.35;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #fff;
    }

    .movie-sub {
      font-size: 0.8rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class MovieCardComponent {
  @Input() movie!: MovieItem;

  constructor(private apiService: ApiService) {}

  getPosterUrl(): string {
    const url = this.movie.poster_url || this.movie.thumb_url;
    return this.apiService.getImageUrl(url);
  }

  onImgError(event: any): void {
    event.target.src = 'https://via.placeholder.com/300x450/141824/94a3b8?text=KaiMovie';
  }
}
