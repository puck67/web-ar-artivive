# Artivive WebAR - Quét Tranh Phát Video (Image Tracking)

Ứng dụng WebAR phong cách **Artivive** chạy 100% trên trình duyệt (không cần cài ứng dụng), hỗ trợ camera quét 4 bức tranh mục tiêu và tự động phát video khớp chính xác theo phối cảnh 3D của tranh.

---

## 🚀 Tính năng nổi bật
- **True AR Image Tracking:** Video được gắn chặt lên bề mặt tranh 3D bằng engine `MindAR.js` và `A-Frame`.
- **Tự động Pause / Play:** Khi camera nhận diện tranh -> phát video; khi lia máy ra chỗ khác -> tạm dừng video để tiết kiệm tài nguyên.
- **Tương thích hoàn hảo trên Mobile:** Vượt qua rào cản chặn Autoplay của iOS Safari & Android Chrome thông qua cơ chế kích hoạt tại màn hình Splash.
- **Nút điều khiển âm thanh:** Hỗ trợ Mute / Unmute linh hoạt.
- **Drawer xem tranh mẫu:** Cho phép người dùng xem nhanh ảnh gốc của 4 tranh để tiện test quét ngay trên màn hình thiết bị khác.
- **Sẵn sàng Deploy Vercel:** Zero-backend, tích hợp cấu hình `vercel.json` tối ưu caching cho `.mind` và streaming `.mp4`.

---

## 🖼️ Danh sách 4 tranh & Video tương ứng

| Target # | Ảnh mục tiêu | Tỷ lệ | Video tương ứng | Ghi chú |
|---|---|---|---|---|
| **#1** | `assets/targets/target0.jpg` | Vuông (1:1) | `assets/videos/video0.mp4` | Video vuông 1080x1080 |
| **#2** | `assets/targets/target1.jpg` | Vuông (1:1) | `assets/videos/video1.mp4` | Video vuông 1080x1080 |
| **#3** | `assets/targets/target2.jpg` | Dọc (1:1.5) | `assets/videos/video2.mp4` | Video dọc 1080x1450 |
| **#4** | `assets/targets/target3.jpg` | Dọc (1:1.5) | `assets/videos/video3.mp4` | Video vuông 1080x1080 |

---

## 🛠️ Hướng dẫn chạy thử nghiệm Local (Testing)

Do yêu cầu bảo mật của trình duyệt, tính năng Camera chỉ hoạt động trên `localhost` hoặc kết nối `HTTPS`.

### Cách 1: Dùng Node.js Static Server
```bash
npx serve .
# Hoặc
npx http-server -p 3000
```
Mở trình duyệt truy cập: `http://localhost:3000`

---

## 🌐 Hướng dẫn Deploy lên Vercel

### Cách 1: Sử dụng Vercel CLI (Nhanh nhất)
1. Cài đặt Vercel CLI nếu chưa có:
   ```bash
   npm install -g vercel
   ```
2. Đứng tại thư mục dự án và chạy:
   ```bash
   vercel --prod
   ```
   Làm theo hướng dẫn trên màn hình để liên kết tài khoản Vercel. Bạn sẽ nhận được đường link HTTPS miễn phí (ví dụ: `https://web-ar-artivive.vercel.app`).

### Cách 2: Deploy qua GitHub
1. Tạo một repository mới trên GitHub và push code lên:
   ```bash
   git remote add origin https://github.com/<username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. Truy cập [vercel.com](https://vercel.com), bấm **Add New Project** -> Chọn repository vừa push.
3. Bấm **Deploy**. Vercel sẽ tự động build và cấp domain HTTPS cho bạn.
