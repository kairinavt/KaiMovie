import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../core/services/api.service';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

        <!-- Server & Episode Selector Box -->
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

        <!-- Interactive Comments & 5-Star Ratings Section -->
        <div class="comments-section">
          <div class="comments-header">
            <h3 class="box-subtitle">💬 Bình Luận & Đánh Giá</h3>
            <div class="avg-rating-badge" *ngIf="avgRating">
              <span class="star">⭐</span> {{ avgRating }} / 5 ({{ totalComments }} đánh giá)
            </div>
          </div>

          <!-- Post Comment Box -->
          <div class="post-comment-card">
            <div class="rating-select">
              <span class="rating-label">Đánh giá của bạn:</span>
              <div class="stars-picker">
                <button
                  *ngFor="let star of [1,2,3,4,5]"
                  class="star-btn"
                  [class.active]="selectedRating >= star"
                  (click)="selectedRating = star">
                  ★
                </button>
              </div>
            </div>

            <div class="comment-input-group">
              <textarea
                placeholder="Viết cảm nhận của bạn về tập phim này..."
                [(ngModel)]="newCommentContent"
                rows="3">
              </textarea>
              <button class="btn btn-primary btn-submit-comment" (click)="submitComment()">
                Gửi Bình Luận
              </button>
            </div>
            <div class="comment-msg" *ngIf="commentMsg" [class.error]="commentMsgIsError">{{ commentMsg }}</div>
          </div>

          <!-- Comments List -->
          <div class="comments-list">
            <div class="comment-card" *ngFor="let c of comments">
              <div class="comment-avatar">
                {{ getInitials(c.userName) }}
              </div>
              <div class="comment-body">
                <div class="comment-meta">
                  <span class="user-name">{{ c.userName }}</span>
                  <span class="user-stars">★ {{ c.rating || 5 }}</span>
                  <span class="comment-time">{{ c.createdAt | date:'HH:mm dd/MM/yyyy' }}</span>
                </div>
                <p class="comment-content">{{ c.content }}</p>
              </div>
            </div>

            <div class="empty-comments" *ngIf="comments.length === 0">
              <p>Chưa có bình luận nào. Hãy là người đầu tiên để lại đánh giá!</p>
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
      color: #ffffff;
    }

    .movie-title a:hover {
      color: var(--primary);
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
      background: #000000;
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 42, 95, 0.2);
      border: 1px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    .player-container iframe {
      width: 100%;
      height: 100%;
      border: none;
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
      margin-bottom: 2rem;
    }

    .server-tabs {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .server-tabs .label {
      font-weight: 600;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .server-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: #ffffff;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .server-btn.active, .server-btn:hover {
      background: var(--primary);
      border-color: var(--primary);
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    .box-subtitle {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffffff;
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
      color: #ffffff;
      padding: 0.5rem 0.25rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s ease;
    }

    .ep-item.active {
      background: var(--primary-gradient);
      border-color: var(--primary);
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    .ep-item:hover:not(.active) {
      background: var(--bg-hover);
      border-color: #3b82f6;
    }

    /* Comments Section */
    .comments-section {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.5rem;
    }

    .comments-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.2rem;
    }

    .avg-rating-badge {
      background: rgba(251, 191, 36, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.4);
      color: #fbbf24;
      font-size: 0.88rem;
      font-weight: 700;
      padding: 0.35rem 0.8rem;
      border-radius: 20px;
    }

    .post-comment-card {
      background: rgba(20, 24, 36, 0.8);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 1.2rem;
      margin-bottom: 1.5rem;
    }

    .rating-select {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.8rem;
    }

    .rating-label {
      font-size: 0.88rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .stars-picker {
      display: flex;
      gap: 0.3rem;
    }

    .star-btn {
      background: transparent;
      border: none;
      font-size: 1.3rem;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .star-btn.active {
      color: #fbbf24;
      text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
    }

    .comment-input-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      textarea {
        background: rgba(7, 9, 14, 0.8);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 0.75rem;
        color: #ffffff;
        font-family: var(--font-main);
        font-size: 0.9rem;
        resize: vertical;
        outline: none;

        &:focus {
          border-color: var(--primary);
        }
      }
    }

    .btn-submit-comment {
      align-self: flex-end;
      padding: 0.6rem 1.4rem;
      border-radius: 20px;
      font-size: 0.88rem;
    }

    .comment-msg {
      font-size: 0.82rem;
      color: #10b981;
      margin-top: 0.5rem;
    }

    .comment-msg.error {
      color: #ef4444;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .comment-card {
      display: flex;
      gap: 0.9rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 1rem;
      border-radius: 12px;
    }

    .comment-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-gradient);
      color: #ffffff;
      font-weight: 800;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .comment-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .comment-meta {
      display: flex;
      align-items: center;
      gap: 0.6rem;

      .user-name {
        font-weight: 700;
        color: #ffffff;
        font-size: 0.92rem;
      }

      .user-stars {
        color: #fbbf24;
        font-size: 0.8rem;
        font-weight: 800;
      }

      .comment-time {
        font-size: 0.78rem;
        color: #64748b;
        margin-left: auto;
      }
    }

    .comment-content {
      color: #cbd5e1;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .empty-comments {
      text-align: center;
      padding: 2rem 0;
      color: var(--text-muted);
      font-size: 0.9rem;
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

  // Comments State
  comments: any[] = [];
  totalComments = 0;
  avgRating = 5;
  selectedRating = 5;
  newCommentContent = '';
  commentMsg = '';
  commentMsgIsError = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
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
          this.loadComments();
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

    // Save Watch Progress to Server History
    if (this.movieData?.movie?.slug && ep?.name) {
      const posterPath = this.movieData.movie.poster_url || this.movieData.movie.thumb_url;
      this.apiService.saveWatchProgress({
        movieSlug: this.movieData.movie.slug,
        movieName: this.movieData.movie.name,
        posterUrl: this.apiService.getImageUrl(posterPath),
        episodeSlug: ep.slug || '',
        episodeName: ep.name,
        currentTime: 0,
        duration: 0,
      }).subscribe({ error: () => {} });
    }
  }

  loadComments(): void {
    this.apiService.getMovieComments(this.slug).subscribe({
      next: (data) => {
        this.comments = data.comments || [];
        this.totalComments = data.totalComments || 0;
        this.avgRating = data.avgRating || 5;
      },
      error: () => {}
    });
  }

  submitComment(): void {
    if (!this.newCommentContent.trim()) {
      this.commentMsg = 'Vui lòng nhập nội dung bình luận';
      this.commentMsgIsError = true;
      return;
    }

    this.apiService.addMovieComment(this.slug, this.newCommentContent.trim(), this.selectedRating).subscribe({
      next: () => {
        this.commentMsg = 'Đã đăng bình luận thành công!';
        this.commentMsgIsError = false;
        this.newCommentContent = '';
        this.loadComments();
      },
      error: (err) => {
        if (err.status === 401) {
          this.commentMsg = 'Vui lòng đăng nhập để bình luận!';
        } else {
          this.commentMsg = 'Không thể gửi bình luận. Thử lại sau.';
        }
        this.commentMsgIsError = true;
      }
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
}
