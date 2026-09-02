# KAIMOVIE — RULES & SPEC KỸ THUẬT

> App xem phim đa nền tảng (Web + Mobile), UI/UX hiện đại, dữ liệu lấy từ **VSMOV API** (`https://vsmov.com/api-document`).
> File này dùng làm "luật" chung: kiến trúc, quy ước code, danh sách tính năng, chuẩn UI/UX — để dev (hoặc AI coding assistant) bám theo khi build.

---

## 1. Kiến trúc tổng thể

```
                     ┌─────────────────────┐
                     │   VSMOV Public API   │  (bên thứ 3, chỉ đọc)
                     │  https://vsmov.com   │
                     └──────────┬───────────┘
                                │ GET (proxy + cache)
                     ┌──────────▼───────────┐
                     │  KaiMovie Backend     │  Node.js + Express + MongoDB
                     │  (BFF / API Gateway)  │
                     └──────┬────────┬───────┘
                REST/JSON   │        │   REST/JSON
              ┌─────────────▼─┐   ┌──▼──────────────┐
              │  KaiMovie Web  │   │ KaiMovie Mobile │
              │ Angular+PrimeNG│   │     Flutter     │
              └────────────────┘   └─────────────────┘
```

**Nguyên tắc bắt buộc:**
- Web và Mobile **không gọi thẳng** API vsmov.com. Tất cả đi qua **backend riêng của KaiMovie**.
- Lý do: (1) giấu domain nguồn phim, dễ đổi nguồn sau này; (2) thêm cache giảm tải & tăng tốc; (3) gắn thêm tính năng riêng (yêu thích, lịch sử, bình luận, đánh giá) mà API gốc không có vì nó chỉ read-only; (4) tránh lỗi CORS trên web/app.
- Backend là nguồn sự thật duy nhất cho **dữ liệu người dùng** (MongoDB). Dữ liệu phim luôn lấy tươi/cache từ VSMOV, không đồng bộ full vào DB riêng.

---

## 2. Nguồn dữ liệu — VSMOV API

Base URL: `https://vsmov.com/api` · Format: JSON (UTF-8) · Method: GET, không cần token.

| Nhóm | Endpoint | Mô tả |
|---|---|---|
| Trang chủ | `/danh-sach/phim-moi-cap-nhat?page=` | Phim mới cập nhật |
| Tìm kiếm | `/tim-kiem?keyword=&limit=` | Tìm phim theo từ khóa |
| Thể loại | `/the-loai` | Danh sách thể loại |
| Thể loại (lọc) | `/the-loai/{slug}?page=` | Phim theo thể loại |
| Quốc gia | `/quoc-gia` | Danh sách quốc gia |
| Quốc gia (lọc) | `/quoc-gia/{slug}?page=` | Phim theo quốc gia |
| Năm phát hành | `/nam-phat-hanh` | Danh sách năm |
| Năm (lọc) | `/nam-phat-hanh/{year}?page=` | Phim theo năm |
| Chi tiết phim | `/phim/{slug}` | Thông tin phim + `episodes` (tập/server phát) |
| Diễn viên | endpoint riêng trong mục "API Phim" | Thông tin diễn viên |
| Code/Showtimes | `/danh-sach/subteam`, theo code | Lịch chiếu/subteam |

Response chuẩn dạng:
```json
{
  "status": true,
  "items": [ { "_id", "name", "origin_name", "slug", "poster_url", "thumb_url", "year", "tmdb": {...}, "imdb": {...} } ],
  "pagination": { "totalItems", "totalItemsPerPage", "currentPage", "totalPages" }
}
```
Chi tiết phim (`/phim/{slug}`) trả thêm: `content`, `type` (single/series), `episode_current`, `episode_total`, `quality`, `lang`, `category[]`, `country[]`, `actor[]`, `director[]`, `episodes[]` (server + link tập).

**Rule xử lý dữ liệu:**
- Luôn kiểm tra `status === true` trước khi dùng.
- Ảnh (`poster_url`, `thumb_url`) đã là URL đầy đủ (CDN vsmov) → dùng thẳng, không cần ghép `pathImage` trừ khi field trả về đường dẫn tương đối.
- Cache ở backend theo key `endpoint + query params`, TTL đề xuất: trang chủ/danh sách 10–15 phút, chi tiết phim 30–60 phút, thể loại/quốc gia/năm 24h (ít đổi).
- Nếu VSMOV lỗi/timeout → trả cache cũ (nếu có) kèm flag `stale: true`, không để app trắng màn hình.

---

## 3. Backend (Node.js + Express + MongoDB)

