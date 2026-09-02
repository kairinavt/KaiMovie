import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container footer-main">
        <!-- Col 1: Brand Info -->
        <div class="footer-col brand-col">
          <a routerLink="/" class="logo">
            <div class="logo-badge">K</div>
            <span class="logo-text">Kai<span>Movie</span></span>
          </a>
          <p class="brand-desc">
            Trải nghiệm nền tảng xem phim trực tuyến hiện đại 4K/Full HD, tốc độ cao không quảng cáo. Dữ liệu liên tục cập nhật từ VSMOV API.
          </p>
          <div class="social-links">
            <a href="https://github.com/kairinavt/KaiMovie" target="_blank" class="social-icon" title="GitHub Project">
              <span>🐙</span> GitHub
            </a>
            <a href="#" class="social-icon" title="Telegram Channel">
              <span>✈️</span> Telegram
            </a>
            <a href="#" class="social-icon" title="Facebook Page">
              <span>📘</span> Facebook
            </a>
          </div>
        </div>

        <!-- Col 2: Navigation Links -->
        <div class="footer-col">
          <h4 class="footer-heading">Khám Phá</h4>
          <ul class="footer-links">
            <li><a routerLink="/">🔥 Phim Mới Cập Nhật</a></li>
            <li><a [routerLink]="['/the-loai', 'phim-bo']">🎬 Phim Bộ Hot</a></li>
            <li><a [routerLink]="['/the-loai', 'phim-le']">📽️ Phim Lẻ Chiếu Rạp</a></li>
            <li><a [routerLink]="['/the-loai', 'hoat-hinh']">🐉 Anime & Hoạt Hình</a></li>
            <li><a [routerLink]="['/the-loai', 'tv-shows']">📺 TV Shows & Reality</a></li>
          </ul>
        </div>

        <!-- Col 3: Popular Genres -->
        <div class="footer-col">
          <h4 class="footer-heading">Thể Loại Hot</h4>
          <ul class="footer-links">
            <li><a [routerLink]="['/the-loai', 'hanh-dong']">⚔️ Phim Hành Động</a></li>
            <li><a [routerLink]="['/the-loai', 'tinh-cam']">❤️ Phim Tình Cảm</a></li>
            <li><a [routerLink]="['/the-loai', 'vien-tuong']">🚀 Phim Viễn Tưởng</a></li>
            <li><a [routerLink]="['/the-loai', 'co-trang']">⚔️ Phim Cổ Trang</a></li>
            <li><a [routerLink]="['/the-loai', 'hai-huoc']">🤣 Phim Hài Hước</a></li>
          </ul>
        </div>

        <!-- Col 4: Mobile App Download Badge -->
        <div class="footer-col app-col">
          <h4 class="footer-heading">Ứng Dụng Mobile</h4>
          <p class="app-desc">Tải ngay ứng dụng KaiMovie dành riêng cho thiết bị di động Android:</p>
          <a href="http://192.168.100.115:5000/downloads/kaimovie-app.apk" download="kaimovie-app.apk" class="btn-apk-footer">
            <span class="apk-icon">📱</span>
            <div class="apk-text">
              <span class="apk-sub">TẢI VỀ CHO ANDROID</span>
              <span class="apk-title">KaiMovie.apk (v1.0)</span>
            </div>
          </a>
          <div class="server-status">
            <span class="status-dot"></span> Server API: <strong>Online (200 OK)</strong>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="container bottom-content">
          <p>© 2026 KaiMovie Team. All rights reserved.</p>
          <div class="legal-links">
            <a href="#">Điều khoản sử dụng</a>
            <span class="dot">•</span>
            <a href="#">Chính sách bảo mật</a>
            <span class="dot">•</span>
            <a href="#">Khiếu nại bản quyền</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(180deg, rgba(12, 15, 23, 0.95) 0%, #05070a 100%);
      border-top: 1px solid var(--border-color);
      padding-top: 3.5rem;
      margin-top: 5rem;
      position: relative;
    }

    .footer-main {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.5rem;
      padding-bottom: 3rem;

      @media (max-width: 992px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
    }

    .footer-col {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .logo-badge {
      width: 38px;
      height: 38px;
      background: var(--primary-gradient);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.4rem;
      color: #fff;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
      span { color: var(--primary); }
    }

    .brand-desc {
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.6;
    }

    .social-links {
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
      margin-top: 0.2rem;
    }

    .social-icon {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 600;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
    }

    .footer-heading {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 800;
      color: #fff;
      position: relative;
      padding-bottom: 0.5rem;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30px;
        height: 3px;
        background: var(--primary-gradient);
        border-radius: 2px;
      }
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;

      a {
        color: var(--text-muted);
        font-size: 0.88rem;
        font-weight: 500;
        transition: all 0.25s ease;

        &:hover {
          color: #fff;
          padding-left: 5px;
        }
      }
    }

    .app-desc {
      color: var(--text-muted);
      font-size: 0.86rem;
    }

    .btn-apk-footer {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      padding: 0.75rem 1.2rem;
      border-radius: 14px;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.55);
        color: #fff;
      }
    }

    .apk-icon {
      font-size: 1.8rem;
    }

    .apk-text {
      display: flex;
      flex-direction: column;
    }

    .apk-sub {
      font-size: 0.68rem;
      font-weight: 800;
      opacity: 0.9;
      letter-spacing: 0.5px;
    }

    .apk-title {
      font-size: 0.92rem;
      font-weight: 800;
    }

    .server-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.4rem;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;

      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .footer-bottom {
      border-top: 1px solid var(--border-color);
      padding: 1.25rem 0;
      background: rgba(0, 0, 0, 0.4);
    }

    .bottom-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #64748b;
      font-size: 0.82rem;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.6rem;
        text-align: center;
      }
    }

    .legal-links {
      display: flex;
      align-items: center;
      gap: 0.6rem;

      a:hover {
        color: var(--text-muted);
      }
    }

    .dot {
      color: #334155;
    }
  `]
})
export class FooterComponent {}
