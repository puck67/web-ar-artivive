document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splash-screen');
  const startBtn = document.getElementById('start-btn');
  const statusText = document.getElementById('status-text');
  const statusDot = document.getElementById('status-dot');
  const viewfinder = document.getElementById('viewfinder');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');
  const galleryBtn = document.getElementById('gallery-btn');
  const galleryModal = document.getElementById('gallery-modal');
  const closeGalleryBtn = document.getElementById('close-gallery-btn');

  const sceneEl = document.querySelector('a-scene');
  const videos = [
    document.getElementById('video0'),
    document.getElementById('video1'),
    document.getElementById('video2'),
    document.getElementById('video3')
  ];

  const targetElements = [
    document.getElementById('target0'),
    document.getElementById('target1'),
    document.getElementById('target2'),
    document.getElementById('target3')
  ];

  let isMuted = false;
  let activeTargets = new Set();

  // Detect in-app browsers (Zalo, Facebook, Messenger)
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isInApp = /FBAN|FBAV|Instagram|Line|MicroMessenger|Zalo|BytedanceWebview/i.test(ua);
  if (isInApp) {
    const tip = document.createElement('div');
    tip.style.cssText = 'background:#ef4444;color:#fff;padding:10px 14px;border-radius:12px;font-size:13px;margin-bottom:16px;text-align:center;line-height:1.4;';
    tip.innerHTML = '⚠️ Bạn đang mở trong ứng dụng (Zalo/Facebook). Vui lòng bấm <b>...</b> ở góc trên và chọn <b>"Mở bằng trình duyệt"</b> (Safari/Chrome) để cấp quyền Camera.';
    const content = document.querySelector('.splash-content');
    if (content) content.insertBefore(tip, content.firstChild);
  }

  // Pre-configure videos
  videos.forEach(v => {
    if (v) {
      v.muted = isMuted;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
    }
  });

  // Watch for MindAR camera feed video injection
  const container = document.getElementById('example-container');
  if (container) {
    const observer = new MutationObserver(() => {
      const camVideo = container.querySelector('video');
      if (camVideo) {
        camVideo.setAttribute('playsinline', '');
        camVideo.setAttribute('webkit-playsinline', '');
        camVideo.setAttribute('autoplay', '');
        const p = camVideo.play();
        if (p !== undefined) {
          p.catch(e => console.log('Camera video autoplay notice:', e));
        }
      }
    });
    observer.observe(container, { childList: true });
  }

  // Start AR Function
  const startARSystem = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ Camera API. Vui lòng mở bằng Safari (iOS) hoặc Chrome (Android).');
      }

      startBtn.innerText = 'Đang mở Camera...';

      const arSystem = sceneEl ? sceneEl.systems['mindar-image-system'] : null;
      if (!arSystem) {
        throw new Error('Hệ thống AR chưa sẵn sàng. Vui lòng bấm thử lại.');
      }

      // Start MindAR
      await arSystem.start();

      // Successfully started camera -> hide splash
      splashScreen.classList.add('hidden');
    } catch (err) {
      console.error('Error starting AR:', err);
      let errMsg = 'Không thể truy cập Camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errMsg = 'Bạn chưa cấp quyền Camera! Vui lòng vào cài đặt trình duyệt (hoặc icon ổ khóa trên thanh địa chỉ) để Cho phép (Allow) Camera, sau đó tải lại trang.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errMsg = 'Không tìm thấy thiết bị Camera trên máy của bạn.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errMsg = 'Camera đang bị ứng dụng khác chiếm dụng. Vui lòng đóng các ứng dụng khác đang dùng camera và thử lại.';
      } else if (err.message) {
        errMsg = err.message;
      }

      alert(errMsg);
      startBtn.disabled = false;
      startBtn.innerText = 'Thử lại';
    }
  };

  // Start AR Experience Button Handler
  startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    startBtn.innerText = 'Đang khởi động...';

    // Warm up videos non-blocking to unlock mobile audio
    videos.forEach(v => {
      if (v) {
        try {
          const playPromise = v.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              v.pause();
              v.currentTime = 0;
            }).catch(e => {
              console.log('Video warmup notice:', e);
            });
          }
        } catch (e) {
          console.warn('Warmup exception:', e);
        }
      }
    });

    // Check if A-Frame scene is already loaded
    if (sceneEl && sceneEl.hasLoaded) {
      startARSystem();
    } else if (sceneEl) {
      startBtn.innerText = 'Đang tải tài nguyên 3D...';
      sceneEl.addEventListener('loaded', () => {
        startARSystem();
      }, { once: true });
    } else {
      startARSystem();
    }
  });

  // Target Detection Events
  targetElements.forEach((targetEl, index) => {
    if (!targetEl) return;

    targetEl.addEventListener('targetFound', () => {
      console.log(`Target ${index} detected!`);
      activeTargets.add(index);

      statusText.innerText = `Đã nhận diện tranh #${index + 1}`;
      statusDot.classList.add('active');
      viewfinder.classList.add('detected');

      const targetVideo = videos[index];
      if (targetVideo) {
        targetVideo.currentTime = 0;
        targetVideo.play().catch(e => console.error("Error playing video:", e));
      }
    });

    targetEl.addEventListener('targetLost', () => {
      console.log(`Target ${index} lost!`);
      activeTargets.delete(index);

      const targetVideo = videos[index];
      if (targetVideo) {
        targetVideo.pause();
      }

      if (activeTargets.size === 0) {
        statusText.innerText = 'Đang quét tìm tranh...';
        statusDot.classList.remove('active');
        viewfinder.classList.remove('detected');
      }
    });
  });

  // Mute / Unmute Toggle
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    videos.forEach(v => {
      if (v) v.muted = isMuted;
    });

    if (isMuted) {
      muteIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      `;
    } else {
      muteIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    }
  });

  // Gallery Preview Drawer Toggle
  galleryBtn.addEventListener('click', () => {
    galleryModal.classList.add('open');
  });

  closeGalleryBtn.addEventListener('click', () => {
    galleryModal.classList.remove('open');
  });
});
