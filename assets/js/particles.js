/**
 * Wedding Invitation - Pushpavrishti Flower Petals & Sparkle Canvas Engine
 * File: assets/js/particles.js
 * Purpose: Interactive canvas particle engine with pre-cached 60fps sprites (crimson roses,
 *          sacred lotus, golden yellow rose petals, gold sparkles), wind/touch drift,
 *          3D tumbling physics, celebratory shower, and wax seal break sparks.
 */

(function (window) {
  'use strict';

  let canvas = null;
  let ctx = null;
  let dpr = 1;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = [];
  let SPRITES = {};
  let windX = 0;
  let targetWindX = 0;
  let lastTouchX = null;
  let isRunning = false;

  // ------------------------------------------------------------------------
  // A. Offscreen Sprite Generators (Hardware-Accelerated Blitting)
  // ------------------------------------------------------------------------
  function createRosePetalSprite(blurred = false) {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const cctx = c.getContext('2d');
    if (blurred) cctx.filter = 'blur(2.2px)';
    cctx.translate(32, 32);

    const grad = cctx.createRadialGradient(-5, -6, 2, 0, 0, 26);
    grad.addColorStop(0, '#E61C3D');
    grad.addColorStop(0.42, '#B7092B');
    grad.addColorStop(0.82, '#7A0016');
    grad.addColorStop(1, '#4A000E');

    cctx.fillStyle = grad;
    cctx.beginPath();
    cctx.moveTo(0, 22);
    cctx.bezierCurveTo(-19, 16, -26, -3, -17, -19);
    cctx.bezierCurveTo(-9, -27, 9, -27, 17, -19);
    cctx.bezierCurveTo(26, -3, 19, 16, 0, 22);
    cctx.closePath();
    cctx.fill();

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
    if (blurred) cctx.filter = 'blur(2.2px)';
    cctx.translate(32, 32);

    const grad = cctx.createLinearGradient(0, 24, 0, -26);
    grad.addColorStop(0, '#FFF5F8');
    grad.addColorStop(0.32, '#F8BBD0');
    grad.addColorStop(0.72, '#E91E63');
    grad.addColorStop(1, '#AD1457');

    cctx.fillStyle = grad;
    cctx.beginPath();
    cctx.moveTo(0, -25);
    cctx.bezierCurveTo(14, -13, 20, 5, 11, 21);
    cctx.bezierCurveTo(6, 26, -6, 26, -11, 21);
    cctx.bezierCurveTo(-20, 5, -14, -13, 0, -25);
    cctx.closePath();
    cctx.fill();

    cctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    cctx.lineWidth = 1.2;
    cctx.beginPath();
    cctx.moveTo(0, 22);
    cctx.quadraticCurveTo(0.6, 0, 0, -23);
    cctx.stroke();

    return c;
  }

  function createYellowRosePetalSprite(blurred = false) {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const cctx = c.getContext('2d');
    if (blurred) cctx.filter = 'blur(2.2px)';
    cctx.translate(32, 32);

    // Warm, velvety golden yellow rose radial gradient
    const grad = cctx.createRadialGradient(-4, -5, 2, 0, 0, 26);
    grad.addColorStop(0, '#FFF176');    // Luminous bright golden core
    grad.addColorStop(0.38, '#FBC02D'); // Rich royal yellow
    grad.addColorStop(0.72, '#F57F17'); // Warm saffron amber
    grad.addColorStop(1, '#D96500');    // Deep warm golden-orange edge shadow

    cctx.fillStyle = grad;
    cctx.beginPath();
    cctx.moveTo(0, 22);
    cctx.bezierCurveTo(-20, 16, -26, -3, -18, -19);
    cctx.bezierCurveTo(-10, -28, 9, -27, 18, -19);
    cctx.bezierCurveTo(27, -2, 20, 16, 0, 22);
    cctx.closePath();
    cctx.fill();

    // Silky curled petal highlight
    const hlGrad = cctx.createLinearGradient(-14, -22, 10, 12);
    hlGrad.addColorStop(0, 'rgba(255, 255, 225, 0.65)');
    hlGrad.addColorStop(0.42, 'rgba(255, 238, 140, 0.28)');
    hlGrad.addColorStop(1, 'rgba(217, 101, 0, 0)');
    cctx.fillStyle = hlGrad;
    cctx.beginPath();
    cctx.moveTo(-2, 17);
    cctx.bezierCurveTo(-14, 11, -20, -2, -14, -15);
    cctx.bezierCurveTo(-8, -22, 3, -18, 8, -12);
    cctx.bezierCurveTo(10, 2, 3, 15, -2, 17);
    cctx.closePath();
    cctx.fill();

    // Subtle delicate center spine line
    cctx.strokeStyle = 'rgba(255, 255, 240, 0.45)';
    cctx.lineWidth = 1.0;
    cctx.beginPath();
    cctx.moveTo(0, 20);
    cctx.quadraticCurveTo(-1, 2, 0, -18);
    cctx.stroke();

    return c;
  }

  function createMarigoldPetalSprite(blurred = false) {
    const size = 48;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const cctx = c.getContext('2d');
    if (blurred) cctx.filter = 'blur(2px)';

    cctx.translate(24, 24);
    const grad = cctx.createLinearGradient(0, 16, 0, -17);
    grad.addColorStop(0, '#FF8F00');
    grad.addColorStop(0.4, '#FFA000');
    grad.addColorStop(0.78, '#FFC107');
    grad.addColorStop(1, '#FFE082');

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

  // ------------------------------------------------------------------------
  // B. Pushpavrishti Particle Physics Class
  // ------------------------------------------------------------------------
  const PETAL_SIZE_MULTIPLIER = 0.48;

  class PushpavrishtiPetal {
    constructor(isBurst = false, burstOriginX = 0, burstOriginY = 0) {
      this.reset(true, isBurst, burstOriginX, burstOriginY);
    }

    reset(initial = false, isBurst = false, burstOriginX = 0, burstOriginY = 0) {
      const layerRand = Math.random();
      if (layerRand < 0.25) {
        this.layer = 0; // Foreground
        this.baseScale = (0.70 + Math.random() * 0.25) * PETAL_SIZE_MULTIPLIER;
        this.opacity = 0.94 + Math.random() * 0.06;
        this.speedY = 1.3 + Math.random() * 0.70;
        this.swayAmp = 20 + Math.random() * 12;
        this.useBlur = false;
      } else if (layerRand < 0.70) {
        this.layer = 1; // Midground
        this.baseScale = (0.50 + Math.random() * 0.20) * PETAL_SIZE_MULTIPLIER;
        this.opacity = 0.88 + Math.random() * 0.10;
        this.speedY = 0.95 + Math.random() * 0.45;
        this.swayAmp = 14 + Math.random() * 8;
        this.useBlur = false;
      } else {
        this.layer = 2; // Background
        this.baseScale = (0.35 + Math.random() * 0.15) * PETAL_SIZE_MULTIPLIER;
        this.opacity = 0.80 + Math.random() * 0.12;
        this.speedY = 0.55 + Math.random() * 0.35;
        this.swayAmp = 8 + Math.random() * 6;
        this.useBlur = true;
      }

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
        this.type = 'yellowRose';
        this.sprite = this.useBlur ? SPRITES.yellowRoseBlurred : SPRITES.yellowRoseCrisp;
        this.spriteSize = 64;
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

      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.8;
      this.flipPhase = Math.random() * Math.PI * 2;
      this.flipSpeed = 0.016 + Math.random() * 0.024;

      this.swayPhase = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.018 + Math.random() * 0.016;
      this.driftX = (Math.random() - 0.5) * 0.4;
    }

    update() {
      if (this.burstVelY !== 0 || this.burstVelX !== 0) {
        this.x += this.burstVelX;
        this.y += this.burstVelY;
        this.burstVelX *= 0.95;
        this.burstVelY += 0.15;
        if (this.burstVelY > this.speedY) {
          this.burstVelY = 0;
          this.burstVelX = 0;
        }
      } else {
        this.y += this.speedY;
      }

      this.swayPhase += this.swaySpeed;
      const layerWindMult = this.layer === 0 ? 1.3 : this.layer === 1 ? 1.0 : 0.7;
      const swayOffset = Math.sin(this.swayPhase) * (this.swayAmp * 0.035);
      this.x += swayOffset + (windX * layerWindMult) + this.driftX;

      this.rotation += this.rotationSpeed;
      this.flipPhase += this.flipSpeed;

      if (this.y > height + 50 || this.x < -60 || this.x > width + 60) {
        this.reset(false);
      }
    }

    draw() {
      const rad = (this.rotation * Math.PI) / 180;
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

  // ------------------------------------------------------------------------
  // C. Wax Seal Break & Snap Sparkles (DOM Elements)
  // ------------------------------------------------------------------------
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

  function spawnSealCloseSparkle(x, y) {
    const sparkleCount = 10;
    const colors = ['#FFF7C2', '#D4AF37', '#FFDF73', '#FFFFFF', '#E6C158'];

    for (let i = 0; i < sparkleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'seal-sparkle-particle';

      const angle = (Math.PI * 2 * i) / sparkleCount + (Math.random() - 0.5) * 0.4;
      const distance = 20 + Math.random() * 28;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = 3 + Math.random() * 3.5;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 0 8px ${color};
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) scale(0.2);
        opacity: 0.95;
        transition: transform 0.6s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.6s ease;
      `;

      document.body.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
        particle.style.opacity = '0';
      });

      setTimeout(() => particle.remove(), 650);
    }
  }

  // ------------------------------------------------------------------------
  // D. Celebratory Shower Burst (Pushpavrishti on Envelope Opening)
  // ------------------------------------------------------------------------
  function burstPetals() {
    const isMobile = window.innerWidth < 768;
    const burstCount = isMobile ? 18 : 26;
    for (let i = 0; i < burstCount; i++) {
      const originX = width * (0.2 + Math.random() * 0.6);
      const originY = height * (0.12 + Math.random() * 0.15);
      particles.push(new PushpavrishtiPetal(true, originX, originY));
    }
    const totalParticles = isMobile ? 32 : 44;
    setTimeout(() => {
      while (particles.length > totalParticles) {
        particles.shift();
      }
    }, 4500);
  }

  // ------------------------------------------------------------------------
  // E. Canvas Render Loop & Init
  // ------------------------------------------------------------------------
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function animateCanvas() {
    if (!isRunning || !ctx) return;
    ctx.clearRect(0, 0, width, height);

    windX += (targetWindX - windX) * 0.05;
    targetWindX *= 0.94;

    const len = particles.length;
    for (let i = 0; i < len; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animateCanvas);
  }

  function init() {
    canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Pre-cache sprites
    SPRITES = {
      roseCrisp: createRosePetalSprite(false),
      roseBlurred: createRosePetalSprite(true),
      lotusCrisp: createLotusPetalSprite(false),
      lotusBlurred: createLotusPetalSprite(true),
      yellowRoseCrisp: createYellowRosePetalSprite(false),
      yellowRoseBlurred: createYellowRosePetalSprite(true),
      marigoldPetalCrisp: createMarigoldPetalSprite(false),
      sparkle: createGoldSparkleSprite(),
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

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

    const isMobile = window.innerWidth < 768;
    const TOTAL_PARTICLES = isMobile ? 36 : 48;
    particles = [];
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      particles.push(new PushpavrishtiPetal());
    }

    isRunning = true;
    animateCanvas();
  }

  window.WeddingParticles = {
    init: init,
    burstPetals: burstPetals,
    spawnSealBurst: spawnSealBurst,
    spawnSealCloseSparkle: spawnSealCloseSparkle
  };
})(window);
