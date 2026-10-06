/**
 * Wedding Invitation Interactive Script - Screen 1
 * Couple: Deepak & Vikashini (D & V)
 * 
 * Features:
 * - 3D Letter-Fold Envelope Opening with Wax Seal Burst
 * - Smooth Screen 1 Unfold and Graceful Disappear Transition
 * - Clean Audio Player with Floating Toggle Button
 * - Ambient Traditional Petals & Gold Sparkles Physics Canvas
 * - Seamless Replay / Reset Mechanism for Testing
 */

document.addEventListener('DOMContentLoaded', () => {
  // Screen & Envelope Elements
  const coverScreen = document.getElementById('cover-screen');
  const announcementScreen = document.getElementById('announcement-screen');
  const envelope = document.getElementById('envelope');
  const envelopeScene = document.getElementById('envelope-scene');
  const waxSeal = document.getElementById('wax-seal');
  const ctaContainer = document.getElementById('cta-container');
  const btnReplay = document.getElementById('btn-replay');

  // Background Audio Elements
  const bgAudio = document.getElementById('bg-audio');
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  const soundWave = document.getElementById('sound-wave');

  let isOpening = false;
  let isEnvelopeOpened = false;
  let isTransitioningToScreen2 = false;
  let isScreen2Active = false;
  let isAudioPlaying = false;

  const scrollCue = document.getElementById('scroll-to-screen2-prompt');
  const innerCard = document.getElementById('inner-card');

  // Pushpavrishti Petal Shower trigger hook
  let triggerPetalShower = () => {};

  // ==========================================================================
  // 1. BACKGROUND AUDIO CONTROLS (<audio id="bg-audio">)
  // ==========================================================================
  function startMusic() {
    if (!bgAudio) return;
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      if (btnMusicToggle) btnMusicToggle.classList.add('playing');
      if (soundWave) soundWave.classList.add('playing');
    }).catch(err => {
      console.log('Background music waiting for audio file / interaction:', err.message);
      isAudioPlaying = false;
      if (btnMusicToggle) btnMusicToggle.classList.remove('playing');
      if (soundWave) soundWave.classList.remove('playing');
    });
  }

  function stopMusic() {
    if (!bgAudio) return;
    bgAudio.pause();
    isAudioPlaying = false;
    if (btnMusicToggle) btnMusicToggle.classList.remove('playing');
    if (soundWave) soundWave.classList.remove('playing');
  }

  if (btnMusicToggle) {
    btnMusicToggle.addEventListener('click', () => {
      if (isAudioPlaying) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }

  // ==========================================================================
  // 2. ENVELOPE OPENING (STAYS ON SCREEN 1 UNTIL USER SCROLLS)
  // ==========================================================================
  function openEnvelope() {
    if (isOpening || isEnvelopeOpened || isScreen2Active) return;
    isOpening = true;

    // Start background music on user touch
    if (!isAudioPlaying) {
      startMusic();
    }

    // Trigger golden wax seal explosion
    if (waxSeal) {
      const sealRect = waxSeal.getBoundingClientRect();
      spawnSealBurst(sealRect.left + sealRect.width / 2, sealRect.top + sealRect.height / 2);
    }

    // Stop subtle floating bounce
    if (envelopeScene) {
      envelopeScene.classList.add('opening-paused');
    }

    // 1. Unfold envelope flap in 3D & slide inner card upward
    if (envelope) {
      envelope.classList.add('opened');
    }

    // 2. Celebratory flower petal shower (Pushpavrishti) synced as card expands into full view
    setTimeout(() => {
      triggerPetalShower();
    }, 220);

    // 3. Fade out top CTA prompt and You're Invited text smoothly
    if (ctaContainer) {
      ctaContainer.style.opacity = '0';
      ctaContainer.style.pointerEvents = 'none';
    }
    const calligraphy = document.querySelector('.invitation-calligraphy-wrapper');
    if (calligraphy) {
      calligraphy.style.opacity = '0';
      calligraphy.style.transition = 'opacity 0.35s ease';
    }

    // 4. Mark envelope opened and activate whole-screen gentle bounce micro-interaction
    setTimeout(() => {
      isEnvelopeOpened = true;
      isOpening = false;

      if (coverScreen) {
        coverScreen.classList.remove('is-scrolling', 'paused-bounce');
        coverScreen.classList.add('screen-bounce');
      }
    }, 850);
  }

  const appContainer = document.getElementById('app-container');

  // ==========================================================================
  // 3. INTERCONNECTED SMOOTH SCROLL NAVIGATION BETWEEN SCREENS
  // ==========================================================================
  function scrollToScreen2() {
    if (announcementScreen) {
      announcementScreen.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function scrollToScreen1() {
    if (appContainer) {
      appContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (coverScreen) {
      coverScreen.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Smooth scroll to Screen 2 on user cue or tap
  function goToScreen2() {
    if (!isEnvelopeOpened) {
      openEnvelope();
    }
    scrollToScreen2();
  }

  // ==========================================================================
  // SCROLL CUE AUTO-PAUSE & FADE-OUT ON SCROLL / SWIPE
  // ==========================================================================
  // WHOLE SCREEN GENTLE BOUNCE AUTO-PAUSE ON SCROLL / SWIPE
  // ==========================================================================
  function handleScrollOrSwipeInteraction() {
    const currentScroll = appContainer ? appContainer.scrollTop : (window.scrollY || window.pageYOffset || 0);

    // If user has scrolled or swiped down towards Screen 2
    if (currentScroll > 15) {
      if (coverScreen) {
        coverScreen.classList.add('is-scrolling', 'paused-bounce');
      }
    } else if (currentScroll <= 5 && isEnvelopeOpened) {
      // Returned back to Screen 1: smoothly restore the screen gentle bounce
      if (coverScreen) {
        coverScreen.classList.remove('is-scrolling', 'paused-bounce');
      }
    }
  }

  // Active listeners on window and appContainer for scroll, touchmove, and wheel
  window.addEventListener('scroll', handleScrollOrSwipeInteraction, { passive: true });
  if (appContainer) {
    appContainer.addEventListener('scroll', () => {
      handleScrollOrSwipeInteraction();
      if (appContainer.scrollTop > 40 && !isEnvelopeOpened && !isOpening) {
        openEnvelope();
      }
    }, { passive: true });
  }

  let touchDragStartY = null;
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchDragStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (touchDragStartY !== null && e.touches && e.touches[0]) {
      const deltaY = touchDragStartY - e.touches[0].clientY;
      if (deltaY > 10 && isEnvelopeOpened && coverScreen) {
        coverScreen.classList.add('is-scrolling', 'paused-bounce');
      }
    }
    handleScrollOrSwipeInteraction();
  }, { passive: true });

  // Desktop Mouse Wheel Forwarding & Auto-Pause
  window.addEventListener('wheel', (e) => {
    if (e.target && e.target.closest('#app-container')) return;
    if (appContainer) {
      appContainer.scrollBy({ top: e.deltaY, behavior: 'smooth' });
      if (e.deltaY > 0 && !isEnvelopeOpened && !isOpening) {
        openEnvelope();
      }
    }
    if (e.deltaY > 5 && isEnvelopeOpened && coverScreen) {
      coverScreen.classList.add('is-scrolling', 'paused-bounce');
    }
    handleScrollOrSwipeInteraction();
  }, { passive: true });

  // Replay Functionality: Smoothly glide back to Screen 1 and reset envelope
  function replayEnvelope() {
    scrollToScreen1();

    setTimeout(() => {
      isEnvelopeOpened = false;
      isOpening = false;

      if (coverScreen) {
        coverScreen.classList.remove('screen-bounce', 'is-scrolling', 'paused-bounce');
      }

      if (envelope) {
        envelope.classList.remove('opened');
      }
      if (envelopeScene) {
        envelopeScene.classList.remove('opening-paused');
      }

      if (ctaContainer) {
        ctaContainer.style.opacity = '1';
        ctaContainer.style.pointerEvents = 'auto';
      }
      const calligraphy = document.querySelector('.invitation-calligraphy-wrapper');
      if (calligraphy) {
        calligraphy.style.opacity = '1';
      }
    }, 350);
  }

  // Bind Interaction Events
  if (envelope) envelope.addEventListener('click', openEnvelope);
  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }
  if (ctaContainer) {
    ctaContainer.addEventListener('click', openEnvelope);
  }
  if (innerCard) {
    innerCard.addEventListener('click', (e) => {
      if (isEnvelopeOpened) {
        e.stopPropagation();
        goToScreen2();
      }
    });
  }
  const coverFooter = document.querySelector('.cover-footer');
  if (coverFooter) {
    coverFooter.addEventListener('click', () => {
      if (isEnvelopeOpened) {
        goToScreen2();
      }
    });
    coverFooter.style.cursor = 'pointer';
  }
  if (btnReplay) {
    btnReplay.addEventListener('click', replayEnvelope);
  }

  // Keyboard Enter / Space on envelope
  if (envelope) {
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  // ==========================================================================
  // 3. WAX SEAL BURST PARTICLES
  // ==========================================================================
  function spawnSealBurst(x, y) {
    const burstCount = 28;
    const colors = ['#FFF2B2', '#D4AF37', '#FFDF73', '#FFFAF0', '#AA771C'];

    for (let i = 0; i < burstCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'seal-sparkle-particle';

      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.6;
      const distance = 40 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = 3 + Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 0 10px ${color};
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) scale(1);
        transition: transform 0.85s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.85s ease;
      `;

      document.body.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
        particle.style.opacity = '0';
      });

      setTimeout(() => particle.remove(), 900);
    }
  }

  // ==========================================================================
  // 4. INTERACTIVE PUSHPAVRISHTI FLOWER PETALS CANVAS PARTICLE SYSTEM
  // ==========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // ------------------------------------------------------------------------
    // A. Offscreen Sprite Generators (Hardware-Accelerated 60fps Mobile Blitting)
    // ------------------------------------------------------------------------
    function createRosePetalSprite(blurred = false) {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const cctx = c.getContext('2d');

      if (blurred) {
        cctx.filter = 'blur(2.2px)';
      }

      cctx.translate(32, 32);

      // Deep velvety crimson rose petal gradient
      const grad = cctx.createRadialGradient(-5, -6, 2, 0, 0, 26);
      grad.addColorStop(0, '#E61C3D');   // Luminous crimson ruby
      grad.addColorStop(0.42, '#B7092B'); // Traditional bridal red
      grad.addColorStop(0.82, '#7A0016'); // Velvet burgundy
      grad.addColorStop(1, '#4A000E');   // Deep shadowed rim

      cctx.fillStyle = grad;
      cctx.beginPath();
      // Gracefully curled organic rose petal
      cctx.moveTo(0, 22);
      cctx.bezierCurveTo(-19, 16, -26, -3, -17, -19);
      cctx.bezierCurveTo(-9, -27, 9, -27, 17, -19);
      cctx.bezierCurveTo(26, -3, 19, 16, 0, 22);
      cctx.closePath();
      cctx.fill();

      // Soft velvety sheen highlight curve
      const hlGrad = cctx.createLinearGradient(-12, -20, 10, 12);
      hlGrad.addColorStop(0, 'rgba(255, 195, 205, 0.45)');
      hlGrad.addColorStop(0.45, 'rgba(255, 115, 140, 0.18)');
      hlGrad.addColorStop(1, 'rgba(120, 0, 20, 0)');
      cctx.fillStyle = hlGrad;
      cctx.beginPath();
      cctx.moveTo(-2, 17);
      cctx.bezierCurveTo(-13, 11, -19, -2, -13, -15);
      cctx.bezierCurveTo(-7, -21, 3, -17, 7, -11);
      cctx.bezierCurveTo(9, 3, 3, 15, -2, 17);
      cctx.closePath();
      cctx.fill();

      return c;
    }

    function createLotusPetalSprite(blurred = false) {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const cctx = c.getContext('2d');

      if (blurred) {
        cctx.filter = 'blur(2.2px)';
      }

      cctx.translate(32, 32);

      // Sacred Lotus (Padma) Petal: Ivory-blush base to vibrant magenta tip
      const grad = cctx.createLinearGradient(0, 24, 0, -26);
      grad.addColorStop(0, '#FFF5F8');    // Pearlescent base
      grad.addColorStop(0.32, '#F8BBD0'); // Delicate lotus pink blush
      grad.addColorStop(0.72, '#E91E63'); // Auspicious vibrant lotus pink
      grad.addColorStop(1, '#AD1457');    // Deep magenta tip

      cctx.fillStyle = grad;
      cctx.beginPath();
      // Tapered lotus petal with pointed tip
      cctx.moveTo(0, -25);
      cctx.bezierCurveTo(14, -13, 20, 5, 11, 21);
      cctx.bezierCurveTo(6, 26, -6, 26, -11, 21);
      cctx.bezierCurveTo(-20, 5, -14, -13, 0, -25);
      cctx.closePath();
      cctx.fill();

      // Subtle translucent central rib vein
      cctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      cctx.lineWidth = 1.2;
      cctx.beginPath();
      cctx.moveTo(0, 22);
      cctx.quadraticCurveTo(0.6, 0, 0, -23);
      cctx.stroke();

      return c;
    }

    function createMarigoldHeadSprite(blurred = false) {
      const size = 72;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const cctx = c.getContext('2d');

      if (blurred) {
        cctx.filter = 'blur(2.2px)';
      }

      const cx = 36;
      const cy = 36;

      // Outer ruffled floret layer (16 petals)
      const outerCount = 16;
      cctx.fillStyle = '#FF8F00'; // Amber saffron
      for (let i = 0; i < outerCount; i++) {
        const angle = (i * 2 * Math.PI) / outerCount;
        const px = cx + Math.cos(angle) * 17;
        const py = cy + Math.sin(angle) * 17;
        cctx.beginPath();
        cctx.ellipse(px, py, 10.5, 6.5, angle + Math.PI / 2, 0, 2 * Math.PI);
        cctx.fill();
      }

      // Middle golden ruffled floret layer (12 petals)
      const midCount = 12;
      cctx.fillStyle = '#FFA000'; // Saffron gold
      for (let i = 0; i < midCount; i++) {
        const angle = (i * 2 * Math.PI) / midCount + 0.26;
        const px = cx + Math.cos(angle) * 12;
        const py = cy + Math.sin(angle) * 12;
        cctx.beginPath();
        cctx.ellipse(px, py, 8.5, 5.5, angle + Math.PI / 2, 0, 2 * Math.PI);
        cctx.fill();
      }

      // Inner vibrant yellow floret layer (10 petals)
      const innerCount = 10;
      cctx.fillStyle = '#FFC107'; // Radiant marigold yellow
      for (let i = 0; i < innerCount; i++) {
        const angle = (i * 2 * Math.PI) / innerCount + 0.52;
        const px = cx + Math.cos(angle) * 7;
        const py = cy + Math.sin(angle) * 7;
        cctx.beginPath();
        cctx.ellipse(px, py, 6.5, 4.5, angle + Math.PI / 2, 0, 2 * Math.PI);
        cctx.fill();
      }

      // Center ruffled lemon-gold crown (7 petals)
      const centerFloretCount = 7;
      cctx.fillStyle = '#FFD54F'; // Sunny bright yellow
      for (let i = 0; i < centerFloretCount; i++) {
        const angle = (i * 2 * Math.PI) / centerFloretCount + 0.15;
        const px = cx + Math.cos(angle) * 3.5;
        const py = cy + Math.sin(angle) * 3.5;
        cctx.beginPath();
        cctx.ellipse(px, py, 4, 3, angle + Math.PI / 2, 0, 2 * Math.PI);
        cctx.fill();
      }

      // Dense saffron core button
      const coreGrad = cctx.createRadialGradient(cx, cy, 1, cx, cy, 6);
      coreGrad.addColorStop(0, '#E65100'); // Deep saffron
      coreGrad.addColorStop(0.7, '#F57C00');
      coreGrad.addColorStop(1, '#FFA000');
      cctx.fillStyle = coreGrad;
      cctx.beginPath();
      cctx.arc(cx, cy, 5, 0, 2 * Math.PI);
      cctx.fill();

      return c;
    }

    function createMarigoldPetalSprite(blurred = false) {
      const size = 48;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const cctx = c.getContext('2d');

      if (blurred) {
        cctx.filter = 'blur(2px)';
      }

      cctx.translate(24, 24);
      const grad = cctx.createLinearGradient(0, 16, 0, -17);
      grad.addColorStop(0, '#FF8F00');   // Saffron orange base
      grad.addColorStop(0.4, '#FFA000');
      grad.addColorStop(0.78, '#FFC107'); // Sunny gold
      grad.addColorStop(1, '#FFE082');   // Highlight tip

      cctx.fillStyle = grad;
      cctx.beginPath();
      cctx.moveTo(0, 16);
      cctx.bezierCurveTo(-7, 8, -9, -9, -5, -15);
      cctx.lineTo(-2, -17);
      cctx.lineTo(0, -16);
      cctx.lineTo(2, -17);
      cctx.lineTo(5, -15);
      cctx.bezierCurveTo(9, -9, 7, 8, 0, 16);
      cctx.closePath();
      cctx.fill();

      return c;
    }

    function createGoldSparkleSprite() {
      const size = 32;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const cctx = c.getContext('2d');
      cctx.translate(16, 16);

      const grad = cctx.createRadialGradient(0, 0, 1, 0, 0, 13);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.28, '#FFF4B8');
      grad.addColorStop(0.7, '#D4AF37');
      grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

      cctx.fillStyle = grad;
      cctx.beginPath();
      const s = 11;
      cctx.moveTo(0, -s);
      cctx.quadraticCurveTo(0, 0, s, 0);
      cctx.quadraticCurveTo(0, 0, 0, s);
      cctx.quadraticCurveTo(0, 0, -s, 0);
      cctx.quadraticCurveTo(0, 0, 0, -s);
      cctx.fill();

      return c;
    }

    // Pre-cache all sprite canvases
    const SPRITES = {
      roseCrisp: createRosePetalSprite(false),
      roseBlurred: createRosePetalSprite(true),
      lotusCrisp: createLotusPetalSprite(false),
      lotusBlurred: createLotusPetalSprite(true),
      marigoldHeadCrisp: createMarigoldHeadSprite(false),
      marigoldHeadBlurred: createMarigoldHeadSprite(true),
      marigoldPetalCrisp: createMarigoldPetalSprite(false),
      sparkle: createGoldSparkleSprite(),
    };

    // ------------------------------------------------------------------------
    // B. Interactive Wind & Touch Physics Tracking
    // ------------------------------------------------------------------------
    let windX = 0;
    let targetWindX = 0;
    let lastTouchX = null;

    window.addEventListener('mousemove', (e) => {
      const deltaX = e.movementX || 0;
      targetWindX = Math.max(-3, Math.min(3, deltaX * 0.15));
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const curX = e.touches[0].clientX;
        if (lastTouchX !== null) {
          const deltaX = curX - lastTouchX;
          targetWindX = Math.max(-3, Math.min(3, deltaX * 0.12));
        }
        lastTouchX = curX;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      lastTouchX = null;
    }, { passive: true });

    // ------------------------------------------------------------------------
    // C. Pushpavrishti Particle Physics Class
    // ------------------------------------------------------------------------
    const isMobile = window.innerWidth < 768;
    const TOTAL_PARTICLES = isMobile ? 36 : 48;
    const PETAL_SIZE_MULTIPLIER = 0.48; // Increased from 0.30 to 0.48 for optimal petal prominence
    const particles = [];

    class PushpavrishtiPetal {
      constructor(isBurst = false, burstOriginX = 0, burstOriginY = 0) {
        this.reset(true, isBurst, burstOriginX, burstOriginY);
      }

      reset(initial = false, isBurst = false, burstOriginX = 0, burstOriginY = 0) {
        // 3 Depth of Field Tiers:
        // Layer 0: Foreground (closer, larger, faster, crisp)
        // Layer 1: Midground (standard, medium, crisp)
        // Layer 2: Background (further back, smaller, gentle float, blurred)
        const layerRand = Math.random();
        if (layerRand < 0.25) {
          this.layer = 0; // Foreground
          this.baseScale = (0.85 + Math.random() * 0.35) * PETAL_SIZE_MULTIPLIER; // ~0.40 - 0.58
          this.opacity = 0.82 + Math.random() * 0.08;   // 0.82 - 0.90
          this.speedY = 1.5 + Math.random() * 0.85;
          this.swayAmp = 23 + Math.random() * 14;
          this.useBlur = false;
        } else if (layerRand < 0.70) {
          this.layer = 1; // Midground
          this.baseScale = (0.62 + Math.random() * 0.22) * PETAL_SIZE_MULTIPLIER; // ~0.30 - 0.40
          this.opacity = 0.72 + Math.random() * 0.12;   // 0.72 - 0.84
          this.speedY = 1.05 + Math.random() * 0.55;
          this.swayAmp = 16 + Math.random() * 10;
          this.useBlur = false;
        } else {
          this.layer = 2; // Background (DoF gentle blur)
          this.baseScale = (0.42 + Math.random() * 0.18) * PETAL_SIZE_MULTIPLIER; // ~0.20 - 0.29
          this.opacity = 0.60 + Math.random() * 0.12;   // 0.60 - 0.72
          this.speedY = 0.60 + Math.random() * 0.40;
          this.swayAmp = 9 + Math.random() * 7;
          this.useBlur = true;
        }

        // Floral Type Distribution:
        // Crimson Rose Petals (~36%), Pink Lotus Petals (~30%),
        // Yellow Marigold Flower Heads (~20%), Marigold Petals (~9%), Sparkles (~5%)
        const typeRand = Math.random();
        if (typeRand < 0.36) {
          this.type = 'rose';
          this.sprite = this.useBlur ? SPRITES.roseBlurred : SPRITES.roseCrisp;
          this.spriteSize = 64;
        } else if (typeRand < 0.66) {
          this.type = 'lotus';
          this.sprite = this.useBlur ? SPRITES.lotusBlurred : SPRITES.lotusCrisp;
          this.spriteSize = 64;
        } else if (typeRand < 0.86) {
          this.type = 'marigoldHead';
          this.sprite = this.useBlur ? SPRITES.marigoldHeadBlurred : SPRITES.marigoldHeadCrisp;
          this.spriteSize = 72;
          // Marigold heads are full blossoms, slight weight adjustment
          this.speedY *= 1.05;
        } else if (typeRand < 0.95) {
          this.type = 'marigoldPetal';
          this.sprite = SPRITES.marigoldPetalCrisp;
          this.spriteSize = 48;
        } else {
          this.type = 'sparkle';
          this.sprite = SPRITES.sparkle;
          this.spriteSize = 32;
          this.baseScale = 0.38 + Math.random() * 0.15;
          this.opacity = 0.88;
        }

        // Coordinates & Physics
        if (isBurst) {
          this.x = burstOriginX + (Math.random() - 0.5) * 60;
          this.y = burstOriginY + (Math.random() - 0.5) * 40;
          this.burstVelX = (Math.random() - 0.5) * 6;
          this.burstVelY = -1.5 - Math.random() * 3.5;
          this.speedY = 1.6 + Math.random() * 1.4;
        } else {
          this.x = Math.random() * (width + 80) - 40;
          this.y = initial ? Math.random() * (height + 50) - 20 : -45;
          this.burstVelX = 0;
          this.burstVelY = 0;
        }

        // Rotation & 3D Tumbling flutter
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.8;
        this.flipPhase = Math.random() * Math.PI * 2;
        this.flipSpeed = 0.016 + Math.random() * 0.024;

        // Side-to-side harmonic swaying
        this.swayPhase = Math.random() * Math.PI * 2;
        this.swaySpeed = 0.018 + Math.random() * 0.016;
        this.driftX = (Math.random() - 0.5) * 0.4;
      }

      update() {
        // Handle burst decay if spawned during unseal celebration
        if (this.burstVelY !== 0 || this.burstVelX !== 0) {
          this.x += this.burstVelX;
          this.y += this.burstVelY;
          this.burstVelX *= 0.95;
          this.burstVelY += 0.15; // gravity pulls burst down
          if (this.burstVelY > this.speedY) {
            this.burstVelY = 0;
            this.burstVelX = 0;
          }
        } else {
          this.y += this.speedY;
        }

        // Harmonic sway & wind influence
        this.swayPhase += this.swaySpeed;
        const layerWindMult = this.layer === 0 ? 1.3 : this.layer === 1 ? 1.0 : 0.7;
        const swayOffset = Math.sin(this.swayPhase) * (this.swayAmp * 0.035);
        this.x += swayOffset + (windX * layerWindMult) + this.driftX;

        // 2D Rotation & 3D Flipping Flutter
        this.rotation += this.rotationSpeed;
        this.flipPhase += this.flipSpeed;

        // Recycle when drifting past bottom or sides
        if (this.y > height + 50 || this.x < -60 || this.x > width + 60) {
          this.reset(false);
        }
      }

      draw() {
        const rad = (this.rotation * Math.PI) / 180;
        // Realistic 3D flutter: Math.cos(flipPhase) simulates the petal flipping face-to-edge in air
        const flip = Math.cos(this.flipPhase);
        const drawScaleX = this.baseScale * (0.35 + 0.65 * Math.abs(flip));
        const drawScaleY = this.baseScale;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(rad);
        ctx.scale(drawScaleX, drawScaleY);
        ctx.globalAlpha = this.opacity;

        const half = this.spriteSize / 2;
        ctx.drawImage(this.sprite, -half, -half, this.spriteSize, this.spriteSize);

        ctx.restore();
      }
    }

    // Populate initial particle system
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      particles.push(new PushpavrishtiPetal());
    }

    // ------------------------------------------------------------------------
    // D. Celebratory Shower Burst (Pushpavrishti on Envelope Opening)
    // ------------------------------------------------------------------------
    function burstPetals() {
      const originX = width / 2;
      const originY = height * 0.38;
      const burstCount = isMobile ? 26 : 36;
      for (let i = 0; i < burstCount; i++) {
        particles.push(new PushpavrishtiPetal(true, originX, originY));
      }
      // Trim excess particles after 6 seconds to preserve mobile 60fps
      setTimeout(() => {
        while (particles.length > TOTAL_PARTICLES) {
          particles.shift();
        }
      }, 5500);
    }

    // Connect trigger hook to envelope opening
    triggerPetalShower = burstPetals;

    // ------------------------------------------------------------------------
    // E. 60 FPS Render Loop
    // ------------------------------------------------------------------------
    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Smooth wind decay
      windX += (targetWindX - windX) * 0.05;
      targetWindX *= 0.94;

      // Update and draw all petals
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        particles[i].update();
        particles[i].draw();
      }

      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }
});
