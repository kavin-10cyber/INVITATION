/**
 * Wedding Invitation - Application Bootstrap Coordinator
 * File: assets/js/main.js
 * Purpose: Initializes and coordinates all decoupled modular components on DOM ready.
 *
 * Module Architecture:
 * 1. WeddingAudio     (assets/js/audio.js)            - Music autoplay, controls & soundwave sync
 * 2. WeddingStage     (assets/js/stage.js)            - GSAP hardware-accelerated entrance timeline
 * 3. WeddingParticles (assets/js/particles.js)        - Pushpavrishti canvas petals & gold sparkles
 * 4. WeddingEnvelope  (assets/js/envelope.js)         - 3D envelope fold, opening/closing choreography
 * 5. WeddingScroll    (assets/js/scroll-transition.js)- 60/120fps cinematic depth dissolve & scroll guard
 * 6. WeddingTheme     (assets/js/theme-switcher.js)   - Live envelope color theme selector
 */

(function () {
  'use strict';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  let hasBootstrapped = false;

  function bootstrap() {
    if (hasBootstrapped) return;
    hasBootstrapped = true;

    // 1. Initialize Audio Player & Autoplay Guard
    if (window.WeddingAudio) {
      window.WeddingAudio.init();
    }

    // 2. Initialize Pushpavrishti Particle Canvas
    if (window.WeddingParticles) {
      window.WeddingParticles.init();
    }

    // 3. Initialize 3D Envelope Interaction & Events
    if (window.WeddingEnvelope) {
      window.WeddingEnvelope.init();
    }

    // 3.5. Initialize Progressive Typewriter Text Reveal
    if (window.WeddingReveal) {
      window.WeddingReveal.init();
    }

    // 4. Initialize Interactive Gold Glitter Scratch Card
    if (window.WeddingScratchCard) {
      window.WeddingScratchCard.init();
    }

    // 5. Initialize Continuous Scroll Transition & Scrubbing
    if (window.WeddingScroll) {
      window.WeddingScroll.init();
    }

    // 6. Initialize Live Color Theme Switcher
    if (window.WeddingTheme) {
      window.WeddingTheme.init();
    }

    // 7. Trigger GSAP Entrance Flow Animation
    if (window.WeddingStage) {
      window.WeddingStage.playEntranceTimeline();
    }
  }

  // Robust Lifecycle Execution:
  // If document is still loading, bind to DOMContentLoaded.
  // If document is already interactive or complete (e.g. cold script defer or late execution), run immediately.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  // Safety net: in case deferred scripts run after window.onload or DOM ready edge cases
  window.addEventListener('load', bootstrap);
})();
