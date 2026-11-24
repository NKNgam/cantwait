/**
 * NAHLELA — MY QUINN: ROMANTIC LOVE COUNTDOWN ENGINE
 * Fixed Admin-set countdown, background romantic song, haptic heartbeat phone vibration, floating petals canvas.
 */

(function () {
  'use strict';

  // --- Core Default Configuration ---
  // You can set your default reunion date here!
  function getDefaultTargetDate() {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  }

  const STORAGE_KEY_ADMIN_DATE = 'nahlela_admin_meeting_date';
  const STORAGE_KEY_ADMIN_NOTE = 'nahlela_admin_love_note';
  const STORAGE_KEY_START_DATE = 'nahlela_meeting_start_date';
  const STORAGE_KEY_KISSES = 'nahlela_kisses_count';

  // --- Target Date Resolution ---
  // 1. URL parameter (?until=... or ?t=...)
  // 2. localStorage admin setting
  // 3. Default fallback
  const urlParams = new URLSearchParams(window.location.search);
  const paramDate = urlParams.get('until') || urlParams.get('t') || urlParams.get('date');
  const paramNote = urlParams.get('note');

  let targetDateString = paramDate || localStorage.getItem(STORAGE_KEY_ADMIN_DATE) || getDefaultTargetDate();
  let loveNote = paramNote || localStorage.getItem(STORAGE_KEY_ADMIN_NOTE) || 'Until our beautiful reunion';
  let targetDate = new Date(targetDateString);

  // If invalid date, reset to default
  if (isNaN(targetDate.getTime())) {
    targetDate = new Date(getDefaultTargetDate());
  }

  let startDate = new Date(localStorage.getItem(STORAGE_KEY_START_DATE) || new Date().toISOString());
  let kissesCount = parseInt(localStorage.getItem(STORAGE_KEY_KISSES), 10) || 0;

  // DOM Elements
  const elDays = document.getElementById('daysVal');
  const elHours = document.getElementById('hoursVal');
  const elMinutes = document.getElementById('minutesVal');
  const elSeconds = document.getElementById('secondsVal');

  const elTargetDateText = document.getElementById('targetDateText');
  const elJourneyPercent = document.getElementById('journeyPercent');
  const elLoveProgressFill = document.getElementById('loveProgressFill');

  const btnSendLove = document.getElementById('sendLoveBtn');
  const elKissesCount = document.getElementById('kissesCount');
  const elLoveMessageHint = document.getElementById('loveMessageHint');

  // Romantic Song Audio Controller
  const romanticAudio = document.getElementById('romanticAudio');
  const btnMusicToggle = document.getElementById('musicToggleBtn');
  const elMusicText = document.getElementById('musicText');
  let isPlayingMusic = false;

  // Admin Modal Elements (Secretly available for you)
  const badgeAdminTrigger = document.getElementById('badgeAdminTrigger');
  const adminModal = document.getElementById('adminModal');
  const btnCloseAdmin = document.getElementById('closeAdminBtn');
  const formAdmin = document.getElementById('adminForm');
  const inputAdminDate = document.getElementById('adminDateTime');
  const inputAdminNote = document.getElementById('adminNote');
  const btnCopyShareLink = document.getElementById('copyShareLinkBtn');
  const copyAlert = document.getElementById('copyAlert');

  // Romantic Whispers for Quinn
  const sweetWhispers = [
    "You are my whole heart, Nahlela.",
    "Every second brings me closer to holding you.",
    "Counting down every heartbeat until we meet, my Quinn.",
    "I miss your smile more than words could ever say.",
    "Forever and always yours, my love.",
    "Sending a gentle kiss straight to you, Nahlela.",
    "You are the most precious gift in my life.",
    "Soon, I will be holding your hand like this red flower."
  ];
  let whisperIndex = 0;

  // --- Background Romantic Song Controls ---
  function playRomanticSong() {
    if (!romanticAudio) return;
    romanticAudio.volume = 0.55;
    const playPromise = romanticAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlayingMusic = true;
        btnMusicToggle.classList.add('playing');
        elMusicText.textContent = 'Pause Song';
      }).catch(() => {
        // Autoplay policy prevented immediate playback
        isPlayingMusic = false;
        btnMusicToggle.classList.remove('playing');
        elMusicText.textContent = 'Play Song';
      });
    }
  }

  function pauseRomanticSong() {
    if (!romanticAudio) return;
    romanticAudio.pause();
    isPlayingMusic = false;
    btnMusicToggle.classList.remove('playing');
    elMusicText.textContent = 'Play Song';
  }

  function toggleRomanticSong() {
    if (isPlayingMusic) {
      pauseRomanticSong();
    } else {
      playRomanticSong();
    }
  }

  // --- Countdown Math & Update Loop ---
  function updateCountdown() {
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';

      elLoveProgressFill.style.width = '100%';
      elJourneyPercent.textContent = '100% — Together!';
      elTargetDateText.textContent = "We are together at last, my Quinn! ❤️";
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    elDays.textContent = String(d).padStart(2, '0');
    elHours.textContent = String(h).padStart(2, '0');
    elMinutes.textContent = String(m).padStart(2, '0');
    elSeconds.textContent = String(s).padStart(2, '0');

    // Calculate elapsed progress towards the meeting date
    const totalSpan = targetDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    let pct = 0;
    if (totalSpan > 0) {
      pct = Math.min(100, Math.max(0, (elapsed / totalSpan) * 100));
    }

    elLoveProgressFill.style.width = pct.toFixed(1) + '%';
    elJourneyPercent.textContent = pct.toFixed(1) + '% closer';

    // Format target date readable
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateFormatted = targetDate.toLocaleDateString(undefined, options);
    elTargetDateText.textContent = `${loveNote} • ${dateFormatted}`;
  }

  // --- Floating Hearts & Phone Vibration on Kiss ---
  function triggerPhoneVibration() {
    // Web Vibration API: gentle romantic double heartbeat rhythm (thump-thump ... thump-thump)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([70, 90, 70, 160, 70, 90, 70]);
      } catch (e) {
        // Vibration not supported or allowed on device
      }
    }
  }

  function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    const symbols = ['💖', '🌹', '💕', '✨', '❤️', '🌸', '🥰'];
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const randomOffset = (Math.random() - 0.5) * 60;
    heart.style.left = `${x + randomOffset}px`;
    heart.style.top = `${y}px`;

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1600);
  }

  function handleSendLove(e) {
    kissesCount++;
    localStorage.setItem(STORAGE_KEY_KISSES, kissesCount);
    elKissesCount.textContent = kissesCount;

    // Trigger Phone Vibration
    triggerPhoneVibration();

    // Start background song if not yet playing (browsers allow playback on click)
    if (!isPlayingMusic) {
      playRomanticSong();
    }

    // Burst 3 sweet hearts
    const rect = btnSendLove.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top;

    createFloatingHeart(centerX, centerY);
    setTimeout(() => createFloatingHeart(centerX - 25, centerY + 10), 80);
    setTimeout(() => createFloatingHeart(centerX + 25, centerY + 10), 160);

    // Cycle sweet whisper
    whisperIndex = (whisperIndex + 1) % sweetWhispers.length;
    elLoveMessageHint.textContent = sweetWhispers[whisperIndex];
  }

  // --- Admin Mode: Setting Time & Generating Shareable Link ---
  function openAdminModal() {
    const tzOffset = targetDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(targetDate.getTime() - tzOffset).toISOString().slice(0, 16);
    inputAdminDate.value = localISOTime;
    inputAdminNote.value = loveNote;
    copyAlert.textContent = '';
    adminModal.classList.add('open');
  }

  function closeAdminModal() {
    adminModal.classList.remove('open');
  }

  function handleAdminFormSubmit(e) {
    e.preventDefault();
    const val = inputAdminDate.value;
    if (!val) return;

    const newTarget = new Date(val);
    if (isNaN(newTarget.getTime())) return;

    targetDate = newTarget;
    startDate = new Date();
    loveNote = inputAdminNote.value.trim() || 'Until our beautiful reunion';

    // Save locally
    localStorage.setItem(STORAGE_KEY_ADMIN_DATE, targetDate.toISOString().slice(0, 16));
    localStorage.setItem(STORAGE_KEY_START_DATE, startDate.toISOString());
    localStorage.setItem(STORAGE_KEY_ADMIN_NOTE, loveNote);

    updateCountdown();
    copyAlert.textContent = '❤️ Meeting time saved!';
    setTimeout(() => {
      closeAdminModal();
    }, 900);
  }

  function generateAndCopyShareLink() {
    const tzOffset = targetDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(targetDate.getTime() - tzOffset).toISOString().slice(0, 16);
    
    // Generate URL with date encoded
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?until=${encodeURIComponent(localISOTime)}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        copyAlert.textContent = '🔗 Link copied! Send it to Nahlela ❤️';
      }).catch(() => {
        prompt('Copy this share link for Nahlela:', shareUrl);
      });
    } else {
      prompt('Copy this share link for Nahlela:', shareUrl);
    }
  }

  // --- Floating Rose Petals Canvas Background ---
  function initPetalsCanvas() {
    const canvas = document.getElementById('petalsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalCount = 38;
    const petals = [];

    const colors = [
      'rgba(230, 43, 85, 0.75)',
      'rgba(196, 24, 60, 0.65)',
      'rgba(255, 133, 161, 0.55)',
      'rgba(229, 193, 125, 0.45)',
      'rgba(255, 209, 220, 0.6)'
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 7 + 4,
        speedY: Math.random() * 0.9 + 0.4,
        speedX: (Math.random() - 0.5) * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        isGoldMote: Math.random() > 0.85
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.015) * 0.6 + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isGoldMote) {
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#e5c17d';
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.r, -p.r * 1.5, -p.r * 1.2, p.r * 0.8, 0, p.r * 1.6);
          ctx.bezierCurveTo(p.r * 1.2, p.r * 0.8, p.r, -p.r * 1.5, 0, 0);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(230, 43, 85, 0.3)';
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // --- Initializer ---
  function init() {
    elKissesCount.textContent = kissesCount;

    // Listeners
    btnSendLove.addEventListener('click', handleSendLove);
    btnMusicToggle.addEventListener('click', toggleRomanticSong);

    // One-time tap on page starts background song gently if user permits
    document.addEventListener('click', function autoStartMusic() {
      if (!isPlayingMusic) {
        playRomanticSong();
      }
      document.removeEventListener('click', autoStartMusic);
    }, { once: true });

    // Admin Mode Listeners
    // Check if ?admin is in URL
    if (urlParams.has('admin')) {
      openAdminModal();
    }

    // Double-click on header badge secretly opens Admin panel
    badgeAdminTrigger.addEventListener('dblclick', openAdminModal);

    // Also support long-press on mobile badge for admin
    let pressTimer;
    badgeAdminTrigger.addEventListener('touchstart', () => {
      pressTimer = setTimeout(openAdminModal, 1500);
    });
    badgeAdminTrigger.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
    });

    btnCloseAdmin.addEventListener('click', closeAdminModal);
    formAdmin.addEventListener('submit', handleAdminFormSubmit);
    btnCopyShareLink.addEventListener('click', generateAndCopyShareLink);

    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) closeAdminModal();
    });

    // Start Petals Canvas
    initPetalsCanvas();

    // Start Countdown Loop
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
