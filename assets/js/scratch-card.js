/**
 * Wedding Invitation - Interactive Gold Foil Scratch Reveal & Live Countdown Module
 * File: assets/js/scratch-card.js
 * Purpose: Provides a delicate champagne-gold foil scratch surface covering the Muhurtham
 *          ceremony date & time. Acts as the interaction gate for Date, Time, Venue, and Countdown.
 *          ALWAYS resets on restart, replay, or page refresh.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'deepak_vikashini_ceremony_revealed_v3';
  // Target date: Sunday, 22nd November 2026 at 5:00 AM IST (UTC+05:30)
  const TARGET_DATE_IST = new Date('2026-11-22T05:00:00+05:30').getTime();

  let canvas = null;
  let ctx = null;
  let container = null;
  let scratchCue = null;
  let scratchSheen = null;
  let countdownTimer = null;

  let isScratching = false;
  let lastX = 0;
  let lastY = 0;
  let isRevealed = false;
  let scratchPointsCount = 0;
  let resizeTimer = null;
  let totalOpaqueSamples = 0;

  const coverImg = new Image();
  coverImg.src = 'assets/images/scratch_plaque_rose_cartouche.png?v=6.0';

  function init() {
    // Strictly clear any legacy local storage key so the card never remembers previous scratch
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    canvas = document.getElementById('scratch-canvas');
    container = document.getElementById('scratch-card-container');
    scratchCue = document.getElementById('scratch-cue');
    scratchSheen = document.getElementById('scratch-sheen-sweep');

    if (scratchSheen) {
      scratchSheen.style.display = 'block';
      scratchSheen.style.opacity = '0.92';
    }

    // DO NOT start countdown timer on init — Countdown remains locked until scratch completion
    stopCountdownTimer();

    if (!canvas || !container) return;
    ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Always start in fully covered, unscratched state
    isRevealed = false;
    setupCanvas();
    bindEvents();

    window.addEventListener('resize', debounceResize, { passive: true });
  }

  function setupCanvas() {
    if (!canvas || !container || isRevealed) return;

    // Use actual rendered bounds of scratch plaque container
    const rect = container.getBoundingClientRect();
    const width = Math.max(Math.round(rect.width || container.offsetWidth || 280), 200);
    const height = Math.max(Math.round(rect.height || container.offsetHeight || 83), 60);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    renderFoil(width, height);
  }

  function renderFoil(width, height) {
    if (!ctx) return;

    function draw() {
      if (!ctx || isRevealed) return;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(coverImg, 0, 0, width, height);
      measureInitialOpaque();
    }

    if (coverImg.complete && coverImg.naturalWidth > 0) {
      draw();
    } else {
      coverImg.onload = draw;
    }
  }

  function measureInitialOpaque() {
    try {
      const w = Math.floor(canvas.width);
      const h = Math.floor(canvas.height);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      let opaque = 0;
      const sampleStep = 4;
      const startY = Math.floor(h * 0.27);
      const endY = Math.floor(h * 0.75);
      const startX = Math.floor(w * 0.25);
      const endX = Math.floor(w * 0.75);

      for (let y = startY; y < endY; y += sampleStep) {
        for (let x = startX; x < endX; x += sampleStep) {
          const idx = (y * w + x) * 4 + 3;
          if (data[idx] >= 32) opaque++;
        }
      }
      totalOpaqueSamples = opaque || 1;
    } catch (e) {
      totalOpaqueSamples = 0;
    }
  }

  function bindEvents() {
    if (!canvas) return;

    // Pointer events handle touch, mouse, and stylus uniformly with touch-action: none
    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });

    // Fallback touch events for complete mobile browser compatibility
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp, { passive: true });
    window.addEventListener('touchcancel', handlePointerUp, { passive: true });

    // Fallback mouse events
    canvas.addEventListener('mousedown', handlePointerDown);

    // Fallback click listener: only triggers if user has actively scratched at least 65%
    if (container) {
      container.addEventListener('click', () => {
        if (!isRevealed && scratchPointsCount >= 8) {
          const percentage = calculateScratchedPercentage();
          if (percentage >= 65) {
            completeFullReveal();
          }
        }
      });
    }
  }

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;
    const scaleX = rect.width > 0 ? (cssWidth / rect.width) : 1;
    const scaleY = rect.height > 0 ? (cssHeight / rect.height) : 1;

    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      clientX: clientX,
      clientY: clientY
    };
  }

  function handlePointerDown(e) {
    if (isRevealed) return;
    if (e.cancelable) e.preventDefault();
    isScratching = true;
    const coords = getCoords(e);
    lastX = coords.x;
    lastY = coords.y;

    if (scratchCue) {
      scratchCue.style.opacity = '0';
      scratchCue.style.pointerEvents = 'none';
    }

    scratch(coords.x, coords.y);
    spawnFoilDebris(coords.clientX, coords.clientY);
  }

  function handlePointerMove(e) {
    if (!isScratching || isRevealed) return;
    if (e.cancelable) e.preventDefault();
    const coords = getCoords(e);
    scratch(coords.x, coords.y);
    spawnFoilDebris(coords.clientX, coords.clientY);
    lastX = coords.x;
    lastY = coords.y;

    // Check progress periodically during continuous drag so reveal triggers immediately
    scratchPointsCount++;
    if (scratchPointsCount % 5 === 0) {
      checkRevealProgress();
    }
  }

  function handlePointerUp() {
    if (!isScratching || isRevealed) return;
    isScratching = false;

    // Only evaluate reveal if user has actually performed scratch strokes
    if (scratchPointsCount < 8) return;

    // Trigger reveal if user has cleared at least 65% on release
    const percentage = calculateScratchedPercentage();
    if (percentage >= 65) {
      completeFullReveal();
    }
  }

  function scratch(x, y) {
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';

    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.hypot(dx, dy);
    // Interpolate points so the stroke is organic and continuous without gaps
    const steps = Math.max(1, Math.floor(dist / 3));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const curX = lastX + dx * t;
      const curY = lastY + dy * t;

      // 1. Core clearing circular stroke
      const coreR = 15.5 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(curX, curY, coreR, 0, Math.PI * 2);
      ctx.fill();

      // 2. Tactile jagged micro-bristle flaking around perimeter (mimics physical latex foil flaking)
      const flakes = 5 + Math.floor(Math.random() * 4);
      for (let j = 0; j < flakes; j++) {
        const angle = Math.random() * Math.PI * 2;
        const offset = coreR - 0.5 + Math.random() * 6.5;
        const rad = 1.6 + Math.random() * 2.6;
        ctx.beginPath();
        ctx.arc(curX + Math.cos(angle) * offset, curY + Math.sin(angle) * offset, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Occasional detached fleck/notch (micro latex tear)
      if (Math.random() < 0.25) {
        const tearAngle = Math.random() * Math.PI * 2;
        const tearDist = coreR + 3.5 + Math.random() * 4.5;
        ctx.beginPath();
        ctx.arc(curX + Math.cos(tearAngle) * tearDist, curY + Math.sin(tearAngle) * tearDist, 1.2 + Math.random() * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function spawnFoilDebris(x, y) {
    // 1. Curled Metallic Foil Shavings (realistic gravity + 3D tumbling physics)
    const shavingCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < shavingCount; i++) {
      const shaving = document.createElement('div');
      shaving.className = 'scratch-foil-shaving';

      const w = 3.2 + Math.random() * 3.8;
      const h = 2.0 + Math.random() * 2.2;
      const flickX = (Math.random() - 0.5) * 26;
      const flickY = -4 - Math.random() * 7;
      const fallY = 24 + Math.random() * 38;
      const rotX = Math.random() * 450;
      const rotY = Math.random() * 450;
      const rotZ = (Math.random() - 0.5) * 200;

      const goldGradients = [
        'linear-gradient(135deg, #FFF9D2 0%, #E5BE57 38%, #B38728 75%, #7A5310 100%)',
        'linear-gradient(135deg, #FFFFFF 0%, #F5DE98 42%, #C49835 80%, #8A601A 100%)',
        'linear-gradient(135deg, #FFF0B8 0%, #D8AA42 45%, #9E7422 85%, #66460B 100%)'
      ];
      const bg = goldGradients[Math.floor(Math.random() * goldGradients.length)];

      shaving.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${w}px;
        height: ${h}px;
        background: ${bg};
        border-radius: ${Math.random() > 0.5 ? '1px 2px 1px 2px' : '2px 1px 2px 1px'};
        box-shadow: 0 1px 2.5px rgba(80, 50, 10, 0.35);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(1);
        opacity: 0.95;
        transition: transform 0.65s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.65s ease-out;
      `;

      document.body.appendChild(shaving);

      requestAnimationFrame(() => {
        shaving.style.transform = `translate(calc(-50% + ${flickX}px), calc(-50% + ${flickY + fallY}px)) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(0.6)`;
        shaving.style.opacity = '0';
      });

      setTimeout(() => shaving.remove(), 700);
    }

    // 2. Sparkling Gold Stardust Flecks
    const sparkleCount = 2 + Math.floor(Math.random() * 2);
    const sparkleColors = ['#FFFFFF', '#FFF8D6', '#FFDF73', '#FFE89E'];
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'scratch-glitter-particle';

      const size = 1.8 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const dist = 7 + Math.random() * 16;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - 5;
      const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

      sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 0 5px ${color}, 0 0 1px #FFFFFF;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) scale(1);
        transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.45s ease;
      `;

      document.body.appendChild(sparkle);

      requestAnimationFrame(() => {
        sparkle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.2)`;
        sparkle.style.opacity = '0';
      });

      setTimeout(() => sparkle.remove(), 500);
    }
  }

  function calculateScratchedPercentage() {
    if (!ctx || !canvas) return 0;
    // CRITICAL: If the user hasn't scratched with their pointer yet, percentage MUST be 0
    if (scratchPointsCount < 5) return 0;

    try {
      const w = Math.floor(canvas.width);
      const h = Math.floor(canvas.height);
      if (w <= 0 || h <= 0) return 0;

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const sampleStep = 4;
      const startY = Math.floor(h * 0.27);
      const endY = Math.floor(h * 0.75);
      const startX = Math.floor(w * 0.25);
      const endX = Math.floor(w * 0.75);

      let totalChecked = 0;
      let opaqueCount = 0;
      let clearedCount = 0;

      for (let y = startY; y < endY; y += sampleStep) {
        for (let x = startX; x < endX; x += sampleStep) {
          totalChecked++;
          const idx = (y * w + x) * 4 + 3;
          if (data[idx] >= 32) {
            opaqueCount++;
          } else {
            clearedCount++;
          }
        }
      }

      // If the canvas has no opaque pixels at all (foil unrendered or canvas blank), return 0
      if (opaqueCount === 0 || totalChecked === 0) {
        return 0;
      }

      return (clearedCount / totalChecked) * 100;
    } catch (e) {
      // Fallback for tainted canvas on file:// protocol
      return Math.min(100, (scratchPointsCount / 30) * 100);
    }
    return 0;
  }

  function checkRevealProgress() {
    if (isRevealed || !ctx || !canvas || scratchPointsCount < 8) return;
    const percentage = calculateScratchedPercentage();
    // During active dragging: trigger complete reveal once at least 65% is cleared
    if (percentage >= 65) {
      completeFullReveal();
    }
  }

  function completeFullReveal(isInstant = false) {
    if (isRevealed) return;
    isRevealed = true;

    // Apply subtle warm gold glow/shimmer to newly revealed date
    const dateBlock = document.getElementById('reveal-date-block');
    if (dateBlock && !isInstant) {
      dateBlock.classList.remove('glow-shimmer');
      void dateBlock.offsetWidth;
      dateBlock.classList.add('glow-shimmer');
    }

    if (canvas) {
      if (isInstant) {
        canvas.style.display = 'none';
      } else {
        canvas.style.transition = 'opacity 0.5s cubic-bezier(0.2, 0.8, 0.3, 1)';
        canvas.style.opacity = '0';
        canvas.style.pointerEvents = 'none';
        setTimeout(() => {
          if (canvas) canvas.style.display = 'none';
        }, 550);
      }
    }

    if (scratchCue) {
      scratchCue.style.transition = 'opacity 0.4s ease';
      scratchCue.style.opacity = '0';
      setTimeout(() => {
        if (scratchCue) scratchCue.style.display = 'none';
      }, 420);
    }

    if (scratchSheen) {
      scratchSheen.style.transition = 'opacity 0.45s ease';
      scratchSheen.style.opacity = '0';
      setTimeout(() => {
        if (scratchSheen) scratchSheen.style.display = 'none';
      }, 480);
    }

    // Celebratory light sparkles & soft falling petals on scratch reveal
    if (!isInstant) {
      if (container) {
        const rect = container.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            spawnFoilDebris(cx + (Math.random() - 0.5) * 120, cy + (Math.random() - 0.5) * 40);
          }, i * 22);
        }
      }

      // Soft rose petals drifting across screen matching transition storyboard
      if (window.WeddingParticles && typeof window.WeddingParticles.burstPetals === 'function') {
        window.WeddingParticles.burstPetals(18);
      }
    }

    // Trigger bridge reveal and cinematic transition to Screen 2
    if (window.WeddingReveal) {
      window.WeddingReveal.handleScratchComplete();
    }
  }

  function startCountdownTimer() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }

    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
  }

  function stopCountdownTimer() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = TARGET_DATE_IST - now;

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-minutes');
    const elSecs = document.getElementById('cd-seconds');

    if (diff <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMins) elMins.textContent = '00';
      if (elSecs) elSecs.textContent = '00';
      stopCountdownTimer();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(minutes).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(seconds).padStart(2, '0');
  }

  function debounceResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!isRevealed) {
        setupCanvas();
      }
    }, 180);
  }

  function resetScratch() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    isRevealed = false;
    isScratching = false;
    scratchPointsCount = 0;
    stopCountdownTimer();

    const dateBlock = document.getElementById('reveal-date-block');
    if (dateBlock) {
      dateBlock.classList.remove('glow-shimmer');
    }

    if (scratchCue) {
      scratchCue.style.removeProperty('transition');
      scratchCue.style.display = 'flex';
      scratchCue.style.opacity = '1';
      scratchCue.style.pointerEvents = 'none';
    }
    if (scratchSheen) {
      scratchSheen.style.removeProperty('transition');
      scratchSheen.style.display = 'block';
      scratchSheen.style.opacity = '1';
    }
    if (canvas) {
      canvas.style.removeProperty('transition');
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
      canvas.style.pointerEvents = 'auto';
      setupCanvas();
    }
  }

  window.WeddingScratchCard = {
    init: init,
    refresh: setupCanvas,
    revealAll: completeFullReveal,
    reset: resetScratch,
    startCountdown: startCountdownTimer,
    stopCountdown: stopCountdownTimer
  };

})(window);
