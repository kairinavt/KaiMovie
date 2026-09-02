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

        <!-- Col 4: Mobile & TV App Download Badges -->
        <div class="footer-col app-col">
          <h4 class="footer-heading">Ứng Dụng Mobile & TV</h4>
          <p class="app-desc">Tải ứng dụng KaiMovie hỗ trợ Android Mobile và Android TV Remote:</p>

          <a href="http://192.168.100.115:5000/downloads/kaimovie-app.apk" download="kaimovie-app.apk" class="btn-apk-footer">
            <span class="apk-icon">📱</span>
            <div class="apk-text">
              <span class="apk-sub">TẢI VỀ CHO ANDROID MOBILE</span>
              <span class="apk-title">KaiMovie-App.apk (v1.0)</span>
            </div>
          </a>

          <a href="http://192.168.100.115:5000/downloads/kaimovie-tv-app.apk" download="kaimovie-tv-app.apk" class="btn-apk-footer btn-tv-footer">
            <span class="apk-icon">📺</span>
            <div class="apk-text">
              <span class="apk-sub">TẢI VỀ CHO ANDROID TV</span>
              <span class="apk-title">KaiMovie-TV.apk (v1.0)</span>
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
      color: #ffffff;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
    }

    .logo-text span {
      color: var(--primary);
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
    }

    .social-icon:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .footer-heading {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 800;
      color: #ffffff;
      position: relative;
      padding-bottom: 0.5rem;
    }

    .footer-heading::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30px;
      height: 3px;
      background: var(--primary-gradient);
      border-radius: 2px;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .footer-links a {
      color: var(--text-muted);
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.25s ease;
    }

    .footer-links a:hover {
      color: #ffffff;
      padding-left: 5px;
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
      color: #ffffff;
      padding: 0.65rem 1rem;
      border-radius: 14px;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);
      transition: all 0.3s ease;
    }

    .btn-tv-footer {
      background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
      box-shadow: 0 4px 20px rgba(168, 85, 247, 0.35);
    }

    .btn-apk-footer:hover {
      transform: translateY(-3px);
      color: #ffffff;
    }

    .apk-icon {
      font-size: 1.6rem;
    }

    .apk-text {
      display: flex;
      flex-direction: column;
    }

    .apk-sub {
      font-size: 0.65rem;
      font-weight: 800;
      opacity: 0.9;
      letter-spacing: 0.5px;
    }

    .apk-title {
      font-size: 0.88rem;
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
    }

    .legal-links {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .legal-links a:hover {
      color: var(--text-muted);
    }

    .dot {
      color: #334155;
    }

    @media (max-width: 992px) {
      .footer-main { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 576px) {
      .footer-main { grid-template-columns: 1fr; }
      .bottom-content { flex-direction: column; gap: 0.6rem; text-align: center; }
    }
  `]
})
export class FooterComponent {}
