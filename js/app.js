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

  // Initialize videos
  videos.forEach(v => {
    if (v) {
      v.muted = isMuted;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
    }
  });

  // Start AR Experience
  startBtn.addEventListener('click', async () => {
    startBtn.disabled = true;
    startBtn.innerText = 'Đang kích hoạt Camera...';

    // Unlock Audio & Video autoplay restriction on Mobile browsers
    for (const v of videos) {
      if (v) {
        try {
          await v.play();
          v.pause();
          v.currentTime = 0;
        } catch (e) {
          console.warn('Media play unlock attempt:', e);
        }
      }
    }

    // Start MindAR tracking system
    if (sceneEl) {
      const arSystem = sceneEl.systems['mindar-image-system'];
      if (arSystem) {
        arSystem.start();
      }
    }

    // Hide Splash Screen
    splashScreen.classList.add('hidden');
  });

  // Target Detection Events
  targetElements.forEach((targetEl, index) => {
    if (!targetEl) return;

    targetEl.addEventListener('targetFound', () => {
      console.log(`Target ${index} detected!`);
      activeTargets.add(index);

      // UI state
      statusText.innerText = `Đã nhận diện tranh #${index + 1}`;
      statusDot.classList.add('active');
      viewfinder.classList.add('detected');

      // Play matching video
      const targetVideo = videos[index];
      if (targetVideo) {
        targetVideo.currentTime = 0;
        targetVideo.play().catch(e => console.error("Error playing video:", e));
      }
    });

    targetEl.addEventListener('targetLost', () => {
      console.log(`Target ${index} lost!`);
      activeTargets.delete(index);

      // Pause matching video
      const targetVideo = videos[index];
      if (targetVideo) {
        targetVideo.pause();
      }

      // If no target is currently active
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
