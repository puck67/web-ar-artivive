# WebAR Image Tracking Video Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng ứng dụng WebAR hoàn chỉnh theo phong cách Artivive: người dùng mở web trên điện thoại/máy tính, quét 4 bức ảnh mục tiêu thì video tương ứng phát bám vào khung tranh 3D; sẵn sàng triển khai lên Vercel.

**Architecture:** Static SPA sử dụng `MindAR.js` (Image Tracking) + `A-Frame` (Three.js 3D engine) + Vanilla UI.

---

## Tasks

### Task 1: Chuẩn bị và chuyển đổi tài nguyên (Asset Preparation & Transcoding)
- [ ] Tạo cấu trúc thư mục dự án (`assets/targets/`, `assets/videos/`, `css/`, `js/`).
- [ ] Chuyển đổi 4 file `.mov` từ Downloads sang `.mp4` tối ưu Web (H.264/AAC, `-movflags +faststart`):
  - `1010.mov` -> `assets/videos/video0.mp4` (1080x1080)
  - `1010(3).mov` -> `assets/videos/video1.mp4` (1080x1080)
  - `1010(1).mov` -> `assets/videos/video2.mp4` (1080x1450)
  - `1010(4).mov` -> `assets/videos/video3.mp4` (1080x1080)
- [ ] Copy và chuẩn hóa 4 ảnh mục tiêu vào `assets/targets/`:
  - `...Ab9o...jpg` -> `target0.jpg` (1254x1254)
  - `...Q4JU...jpg` -> `target1.jpg` (1254x1254)
  - `...OCIR...jpg` -> `target2.jpg` (1024x1536)
  - `...TKWn...jpg` -> `target3.jpg` (1024x1536)
- [ ] Kiểm tra tính toàn vẹn và khả năng phát của 4 file `.mp4`.

### Task 2: Biên dịch dữ liệu nhận diện MindAR (`targets.mind`)
- [ ] Cài đặt hoặc chạy công cụ biên dịch MindAR compiler (`mind-ar-js` compiler) để nạp 4 ảnh `target0.jpg` -> `target3.jpg`.
- [ ] Xuất ra file dữ liệu nhận diện `assets/targets.mind`.
- [ ] Kiểm tra dung lượng và cấu trúc file `targets.mind`.

### Task 3: Xây dựng Giao diện & Scene WebAR (`index.html`, `style.css`, `app.js`)
- [ ] Tạo `index.html`:
  - Nhúng CDN MindAR.js (v1.2.5) và A-Frame (v1.5.0).
  - Khai báo `<a-scene>` với cấu hình `mindar-image="imageTargetSrc: ./assets/targets.mind; autoStart: false;"`.
  - Khai báo `<a-assets>` chứa 4 thẻ `<video>` (`id="video0"` ... `id="video3"`).
  - Khai báo 4 `<a-entity mindar-image-target="targetIndex: X">` với `<a-plane>` hiển thị video tương ứng theo đúng tỷ lệ khung hình.
- [ ] Tạo `css/style.css`:
  - Thiết kế Splash Screen hiện đại (nút "Bắt đầu trải nghiệm AR").
  - Thiết kế Scanning Reticle (khung viền ngắm quét ảnh có hiệu ứng quét sáng radar/pulse).
  - Thiết kế thanh điều khiển nổi (nút Mute/Unmute, nút toàn màn hình).
- [ ] Tạo `js/app.js`:
  - Xử lý sự kiện click "Bắt đầu": khởi động MindAR scene và mở khóa âm thanh video (`audioContext`).
  - Lắng nghe sự kiện `targetFound` & `targetLost` cho từng target: play khi thấy, pause khi mất dấu.
  - Xử lý toggle âm thanh toàn cục (Mute/Unmute).

### Task 4: Cấu hình Vercel & Kiểm thử
- [ ] Tạo `vercel.json` định nghĩa headers cho MIME type của `.mind` (`application/octet-stream`) và cache header cho video.
- [ ] Chạy local server kiểm tra luồng camera, tải assets, tính năng tracking và video playback.
- [ ] Commit toàn bộ mã nguồn vào git repository.
- [ ] Hướng dẫn hoặc thực hiện deploy lên Vercel.
