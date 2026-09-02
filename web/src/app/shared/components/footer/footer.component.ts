import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <div class="logo-text">Kai<span>Movie</span></div>
          <p>Ứng dụng xem phim trực tuyến hiện đại. Dữ liệu phim được cập nhật liên tục từ VSMOV API.</p>
        </div>
        <div class="footer-app-download">
          <a href="http://192.168.100.115:5000/downloads/kaimovie-app.apk" download="kaimovie-app.apk" class="btn-apk-footer">
            📱 Tải App KaiMovie APK Cho Android (v1.0.0)
          </a>
        </div>
        <div class="footer-copy">
          <p>© 2026 KaiMovie Team. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-surface);
      border-top: 1px solid var(--border-color);
      padding: 2.5rem 0 1.5rem;
      margin-top: 4rem;
    }

    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.2rem;
      text-align: center;
    }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;

      span { color: var(--primary); }
    }

    .footer-brand p {
      color: var(--text-muted);
      font-size: 0.9rem;
      max-width: 500px;
    }

    .btn-apk-footer {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      font-weight: 700;
      font-size: 0.88rem;
      padding: 0.6rem 1.4rem;
      border-radius: 25px;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
        color: #fff;
      }
    }

    .footer-copy {
      color: #64748b;
      font-size: 0.82rem;
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
      width: 100%;
    }
  `]
})
export class FooterComponent {}
