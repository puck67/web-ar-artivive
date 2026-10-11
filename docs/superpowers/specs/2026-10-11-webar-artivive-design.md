# Spec: WebAR Image Tracking Video Player (Artivive Style)

## 1. Overview
Hệ thống WebAR cho phép người dùng mở trình duyệt web trên thiết bị di động (iOS Safari / Android Chrome) hoặc máy tính, cấp quyền camera và hướng vào các bức tranh in ấn mục tiêu (Target Images). Khi phát hiện tranh, hệ thống sẽ phát video tương ứng gắn chặt lên bề mặt bức ảnh với phối cảnh 3D thời gian thực. Dự án được tối ưu để triển khai trực tiếp dưới dạng static site lên Vercel.

## 2. Architecture & Components
- **Client Application:** Static Single Page Application (HTML5, Vanilla CSS3, Vanilla JavaScript).
- **AR Tracking Engine:** `MindAR.js` (v1.2.5 - Image Tracking) chạy trên nền WebAssembly và TensorFlow.js.
- **Rendering Engine:** `A-Frame` (v1.5.0) trên nền `Three.js` quản lý Scene, Camera, và các Mesh Plane hiển thị video texture.
- **Hosting & Deployment:** Static hosting trên Vercel (kèm cấu hình `vercel.json` tối ưu caching và MIME types cho `.mind` và `.mp4`).

## 3. Media Assets & Mapping
4 cặp ảnh và video mục tiêu từ thư mục Downloads của người dùng:

| Target Index | Tên ảnh gốc | Tỷ lệ / Kích thước | Tên video gốc | Kích thước video | Kích thước Plane (A-Frame) |
|---|---|---|---|---|---|
| 0 | `...Ab9o...jpg` | 1:1 (1254x1254) | `1010.mov` | 1080x1080 (1:1) | `width="1" height="1"` |
| 1 | `...Q4JU...jpg` | 1:1 (1254x1254) | `1010(3).mov` | 1080x1080 (1:1) | `width="1" height="1"` |
| 2 | `...OCIR...jpg` | 2:3 (1024x1536) | `1010(1).mov` | 1080x1450 (~2:3) | `width="1" height="1.417"` |
| 3 | `...TKWn...jpg` | 2:3 (1024x1536) | `1010(4).mov` | 1080x1080 (1:1) | `width="1" height="1"` |

*Tất cả video `.mov` được transcode sang `.mp4` (H.264/AAC, `-movflags +faststart`).*

## 4. User Flow & State Machine
1. **Initial / Splash Screen:**
   - Người dùng bấm nút "Bắt đầu trải nghiệm AR".
   - Kích hoạt `getUserMedia` (camera sau) và mở khóa `AudioContext` trên trình duyệt di động.
2. **Scanning State:**
   - Ẩn màn hình Splash, hiển thị camera feed toàn màn hình.
   - Hiển thị HUD: Khung viền ngắm (scanning reticle), nút chuyển đổi âm thanh (Mute/Unmute), gợi ý "Hướng camera vào tranh".
3. **Target Found State (`targetFound`):**
   - Ẩn khung viền ngắm.
   - Video tương ứng với `targetIndex` tự động play (loop).
4. **Target Lost State (`targetLost`):**
   - Tự động pause video để tiết kiệm tài nguyên.
   - Hiện lại khung viền ngắm.

## 5. Mobile Compatibility & Autoplay Handling
- Các thẻ `<video>` được gắn cờ `playsinline webkit-playsinline loop preload="auto"`.
- Sự kiện click nút "Bắt đầu" sẽ kích hoạt `video.play()` rồi `video.pause()` ngay lập tức cho các video để vượt qua rào cản Autoplay Policy của trình duyệt iOS/Android.

## 6. Directory Structure
```
web-ar-artivive/
├── assets/
│   ├── targets.mind          # File nhận diện nhị phân 4 targets
│   ├── targets/              # 4 ảnh gốc (được tối ưu kích thước)
│   └── videos/               # 4 video định dạng .mp4
├── css/
│   └── style.css             # Giao diện HUD scan & overlay
├── js/
│   └── app.js                # Quản lý sự kiện MindAR & playback
├── docs/
│   └── superpowers/specs/    # Tài liệu đặc tả kỹ thuật
├── index.html                # Trình chiếu AR & A-Frame scene
├── vercel.json               # Cấu hình header & routing Vercel
└── README.md
```

## 7. Verification & Success Criteria
1. Chuyển đổi thành công 4 file `.mov` sang `.mp4`.
2. Biên dịch thành công 4 ảnh thành `targets.mind`.
3. Chạy local web server test bằng HTTPS hoặc localhost: scan cả 4 tranh đều nhận diện nhạy, video phát đúng tỷ lệ và bám chặt theo tranh.
4. Triển khai lên Vercel hoạt động trơn tru trên thiết bị di động thực tế.
