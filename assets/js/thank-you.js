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
            const isNearBottom = (screen4El.scrollHeight - screen4El.scrollTop - screen4El.clientHeight) <= 80;
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
   * Cinematic Rose-Gold Optical Lens Flare & Film Light Leak Transition
   * Bridges Screen 4 (Midnight Navy Venue) to Screen 5 (Light Blush-Pink Thank You)
   * with pure, velvety optical film exposure bloom and zero artificial shapes.
   */
  function transitionToScreen5() {
    if (isTransitioning) return;
    if (!screen4El) screen4El = document.getElementById('invitation-screen-4');
    if (!screen5El) screen5El = document.getElementById('invitation-screen-5');
    if (!screen5El) return;
    isTransitioning = true;

    const btnReplayFab = document.getElementById('btn-replay-fab');

    // Keep Replay FAB active and accessible on Thank You screen
    if (btnReplayFab) {
      btnReplayFab.style.opacity = '1';
      btnReplayFab.style.pointerEvents = 'auto';
    }

    const flareBridgeEl = document.getElementById('venue-flare-bridge');
    const flareScrimEl = flareBridgeEl ? flareBridgeEl.querySelector('.flare-scrim') : null;
    const flareLightLeakEl = document.getElementById('flare-light-leak');
    const flareBlushVeilEl = document.getElementById('flare-blush-veil');
    const flareStageEl = document.getElementById('flare-stage');
    const flareStreakEl = flareBridgeEl ? flareBridgeEl.querySelector('.flare-anamorphic-streak') : null;
    const flareGlowEl = flareBridgeEl ? flareBridgeEl.querySelector('.flare-anamorphic-glow') : null;
    const flareCoreEl = flareBridgeEl ? flareBridgeEl.querySelector('.flare-core-orb') : null;
    const flareStarburstEl = flareBridgeEl ? flareBridgeEl.querySelector('.flare-starburst') : null;
    const flareBokehs = flareBridgeEl ? flareBridgeEl.querySelectorAll('.flare-bokeh-orb') : null;
    const flareDusts = flareBridgeEl ? flareBridgeEl.querySelectorAll('.flare-dust') : null;

    // Screen 5 interior elements
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

    if (typeof gsap !== 'undefined' && flareBridgeEl && flareLightLeakEl) {
      if (screen4El) gsap.killTweensOf(screen4El);
      gsap.killTweensOf([
        flareBridgeEl, flareLightLeakEl, screen5El, headerEl, pipEl, eyebrowEl,
        titleEl, flourishEl, supportingEl, monogramEl, coupleNamesEl, taglineEl, messageEl
      ]);
      if (flareScrimEl) gsap.killTweensOf(flareScrimEl);
      if (flareBlushVeilEl) gsap.killTweensOf(flareBlushVeilEl);
      if (flareStageEl) gsap.killTweensOf(flareStageEl);
      if (flareStreakEl) gsap.killTweensOf(flareStreakEl);
      if (flareGlowEl) gsap.killTweensOf(flareGlowEl);
      if (flareCoreEl) gsap.killTweensOf(flareCoreEl);
      if (flareStarburstEl) gsap.killTweensOf(flareStarburstEl);
      if (flareBokehs) gsap.killTweensOf(flareBokehs);
      if (flareDusts) gsap.killTweensOf(flareDusts);
      if (dividers) gsap.killTweensOf(dividers);

      // Pre-set Bridge Initial States
      flareBridgeEl.classList.add('active');
      flareBridgeEl.style.display = 'block';
      gsap.set(flareBridgeEl, { opacity: 1 });

      if (flareScrimEl) gsap.set(flareScrimEl, { opacity: 0 });
      if (flareBlushVeilEl) gsap.set(flareBlushVeilEl, { opacity: 0 });
      if (flareLightLeakEl) gsap.set(flareLightLeakEl, { opacity: 0, scale: 0.7, x: 20, y: -20 });
      if (flareStageEl) gsap.set(flareStageEl, { opacity: 1, xPercent: 0 });
      if (flareStreakEl) gsap.set(flareStreakEl, { scaleX: 0, opacity: 0 });
      if (flareGlowEl) gsap.set(flareGlowEl, { scaleX: 0, opacity: 0 });
      if (flareCoreEl) gsap.set(flareCoreEl, { scale: 0, opacity: 0 });
      if (flareStarburstEl) gsap.set(flareStarburstEl, { scale: 0, rotation: 0, opacity: 0 });
      if (flareBokehs && flareBokehs.length > 0) {
        gsap.set(flareBokehs, { scale: 0.3, opacity: 0 });
      }
      if (flareDusts && flareDusts.length > 0) {
        gsap.set(flareDusts, { opacity: 0, y: 10 });
      }

      // Pre-set Screen 5 Initial States for graceful reveal
      gsap.set(screen5El, { display: 'none', opacity: 0 });
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
          flareBridgeEl.classList.remove('active');
          flareBridgeEl.style.display = 'none';
          gsap.set(flareBridgeEl, { clearProps: 'all' });
          if (flareLightLeakEl) gsap.set(flareLightLeakEl, { clearProps: 'all' });
          if (flareBlushVeilEl) gsap.set(flareBlushVeilEl, { clearProps: 'all' });
          if (flareStageEl) gsap.set(flareStageEl, { clearProps: 'all' });
          gsap.set(screen5El, { clearProps: 'transform' });
          isTransitioning = false;
        }
      });

      // 1. Filmic dark scrim sets the camera aperture mood over Screen 4 (0.22s)
      if (flareScrimEl) {
        tl.to(flareScrimEl, {
          opacity: 0.75,
          duration: 0.22,
          ease: 'power2.inOut'
        }, 0);
      }

      // 2. Optical Glint: Radiant lens core & starburst ignite at center (0.32s)
      if (flareCoreEl) {
        tl.to(flareCoreEl, {
          opacity: 1,
          scale: 1.3,
          duration: 0.32,
          ease: 'power2.out'
        }, 0.04);
      }
      if (flareStarburstEl) {
        tl.to(flareStarburstEl, {
          opacity: 0.95,
          scale: 1.2,
          rotation: 45,
          duration: 0.32,
          ease: 'power2.out'
        }, 0.06);
      }

      // 3. Ultra-wide Anamorphic Horizontal Laser Streak shoots across screen (0.40s)
      if (flareStreakEl) {
        tl.to(flareStreakEl, {
          scaleX: 1.4,
          opacity: 1,
          duration: 0.40,
          ease: 'power3.out'
        }, 0.10);
      }
      if (flareGlowEl) {
        tl.to(flareGlowEl, {
          scaleX: 1.25,
          opacity: 0.95,
          duration: 0.44,
          ease: 'power2.out'
        }, 0.12);
      }

      // 4. Soft Optical Bokeh Orbs drift across the lens (0.50s)
      if (flareBokehs && flareBokehs.length > 0) {
        flareBokehs.forEach((bokeh, idx) => {
          tl.to(bokeh, {
            opacity: 0.8,
            scale: 1.15,
            x: (idx % 2 === 0 ? 18 : -18),
            y: (idx % 2 === 0 ? -12 : 12),
            duration: 0.50,
            ease: 'sine.out'
          }, 0.15 + (idx * 0.05));
        });
      }

      // Stardust glimmers drift
      if (flareDusts && flareDusts.length > 0) {
        flareDusts.forEach((dust, idx) => {
          tl.to(dust, {
            opacity: 0.95,
            y: -15,
            duration: 0.55,
            ease: 'power1.out'
          }, 0.16 + (idx * 0.04));
        });
      }

      // 5. CRITICAL SUNLIGHT LEAK & BLUSH VEIL BLOOM (0.35s)
      // Completely bathes the dark navy into warm, ethereal blush-pink & champagne morning light!
      if (flareLightLeakEl) {
        tl.to(flareLightLeakEl, {
          opacity: 1,
          scale: 1.35,
          x: 0,
          y: 0,
          duration: 0.38,
          ease: 'expo.in'
        }, 0.22);
      }
      if (flareBlushVeilEl) {
        tl.to(flareBlushVeilEl, {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.in'
        }, 0.25);
      }

      // Clear dark scrim before screen swap so it never darkens Screen 5
      if (flareScrimEl) {
        tl.to(flareScrimEl, {
          opacity: 0,
          duration: 0.10
        }, 0.55);
      }

      // 6. Seamless Screen Swap Underneath Radiant Blush Light Peak (0.60s)
      tl.add(() => {
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
        screen5El.scrollTop = 0;
      }, 0.60);

      // 7. Light Veil dissolves like morning mist, revealing pristine Screen 5 (0.45s)
      if (flareBlushVeilEl) {
        tl.to(flareBlushVeilEl, {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out'
        }, 0.60);
      }
      if (flareLightLeakEl) {
        tl.to(flareLightLeakEl, {
          opacity: 0,
          duration: 0.50,
          ease: 'power2.out'
        }, 0.62);
      }
      if (flareStageEl) {
        tl.to(flareStageEl, {
          xPercent: 35,
          opacity: 0,
          duration: 0.40,
          ease: 'power2.in'
        }, 0.60);
      }

      tl.to(flareBridgeEl, {
        opacity: 0,
        duration: 0.30,
        ease: 'power2.out'
      }, 0.75);

      if (shimmerEl) {
        tl.to(shimmerEl, {
          opacity: 1,
          duration: 0.85,
          ease: 'sine.out'
        }, 0.70);
      }

      // 8. Staggered Entrance of Screen 5 Typography & Ornaments
      if (pipEl) {
        tl.to(pipEl, {
          opacity: 1,
          y: 0,
          scale: 1.0,
          duration: 0.45,
          ease: 'back.out(1.4)'
        }, 0.75);
      }
      if (eyebrowEl) {
        tl.to(eyebrowEl, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out'
        }, 0.92);
      }

      // "Thank You" Calligraphy Heading
      if (titleEl) {
        tl.to(titleEl, {
          opacity: 1,
          scale: 1.0,
          y: 0,
          duration: 0.75,
          ease: 'power2.out'
        }, 1.02);
      }

      // Gold heart flourish beneath heading
      if (flourishEl) {
        tl.to(flourishEl, {
          opacity: 1,
          scaleX: 1.0,
          duration: 0.50,
          ease: 'back.out(1.3)'
        }, 1.20);
      }

      // "For Gracing Us With Your Presence & Blessings"
      if (supportingEl) {
        tl.to(supportingEl, {
          opacity: 1,
          y: 0,
          duration: 0.50,
          ease: 'power2.out'
        }, 1.35);
      }

      // First divider expands
      if (dividers && dividers[0]) {
        tl.to(dividers[0], {
          opacity: 0.85,
          scaleX: 1.0,
          duration: 0.40,
          ease: 'power2.out'
        }, 1.48);
      }

      // Circular Antique-Gold D & V Monogram appears
      if (monogramEl) {
        tl.to(monogramEl, {
          opacity: 1,
          scale: 1.0,
          duration: 0.65,
          ease: 'back.out(1.35)'
        }, 1.60);
      }

      // Couple Names "Deepak & Vikashini" and tagline
      if (coupleNamesEl) {
        tl.to(coupleNamesEl, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out'
        }, 1.78);
      }
      if (taglineEl) {
        tl.to(taglineEl, {
          opacity: 1,
          y: 0,
          duration: 0.40,
          ease: 'power2.out'
        }, 1.90);
      }

      // Second divider expands
      if (dividers && dividers[1]) {
        tl.to(dividers[1], {
          opacity: 0.85,
          scaleX: 1.0,
          duration: 0.40,
          ease: 'power2.out'
        }, 2.00);
      }

      // Exact Replacement Paragraph
      if (messageEl) {
        tl.to(messageEl, {
          opacity: 1,
          y: 0,
          duration: 0.70,
          ease: 'power2.out'
        }, 2.08);
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
    if (isTransitioning) return;
    if (!screen4El) screen4El = document.getElementById('invitation-screen-4');
    if (!screen5El) screen5El = document.getElementById('invitation-screen-5');
    if (!screen4El || !screen5El) return;
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

    const flareBridgeEl = document.getElementById('venue-flare-bridge');
    if (flareBridgeEl) {
      if (typeof gsap !== 'undefined') gsap.killTweensOf(flareBridgeEl);
      flareBridgeEl.classList.remove('active');
      flareBridgeEl.style.display = 'none';
      if (typeof gsap !== 'undefined') gsap.set(flareBridgeEl, { clearProps: 'all' });
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
          btnReplayFab.style.opacity = '1';
          btnReplayFab.style.pointerEvents = 'auto';
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
