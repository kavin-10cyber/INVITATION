/**
 * ============================================================================
 * WEDDING INVITATION - THANK YOU CLOSING SCREEN CONTROLLER
 * Workspace: INVITATION (Deepak & Vikashini)
 * File: assets/js/thank-you.js
 * Purpose: Dedicated interactive controller for the Thank You closing screen (Screen 5).
 *          Choreographs slow, cinematic text reveals and graceful transitions.
 * ============================================================================
 */

(function (window) {
  'use strict';

  // DOM Elements cache
  let screen4El = null;
  let screen5El = null;
  let isTransitioning = false;
  let touchStartY = 0;
  let touchStartX = 0;

  /**
   * Initializes Thank You screen DOM references, navigation bindings, and touch gestures.
   */
  function init() {
    screen4El = document.getElementById('invitation-screen-4');
    screen5El = document.getElementById('invitation-screen-5');

    // 1. Screen 4 Scroll/Next Button (#btn-venue-scroll) Triggers Screen 5 Transition
    const btnVenueScroll = document.getElementById('btn-venue-scroll');
    if (btnVenueScroll) {
      btnVenueScroll.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        transitionToScreen5();
      });
    }

    // 2. Screen 4 Touch Swipe Navigation to Screen 5 (Swipe Up / Scroll Past End)
    if (screen4El) {
      screen4El.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          touchStartY = e.touches[0].clientY;
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      screen4El.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          const diffY = touchStartY - e.changedTouches[0].clientY;
          const diffX = Math.abs(touchStartX - e.changedTouches[0].clientX);
          // Swiping up (diffY > 45) while near bottom of screen 4
          if (diffY > 45 && Math.abs(diffY) > diffX * 1.2) {
            const isNearBottom = (screen4El.scrollHeight - screen4El.scrollTop - screen4El.clientHeight) <= 40;
            if (isNearBottom) {
              transitionToScreen5();
            }
          }
        }
      }, { passive: true });
    }

    // 3. Screen 5 Touch Swipe Back to Screen 4 (Swipe Down while at top of scroll)
    if (screen5El) {
      screen5El.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          touchStartY = e.touches[0].clientY;
          touchStartX = e.touches[0].clientX;
        }
      }, { passive: true });

      screen5El.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          const diffY = touchStartY - e.changedTouches[0].clientY;
          const diffX = Math.abs(touchStartX - e.changedTouches[0].clientX);
          // Swiping down (diffY < -45) while at top of screen 5
          if (diffY < -45 && Math.abs(diffY) > diffX * 1.2) {
            if (screen5El.scrollTop <= 10) {
              transitionBackToScreen4();
            }
          }
        }
      }, { passive: true });
    }
  }

  /**
   * Slow, regal cinematic transition from Screen 4 (Venue & Directions) into Screen 5 (Thank You).
   * Follows user-specified 9-phase staggered animation sequence.
   */
  function transitionToScreen5() {
    if (isTransitioning || !screen5El) return;
    isTransitioning = true;

    if (!screen4El) screen4El = document.getElementById('invitation-screen-4');
    const btnReplayFab = document.getElementById('btn-replay-fab');

    // Ensure Replay FAB is completely hidden on Thank You screen
    if (btnReplayFab) {
      btnReplayFab.style.opacity = '0';
      btnReplayFab.style.pointerEvents = 'none';
    }

    // Elements inside Screen 5 to animate
    const headerEl = screen5El.querySelector('.ty-header-section');
    const pipEl = screen5El.querySelector('.ty-top-pip-wrap');
    const eyebrowEl = screen5El.querySelector('.ty-eyebrow-text');
    const titleEl = screen5El.querySelector('.ty-main-heading');
    const flourishEl = screen5El.querySelector('.ty-flourish-wrap');
    const supportingEl = screen5El.querySelector('.ty-supporting-heading');
    const dividers = screen5El.querySelectorAll('.ty-divider-ornament');
    const monogramEl = screen5El.querySelector('.ty-monogram-container');
    const coupleNamesEl = screen5El.querySelector('.ty-couple-names');
    const taglineEl = screen5El.querySelector('.ty-couple-tagline');
    const messageEl = screen5El.querySelector('.ty-message-paragraph');
    const shimmerEl = screen5El.querySelector('.ty-shimmer-scrim');

    // Scroll to top of Screen 5
    screen5El.scrollTop = 0;

    if (typeof gsap !== 'undefined') {
      if (screen4El) gsap.killTweensOf(screen4El);
      gsap.killTweensOf([
        screen5El, headerEl, pipEl, eyebrowEl, titleEl, flourishEl,
        supportingEl, monogramEl, coupleNamesEl, taglineEl, messageEl
      ]);
      if (dividers) gsap.killTweensOf(dividers);

      // Pre-set initial states for hardware-accelerated fluid entrance
      gsap.set(screen5El, { display: 'flex', opacity: 0 });
      if (pipEl) gsap.set(pipEl, { opacity: 0, y: -6, scale: 0.8 });
      if (eyebrowEl) gsap.set(eyebrowEl, { opacity: 0, y: -6 });
      if (titleEl) gsap.set(titleEl, { opacity: 0, scale: 0.86, y: -10 });
      if (flourishEl) gsap.set(flourishEl, { opacity: 0, scaleX: 0.7, transformOrigin: 'center center' });
      if (supportingEl) gsap.set(supportingEl, { opacity: 0, y: 12 });
      if (dividers && dividers.length > 0) gsap.set(dividers, { opacity: 0, scaleX: 0.4, transformOrigin: 'center center' });
      if (monogramEl) gsap.set(monogramEl, { opacity: 0, scale: 0.76, transformOrigin: 'center center' });
      if (coupleNamesEl) gsap.set(coupleNamesEl, { opacity: 0, y: 8 });
      if (taglineEl) gsap.set(taglineEl, { opacity: 0, y: 6 });
      if (messageEl) gsap.set(messageEl, { opacity: 0, y: 12 });
      if (shimmerEl) gsap.set(shimmerEl, { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          if (screen4El) {
            screen4El.classList.remove('screen-active');
            screen4El.classList.add('screen-hidden');
            screen4El.style.display = 'none';
          }
          screen5El.classList.remove('screen-hidden');
          screen5El.classList.add('screen-active');
          gsap.set(screen5El, { clearProps: 'transform' });
          isTransitioning = false;
        }
      });

      // 1. Screen 4 gently dissolves away (0.40s)
      if (screen4El) {
        tl.to(screen4El, {
          opacity: 0,
          scale: 0.96,
          duration: 0.40,
          ease: 'power2.inOut'
        }, 0);
      }

      // 2. Phase 1: Screen 5 Ivory background and floral frame fade in gently (0.60s)
      tl.to(screen5El, {
        opacity: 1,
        duration: 0.60,
        ease: 'power2.out'
      }, 0.20);

      if (shimmerEl) {
        tl.to(shimmerEl, {
          opacity: 1,
          duration: 0.90,
          ease: 'sine.out'
        }, 0.25);
      }

      // 3. Phase 2: Top gold ornament pip and "WITH LOVE & GRATITUDE" eyebrow appear (0.50s)
      if (pipEl) {
        tl.to(pipEl, {
          opacity: 1,
          y: 0,
          scale: 1.0,
          duration: 0.45,
          ease: 'back.out(1.4)'
        }, 0.45);
      }
      if (eyebrowEl) {
        tl.to(eyebrowEl, {
          opacity: 1,
          y: 0,
          duration: 0.50,
          ease: 'power2.out'
        }, 0.52);
      }

      // 4. Phase 3: "Thank You" Calligraphy Heading reveals gracefully (0.80s)
      if (titleEl) {
        tl.to(titleEl, {
          opacity: 1,
          scale: 1.0,
          y: 0,
          duration: 0.80,
          ease: 'power2.out'
        }, 0.70);
      }

      // 5. Phase 4: Gold heart flourish smoothly draws & fades into view beneath heading (0.55s)
      if (flourishEl) {
        tl.to(flourishEl, {
          opacity: 1,
          scaleX: 1.0,
          duration: 0.55,
          ease: 'back.out(1.3)'
        }, 0.95);
      }

      // 6. Phase 5: "For Gracing Us With Your Presence & Blessings" fades in with slight upward movement (0.55s)
      if (supportingEl) {
        tl.to(supportingEl, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out'
        }, 1.15);
      }

      // First divider expands
      if (dividers && dividers[0]) {
        tl.to(dividers[0], {
          opacity: 0.85,
          scaleX: 1.0,
          duration: 0.45,
          ease: 'power2.out'
        }, 1.30);
      }

      // 7. Phase 6: Circular Antique-Gold D & V Monogram appears with gentle scale-and-fade (0.75s)
      if (monogramEl) {
        tl.to(monogramEl, {
          opacity: 1,
          scale: 1.0,
          duration: 0.75,
          ease: 'back.out(1.35)'
        }, 1.45);
      }

      // 8. Phase 7: Couple Names "Deepak & Vikashini" and tagline appear sequentially (0.55s)
      if (coupleNamesEl) {
        tl.to(coupleNamesEl, {
          opacity: 1,
          y: 0,
          duration: 0.50,
          ease: 'power2.out'
        }, 1.70);
      }
      if (taglineEl) {
        tl.to(taglineEl, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out'
        }, 1.85);
      }

      // Second divider expands
      if (dividers && dividers[1]) {
        tl.to(dividers[1], {
          opacity: 0.85,
          scaleX: 1.0,
          duration: 0.45,
          ease: 'power2.out'
        }, 1.95);
      }

      // 9. Phase 8: Exact Replacement Paragraph fades in with smooth, elegant text reveal (0.75s)
      if (messageEl) {
        tl.to(messageEl, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out'
        }, 2.05);
      }

    } else {
      // Fallback without GSAP
      if (screen4El) {
        screen4El.classList.remove('screen-active');
        screen4El.classList.add('screen-hidden');
        screen4El.style.display = 'none';
        screen4El.style.opacity = '0';
      }
      screen5El.classList.remove('screen-hidden');
      screen5El.classList.add('screen-active');
      screen5El.style.display = 'flex';
      screen5El.style.opacity = '1';
      isTransitioning = false;
    }
  }

  /**
   * Smooth return from Screen 5 (Thank You) back to Screen 4 (Venue & Directions).
   */
  function transitionBackToScreen4() {
    if (isTransitioning || !screen4El || !screen5El) return;
    isTransitioning = true;

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf([screen4El, screen5El]);

      gsap.set(screen4El, {
        display: 'flex',
        opacity: 0,
        scale: 0.96
      });

      const tl = gsap.timeline({
        onComplete: () => {
          screen5El.classList.remove('screen-active');
          screen5El.classList.add('screen-hidden');
          screen5El.style.display = 'none';

          screen4El.classList.remove('screen-hidden');
          screen4El.classList.add('screen-active');
          gsap.set(screen4El, { clearProps: 'all' });
          isTransitioning = false;
        }
      });

      // 1. Screen 5 gently recedes
      tl.to(screen5El, {
        opacity: 0,
        scale: 0.96,
        duration: 0.40,
        ease: 'power2.inOut'
      }, 0);

      // 2. Screen 4 emerges smoothly
      tl.to(screen4El, {
        opacity: 1,
        scale: 1.0,
        duration: 0.50,
        ease: 'power2.out'
      }, 0.18);

    } else {
      screen5El.classList.remove('screen-active');
      screen5El.classList.add('screen-hidden');
      screen5El.style.display = 'none';
      screen5El.style.opacity = '0';

      screen4El.classList.remove('screen-hidden');
      screen4El.classList.add('screen-active');
      screen4El.style.display = 'flex';
      screen4El.style.opacity = '1';
      isTransitioning = false;
    }
  }

  /**
   * Resets Screen 5 state on replay or full reset.
   */
  function reset() {
    isTransitioning = false;

    if (screen5El) {
      if (typeof gsap !== 'undefined') gsap.killTweensOf(screen5El);
      screen5El.classList.remove('screen-active');
      screen5El.classList.add('screen-hidden');
      if (typeof gsap !== 'undefined') gsap.set(screen5El, { clearProps: 'all' });
      screen5El.style.removeProperty('display');
      screen5El.style.removeProperty('opacity');
      screen5El.style.removeProperty('transform');
      screen5El.style.display = 'none';
      screen5El.style.opacity = '0';
      screen5El.scrollTop = 0;
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      setTimeout(checkUrlScreenTrigger, 220);
    });
  } else {
    init();
    setTimeout(checkUrlScreenTrigger, 220);
  }

  /**
   * Supports instant developer preview via ?screen=5 or #screen-5
   */
  function checkUrlScreenTrigger() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('screen') === '5' || window.location.hash === '#screen-5') {
        const card = document.getElementById('invitation-card');
        const cardFlipper = document.getElementById('card-flipper');
        const s1 = document.getElementById('invitation-screen-1');
        const s2 = document.getElementById('invitation-screen-2');
        const s3 = document.getElementById('invitation-screen-3');
        const s4 = document.getElementById('invitation-screen-4');
        const s5 = document.getElementById('invitation-screen-5');
        const envelope = document.getElementById('envelope-container');
        const waxSeal = document.getElementById('wax-seal-wrapper');
        const btnReplayFab = document.getElementById('btn-replay-fab');

        if (envelope) envelope.style.display = 'none';
        if (waxSeal) waxSeal.style.display = 'none';
        if (btnReplayFab) {
          btnReplayFab.style.opacity = '0';
          btnReplayFab.style.pointerEvents = 'none';
        }
        if (card) {
          card.classList.add('card-docked-fullscreen');
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'none';
        }
        if (cardFlipper) cardFlipper.style.transform = 'none';
        if (s1) {
          s1.classList.remove('screen-active');
          s1.classList.add('screen-hidden');
          s1.style.display = 'none';
          s1.style.opacity = '0';
        }
        if (s2) {
          s2.classList.remove('screen-active');
          s2.classList.add('screen-hidden');
          s2.style.display = 'none';
          s2.style.opacity = '0';
        }
        if (s3) {
          s3.classList.remove('screen-active');
          s3.classList.add('screen-hidden');
          s3.style.display = 'none';
          s3.style.opacity = '0';
        }
        if (s4) {
          s4.classList.remove('screen-active');
          s4.classList.add('screen-hidden');
          s4.style.display = 'none';
          s4.style.opacity = '0';
        }
        if (s5) {
          s5.classList.remove('screen-hidden');
          s5.classList.add('screen-active');
          s5.style.display = 'flex';
          s5.style.opacity = '1';
          s5.style.transform = 'none';
          s5.style.pointerEvents = 'auto';
        }
      }
    } catch (e) {
      console.warn('URL screen trigger error:', e);
    }
  }

  // Export module globally
  window.WeddingThankYou = {
    init: init,
    transitionToScreen5: transitionToScreen5,
    transitionBackToScreen4: transitionBackToScreen4,
    reset: reset
  };

})(window);