### 3.1 Cấu trúc thư mục
```
server/
 ├─ src/
 │   ├─ config/          # kết nối DB, env, cache (node-cache/redis)
 │   ├─ modules/
 │   │   ├─ movies/       # proxy + cache gọi VSMOV (controller, service)
 │   │   ├─ auth/         # đăng ký/đăng nhập, JWT, refresh token
 │   │   ├─ favorites/    # CRUD yêu thích
 │   │   ├─ history/      # lịch sử xem, tiếp tục xem
 │   │   ├─ ratings/      # đánh giá sao
 │   │   ├─ comments/     # bình luận theo phim
 │   │   └─ users/        # hồ sơ người dùng
 │   ├─ middlewares/      # auth guard, rate-limit, error handler
 │   ├─ utils/            # axios client gọi vsmov, response wrapper
 │   └─ app.js
 └─ .env                  # VSMOV_BASE_URL, MONGO_URI, JWT_SECRET, PORT
```

### 3.2 Models MongoDB (dữ liệu riêng của KaiMovie)
- **User**: `email, passwordHash, name, avatar, provider (local/google), createdAt`
- **Favorite**: `userId, movieSlug, movieSnapshot{name, poster_url, year}, createdAt`
- **WatchHistory**: `userId, movieSlug, episodeName, progressSeconds, updatedAt` → dùng cho "Tiếp tục xem"
- **Rating**: `userId, movieSlug, score(1-10)`
- **Comment**: `userId, movieSlug, content, parentId (reply), createdAt`

### 3.3 Quy ước API riêng
- Prefix `/api/v1`. Endpoint phim proxy: `/api/v1/movies/...` (mirror cấu trúc VSMOV nhưng có cache).
- Endpoint user-feature cần JWT: `/api/v1/favorites`, `/api/v1/history`, `/api/v1/ratings`, `/api/v1/comments`.
- Response format đồng nhất: `{ success, data, message, pagination? }`.
- Validate input bằng `joi` hoặc `zod`. Rate-limit các route public (search, danh sách) để tránh spam kéo API nguồn.
- Log lỗi gọi VSMOV riêng (không để lộ stack trace ra client).

---

## 4. Web App (Angular + PrimeNG + ngx-formly)

- Dùng **standalone components**, lazy-load theo route (`loadComponent`) cho từng trang: Home, Search, Category, MovieDetail, Watch, Favorites, History, Profile, Auth.
- State: `signal`/`RxJS` cho state cục bộ; cân nhắc thêm store nhẹ (NgRx SignalStore hoặc service-based state) cho favorites/watch history vì dùng lại nhiều nơi.
- PrimeNG components gợi ý: `Carousel` (banner trending), `DataView`/`Card` (grid phim), `Skeleton` (loading), `InputText` + debounce (search), `TabView` (chọn tập/server), `Dropdown` (lọc thể loại/quốc gia/năm), `Paginator` hoặc infinite scroll.
- ngx-formly cho các form: đăng ký/đăng nhập, form bình luận, form đổi profile.
- Player: HLS.js hoặc video.js nếu link tập là m3u8; nếu là iframe embed từ server phim thì nhúng `iframe` có sandbox hợp lý.
- Responsive: mobile-first, breakpoint theo PrimeFlex/Tailwind (nếu thêm), tối thiểu test tại 360px, 768px, 1280px.

## 5. Mobile App (Flutter)

- State management: **Riverpod** hoặc **Bloc** (chọn 1, đồng bộ với dự án `food_store` nếu đã dùng sẵn pattern nào — dùng lại cho quen).
- Cấu trúc theo tính năng (feature-first): `lib/features/{home, search, movie_detail, player, favorites, history, auth, profile}/{data, domain, presentation}`.
- Networking: `dio` + interceptor gắn JWT + retry/cache (dio_cache_interceptor).
- Video player: `video_player` + `chewie` cho m3u8/mp4; nếu server trả iframe web thì dùng `webview_flutter`.
- Ảnh: `cached_network_image` để cache poster/thumbnail, có placeholder blur/skeleton.
- Offline nhẹ: cache danh sách trang chủ + favorites bằng `hive`/`sqflite` để mở app có dữ liệu ngay cả khi mạng chậm.
- Navigation: `go_router`, deep link tới `movie/{slug}` để share phim.

### 5.1 Cập nhật APK trong app (in-app update, Android)
Vì app Android có thể phát hành ngoài Play Store (tải file APK trực tiếp), cần cơ chế tự kiểm tra & tải bản cập nhật:
- **Backend** thêm endpoint public: `GET /api/v1/app/version` trả về:
  ```json
  {
    "latestVersionCode": 12,
    "latestVersionName": "1.3.0",
    "apkUrl": "https://cdn.kaimovie.app/releases/kaimovie-1.3.0.apk",
    "changelog": "Sửa lỗi phát video, thêm dark mode...",
    "forceUpdate": false
  }
  ```
