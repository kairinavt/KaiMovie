import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="watch-page">
      <div class="container" *ngIf="loading">
        <div class="skeleton player-skeleton"></div>
      </div>

      <div class="container" *ngIf="!loading && movieData">
        <!-- Player Header -->
        <div class="player-header">
          <h1 class="movie-title">
            <a [routerLink]="['/phim', movieData.movie?.slug]">{{ movieData.movie?.name }}</a>
            <span class="active-ep" *ngIf="currentEp"> - {{ currentEp.name }}</span>
          </h1>
          <a [routerLink]="['/phim', movieData.movie?.slug]" class="btn btn-secondary btn-sm">
            ← Chi tiết phim
          </a>
        </div>

        <!-- Video Player Frame -->
        <div class="player-container">
          <iframe
            *ngIf="safePlayerUrl"
            [src]="safePlayerUrl"
            allowfullscreen
            frameborder="0"
            scrolling="no"
            allow="autoplay; encrypted-media">
          </iframe>
          <div class="no-player" *ngIf="!safePlayerUrl">
            <p>Không thể tải luồng phát video cho tập phim này.</p>
          </div>
        </div>

        <!-- Server Selector Tabs -->
        <div class="control-box">
          <div class="server-tabs" *ngIf="movieData.episodes?.length">
            <span class="label">Đổi Server:</span>
            <button
              *ngFor="let server of movieData.episodes; let sIdx = index"
              class="server-btn"
              [class.active]="currentServerIdx === sIdx"
              (click)="selectServer(sIdx)">
              {{ server.server_name }}
            </button>
          </div>

          <!-- Episode List Grid -->
          <div class="episodes-wrapper" *ngIf="currentServer">
            <h3 class="box-subtitle">Chọn Tập Phim</h3>
            <div class="ep-grid">
              <button
                *ngFor="let ep of currentServer.server_data"
                class="ep-item"
                [class.active]="currentEp?.slug === ep.slug"
                (click)="selectEpisode(ep)">
                {{ ep.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .watch-page {
      padding: 1.5rem 0 4rem;
    }

    .player-skeleton {
      aspect-ratio: 16 / 9;
      width: 100%;
      border-radius: var(--radius-md);
    }

    .player-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .movie-title {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;

      a { &:hover { color: var(--primary); } }
    }

    .active-ep {
      color: var(--primary);
    }

    .btn-sm {
      padding: 0.4rem 0.9rem;
      font-size: 0.85rem;
    }

    .player-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 42, 95, 0.2);
      border: 1px solid var(--border-color);
      margin-bottom: 1.5rem;

      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    }

    .no-player {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-muted);
    }

    .control-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .server-tabs {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;

      .label {
        font-weight: 600;
        color: var(--text-muted);
        font-size: 0.9rem;
      }
    }

    .server-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &.active, &:hover {
        background: var(--primary);
        border-color: var(--primary);
        box-shadow: 0 4px 12px var(--primary-glow);
      }
    }

    .box-subtitle {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.85rem;
    }

    .ep-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
      gap: 0.5rem;
      max-height: 280px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .ep-item {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 0.5rem 0.25rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s ease;

      &.active {
        background: var(--primary-gradient);
        border-color: var(--primary);
        box-shadow: 0 4px 12px var(--primary-glow);
      }

      &:hover:not(.active) {
        background: var(--bg-hover);
        border-color: #3b82f6;
      }
    }
  `]
})
export class WatchComponent implements OnInit {
  slug = '';
  currentServerIdx = 0;
  epSlug = '';
  movieData: any = null;
  currentServer: any = null;
  currentEp: any = null;
  safePlayerUrl: SafeResourceUrl | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      this.route.queryParams.subscribe((qParams) => {
        this.currentServerIdx = Number(qParams['server'] || 0);
        this.epSlug = qParams['ep'] || '';
        if (this.slug) {
          this.loadMovie();
        }
      });
    });
  }

  loadMovie(): void {
    this.loading = true;
    this.apiService.getMovieDetail(this.slug).subscribe({
      next: (res) => {
        this.movieData = res.data || res;
        this.loading = false;

        if (this.movieData?.episodes?.length) {
          this.selectServer(this.currentServerIdx);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectServer(sIdx: number): void {
    this.currentServerIdx = sIdx;
    this.currentServer = this.movieData?.episodes?.[sIdx] || this.movieData?.episodes?.[0];

    if (this.currentServer?.server_data?.length) {
      let targetEp = this.currentServer.server_data.find((e: any) => e.slug === this.epSlug);
      if (!targetEp) {
        targetEp = this.currentServer.server_data[0];
      }
      this.selectEpisode(targetEp);
    }
  }

  selectEpisode(ep: any): void {
    this.currentEp = ep;
    const rawUrl = ep?.link_embed || ep?.link_m3u8 || '';
    if (rawUrl) {
      this.safePlayerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    } else {
      this.safePlayerUrl = null;
    }
  }
}
