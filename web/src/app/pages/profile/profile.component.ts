import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="profile-page page-wrapper container">
      <!-- Ambient Glow Backdrop -->
      <div class="ambient-glow" [style.background]="getGlowGradient()"></div>

      <div class="profile-layout" *ngIf="user">
        <!-- Sidebar Profile Card -->
        <div class="profile-card glass-panel">
          <div class="avatar-wrapper">
            <img [src]="user.avatar || defaultAvatar" [alt]="user.name" class="profile-avatar" />
            <button class="avatar-edit-badge" (click)="showAvatarPicker = !showAvatarPicker" title="Đổi Ảnh Đại Diện">
              📷
            </button>
          </div>

          <h2 class="user-name">{{ user.name }}</h2>
          <p class="user-email">{{ user.email }}</p>
          <div class="vip-tag">{{ user.vipLevel || '⭐ Thành Viên VIP' }}</div>

          <p class="user-bio">
            "{{ user.bio || 'Yêu thích điện ảnh & trải nghiệm phim chất lượng cao trên KaiMovie!' }}"
          </p>

          <!-- Quick Stats Grid -->
          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-val">28</span>
              <span class="stat-lbl">Phim Đã Xem</span>
            </div>
            <div class="stat-box">
              <span class="stat-val">42h</span>
              <span class="stat-lbl">Thời Gian</span>
            </div>
            <div class="stat-box">
              <span class="stat-val">12</span>
              <span class="stat-lbl">Yêu Thích</span>
            </div>
          </div>

          <button class="btn btn-secondary btn-logout" (click)="onLogout()">
            🚪 Đăng Xuất Tài Khoản
          </button>
        </div>

        <!-- Main Customization & Settings Box -->
        <div class="profile-main glass-panel">
          <!-- Navigation Tabs -->
          <div class="profile-tabs">
            <button
              class="tab-btn"
              [class.active]="activeTab === 'edit'"
              (click)="activeTab = 'edit'">
              👤 Thẻ Cá Nhân
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'preferences'"
              (click)="activeTab = 'preferences'">
              ⚙️ Cấu Hình Xem Phim
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'history'"
              (click)="activeTab = 'history'; loadHistory()">
              🕒 Lịch Sử Xem
            </button>
          </div>

          <!-- Alert Success Message -->
          <div class="success-alert" *ngIf="saveMessage">
            <span>✅ {{ saveMessage }}</span>
          </div>

          <!-- Avatar Picker Modal Drawer -->
          <div class="avatar-picker-box" *ngIf="showAvatarPicker">
            <h4 class="picker-title">Chọn Ảnh Đại Diện Cyberpunk & Anime</h4>
            <div class="avatar-presets">
              <img
                *ngFor="let av of avatarPresets"
                [src]="av"
                class="preset-img"
                [class.selected]="user.avatar === av"
                (click)="selectAvatar(av)"
              />
            </div>
            <div class="custom-avatar-input">
              <input type="text" placeholder="Hoặc dán URL ảnh đại diện riêng..." [(ngModel)]="customAvatarUrl" />
              <button class="btn btn-primary btn-sm" (click)="selectAvatar(customAvatarUrl)">Áp Dụng</button>
            </div>
          </div>

          <!-- Tab 1: Edit Profile -->
          <div class="tab-content" *ngIf="activeTab === 'edit'">
            <h3 class="tab-title">Chỉnh Sửa Thông Tin Cá Nhân</h3>
            <form (ngSubmit)="saveProfile()" class="edit-form">
              <div class="form-group">
                <label>Họ và Tên Hợp Lệ</label>
                <input type="text" [(ngModel)]="editName" name="editName" required />
              </div>

              <div class="form-group">
                <label>Tiểu Sử / Slogan Cá Nhân</label>
                <textarea rows="3" [(ngModel)]="editBio" name="editBio" placeholder="Viết vài dòng giới thiệu về gu xem phim của bạn..."></textarea>
              </div>

              <div class="form-group">
                <label>Mức Độ VIP Hỗ Trợ</label>
                <select [(ngModel)]="editVipLevel" name="editVipLevel">
                  <option value="⭐ Thành Viên VIP">⭐ Thành Viên VIP</option>
                  <option value="👑 VIP Super Pro 4K">👑 VIP Super Pro 4K</option>
                  <option value="🔥 Premium Ultra HD">🔥 Premium Ultra HD</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary btn-save">
                💾 Lưu Thay Đổi
              </button>
            </form>
          </div>

          <!-- Tab 2: Preferences & Theme Accent -->
          <div class="tab-content" *ngIf="activeTab === 'preferences'">
            <h3 class="tab-title">Tuỳ Biến Giao Diện & Trình Phát</h3>

            <div class="pref-group">
              <label class="pref-label">Tông Màu Nhấn Giao Diện (Theme Accent Color)</label>
              <div class="color-picker-grid">
                <button
                  *ngFor="let col of colorOptions"
                  class="color-chip"
                  [style.background]="col.code"
                  [class.active]="editAccentColor === col.code"
                  (click)="editAccentColor = col.code"
                  [title]="col.name">
                  <span *ngIf="editAccentColor === col.code">✓</span>
                </button>
              </div>
            </div>

            <div class="pref-group">
              <label class="pref-label">Chất Lượng Video Mặc Định Khi Xem</label>
              <select [(ngModel)]="editQuality" class="pref-select">
                <option value="4K Ultra">⚡ 4K Ultra HD (Ưu tiên chất lượng cao nhất)</option>
                <option value="1080p">🎬 1080p Full HD (Khuyên dùng)</option>
                <option value="720p">📱 720p HD (Tối ưu dữ liệu mạng di động)</option>
              </select>
            </div>

            <div class="pref-group toggle-group">
              <div>
                <div class="toggle-title">Tự Động Phát Tập Tiếp Theo</div>
                <div class="toggle-desc">Tự chuyển sang tập mới khi hết tập phim đang phát</div>
              </div>
              <input type="checkbox" class="toggle-switch" [(ngModel)]="editAutoplay" />
            </div>

            <button class="btn btn-primary btn-save" (click)="saveProfile()">
              ⚙️ Lưu Cấu Hình Tuỳ Biến
            </button>
          </div>

          <!-- Tab 3: History & Recent Movies -->
          <div class="tab-content" *ngIf="activeTab === 'history'">
            <div class="history-header">
              <h3 class="tab-title">Lịch Sử Xem Phim</h3>
              <button class="btn btn-secondary btn-sm" (click)="clearHistory()">Xóa Lịch Sử</button>
            </div>

            <div class="history-list" *ngIf="watchHistory.length > 0">
              <div class="history-item" *ngFor="let h of watchHistory">
                <img [src]="h.posterUrl || defaultPoster" [alt]="h.movieName" class="h-poster" />
                <div class="h-info">
                  <h4 class="h-title">
                    <a [routerLink]="['/xem-phim', h.movieSlug]">{{ h.movieName }}</a>
                  </h4>
                  <span class="h-ep" *ngIf="h.episodeName">Tập phim: {{ h.episodeName }}</span>
                  <span class="h-time">Cập nhật: {{ h.updatedAt | date:'HH:mm dd/MM/yyyy' }}</span>
                </div>
                <a [routerLink]="['/xem-phim', h.movieSlug]" class="btn btn-primary btn-sm btn-play-h">
                  ▶ Tiếp Tục
                </a>
              </div>
            </div>

            <div class="empty-state" *ngIf="watchHistory.length === 0">
              <p>Chưa có lịch sử xem phim nào gần đây.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Guest State -->
      <div class="auth-card empty-state" *ngIf="!user" style="margin: 4rem auto; text-align: center;">
        <h2>🔒 Bạn Chưa Đăng Nhập</h2>
        <p>Vui lòng đăng nhập để tuỳ biến trang cá nhân và theo dõi lịch sử xem phim.</p>
        <a routerLink="/dang-nhap" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">
          🔑 Đăng Nhập Ngay
        </a>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      position: relative;
      padding-top: 2rem;
      padding-bottom: 4rem;
    }

    .ambient-glow {
      position: absolute;
      width: 600px;
      height: 600px;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 0;
      filter: blur(80px);
      opacity: 0.15;
    }

    .profile-layout {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 2rem;
    }

    .profile-card {
      background: rgba(18, 22, 34, 0.85);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .avatar-wrapper {
      position: relative;
      margin-bottom: 1rem;
    }

    .profile-avatar {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--primary);
      box-shadow: 0 0 20px var(--primary-glow);
    }

    .avatar-edit-badge {
      position: absolute;
      bottom: 2px;
      right: 2px;
      background: var(--primary-gradient);
      border: 2px solid #000;
      color: #ffffff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }

    .user-name {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 800;
      color: #ffffff;
    }

    .user-email {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.6rem;
    }

    .vip-tag {
      background: rgba(251, 191, 36, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.4);
      color: #fbbf24;
      padding: 0.35rem 0.9rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 1.2rem;
    }

    .user-bio {
      font-size: 0.88rem;
      color: #94a3b8;
      font-style: italic;
      line-height: 1.4;
      margin-bottom: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.6rem;
      width: 100%;
      margin-bottom: 1.8rem;
    }

    .stat-box {
      background: rgba(7, 9, 14, 0.7);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 0.75rem 0.3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-val {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--primary);
    }

    .stat-lbl {
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }

    .btn-logout {
      width: 100%;
      padding: 0.7rem;
      font-size: 0.88rem;
      border-radius: 20px;
    }

    .profile-main {
      background: rgba(18, 22, 34, 0.85);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 2rem;
    }

    .profile-tabs {
      display: flex;
      gap: 0.75rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.6rem 1.2rem;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .tab-btn.active {
      background: var(--primary-gradient);
      color: #ffffff;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    .tab-title {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 1.2rem;
    }

    .success-alert {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 0.88rem;
      margin-bottom: 1.2rem;
    }

    .avatar-picker-box {
      background: rgba(10, 14, 22, 0.95);
      border: 1px solid var(--primary);
      border-radius: 14px;
      padding: 1.2rem;
      margin-bottom: 1.5rem;
    }

    .picker-title {
      font-size: 0.95rem;
      color: #ffffff;
      margin-bottom: 0.8rem;
    }

    .avatar-presets {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.9rem;
      overflow-x: auto;
    }

    .preset-img {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .preset-img.selected, .preset-img:hover {
      border-color: var(--primary);
      transform: scale(1.1);
    }

    .custom-avatar-input {
      display: flex;
      gap: 0.5rem;
    }

    .custom-avatar-input input {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      color: #ffffff;
      font-size: 0.85rem;
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;

      label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #cbd5e1;
      }

      input, textarea, select {
        background: rgba(7, 9, 14, 0.8);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 0.75rem;
        color: #ffffff;
        font-size: 0.9rem;
        outline: none;

        &:focus {
          border-color: var(--primary);
        }
      }
    }

    .btn-save {
      align-self: flex-start;
      padding: 0.75rem 1.8rem;
      border-radius: 25px;
      margin-top: 0.5rem;
    }

    .pref-group {
      margin-bottom: 1.5rem;
    }

    .pref-label {
      display: block;
      font-size: 0.88rem;
      font-weight: 700;
      color: #cbd5e1;
      margin-bottom: 0.6rem;
    }

    .color-picker-grid {
      display: flex;
      gap: 0.75rem;
    }

    .color-chip {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      color: #ffffff;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }

    .color-chip.active {
      border-color: #ffffff;
      transform: scale(1.15);
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
    }

    .pref-select {
      width: 100%;
      background: rgba(7, 9, 14, 0.8);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 0.75rem;
      color: #ffffff;
    }

    .toggle-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.03);
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }

    .toggle-title {
      font-weight: 700;
      color: #ffffff;
      font-size: 0.92rem;
    }

    .toggle-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .toggle-switch {
      width: 22px;
      height: 22px;
      cursor: pointer;
      accent-color: var(--primary);
    }

    /* History List */
    .history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.2rem;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      padding: 0.75rem;
      border-radius: 12px;
    }

    .h-poster {
      width: 50px;
      height: 70px;
      object-fit: cover;
      border-radius: 6px;
    }

    .h-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .h-title a {
      font-family: var(--font-heading);
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
      &:hover { color: var(--primary); }
    }

    .h-ep {
      font-size: 0.82rem;
      color: var(--primary);
      font-weight: 600;
    }

    .h-time {
      font-size: 0.75rem;
      color: #64748b;
    }

    .btn-play-h {
      padding: 0.4rem 0.9rem;
      font-size: 0.8rem;
      border-radius: 15px;
    }

    @media (max-width: 868px) {
      .profile-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  activeTab: 'edit' | 'preferences' | 'history' = 'edit';
  saveMessage = '';
  showAvatarPicker = false;
  customAvatarUrl = '';

  defaultAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=KaiMovieUser';
  defaultPoster = 'assets/placeholder-poster.png';

  avatarPresets = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=CyberPunk1',
    'https://api.dicebear.com/7.x/bottts/svg?seed=KaiMovieStar',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/bottts/svg?seed=NeonMatrix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack'
  ];

  colorOptions = [
    { name: 'Cyberpunk Pink', code: '#ff2a5f' },
    { name: 'Electric Purple', code: '#a855f7' },
    { name: 'Cyber Cyan', code: '#06b6d4' },
    { name: 'Emerald Green', code: '#10b981' }
  ];

  // Edit State
  editName = '';
  editBio = '';
  editVipLevel = '⭐ Thành Viên VIP';
  editAccentColor = '#ff2a5f';
  editQuality = '1080p';
  editAutoplay = true;

  watchHistory: any[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.user = u;
      if (u) {
        this.editName = u.name || '';
        this.editBio = u.bio || '';
        this.editVipLevel = u.vipLevel || '⭐ Thành Viên VIP';
        this.editAccentColor = u.accentColor || '#ff2a5f';
        this.editQuality = u.preferredQuality || '1080p';
        this.editAutoplay = u.autoplayNext !== false;
      }
    });
  }

  selectAvatar(url: string): void {
    if (!url) return;
    this.authService.updateProfile({ avatar: url });
    this.showAvatarPicker = false;
    this.showSaveSuccess('Đã cập nhật ảnh đại diện mới!');
  }

  saveProfile(): void {
    this.authService.updateProfile({
      name: this.editName,
      bio: this.editBio,
      vipLevel: this.editVipLevel,
      accentColor: this.editAccentColor,
      preferredQuality: this.editQuality,
      autoplayNext: this.editAutoplay
    });
    this.showSaveSuccess('Đã lưu thay đổi hồ sơ & cấu hình giao diện thành công!');
  }

  loadHistory(): void {
    this.apiService.getWatchHistory().subscribe({
      next: (res) => this.watchHistory = res || [],
      error: () => this.watchHistory = []
    });
  }

  clearHistory(): void {
    this.watchHistory = [];
    this.showSaveSuccess('Đã xóa sạch lịch sử xem phim.');
  }

  getGlowGradient(): string {
    return `radial-gradient(circle, ${this.editAccentColor} 0%, transparent 70%)`;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  private showSaveSuccess(msg: string): void {
    this.saveMessage = msg;
    setTimeout(() => this.saveMessage = '', 3500);
  }
}
