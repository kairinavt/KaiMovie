import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService, MovieItem } from '../../core/services/api.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent],
  template: `
    <div class="search-page page-wrapper container">
      <div class="search-header">
        <h1 class="section-title">
          Kết quả tìm kiếm cho: <span class="highlight">"{{ keyword }}"</span>
        </h1>
        <p class="search-count" *ngIf="!loading">
          Tìm thấy {{ movies.length }} phim phù hợp
        </p>
      </div>

      <!-- Loading Skeleton -->
      <div class="movie-grid" *ngIf="loading">
        <div class="skeleton-card" *ngFor="let item of [1,2,3,4,5,6,7,8]">
          <div class="skeleton poster-skeleton"></div>
          <div class="skeleton title-skeleton"></div>
        </div>
      </div>

      <!-- Results Grid -->
      <div class="movie-grid" *ngIf="!loading && movies.length > 0">
        <app-movie-card *ngFor="let movie of movies" [movie]="movie"></app-movie-card>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && movies.length === 0">
        <div class="empty-icon">🔍</div>
        <h3>Không tìm thấy phim nào phù hợp</h3>
        <p>Thử tìm với từ khóa khác (ví dụ: Tên phim Tiếng Việt, tên Tiếng Anh, hoặc thể loại)...</p>
        <a routerLink="/" class="btn btn-primary" style="margin-top: 1rem;">Về Trang Chủ</a>
      </div>
    </div>
  `,
  styles: [`
    .search-page {
      padding-top: 2rem;
    }

    .search-header {
      margin-bottom: 2rem;
    }

    .highlight {
      color: var(--primary);
    }

    .search-count {
      color: var(--text-muted);
      margin-top: 0.25rem;
      font-size: 0.95rem;
    }

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

    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      .empty-icon {
        font-size: 3rem;
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  keyword = '';
  movies: MovieItem[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.keyword = queryParams['keyword'] || '';
      if (this.keyword) {
        this.performSearch();
      } else {
        this.movies = [];
        this.loading = false;
      }
    });
  }

  performSearch(): void {
    this.loading = true;
    this.apiService.searchMovies(this.keyword).subscribe({
      next: (res) => {
        this.movies = res.items || [];
        this.loading = false;
      },
      error: () => {
        this.movies = [];
        this.loading = false;
      }
    });
  }
}
