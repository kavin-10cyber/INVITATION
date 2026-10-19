/**
 * Wedding Invitation - Scroll Transition & Cinematic Depth Dissolve Module
 * File: assets/js/scroll-transition.js
 * Purpose: 60/120fps continuous scrubbing between Screen 1 (Cover) and Screen 2 (Announcement),
 *          IntersectionObserver safety guard, screen gentle bounce auto-pause, and scroll-to-open.
 */

(function (window) {
  'use strict';

  let appContainer = null;
  let coverScreen = null;
  let announcementScreen = null;
  let royalFrameCard = null;
  let groomCard = null;
  let ampersand = null;
  let brideCard = null;
  let dateBanner = null;
  let bgParallax = null;

  let isCoverScreenInView = true;
  let allowScrollOpen = false;
  let tickingTransition = false;
  let scrollPauseTimeout = null;

  function updateScrollTransition() {
    if (!appContainer || !coverScreen || !announcementScreen) {
      tickingTransition = false;
      return;
    }

    const scrollTop = appContainer.scrollTop;
    const clientH = appContainer.clientHeight || window.innerHeight;
    const scrollRange = Math.max(1, clientH);
    const progress = Math.min(1, Math.max(0, scrollTop / scrollRange));

    // 1. SCREEN 1: Gradual cinematic depth dissolve
    const coverOpacity = Math.max(0, 1 - progress * 1.25);
    const coverScale = (1 - progress * 0.08).toFixed(4);
    const coverTranslateY = (-progress * 35).toFixed(1);
    const coverBlur = (progress * 8).toFixed(1);

    coverScreen.style.opacity = coverOpacity.toFixed(3);
    coverScreen.style.transform = `scale(${coverScale}) translate3d(0, ${coverTranslateY}px, 0)`;
    coverScreen.style.filter = progress > 0.015 ? `blur(${coverBlur}px)` : 'none';
    coverScreen.style.pointerEvents = progress > 0.45 ? 'none' : 'auto';

    // 2. SCREEN 2: Gradual emergence and arrival
    const screen2Opacity = Math.min(1, Math.max(0, (progress - 0.05) / 0.85));
    announcementScreen.style.opacity = screen2Opacity.toFixed(3);
    announcementScreen.style.pointerEvents = progress > 0.25 ? 'auto' : 'none';

    // 3. Royal Frame Card: Center expansion & float-up
    if (royalFrameCard) {
      const cardScale = (0.93 + progress * 0.07).toFixed(4);
      const cardTranslateY = Math.max(0, (1 - progress) * 50).toFixed(1);
      const cardOpacity = Math.min(1, Math.max(0, (progress - 0.12) / 0.78)).toFixed(3);

      royalFrameCard.style.transform = `translate3d(0, ${cardTranslateY}px, 0) scale(${cardScale})`;
      royalFrameCard.style.opacity = cardOpacity;
    }

    // 4. Staggered Internal Revelations
    if (groomCard) {
      const pGroom = Math.min(1, Math.max(0, (progress - 0.32) / 0.48));
      groomCard.style.opacity = pGroom.toFixed(3);
      groomCard.style.transform = `translate3d(0, ${((1 - pGroom) * 20).toFixed(1)}px, 0)`;
    }

    if (ampersand) {
      const pAmp = Math.min(1, Math.max(0, (progress - 0.42) / 0.45));
      ampersand.style.opacity = pAmp.toFixed(3);
      ampersand.style.transform = `translate3d(0, ${((1 - pAmp) * 20).toFixed(1)}px, 0)`;
    }

    if (brideCard) {
      const pBride = Math.min(1, Math.max(0, (progress - 0.52) / 0.42));
      brideCard.style.opacity = pBride.toFixed(3);
      brideCard.style.transform = `translate3d(0, ${((1 - pBride) * 20).toFixed(1)}px, 0)`;
    }

    if (dateBanner) {
      const pBanner = Math.min(1, Math.max(0, (progress - 0.62) / 0.38));
      dateBanner.style.opacity = pBanner.toFixed(3);
      dateBanner.style.transform = `translate3d(0, ${((1 - pBanner) * 20).toFixed(1)}px, 0)`;
    }

    // 5. Background Parallax Layer
    if (bgParallax) {
      const translateY = ((1 - progress) * 12).toFixed(1);
      bgParallax.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }

    tickingTransition = false;
  }

  function requestTransitionTick() {
    if (!tickingTransition) {
      tickingTransition = true;
      requestAnimationFrame(updateScrollTransition);
    }
  }

  function handleScrollOrSwipeInteraction() {
    const screens = document.querySelectorAll('.app-screen, .cover-screen, .announcement-screen, .screen-bounce');
    screens.forEach((screen) => {
      screen.classList.add('is-scrolling', 'paused-bounce');
    });

    clearTimeout(scrollPauseTimeout);
    scrollPauseTimeout = setTimeout(() => {
      screens.forEach((screen) => {
        screen.classList.remove('is-scrolling', 'paused-bounce');
      });
    }, 180);
  }

  function scrollToScreen1() {
    if (appContainer) {
      appContainer.scrollTo({ top: 0, behavior: 'smooth' });
      const card = document.getElementById('invitation-card');
      if (card && card.classList.contains('card-docked-fullscreen')) {
        setTimeout(() => {
          if (appContainer.scrollTop < 50) {
            appContainer.classList.add('card-fullscreen-active');
            document.body.classList.add('card-fullscreen-active');
          }
        }, 300);
      }
    } else if (coverScreen) {
      coverScreen.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function scrollToScreen2() {
    if (appContainer) {
      appContainer.classList.remove('card-fullscreen-active');
      document.body.classList.remove('card-fullscreen-active');
      const clientH = appContainer.clientHeight || window.innerHeight;
      appContainer.scrollTo({ top: clientH, behavior: 'smooth' });
    } else if (announcementScreen) {
      announcementScreen.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function init() {
    appContainer = document.getElementById('app-container');
    coverScreen = document.getElementById('cover-screen');
    announcementScreen = document.getElementById('announcement-screen');
    royalFrameCard = document.querySelector('.announcement-screen .royal-frame-card');
    groomCard = document.querySelector('.announcement-screen .groom-card');
    ampersand = document.querySelector('.announcement-screen .royal-ampersand-divider');
    brideCard = document.querySelector('.announcement-screen .bride-card');
    dateBanner = document.querySelector('.announcement-screen .muhurtham-highlight-banner');
    bgParallax = document.getElementById('announcement-bg-parallax');

    // Ensure Screen 1 is cleanly in view on load
    if (appContainer) {
      appContainer.scrollTop = 0;
      setTimeout(() => {
        if (appContainer) {
          appContainer.scrollTop = 0;
          requestTransitionTick();
        }
      }, 50);
    }
    window.scrollTo(0, 0);

    // Enable scroll-to-open only after animation establishes
    setTimeout(() => {
      allowScrollOpen = true;
    }, 4000);

    // IntersectionObserver: Safety guard for Screen 1
    const coverObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isCoverScreenInView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      });
    }, {
      root: appContainer || null,
      threshold: [0.1, 0.35, 0.7]
    });

    if (coverScreen) {
      coverObserver.observe(coverScreen);
    }

    // Scroll, resize, and gesture listeners
    requestTransitionTick();
    window.addEventListener('resize', requestTransitionTick, { passive: true });

    window.addEventListener('scroll', () => {
      handleScrollOrSwipeInteraction();
      requestTransitionTick();
    }, { passive: true });

    if (appContainer) {
      appContainer.addEventListener('scroll', () => {
        handleScrollOrSwipeInteraction();
        requestTransitionTick();

        if (
          allowScrollOpen &&
          isCoverScreenInView &&
          appContainer.scrollTop > 40 &&
          appContainer.scrollTop < 280 &&
          window.WeddingEnvelope &&
          !window.WeddingEnvelope.isOpen()
        ) {
          window.WeddingEnvelope.open();
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
        if (deltaY > 10 && coverScreen && window.WeddingEnvelope && window.WeddingEnvelope.isOpen()) {
          coverScreen.classList.add('is-scrolling', 'paused-bounce');
        }
      }
      handleScrollOrSwipeInteraction();
      requestTransitionTick();
    }, { passive: true });

    // Desktop Mouse Wheel Forwarding
    window.addEventListener('wheel', (e) => {
      if (e.target && e.target.closest('#app-container')) return;
      if (appContainer && allowScrollOpen) {
        appContainer.scrollBy({ top: e.deltaY, behavior: 'smooth' });
        if (
          e.deltaY > 0 &&
          isCoverScreenInView &&
          appContainer.scrollTop < 280 &&
          window.WeddingEnvelope &&
          !window.WeddingEnvelope.isOpen()
        ) {
          window.WeddingEnvelope.open();
        }
      }
      if (e.deltaY > 5 && coverScreen && window.WeddingEnvelope && window.WeddingEnvelope.isOpen()) {
        coverScreen.classList.add('is-scrolling', 'paused-bounce');
      }
      handleScrollOrSwipeInteraction();
      requestTransitionTick();
    }, { passive: true });

    // Screen 1 -> Screen 2 Navigation
    const btnScrollProgram = document.getElementById('btn-scroll-to-program');
    if (btnScrollProgram) {
      btnScrollProgram.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollToScreen2();
      });
    }

    // Screen 2 Controls
    const btnReplayS2 = document.getElementById('btn-replay-s2');
    if (btnReplayS2) {
      btnReplayS2.addEventListener('click', () => {
        scrollToScreen1();
        setTimeout(() => {
          if (window.WeddingEnvelope && window.WeddingEnvelope.isOpen()) {
            window.WeddingEnvelope.close();
          }
        }, 500);
      });
    }

    const scrollTopCue = document.getElementById('scroll-to-top-cue');
    if (scrollTopCue) {
      scrollTopCue.addEventListener('click', scrollToScreen1);
    }
  }

  window.WeddingScroll = {
    init: init,
    requestTick: requestTransitionTick,
    scrollToScreen1: scrollToScreen1,
    scrollToScreen2: scrollToScreen2,
    isCoverInView: () => isCoverScreenInView
  };
})(window);