- **Flutter**: dùng `package_info_plus` lấy `versionCode` hiện tại → so với `latestVersionCode` từ API mỗi khi mở app (hoặc định kỳ). Nếu có bản mới → hiện dialog thông báo (bắt buộc cập nhật nếu `forceUpdate = true`, không cho vào app cho tới khi cập nhật).
- Tải APK: dùng `dio` tải file về thư mục cache (`path_provider`), hiện progress bar % tải.
- Cài đặt: dùng `open_filex` (hoặc `install_plugin`) mở file APK vừa tải để trigger màn hình cài đặt của Android.
- **Quyền cần khai báo** trong `AndroidManifest.xml`: `REQUEST_INSTALL_PACKAGES`. Từ Android 8 trở lên, người dùng phải bật thủ công "Cho phép cài đặt ứng dụng không rõ nguồn gốc" cho app KaiMovie — nên có màn hình hướng dẫn khi phát hiện quyền chưa bật.
- APK release nên host trên CDN/S3 hoặc chính server backend (thư mục `/releases`), đặt tên theo version rõ ràng, giữ lại vài bản cũ phòng khi cần rollback.
- **Lưu ý iOS**: Apple không cho phép cài app ngoài App Store/TestFlight → cơ chế tải APK cập nhật này **chỉ áp dụng cho Android**. Bản iOS vẫn phải cập nhật qua App Store (hoặc TestFlight nếu đang thử nghiệm).

---

## 6. Danh sách tính năng (Feature list)

### Bắt buộc (MVP)
- Trang chủ: banner phim nổi bật (carousel), các dải phim (mới cập nhật, phổ biến…)
- Tìm kiếm theo tên (debounce 300–500ms), gợi ý khi gõ
- Lọc/duyệt theo Thể loại, Quốc gia, Năm phát hành (kết hợp được nhiều filter)
- Trang chi tiết phim: poster, mô tả, diễn viên, đạo diễn, thể loại, đánh giá TMDB/IMDB, danh sách tập + chọn server
- Trình phát video: chọn tập, chọn server, chuyển chất lượng nếu có
- Đăng ký/Đăng nhập (email + có thể thêm Google OAuth)
- Yêu thích phim (thêm/xóa, xem danh sách)
- Lịch sử xem + "Tiếp tục xem" (lưu tiến trình theo giây)
- Responsive/adaptive UI Web, native-feel UI Mobile

### Nên có (nâng cao trải nghiệm)
- Đánh giá sao + bình luận theo phim
- Đề xuất phim liên quan (cùng thể loại/diễn viên) ở trang chi tiết
- Dark mode / Light mode (mặc định Dark vì đặc thù app xem phim)
- Thông báo có tập mới cho phim đã theo dõi (push notification mobile, web notification)
- Đa ngôn ngữ (VI/EN) nếu hướng tới người dùng ngoài Việt Nam
- Chia sẻ phim qua link/deep link
- Tự kiểm tra & tải bản cập nhật APK mới trong app (Android, xem chi tiết mục 5.1)

### Có thể mở rộng sau
- Watch party / xem chung
- Playlist cá nhân
- Tải xuống xem offline trên mobile (nếu bản quyền/nguồn cho phép)

---

## 7. Chuẩn UI/UX hiện đại

