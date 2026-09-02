import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, MovieItem } from '../../core/services/api.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MovieCardComponent],
  template: `
    <div class="search-page page-wrapper container">
      <!-- Filter Toolbar -->
      <div class="filter-panel">
        <h2 class="filter-heading">⚙️ Bộ Lọc Phim Nâng Cao</h2>
        <div class="filter-controls">
          <!-- Keyword Input -->
          <div class="filter-group">
            <label>Từ khóa</label>
            <input type="text" [(ngModel)]="keyword" placeholder="Nhập tên phim..." (keyup.enter)="applyFilters()" />
          </div>

          <!-- Category Select -->
          <div class="filter-group">
            <label>Thể loại</label>
            <select [(ngModel)]="selectedCategory" (change)="applyFilters()">
              <option value="">-- Tất cả thể loại --</option>
              <option *ngFor="let cat of categories" [value]="cat.slug">{{ cat.name }}</option>
            </select>
          </div>

          <!-- Country Select -->
          <div class="filter-group">
            <label>Quốc gia</label>
            <select [(ngModel)]="selectedCountry" (change)="applyFilters()">
              <option value="">-- Tất cả quốc gia --</option>
              <option *ngFor="let c of countries" [value]="c.slug">{{ c.name }}</option>
            </select>
          </div>

          <!-- Year Select -->
          <div class="filter-group">
            <label>Năm phát hành</label>
            <select [(ngModel)]="selectedYear" (change)="applyFilters()">
              <option value="">-- Tất cả các năm --</option>
              <option *ngFor="let y of [2026,2025,2024,2023,2022,2021,2020]" [value]="y">{{ y }}</option>
            </select>
          </div>

          <button class="btn btn-primary btn-apply" (click)="applyFilters()">
            🔍 Lọc Phim
          </button>
        </div>
      </div>

      <!-- Search Header Count -->
      <div class="search-header">
        <h1 class="section-title">
          Kết quả lọc phim: <span class="highlight" *ngIf="keyword">"{{ keyword }}"</span>
        </h1>
        <p class="search-count" *ngIf="!loading">
          Tìm thấy {{ filteredMovies.length }} kết quả phù hợp
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
      <div class="movie-grid" *ngIf="!loading && filteredMovies.length > 0">
        <app-movie-card *ngFor="let movie of filteredMovies" [movie]="movie"></app-movie-card>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredMovies.length === 0">
        <div class="empty-icon">🔍</div>
        <h3>Không tìm thấy phim nào phù hợp</h3>
        <p>Thử điều chỉnh lại bộ lọc thể loại, quốc gia hoặc từ khóa tìm kiếm...</p>
        <button class="btn btn-primary" (click)="resetFilters()" style="margin-top: 1rem;">Đặt Lại Bộ Lọc</button>
      </div>
    </div>
  `,
  styles: [`
    .search-page {
      padding-top: 2rem;
    }

    .filter-panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .filter-heading {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1.2rem;
    }

    .filter-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      align-items: flex-end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .filter-group label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .filter-group input, .filter-group select {
      background: rgba(7, 9, 14, 0.8);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 0.65rem 0.8rem;
      color: #ffffff;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.25s ease;
    }

    .filter-group input:focus, .filter-group select:focus {
      border-color: var(--primary);
    }

    .btn-apply {
      padding: 0.65rem 1.4rem;
      border-radius: 20px;
      height: 42px;
    }

    .search-header {
      margin-bottom: 1.5rem;
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
    }

    .empty-icon {
      font-size: 3rem;
    }
  `]
})
export class SearchComponent implements OnInit {
  keyword = '';
  selectedCategory = '';
  selectedCountry = '';
  selectedYear = '';

  categories: any[] = [];
  countries: any[] = [];
  rawMovies: MovieItem[] = [];
  filteredMovies: MovieItem[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getCategories().subscribe(res => this.categories = res || []);
    this.apiService.getCountries().subscribe(res => this.countries = res || []);

    this.route.queryParams.subscribe((queryParams) => {
      this.keyword = queryParams['keyword'] || '';
      this.selectedCategory = queryParams['category'] || '';
      this.selectedCountry = queryParams['country'] || '';
      this.selectedYear = queryParams['year'] || '';
      this.performSearch();
    });
  }

  performSearch(): void {
    this.loading = true;

    if (this.selectedCategory) {
      this.apiService.getByCategory(this.selectedCategory, 1).subscribe({
        next: (res) => {
          this.rawMovies = res.items || [];
          this.applyLocalFilters();
        },
        error: () => { this.filteredMovies = []; this.loading = false; }
      });
    } else if (this.selectedCountry) {
      this.apiService.getByCountry(this.selectedCountry, 1).subscribe({
        next: (res) => {
          this.rawMovies = res.items || [];
          this.applyLocalFilters();
        },
        error: () => { this.filteredMovies = []; this.loading = false; }
      });
    } else if (this.keyword) {
      this.apiService.searchMovies(this.keyword).subscribe({
        next: (res) => {
          this.rawMovies = res.items || [];
          this.applyLocalFilters();
        },
        error: () => { this.filteredMovies = []; this.loading = false; }
      });
    } else {
      this.apiService.getLatestMovies(1).subscribe({
        next: (res) => {
          this.rawMovies = res.items || [];
          this.applyLocalFilters();
        },
        error: () => { this.filteredMovies = []; this.loading = false; }
      });
    }
  }

  applyLocalFilters(): void {
    let result = [...this.rawMovies];

    if (this.keyword.trim()) {
      const k = this.keyword.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(k) || m.origin_name.toLowerCase().includes(k)
      );
    }

    if (this.selectedYear) {
      result = result.filter(m => String(m.year) === String(this.selectedYear));
    }

    this.filteredMovies = result;
    this.loading = false;
  }

  applyFilters(): void {
    this.router.navigate(['/tim-kiem'], {
      queryParams: {
        keyword: this.keyword || null,
        category: this.selectedCategory || null,
        country: this.selectedCountry || null,
        year: this.selectedYear || null,
      }
    });
  }

  resetFilters(): void {
    this.keyword = '';
    this.selectedCategory = '';
    this.selectedCountry = '';
    this.selectedYear = '';
    this.applyFilters();
  }
}
