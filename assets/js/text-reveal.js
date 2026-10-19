/**
 * Wedding Invitation - Multi-Screen Progressive Reveal & Cinematic Page Transition Coordinator
 * File: assets/js/text-reveal.js
 * Purpose: Manages progressive typewriter text reveals for Screen 1,
 *          handles scratch completion gating with transition bridge,
 *          orchestrates the soft cinematic page transition to Screen 2,
 *          reveals Screen 2 wedding details sequentially, and coordinates clean resets.
 */

(function (window) {
  'use strict';

  // Explicit Invitation State Machine
  const STATES = {
    SCREEN_ONE: 'SCREEN_ONE',
    SCRATCH_READY: 'SCRATCH_READY',
    SCRATCHING: 'SCRATCHING',
    SCRATCH_COMPLETED: 'SCRATCH_COMPLETED',
    TRANSITIONING: 'TRANSITIONING',
    SCREEN_TWO_REVEALING: 'SCREEN_TWO_REVEALING',
    SCREEN_TWO_COMPLETE: 'SCREEN_TWO_COMPLETE'
  };

  let currentState = STATES.SCREEN_ONE;
  let isInitialized = false;
  let activeTimers = [];
  let activeTimeouts = [];
  let currentSequenceId = 0;

  // Screen 1 cached character spans
  let charsEyebrow = [];
  let charsNames = [];
  let charsSub = [];
  let charsBlessing = [];
  let charsBridgeDate = [];
  let charsBridgeYear = [];
  let charsBridgeMuhurtham = [];
  let charsBridgeTime = [];

  // Screen 2 cached character spans
  let charsS2Joy = [];
  let charsS2Lead = [];
  let charsS2Ceremony = [];
  let charsS2Date = [];
  let charsS2Muhurtham = [];
  let charsS2Time = [];
  let charsS2Venue = [];
  let charsS2Temple = [];
  let charsS2Location = [];

  // DOM Elements Cache
  let screen1El = null;
  let screen2El = null;
  let overlayEl = null;

  let headerAccentLine = null;
  let portraitHeroContainer = null;
  let ceremonyScratchSection = null;
  let scratchRevealContent = null;
  let cardCoupleTitle = null;

  let s2CalendarMotif = null;
  let s2ClockMotif = null;
  let s2Divider = null;
  let s2VenuePin = null;
  let s2CountdownPanel = null;
  let s2TempleSketch = null;
  let screen3El = null;
  let receptionBridgeEl = null;
  let btnViewReception = null;
  let btnBackToWedding = null;
  let isScreenTransitioning = false;
  let touchStartY = 0;
  let touchStartX = 0;

  function init() {
    if (isInitialized) return;

    // Cache containers
    screen1El = document.getElementById('invitation-screen-1');
    screen2El = document.getElementById('invitation-screen-2');
    overlayEl = document.getElementById('page-transition-overlay');

    // Screen 1 Elements
    headerAccentLine = document.querySelector('#invitation-screen-1 .header-accent-line');
    portraitHeroContainer = document.querySelector('#invitation-screen-1 .portrait-hero-container');
    ceremonyScratchSection = document.getElementById('ceremony-scratch-section');
    scratchRevealContent = document.getElementById('scratch-reveal-content');
    cardCoupleTitle = document.querySelector('#invitation-screen-1 .card-couple-title');

    // Screen 2 Motifs
    s2CalendarMotif = document.querySelector('.screen2-calendar-motif');
    s2ClockMotif = document.querySelector('.screen2-clock-motif');
    s2Divider = document.querySelector('.screen2-ornament-divider');
    s2VenuePin = document.querySelector('.screen2-venue-tag .venue-pin-icon');
    s2CountdownPanel = document.getElementById('screen2-countdown-panel');
    s2TempleSketch = document.querySelector('.screen2-temple-sketch');

    // Tokenize Screen 1 Text
    const elEyebrow = document.querySelector('#invitation-screen-1 .card-eyebrow');
    if (elEyebrow) charsEyebrow = prepareElementForTypewriter(elEyebrow);

    if (cardCoupleTitle) {
      const groom = cardCoupleTitle.querySelector('.name-part.groom');
      const amp = cardCoupleTitle.querySelector('.name-ampersand');
      const bride = cardCoupleTitle.querySelector('.name-part.bride');
      charsNames = [
        ...(groom ? prepareElementForTypewriter(groom) : []),
        ...(amp ? prepareElementForTypewriter(amp) : []),
        ...(bride ? prepareElementForTypewriter(bride) : [])
      ];
    }

    const elSub = document.querySelector('#invitation-screen-1 .couple-editorial-sub');
    if (elSub) charsSub = prepareElementForTypewriter(elSub);

    const elBlessing = document.querySelector('#invitation-screen-1 .invitation-editorial-message');
    if (elBlessing) charsBlessing = prepareElementForTypewriter(elBlessing);

    // Scratch Bridge Date & Muhurtham on Screen 1
    const elBridgeDate = document.getElementById('reveal-date-text');
    if (elBridgeDate) charsBridgeDate = prepareElementForTypewriter(elBridgeDate);

    const elBridgeYear = document.getElementById('reveal-date-year');
    if (elBridgeYear) charsBridgeYear = prepareElementForTypewriter(elBridgeYear);

    const elBridgeMuhurtham = document.querySelector('#reveal-time-badge .time-label');
    if (elBridgeMuhurtham) charsBridgeMuhurtham = prepareElementForTypewriter(elBridgeMuhurtham);

    const elBridgeBadge = document.getElementById('reveal-time-badge');
    if (elBridgeBadge) {
      const dot = elBridgeBadge.querySelector('.time-dot');
      const val = elBridgeBadge.querySelector('.time-value');
      charsBridgeTime = [
        ...(dot ? prepareElementForTypewriter(dot) : []),
        ...(val ? prepareElementForTypewriter(val) : [])
      ];
    }

    // Tokenize Screen 2 Text
    const elS2Joy = document.querySelector('.screen2-joy-badge');
    if (elS2Joy) charsS2Joy = prepareElementForTypewriter(elS2Joy);

    const elS2Lead = document.querySelector('.screen2-invitation-lead');
    if (elS2Lead) charsS2Lead = prepareElementForTypewriter(elS2Lead);

    const elS2Ceremony = document.querySelector('.screen2-ceremony-title');
    if (elS2Ceremony) charsS2Ceremony = prepareElementForTypewriter(elS2Ceremony);

    const elS2Date = document.querySelector('.screen2-date-text');
    if (elS2Date) charsS2Date = prepareElementForTypewriter(elS2Date);

    const elS2Muhurtham = document.querySelector('.screen2-muhurtham-label');
    if (elS2Muhurtham) charsS2Muhurtham = prepareElementForTypewriter(elS2Muhurtham);

    const elS2Time = document.querySelector('.screen2-muhurtham-time');
    if (elS2Time) charsS2Time = prepareElementForTypewriter(elS2Time);

    const elS2Venue = document.querySelector('.screen2-venue-eyebrow');
    if (elS2Venue) charsS2Venue = prepareElementForTypewriter(elS2Venue);

    const elS2Temple = document.querySelector('.screen2-temple-name');
    if (elS2Temple) charsS2Temple = prepareElementForTypewriter(elS2Temple);

    const elS2Loc = document.querySelector('.screen2-venue-location');
    if (elS2Loc) charsS2Location = prepareElementForTypewriter(elS2Loc);

    // Screen 3 & Reception Navigation
    screen3El = document.getElementById('invitation-screen-3');
    receptionBridgeEl = document.getElementById('reception-lotus-bridge');
    btnViewReception = document.getElementById('btn-view-reception');
    btnBackToWedding = document.getElementById('btn-back-to-wedding');

    if (btnViewReception) {
      btnViewReception.addEventListener('click', (e) => {
        e.stopPropagation();
        transitionToScreen3();
      });
    }

    if (btnBackToWedding) {
      btnBackToWedding.addEventListener('click', (e) => {
        e.stopPropagation();
        transitionBackToScreen2();
      });
    }

    const btnReceptionVenue = document.getElementById('btn-reception-venue');
    if (btnReceptionVenue) {
      btnReceptionVenue.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isScreenTransitioning) return;
        if (window.WeddingVenueDirections && typeof window.WeddingVenueDirections.transitionToScreen4 === 'function') {
          isScreenTransitioning = true;
          setTimeout(() => { isScreenTransitioning = false; }, 1800);
          window.WeddingVenueDirections.transitionToScreen4();
        }
      });
    }

    // Robust Wheel & Touch swipe navigation between Screen 2, Screen 3, and Screen 4
    window.addEventListener('wheel', handleScrollNavigation, { passive: true, capture: true });

    let isTouchActive = false;

    function handleSwipe(diffY, diffX) {
      if (isScreenTransitioning) return;
      if (Math.abs(diffY) >= 35 && Math.abs(diffY) > diffX * 1.1) {
        if (diffY > 0) {
          handleScrollDown();
        } else {
          handleScrollUp();
        }
      }
    }

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isTouchActive = true;
      }
    }, { passive: true, capture: true });

    window.addEventListener('touchmove', (e) => {
      if (!isTouchActive || isScreenTransitioning) return;
      if (e.touches && e.touches.length > 0) {
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const diffY = touchStartY - currentY;
        const diffX = Math.abs(touchStartX - currentX);
        if (Math.abs(diffY) >= 42 && Math.abs(diffY) > diffX * 1.15) {
          isTouchActive = false;
          handleSwipe(diffY, diffX);
        }
      }
    }, { passive: true, capture: true });

    window.addEventListener('touchend', (e) => {
      if (!isTouchActive) return;
      isTouchActive = false;
      if (e.changedTouches && e.changedTouches.length > 0) {
        const diffY = touchStartY - e.changedTouches[0].clientY;
        const diffX = Math.abs(touchStartX - e.changedTouches[0].clientX);
        handleSwipe(diffY, diffX);
      }
    }, { passive: true, capture: true });

    window.addEventListener('touchcancel', () => {
      isTouchActive = false;
    }, { passive: true, capture: true });

    resetAll();
    isInitialized = true;
  }

  /**
   * Converts plain text inside an element into word containers (.tw-word)
   * holding individual character spans (.tw-char). Preserves whitespace,
   * inline HTML tags, and ensures browser word-wrapping never breaks mid-word.
   */
  function prepareElementForTypewriter(element) {
    if (!element) return [];
    if (element.dataset.twPrepared === 'true') {
      return Array.from(element.querySelectorAll('.tw-char'));
    }

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text || text.length === 0) return;

        const fragment = document.createDocumentFragment();
        const tokens = text.split(/(\s+)/);

        tokens.forEach(token => {
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(token));
          } else if (token.length > 0) {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'tw-word';
            for (let i = 0; i < token.length; i++) {
              const charSpan = document.createElement('span');
              charSpan.className = 'tw-char';
              charSpan.textContent = token[i];
              wordSpan.appendChild(charSpan);
            }
            fragment.appendChild(wordSpan);
          }
        });

        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('tw-char') || node.classList.contains('tw-word')) {
          return;
        }
        const children = Array.from(node.childNodes);
        children.forEach(child => processNode(child));
      }
    }

    processNode(element);
    element.dataset.twPrepared = 'true';
    return Array.from(element.querySelectorAll('.tw-char'));
  }

  function sleep(ms) {
    return new Promise(resolve => {
      const t = setTimeout(resolve, ms);
      activeTimeouts.push(t);
    });
  }

  function typeChars(chars, charDelay = 30, seqId) {
    return new Promise(resolve => {
      if (!chars || !chars.length || seqId !== currentSequenceId) {
        resolve();
        return;
      }
      let idx = 0;
      const timer = setInterval(() => {
        if (seqId !== currentSequenceId) {
          clearInterval(timer);
          resolve();
          return;
        }
        if (idx >= chars.length) {
          clearInterval(timer);
          resolve();
          return;
        }
        chars[idx].classList.add('is-revealed');
        idx++;
      }, charDelay);
      activeTimers.push(timer);
    });
  }

  function revealAllScreenOneImmediately() {
    if (screen1El) {
      screen1El.classList.remove('screen-hidden', 'card-in-transition');
      screen1El.classList.add('screen-active');
      if (typeof gsap !== 'undefined') gsap.set(screen1El, { clearProps: 'all' });
      screen1El.style.removeProperty('display');
      screen1El.style.removeProperty('opacity');
      screen1El.style.removeProperty('transform');
      screen1El.style.display = 'flex';
      screen1El.style.opacity = '1';
    }
    if (screen2El) {
      screen2El.classList.remove('screen-active');
      screen2El.classList.add('screen-hidden');
      if (typeof gsap !== 'undefined') gsap.set(screen2El, { clearProps: 'all' });
      screen2El.style.removeProperty('display');
      screen2El.style.removeProperty('opacity');
      screen2El.style.removeProperty('transform');
      screen2El.style.display = 'none';
      screen2El.style.opacity = '0';
    }
    const chars = document.querySelectorAll('#invitation-screen-1 .tw-char');
    chars.forEach(c => c.classList.add('is-revealed'));
    if (portraitHeroContainer) portraitHeroContainer.classList.add('portrait-revealed');
    if (cardCoupleTitle) cardCoupleTitle.classList.add('names-settled');
    if (headerAccentLine) headerAccentLine.classList.add('line-revealed');
    if (ceremonyScratchSection) ceremonyScratchSection.classList.add('scratch-section-revealed');
    const sections = document.querySelectorAll('#invitation-screen-1 .card-section');
    sections.forEach(s => {
      s.style.removeProperty('opacity');
      s.style.removeProperty('visibility');
    });
    const btnFold = document.getElementById('btn-fold-envelope');
    if (btnFold) {
      btnFold.style.removeProperty('opacity');
      btnFold.style.removeProperty('visibility');
    }
  }

  /**
   * SCREEN 1: Emotional Introduction Sequence
   * Triggered when the invitation card docks fullscreen after envelope opening.
   */
  async function startSequence() {
    init();
    resetAll();

    const seqId = ++currentSequenceId;
    currentState = STATES.SCREEN_ONE;

    if (screen1El) {
      screen1El.classList.remove('screen-hidden', 'card-in-transition');
      screen1El.classList.add('screen-active');
      if (typeof gsap !== 'undefined') gsap.set(screen1El, { clearProps: 'all' });
      screen1El.style.removeProperty('display');
      screen1El.style.removeProperty('opacity');
      screen1El.style.removeProperty('transform');
      screen1El.style.display = 'flex';
      screen1El.style.opacity = '1';
    }
    if (screen2El) {
      screen2El.classList.remove('screen-active');
      screen2El.classList.add('screen-hidden');
      if (typeof gsap !== 'undefined') gsap.set(screen2El, { clearProps: 'all' });
      screen2El.style.removeProperty('display');
      screen2El.style.removeProperty('opacity');
      screen2El.style.removeProperty('transform');
      screen2El.style.display = 'none';
      screen2El.style.opacity = '0';
    }

    // Immediately clear any inline opacity styles from sections
    const sections = document.querySelectorAll('#invitation-screen-1 .card-section');
    sections.forEach(s => {
      s.style.removeProperty('opacity');
      s.style.removeProperty('visibility');
    });
    const btnFold = document.getElementById('btn-fold-envelope');
    if (btnFold) {
      btnFold.style.removeProperty('opacity');
      btnFold.style.removeProperty('visibility');
    }

    // Safety timeout: ensure all content is 100% visible after sequence completes
    const safetyTimer = setTimeout(() => {
      if (seqId === currentSequenceId && currentState === STATES.SCREEN_ONE) {
        revealAllScreenOneImmediately();
        if (window.WeddingScratchCard) window.WeddingScratchCard.refresh();
      }
    }, 4800);
    activeTimeouts.push(safetyTimer);

    await sleep(60);
    if (seqId !== currentSequenceId) return;

    // 1. "TOGETHER WITH THEIR FAMILIES" (~18ms/char)
    await typeChars(charsEyebrow, 18, seqId);
    if (seqId !== currentSequenceId) return;

    if (headerAccentLine) headerAccentLine.classList.add('line-revealed');
    await sleep(80);
    if (seqId !== currentSequenceId) return;

    // 2. "Deepak & Vikashini" (~24ms/char)
    await typeChars(charsNames, 24, seqId);
    if (seqId !== currentSequenceId) return;

    if (cardCoupleTitle) cardCoupleTitle.classList.add('names-settled');
    await sleep(90);
    if (seqId !== currentSequenceId) return;

    // 3. Credentials (~15ms/char)
    await typeChars(charsSub, 15, seqId);
    if (seqId !== currentSequenceId) return;

    await sleep(90);
    if (seqId !== currentSequenceId) return;

    // 4. Couple portrait soft upward reveal
    if (portraitHeroContainer) portraitHeroContainer.classList.add('portrait-revealed');
    await sleep(180);
    if (seqId !== currentSequenceId) return;

    // 5. Blessing Message (~12ms/char)
    await typeChars(charsBlessing, 12, seqId);
    if (seqId !== currentSequenceId) return;

    await sleep(100);
    if (seqId !== currentSequenceId) return;

    // 6. Scratch Card appears
    if (ceremonyScratchSection) ceremonyScratchSection.classList.add('scratch-section-revealed');
    if (window.WeddingScratchCard) window.WeddingScratchCard.refresh();

    if (currentState === STATES.SCREEN_ONE) {
      currentState = STATES.SCRATCH_READY;
    }
    // STOP. Wait for guest to scratch.
  }

  /**
   * Interaction Bridge & Trigger to Screen 2 Transition
   * Called when scratch threshold is reached or user releases/taps revealed card.
   */
  async function handleScratchComplete() {
    // Prevent double triggers
    if (currentState === STATES.SCRATCH_COMPLETED ||
        currentState === STATES.TRANSITIONING ||
        currentState === STATES.SCREEN_TWO_REVEALING ||
        currentState === STATES.SCREEN_TWO_COMPLETE) {
      return;
    }

    currentState = STATES.SCRATCH_COMPLETED;

    // Immediately stop any pending Screen 1 typing timers or safety timeouts
    activeTimers.forEach(t => clearInterval(t));
    activeTimers = [];
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];

    // Step 1: Activate Dreamy Transition State on Screen 1
    if (screen1El) {
      screen1El.classList.add('card-in-transition');
    }

    if (scratchRevealContent) {
      scratchRevealContent.classList.add('date-content-active');
    }

    // Reveal the bridge date/time in high contrast
    charsBridgeDate.forEach(c => c.classList.add('is-revealed'));
    charsBridgeYear.forEach(c => c.classList.add('is-revealed'));
    charsBridgeMuhurtham.forEach(c => c.classList.add('is-revealed'));
    charsBridgeTime.forEach(c => c.classList.add('is-revealed'));

    // Trigger specular gold sheen sweep and celebratory petals
    const sheen = document.querySelector('.card-sheen-sweep');
    if (sheen) {
      sheen.classList.remove('active');
      void sheen.offsetWidth;
      sheen.classList.add('active');
    }
    if (window.WeddingParticles && typeof window.WeddingParticles.burstPetals === 'function') {
      window.WeddingParticles.burstPetals(16);
    }

    // Hold the gold transition screen for ~350ms so user can appreciate the revealed date
    await sleep(350);

    executeTransition();
  }

  /**
   * Soft Cinematic Invitation-Page Transition: Screen 1 -> Screen 2
   */
  function executeTransition() {
    if (currentState === STATES.TRANSITIONING ||
        currentState === STATES.SCREEN_TWO_REVEALING ||
        currentState === STATES.SCREEN_TWO_COMPLETE) {
      return;
    }

    currentState = STATES.TRANSITIONING;

    // Helper to finalize Screen 2 display
    function showScreen2Final() {
      if (screen1El) {
        screen1El.classList.remove('screen-active', 'card-in-transition');
        screen1El.classList.add('screen-hidden');
        screen1El.style.display = 'none';
        screen1El.style.opacity = '0';
      }
      if (overlayEl) {
        overlayEl.style.display = 'none';
        overlayEl.style.opacity = '0';
      }
      if (screen2El) {
        screen2El.classList.remove('screen-hidden');
        screen2El.classList.add('screen-active');
        screen2El.style.display = 'flex';
        screen2El.style.opacity = '1';
        screen2El.style.zIndex = '30';
        screen2El.style.removeProperty('transform');
      }
      currentState = STATES.SCREEN_TWO_REVEALING;
      startScreen2Sequence();
    }

    // Safety fallback: guaranteed display of Screen 2 even if animation stalls
    const fallbackTimer = setTimeout(() => {
      if (currentState === STATES.TRANSITIONING) {
        showScreen2Final();
      }
    }, 2900);
    activeTimeouts.push(fallbackTimer);

    if (typeof gsap === 'undefined') {
      clearTimeout(fallbackTimer);
      showScreen2Final();
      return;
    }

    gsap.killTweensOf([screen1El, screen2El, overlayEl]);

    // Prepare Screen 2 behind transition
    if (screen2El) {
      screen2El.classList.remove('screen-hidden');
      screen2El.classList.add('screen-active');
      const s2Sections = screen2El.querySelectorAll('.screen2-section');
      gsap.set(s2Sections, { clearProps: 'opacity,visibility' });
      s2Sections.forEach(s => {
        s.style.removeProperty('opacity');
        s.style.removeProperty('visibility');
      });
      gsap.set(screen2El, {
        display: 'flex',
        opacity: 0,
        scale: 0.98,
        y: 15,
        zIndex: 30
      });
    }

    if (overlayEl) {
      gsap.set(overlayEl, {
        display: 'block',
        opacity: 0,
        zIndex: 25
      });
    }

    // 2.5-second cinematic Warm Antique-Gold page transition timeline
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallbackTimer);
        showScreen2Final();
      }
    });

    // 1. Soft warm antique-gold veil glides in with rich radiance (0.80s)
    if (overlayEl) {
      tl.to(overlayEl, {
        opacity: 0.68,
        duration: 0.80,
        ease: 'power2.out'
      }, 0);
    }

    // 2. Screen 1 recedes smoothly into the golden mist (1.10s)
    if (screen1El) {
      tl.to(screen1El, {
        opacity: 0,
        scale: 0.95,
        y: -12,
        duration: 1.10,
        ease: 'power2.inOut'
      }, 0.30);
    }

    // 3. Screen 2 emerges gracefully from the golden warmth (1.55s)
    if (screen2El) {
      tl.to(screen2El, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.55,
        ease: 'power2.out',
        clearProps: 'transform'
      }, 0.75);
    }

    // 4. Gold veil dissolves away cleanly into Screen 2 (1.15s, finishing at exactly 2.50s)
    if (overlayEl) {
      tl.to(overlayEl, {
        opacity: 0,
        duration: 1.15,
        ease: 'power2.inOut'
      }, 1.35);
    }
  }

  /**
   * SCREEN 2: Wedding Details Sequential Progressive Reveal
   */
  async function startScreen2Sequence() {
    const seqId = currentSequenceId;

    if (screen2El) {
      screen2El.classList.remove('screen-hidden');
      screen2El.classList.add('screen-active');
      screen2El.style.display = 'flex';
      screen2El.style.opacity = '1';
      screen2El.style.zIndex = '30';
      screen2El.style.removeProperty('transform');
      const s2Sections = screen2El.querySelectorAll('.screen2-section');
      if (typeof gsap !== 'undefined') gsap.set(s2Sections, { clearProps: 'opacity,visibility' });
      s2Sections.forEach(s => {
        s.style.removeProperty('opacity');
        s.style.removeProperty('visibility');
        s.style.opacity = '1';
      });
    }

    // Reveal all text characters on Screen 2 so the page unfolds completely
    const allS2Chars = document.querySelectorAll('#invitation-screen-2 .tw-char');
    allS2Chars.forEach(c => c.classList.add('is-revealed'));

    if (s2CalendarMotif) {
      s2CalendarMotif.style.transition = 'opacity 0.4s ease';
      s2CalendarMotif.style.opacity = '0.85';
    }
    if (s2ClockMotif) {
      s2ClockMotif.style.transition = 'opacity 0.4s ease';
      s2ClockMotif.style.opacity = '0.85';
    }
    if (s2Divider) {
      s2Divider.style.transition = 'opacity 0.4s ease';
      s2Divider.style.opacity = '0.85';
    }
    if (s2VenuePin) {
      s2VenuePin.style.transition = 'opacity 0.4s ease';
      s2VenuePin.style.opacity = '1';
    }
    if (s2CountdownPanel) {
      s2CountdownPanel.style.transition = 'opacity 0.4s ease';
      s2CountdownPanel.style.opacity = '1';
    }
    if (s2TempleSketch) {
      s2TempleSketch.style.transition = 'opacity 0.4s ease';
      s2TempleSketch.style.opacity = '0.75';
    }

    // Live countdown timer starts immediately
    if (window.WeddingScratchCard && typeof window.WeddingScratchCard.startCountdown === 'function') {
      window.WeddingScratchCard.startCountdown();
    }

    currentState = STATES.SCREEN_TWO_COMPLETE;
  }

  function handleScrollDown() {
    if (isScreenTransitioning) return;
    if (screen2El && screen2El.classList.contains('screen-active') && !screen2El.classList.contains('screen-hidden')) {
      transitionToScreen3();
    } else if (screen3El && screen3El.classList.contains('screen-active') && !screen3El.classList.contains('screen-hidden')) {
      if (window.WeddingVenueDirections && typeof window.WeddingVenueDirections.transitionToScreen4 === 'function') {
        isScreenTransitioning = true;
        setTimeout(() => { isScreenTransitioning = false; }, 1800);
        window.WeddingVenueDirections.transitionToScreen4();
      }
    }
  }

  function handleScrollUp() {
    if (isScreenTransitioning) return;
    const screen4El = document.getElementById('invitation-screen-4');
    if (screen4El && screen4El.classList.contains('screen-active') && !screen4El.classList.contains('screen-hidden')) {
      if (screen4El.scrollTop <= 10) {
        if (window.WeddingVenueDirections && typeof window.WeddingVenueDirections.transitionBackToScreen3 === 'function') {
          isScreenTransitioning = true;
          setTimeout(() => { isScreenTransitioning = false; }, 800);
          window.WeddingVenueDirections.transitionBackToScreen3();
        }
      }
    } else if (screen3El && screen3El.classList.contains('screen-active') && !screen3El.classList.contains('screen-hidden')) {
      transitionBackToScreen2();
    }
  }

  function handleScrollNavigation(e) {
    if (isScreenTransitioning) return;
    if (Math.abs(e.deltaY) < 25) return;
    if (e.deltaY > 0) {
      handleScrollDown();
    } else {
      handleScrollUp();
    }
  }

  /**
   * SCREEN 2 to SCREEN 3 (Reception) Cinematic Golden Lotus Bridge & Staggered Entrance Animation
   */
  function transitionToScreen3() {
    if (isScreenTransitioning || !screen3El || !screen2El) return;
    isScreenTransitioning = true;
    setTimeout(() => { isScreenTransitioning = false; }, 2800);

    const btnReplayFab = document.getElementById('btn-replay-fab');
    if (btnReplayFab) {
      btnReplayFab.style.opacity = '1';
      btnReplayFab.style.pointerEvents = 'auto';
    }

    if (typeof gsap !== 'undefined' && receptionBridgeEl) {
      gsap.killTweensOf([screen2El, screen3El, receptionBridgeEl]);

      // Prepare bridge overlay
      gsap.set(receptionBridgeEl, {
        display: 'block',
        opacity: 0,
        scale: 0.95,
        zIndex: 60
      });

      const tl = gsap.timeline({
        onComplete: () => {
          isScreenTransitioning = false;
          if (btnReplayFab) {
            btnReplayFab.style.opacity = '1';
            btnReplayFab.style.pointerEvents = 'auto';
          }
        }
      });

      // 1. Screen 2 softly recedes (0.35s)
      tl.to(screen2El, {
        opacity: 0,
        scale: 0.97,
        duration: 0.35,
        ease: 'power2.inOut'
      }, 0);

      // 2. Golden Lotus Bridge blooms into view with celestial glow (0.50s)
      tl.to(receptionBridgeEl, {
        opacity: 1,
        scale: 1.0,
        duration: 0.50,
        ease: 'power2.out'
      }, 0.15)
      // 3. Central Golden Lotus breathes with sacred 0.85s slow bloom expansion
      .to(receptionBridgeEl, {
        scale: 1.05,
        duration: 0.85,
        ease: 'sine.inOut'
      }, 0.65)
      // 4. In background: swap Screen 2 for Screen 3 & initialize elements with Cinematic Blur & Starlight pre-states
      .add(() => {
        screen2El.classList.remove('screen-active');
        screen2El.classList.add('screen-hidden');
        screen2El.style.display = 'none';

        screen3El.classList.remove('screen-hidden');
        screen3El.classList.add('screen-active');
        screen3El.style.display = 'flex';
        screen3El.style.opacity = '0';
        screen3El.style.transform = 'scale(0.96)';

        const s3Date = screen3El.querySelector('.screen3-date-section');
        const s3DateText = screen3El.querySelector('.screen3-date-text');
        const s3DateDiamonds = screen3El.querySelectorAll('.s3-date-diamond');
        const s3DateLines = screen3El.querySelectorAll('.s3-date-line');
        const s3TitleImg = screen3El.querySelector('.screen3-title-img');
        const s3Sparkles = screen3El.querySelectorAll('.s3-sparkle');
        const s3Time = screen3El.querySelector('.screen3-time-section');
        const s3TimeBadge = screen3El.querySelector('.s3-clock-badge-img');
        const s3TimeText = screen3El.querySelector('.screen3-time-text');
        const s3TimeDivider = screen3El.querySelector('.s3-ornament-divider');
        const s3Venue = screen3El.querySelector('.screen3-venue-section');
        const s3VenueBadge = screen3El.querySelector('.s3-pin-badge-img');
        const s3VenueName = screen3El.querySelector('.screen3-venue-name');
        const s3VenueAddr = screen3El.querySelector('.screen3-venue-address');
        const s3VenueDivider = screen3El.querySelector('.s3-venue-divider');
        const s3VenueBtn = screen3El.querySelector('#btn-reception-venue');

        // Style 3 (Cinematic Optical Blur Focus) + Style 2 (Celestial Starlight) Pre-states
        if (s3Date) gsap.set(s3Date, { opacity: 0, y: -18 });
        if (s3DateText) gsap.set(s3DateText, { filter: 'blur(8px)', opacity: 0, letterSpacing: '0.20em' });
        if (s3DateLines) gsap.set(s3DateLines, { scaleX: 0, transformOrigin: 'center center' });
        if (s3DateDiamonds) gsap.set(s3DateDiamonds, { scale: 0, opacity: 0, rotation: -90 });

        if (s3TitleImg) gsap.set(s3TitleImg, {
          opacity: 0,
          scale: 0.82,
          filter: 'blur(10px) drop-shadow(0 0 24px rgba(255, 215, 120, 1.0))'
        });
        if (s3Sparkles) gsap.set(s3Sparkles, { opacity: 0, scale: 0 });

        if (s3Time) gsap.set(s3Time, { opacity: 0, y: 16 });
        if (s3TimeBadge) gsap.set(s3TimeBadge, { opacity: 0, scale: 0.75, filter: 'blur(5px)' });
        if (s3TimeText) gsap.set(s3TimeText, { opacity: 0, filter: 'blur(6px)', letterSpacing: '0.12em' });
        if (s3TimeDivider) gsap.set(s3TimeDivider, { scaleX: 0, transformOrigin: 'center center' });

        if (s3Venue) gsap.set(s3Venue, { opacity: 0, y: 20 });
        if (s3VenueBadge) gsap.set(s3VenueBadge, { opacity: 0, scale: 0.75, filter: 'blur(5px)' });
        if (s3VenueName) gsap.set(s3VenueName, { opacity: 0, filter: 'blur(7px)', scale: 0.95 });
        if (s3VenueAddr) gsap.set(s3VenueAddr, { opacity: 0, y: 8, filter: 'blur(4px)' });
        if (s3VenueDivider) gsap.set(s3VenueDivider, { scaleX: 0, transformOrigin: 'center center' });
        if (s3VenueBtn) gsap.set(s3VenueBtn, { opacity: 0, scale: 0.72, y: 16 });
      }, 0.85)
      // 5. Golden Lotus Bridge gently dissolves away into Screen 3 (0.55s, total 2.0s)
      .to(receptionBridgeEl, {
        opacity: 0,
        scale: 1.10,
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete: () => {
          receptionBridgeEl.style.display = 'none';
          gsap.set(receptionBridgeEl, { clearProps: 'all' });
        }
      }, 1.45)
      // 6. Screen 3 settles fully into place (0.55s)
      .to(screen3El, {
        opacity: 1,
        scale: 1.0,
        duration: 0.55,
        ease: 'power2.out',
        clearProps: 'transform'
      }, 1.45)

      // 7. --- HYBRID STYLE 2 + STYLE 3 CINEMATIC OPTICAL FOCUS & STARLIGHT SEQUENCING (SLOWER, MORE ELEGANT) ---

      // A. Date Section: lines expand, diamonds burst, bold text snaps gracefully from blur(8px) into razor-sharp focus
      .to(screen3El.querySelector('.screen3-date-section'), { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 1.55)
      .to(screen3El.querySelectorAll('.s3-date-line'), { scaleX: 1, duration: 0.65, ease: 'power2.out' }, 1.58)
      .to(screen3El.querySelectorAll('.s3-date-diamond'), { scale: 1, opacity: 1, rotation: 0, duration: 0.65, ease: 'back.out(1.8)' }, 1.62)
      .to(screen3El.querySelector('.screen3-date-text'), {
        filter: 'blur(0px)',
        opacity: 1,
        letterSpacing: '0.10em',
        duration: 0.85,
        ease: 'sine.out',
        clearProps: 'filter'
      }, 1.62)

      // B. "Reception" Calligraphy: Luxurious Slow Optical Depth Bloom (blur(10px) -> blur(0px) + scale(0.82 -> 1.0))
      .to(screen3El.querySelector('.screen3-title-img'), {
        opacity: 1,
        scale: 1.0,
        filter: 'blur(0px) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 8px rgba(226, 183, 85, 0.5))',
        duration: 0.95,
        ease: 'back.out(1.2)',
        clearProps: 'transform,filter'
      }, 1.90)
      // Accompanying Starlight Twinkle Burst (✦ / ✧) on the calligraphy flourishes
      .to(screen3El.querySelectorAll('.s3-sparkle'), {
        opacity: 1,
        scale: 1.35,
        stagger: 0.16,
        duration: 0.55,
        ease: 'back.out(1.8)',
        onComplete: () => {
          gsap.to(screen3El.querySelectorAll('.s3-sparkle'), {
            scale: 1.0,
            duration: 0.45,
            clearProps: 'transform'
          });
        }
      }, 2.12)

      // E. Celebratory Pushpavrishti flower petal shower across the starry night
      .add(() => {
        if (window.WeddingParticles && typeof window.WeddingParticles.burstPetals === 'function') {
          window.WeddingParticles.burstPetals(18);
        }
      }, 2.15)

      // C. Time Section: Medallion scales in gracefully from blur, time numerals snap into crisp gold focus
      .to(screen3El.querySelector('.screen3-time-section'), { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 2.25)
      .to(screen3El.querySelector('.s3-clock-badge-img'), { opacity: 1, scale: 1.0, filter: 'blur(0px)', duration: 0.65, ease: 'back.out(1.3)', clearProps: 'transform,filter' }, 2.28)
      .to(screen3El.querySelector('.screen3-time-text'), { opacity: 1, filter: 'blur(0px)', letterSpacing: '0.05em', duration: 0.75, ease: 'sine.out', clearProps: 'filter' }, 2.32)
      .to(screen3El.querySelector('.s3-ornament-divider'), { scaleX: 1, duration: 0.65, ease: 'power2.out', clearProps: 'transform' }, 2.38)

      // D. Venue Section: Pin badge focuses, temple hall name snaps smoothly from dreamlike gold blur to bold crisp weight
      .to(screen3El.querySelector('.screen3-venue-section'), { opacity: 1, y: 0, duration: 0.70, ease: 'power2.out' }, 2.50)
      .to(screen3El.querySelector('.s3-pin-badge-img'), { opacity: 1, scale: 1.0, filter: 'blur(0px)', duration: 0.65, ease: 'back.out(1.3)', clearProps: 'transform,filter' }, 2.54)
      .to(screen3El.querySelector('.screen3-venue-name'), { opacity: 1, filter: 'blur(0px)', scale: 1.0, duration: 0.80, ease: 'sine.out', clearProps: 'transform,filter' }, 2.58)
      .to(screen3El.querySelector('.screen3-venue-address'), { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.70, ease: 'sine.out', clearProps: 'transform,filter' }, 2.66)
      .to(screen3El.querySelector('.s3-venue-divider'), { scaleX: 1, duration: 0.65, ease: 'power2.out', clearProps: 'transform' }, 2.72)
      // F. Venue Action Button: Enters with buoyant royal bounce next to Vikashini
      .to(screen3El.querySelector('#btn-reception-venue'), {
        opacity: 1,
        scale: 1.0,
        y: 0,
        duration: 0.70,
        ease: 'back.out(1.6)',
        clearProps: 'transform,opacity'
      }, 2.76);

    } else {
      // Fallback
      if (receptionBridgeEl) {
        receptionBridgeEl.style.display = 'block';
        receptionBridgeEl.style.opacity = '1';
        setTimeout(() => {
          screen2El.classList.remove('screen-active');
          screen2El.classList.add('screen-hidden');
          screen2El.style.display = 'none';
          screen3El.classList.remove('screen-hidden');
          screen3El.classList.add('screen-active');
          screen3El.style.display = 'flex';
          screen3El.style.opacity = '1';
          receptionBridgeEl.style.display = 'none';
          receptionBridgeEl.style.opacity = '0';
          if (btnReplayFab) {
            btnReplayFab.style.opacity = '1';
            btnReplayFab.style.pointerEvents = 'auto';
          }
          isScreenTransitioning = false;
        }, 1200);
      } else {
        screen2El.classList.remove('screen-active');
        screen2El.classList.add('screen-hidden');
        screen2El.style.display = 'none';
        screen3El.classList.remove('screen-hidden');
        screen3El.classList.add('screen-active');
        screen3El.style.display = 'flex';
        screen3El.style.opacity = '1';
        if (btnReplayFab) {
          btnReplayFab.style.opacity = '1';
          btnReplayFab.style.pointerEvents = 'auto';
        }
        isScreenTransitioning = false;
      }
    }
  }

  /**
   * SCREEN 3 back to SCREEN 2 (Wedding Ceremony) 2.0s Cinematic Golden Lotus Bridge Transition
   */
  function transitionBackToScreen2() {
    if (isScreenTransitioning || !screen3El || !screen2El) return;
    isScreenTransitioning = true;
    setTimeout(() => { isScreenTransitioning = false; }, 2800);

    const btnReplayFab = document.getElementById('btn-replay-fab');

    if (typeof gsap !== 'undefined' && receptionBridgeEl) {
      gsap.killTweensOf([screen2El, screen3El, receptionBridgeEl]);

      gsap.set(receptionBridgeEl, {
        display: 'block',
        opacity: 0,
        scale: 0.95,
        zIndex: 60
      });

      const tl = gsap.timeline({
        onComplete: () => {
          isScreenTransitioning = false;
          if (btnReplayFab) {
            btnReplayFab.style.opacity = '1';
            btnReplayFab.style.pointerEvents = 'auto';
          }
        }
      });

      // 1. Screen 3 softly recedes (0.35s)
      tl.to(screen3El, {
        opacity: 0,
        scale: 0.97,
        duration: 0.35,
        ease: 'power2.inOut'
      }, 0);

      // 2. Golden Lotus Bridge blooms into view with celestial glow (0.50s)
      tl.to(receptionBridgeEl, {
        opacity: 1,
        scale: 1.0,
        duration: 0.50,
        ease: 'power2.out'
      }, 0.15)
      // 3. Central Golden Lotus breathes with sacred 0.85s slow bloom expansion
      .to(receptionBridgeEl, {
        scale: 1.05,
        duration: 0.85,
        ease: 'sine.inOut'
      }, 0.65)
      // 4. In background: swap Screen 3 for Screen 2
      .add(() => {
        screen3El.classList.remove('screen-active');
        screen3El.classList.add('screen-hidden');
        screen3El.style.display = 'none';

        screen2El.classList.remove('screen-hidden');
        screen2El.classList.add('screen-active');
        screen2El.style.display = 'flex';
        screen2El.style.opacity = '0';
        screen2El.style.transform = 'scale(0.97)';
      }, 0.85)
      // 5. Golden Lotus Bridge gently dissolves away into Screen 2 (0.55s, total 2.0s)
      .to(receptionBridgeEl, {
        opacity: 0,
        scale: 1.10,
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete: () => {
          receptionBridgeEl.style.display = 'none';
          gsap.set(receptionBridgeEl, { clearProps: 'all' });
        }
      }, 1.45)
      // 6. Screen 2 settles smoothly and resumes gentle hop (0.55s)
      .to(screen2El, {
        opacity: 1,
        scale: 1.0,
        duration: 0.55,
        ease: 'power2.out',
        clearProps: 'transform'
      }, 1.45);

    } else {
      if (receptionBridgeEl) {
        receptionBridgeEl.style.display = 'block';
        receptionBridgeEl.style.opacity = '1';
        setTimeout(() => {
          screen3El.classList.remove('screen-active');
          screen3El.classList.add('screen-hidden');
          screen3El.style.display = 'none';
          screen2El.classList.remove('screen-hidden');
          screen2El.classList.add('screen-active');
          screen2El.style.display = 'flex';
          screen2El.style.opacity = '1';
          screen2El.style.removeProperty('transform');
          receptionBridgeEl.style.display = 'none';
          receptionBridgeEl.style.opacity = '0';
          if (btnReplayFab) {
            btnReplayFab.style.opacity = '1';
            btnReplayFab.style.pointerEvents = 'auto';
          }
          isScreenTransitioning = false;
        }, 2000);
      } else {
        screen3El.classList.remove('screen-active');
        screen3El.classList.add('screen-hidden');
        screen3El.style.display = 'none';
        screen2El.classList.remove('screen-hidden');
        screen2El.classList.add('screen-active');
        screen2El.style.display = 'flex';
        screen2El.style.opacity = '1';
        screen2El.style.removeProperty('transform');
        if (btnReplayFab) {
          btnReplayFab.style.opacity = '1';
          btnReplayFab.style.pointerEvents = 'auto';
        }
        isScreenTransitioning = false;
      }
    }
  }

  /**
   * Reset All: Returns entire invitation to Screen 1 initial unscratched state.
   */
  function resetAll() {
    currentSequenceId++;
    currentState = STATES.SCREEN_ONE;
    isScreenTransitioning = false;

    activeTimers.forEach(t => clearInterval(t));
    activeTimers = [];
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];

    // Stop countdown live timer
    if (window.WeddingScratchCard) {
      window.WeddingScratchCard.stopCountdown();
    }

    // Kill any active GSAP animations
    if (typeof gsap !== 'undefined') {
      if (screen1El) {
        gsap.killTweensOf(screen1El);
        gsap.set(screen1El, { clearProps: 'all' });
      }
      if (screen2El) {
        gsap.killTweensOf(screen2El);
        gsap.set(screen2El, { clearProps: 'all' });
      }
      if (overlayEl) {
        gsap.killTweensOf(overlayEl);
        gsap.set(overlayEl, { clearProps: 'all' });
      }
      if (s2CountdownPanel) gsap.killTweensOf(s2CountdownPanel);
    }

    // Reset character spans to hidden across both screens
    const allChars = document.querySelectorAll('.invitation-card .tw-char');
    allChars.forEach(c => c.classList.remove('is-revealed'));

    // Clear any inline opacity on sections so content is never trapped invisible
    const sections = document.querySelectorAll('.invitation-card .card-section, .invitation-card .screen2-section');
    sections.forEach(s => {
      s.style.removeProperty('opacity');
      s.style.removeProperty('visibility');
    });
    const btnFold = document.getElementById('btn-fold-envelope');
    if (btnFold) {
      btnFold.style.removeProperty('opacity');
      btnFold.style.removeProperty('visibility');
    }

    // Reset Overlay
    if (overlayEl) {
      overlayEl.classList.remove('active');
      overlayEl.style.removeProperty('opacity');
      overlayEl.style.removeProperty('display');
      overlayEl.style.opacity = '0';
      overlayEl.style.display = 'none';
    }

    // Reset Screen 2
    if (screen2El) {
      screen2El.classList.remove('screen-active');
      screen2El.classList.add('screen-hidden');
      if (typeof gsap !== 'undefined') gsap.set(screen2El, { clearProps: 'all' });
      screen2El.style.removeProperty('display');
      screen2El.style.removeProperty('opacity');
      screen2El.style.removeProperty('transform');
      screen2El.style.display = 'none';
      screen2El.style.opacity = '0';
    }
    if (s2CalendarMotif) s2CalendarMotif.style.opacity = '0';
    if (s2ClockMotif) s2ClockMotif.style.opacity = '0';
    if (s2Divider) s2Divider.style.opacity = '0';
    if (s2VenuePin) s2VenuePin.style.opacity = '0';
    if (s2CountdownPanel) s2CountdownPanel.style.opacity = '0';
    if (s2TempleSketch) s2TempleSketch.style.opacity = '0';

    // Reset Screen 3 (Reception)
    if (screen3El) {
      screen3El.classList.remove('screen-active');
      screen3El.classList.add('screen-hidden');
      if (typeof gsap !== 'undefined') {
        gsap.set(screen3El, { clearProps: 'all' });
        const s3VenueBtn = screen3El.querySelector('#btn-reception-venue');
        if (s3VenueBtn) gsap.set(s3VenueBtn, { clearProps: 'all' });
      }
      screen3El.style.removeProperty('display');
      screen3El.style.removeProperty('opacity');
      screen3El.style.removeProperty('transform');
      screen3El.style.display = 'none';
      screen3El.style.opacity = '0';
    }

    // Reset Screen 4 (Venue & Directions)
    if (window.WeddingVenueDirections && typeof window.WeddingVenueDirections.reset === 'function') {
      window.WeddingVenueDirections.reset();
    }

    // Reset Screen 5 (Thank You Closing Screen)
    if (window.WeddingThankYou && typeof window.WeddingThankYou.reset === 'function') {
      window.WeddingThankYou.reset();
    }

    // Reset Golden Lotus Bridge & Floating Replay FAB
    if (receptionBridgeEl) {
      if (typeof gsap !== 'undefined') gsap.killTweensOf(receptionBridgeEl);
      receptionBridgeEl.classList.remove('active');
      receptionBridgeEl.style.removeProperty('display');
      receptionBridgeEl.style.removeProperty('opacity');
      receptionBridgeEl.style.removeProperty('transform');
      receptionBridgeEl.style.display = 'none';
      receptionBridgeEl.style.opacity = '0';
    }
    const btnReplayFab = document.getElementById('btn-replay-fab');
    if (btnReplayFab) {
      btnReplayFab.style.removeProperty('opacity');
      btnReplayFab.style.removeProperty('pointer-events');
      btnReplayFab.style.opacity = '1';
      btnReplayFab.style.pointerEvents = 'auto';
    }

    // Reset Screen 1
    if (screen1El) {
      screen1El.classList.remove('screen-hidden', 'card-in-transition');
      screen1El.classList.add('screen-active');
      if (typeof gsap !== 'undefined') gsap.set(screen1El, { clearProps: 'all' });
      screen1El.style.removeProperty('display');
      screen1El.style.removeProperty('opacity');
      screen1El.style.removeProperty('transform');
      screen1El.style.display = 'flex';
      screen1El.style.opacity = '1';
      screen1El.style.transform = 'none';
    }

    if (headerAccentLine) headerAccentLine.classList.remove('line-revealed');
    if (cardCoupleTitle) cardCoupleTitle.classList.remove('names-settled');
    if (portraitHeroContainer) portraitHeroContainer.classList.remove('portrait-revealed');
    if (ceremonyScratchSection) ceremonyScratchSection.classList.remove('scratch-section-revealed');
    if (scratchRevealContent) scratchRevealContent.classList.remove('date-content-active');

    // Reset Scratch Foil
    if (window.WeddingScratchCard) {
      window.WeddingScratchCard.reset();
    }
  }

  window.WeddingReveal = {
    init: init,
    startSequence: startSequence,
    handleScratchComplete: handleScratchComplete,
    executeTransition: executeTransition,
    resetAll: resetAll,
    getState: () => currentState,
    STATES: STATES
  };

})(window);