- **Theme mặc định: Dark UI** — nền tối (#0e0f13–#15171c), text sáng, accent color nổi bật (1 màu chủ đạo, ví dụ đỏ/cam/tím) dùng nhất quán cho CTA, badge "mới", rating.
- **Typography**: 1 font chính rõ ràng, tối đa 2 font (heading + body). Phân cấp rõ H1–H3, đảm bảo contrast đạt chuẩn WCAG AA trên nền tối.
- **Bố cục dạng lưới (grid)** cho danh sách phim, poster tỉ lệ 2:3, hover/press có scale nhẹ + shadow (web), ripple/tap feedback (mobile).
- **Skeleton loading** thay vì spinner cho danh sách/poster; **lazy-load ảnh** (IntersectionObserver web, `cached_network_image` mobile).
- **Infinite scroll** cho danh sách phim thay vì phân trang cứng (giữ nút "Xem thêm" như fallback).
- **Micro-interactions**: transition mượt khi chuyển trang/tab (200–300ms ease), animation khi thêm vào yêu thích (heart bounce), progress bar mượt cho "tiếp tục xem".
- **Empty/Error state** có thiết kế riêng (không chỉ text trắng): icon + thông điệp thân thiện + nút thử lại.
- **Accessibility**: alt text cho poster, focus state rõ ràng trên web, kích thước tap target ≥ 44px trên mobile.
- Nhất quán bộ spacing/radius/shadow giữa Web và Mobile để thương hiệu KaiMovie đồng bộ 2 nền tảng.

---

## 8. Quy ước code chung

- Đặt tên slug/route theo tiếng Việt không dấu, giống VSMOV (`the-loai/hanh-dong`) để dễ đối chiếu dữ liệu.
- Toàn bộ text hiển thị người dùng: tiếng Việt là chính; chuẩn bị sẵn cấu trúc i18n nếu định thêm tiếng Anh sau.
- Biến môi trường: không hardcode base URL của VSMOV hay backend — luôn qua `.env` / `environment.ts` / `--dart-define`.
- Git: nhánh `main` (release), `develop` (tích hợp), feature branch `feature/ten-tinh-nang`.
- Commit message ngắn gọn, tiền tố `feat:`, `fix:`, `refactor:`, `chore:`.
- Mỗi tính năng backend nên có ít nhất test cơ bản cho service gọi VSMOV (mock response) và test cho các route cần auth.

---

## 9. Deploy Web — Vercel

- **KaiMovie Web (Angular)** deploy trên **Vercel**.
- Build command: `ng build` (hoặc `ng build --configuration production`), Output directory: `dist/<project-name>/browser` (Angular ≥17 tách `browser/server`; kiểm tra đúng path trong `angular.json` trước khi set trên Vercel).
- Thêm file `vercel.json` ở root web nếu cần custom rewrite cho Angular SPA (route mọi request về `index.html`):
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- Biến môi trường (base URL backend, v.v.) khai báo trong **Vercel Project Settings → Environment Variables**, tách riêng `Production`/`Preview`/`Development`; không commit `.env`/`environment.prod.ts` chứa secret.
- Mỗi PR/branch tự có **Preview Deployment** trên Vercel → dùng để test trước khi merge vào `main`.
- **Backend (Node/Express + MongoDB)** khuyến nghị deploy **riêng** (Render/Railway/VPS…) vì là server dài hạn (kết nối DB, cache in-memory). Nếu muốn gộp chung Vercel, phải chuyển các route Express sang dạng **Vercel Serverless Functions** (`api/*.ts`), lưu ý: cache in-memory và cron sẽ không hoạt động ổn định trên serverless → cân nhắc dùng Redis/DB cho cache thay vì cache RAM.
- CORS ở backend phải cho phép domain Vercel (kể cả các domain preview dạng `*.vercel.app` nếu cần test preview).

## 10. Backend hosting — lựa chọn miễn phí

Đề xuất cho giai đoạn đồ án/demo (chưa cần production thật):

| Thành phần | Dịch vụ | Free tier | Lưu ý |
|---|---|---|---|
| Backend (Node/Express) | **Render** (Web Service, free) | Không cần thẻ, deploy trực tiếp từ Git | Sleep sau 15 phút không có traffic, cold start ~30–60s khi request đầu tiên, RAM giới hạn 512MB |
| Database | **MongoDB Atlas M0** | Free vĩnh viễn, 512MB storage, tối đa 500 connections | Không có backup tự động, đủ dùng cho đồ án/app nhỏ |
| Web frontend | **Vercel** | Đã chọn ở mục 9 | — |

**Lựa chọn khác nếu cần:**
- **Bonto** (nền tảng mới): free 75 giờ/tháng, 512MB RAM, 256MB storage, hỗ trợ Express sẵn — nhưng còn mới, chưa nhiều người kiểm chứng lâu dài.
- **Railway/Fly.io**: hiện không còn free tier thật sự (chỉ có trial/credit nhỏ, cần thẻ) — chỉ cân nhắc khi sẵn sàng trả phí.
- **Glitch/Replit**: chỉ phù hợp prototype nhanh, không nên dùng để demo chính thức vì giới hạn tài nguyên nặng hơn Render.

**Cách giảm ảnh hưởng cold start của Render free:** thêm endpoint `/healthz` đơn giản, dùng UptimeRobot (free) ping mỗi 5 phút để giữ server "thức" trước buổi demo/báo cáo — đây là workaround không chính thức, không nên phụ thuộc hoàn toàn nếu lên production thật.

## 11. Ghi chú vận hành

- Vì VSMOV là nguồn dữ liệu bên thứ 3, cần thiết kế lớp adapter/service ở backend sao cho nếu sau này đổi/thêm nguồn phim khác, chỉ cần sửa trong `modules/movies`, không ảnh hưởng Web/Mobile.
- Theo dõi rate limit/khả năng chặn IP từ VSMOV nếu traffic lớn → cache là bắt buộc, không tùy chọn.
- Đảm bảo tuân thủ điều khoản sử dụng của VSMOV khi triển khai thực tế/công khai.
