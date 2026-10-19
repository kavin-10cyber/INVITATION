/**
 * ============================================================================
 * WEDDING INVITATION - VENUE & DIRECTIONS ENGINE
 * Workspace: INVITATION (Deepak & Vikashini)
 * File: assets/js/venue-directions.js
 * Purpose: Dedicated interactive controller for Venue & Directions screen (Screen 4).
 * ============================================================================
 */

(function (window) {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. CONFIGURABLE GOOGLE MAPS URLS & CALENDAR CONSTANTS
  // --------------------------------------------------------------------------
  const VENUE_CONFIG = {
    // Reception Google Maps URL (Exact location: Sengunthar Kalyana Mandapam, Tirupur)
    receptionMapsUrl: "https://maps.app.goo.gl/fxFxH68HeiaVmsk88",

    // Wedding Ceremony Google Maps URL (Exact location: Arulmigu Thirumuruganadha Swamy Temple, Tirupur)
    ceremonyMapsUrl: "https://maps.app.goo.gl/KnThmrxYPq4JMzhS8",

    // Grand Reception Event (Saturday, 21 Nov 2026, 6:00 PM – 9:00 PM IST)
    receptionCalendar: {
      title: "Deepak & Vikashini — Grand Reception",
      description: "With joy and blessings of our families, we warmly invite you to celebrate the Grand Reception of Deepak & Vikashini at Sengundhar Thirumana Mandabam, Tirupur.",
      location: "Sengundhar Thirumana Mandabam, New Bus Stand Back Side, P.N Road, Tirupur",
      startUtc: "20261121T123000Z",
      endUtc: "20261121T153000Z"
    },

    // Auspicious Muhurtham Ceremony Event (Sunday, 22 Nov 2026, 5:00 AM – 6:00 AM IST)
    ceremonyCalendar: {
      title: "Deepak & Vikashini — Auspicious Muhurtham",
      description: "With divine grace, join us in celebrating the sacred wedding ceremony (Muhurtham) of Deepak & Vikashini at Arulmigu Thirumuruganadha Swamy Temple, Tirupur.",
      location: "Arulmigu Thirumuruganadha Swamy Temple, Thirumurugan Poondi, Tirupur",
      startUtc: "20261121T233000Z",
      endUtc: "20261122T003000Z"
    }
  };

  // DOM Elements cache
  let screen3El = null;
  let screen4El = null;
  let cardReception = null;
  let cardCeremony = null;
  let btnAddCalendar = null;
  let btnVenueBack = null;
  let modalBackdrop = null;
  let btnModalIcs = null;
  let btnModalGoogle = null;
  let btnModalCancel = null;

  let isTransitioning = false;
  let touchStartY = 0;
  let touchStartX = 0;

  /**
   * Initializes Venue & Directions screen DOM references and event listeners.
   */
  function init() {
    screen3El = document.getElementById('invitation-screen-3');
    screen4El = document.getElementById('invitation-screen-4');
    cardReception = document.getElementById('card-reception-venue');
    cardCeremony = document.getElementById('card-ceremony-venue');
    btnAddCalendar = document.getElementById('btn-add-calendar');
    btnVenueBack = document.getElementById('btn-venue-back');
    modalBackdrop = document.getElementById('calendar-confirm-modal');
    btnModalIcs = document.getElementById('btn-modal-download-ics');
    const btnModalReceptionGoogle = document.getElementById('btn-modal-reception-cal');
    const btnModalCeremonyGoogle = document.getElementById('btn-modal-ceremony-cal');
    btnModalCancel = document.getElementById('btn-modal-cancel');

    // 1. Reception Card Click & Keyboard Activation
    if (cardReception) {
      cardReception.addEventListener('click', (e) => {
        e.preventDefault();
        openMapUrl(VENUE_CONFIG.receptionMapsUrl);
      });
      cardReception.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMapUrl(VENUE_CONFIG.receptionMapsUrl);
        }
      });
    }

    // 2. Ceremony Card Click & Keyboard Activation
    if (cardCeremony) {
      cardCeremony.addEventListener('click', (e) => {
        e.preventDefault();
        openMapUrl(VENUE_CONFIG.ceremonyMapsUrl);
      });
      cardCeremony.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMapUrl(VENUE_CONFIG.ceremonyMapsUrl);
        }
      });
    }

    // 3. Add to Calendar Button -> Opens Confirmation Modal
    if (btnAddCalendar) {
      btnAddCalendar.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openCalendarModal();
      });
    }

    // 4. Modal Action Handlers
    if (btnModalIcs) {
      btnModalIcs.addEventListener('click', (e) => {
        e.preventDefault();
        downloadIcsFile();
        closeCalendarModal();
      });
    }

    if (btnModalReceptionGoogle) {
      btnModalReceptionGoogle.addEventListener('click', (e) => {
        e.preventDefault();
        openGoogleCalendar('reception');
        closeCalendarModal();
      });
    }

    if (btnModalCeremonyGoogle) {
      btnModalCeremonyGoogle.addEventListener('click', (e) => {
        e.preventDefault();
        openGoogleCalendar('ceremony');
        closeCalendarModal();
      });
    }

    if (btnModalCancel) {
      btnModalCancel.addEventListener('click', (e) => {
        e.preventDefault();
        closeCalendarModal();
      });
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          closeCalendarModal();
        }
      });
    }

    // 5. Back Navigation Button
    if (btnVenueBack) {
      btnVenueBack.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        transitionBackToScreen3();
      });
    }

    // 6. Touch swipe back to Screen 3 when at top of Screen 4
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
          // Swiping down (diffY < -40) while at top of scroll
          if (diffY < -45 && Math.abs(diffY) > diffX * 1.2) {
            if (screen4El.scrollTop <= 10) {
              transitionBackToScreen3();
            }
          }
        }
      }, { passive: true });
    }

    // Expose config globally so user can inspect or override dynamically
    window.WeddingVenues = VENUE_CONFIG;
  }

  /**
   * Safely opens a Google Maps URL in a new browser tab or device Maps app.
   * @param {string} url
   */
  function openMapUrl(url) {
    if (!url) return;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.location.href = url;
    }
  }

  /**
   * Opens the Add to Calendar confirmation modal.
   */
  function openCalendarModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.add('is-active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
    }
  }

  /**
   * Closes the calendar modal.
   */
  function closeCalendarModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Generates and downloads a valid RFC-5545 .ics file containing BOTH events:
   * 1. Grand Reception (21 Nov 2026, 6:00 PM – 9:00 PM IST)
   * 2. Sacred Muhurtham (22 Nov 2026, 5:00 AM – 6:00 AM IST)
   */
  function downloadIcsFile() {
    const rec = VENUE_CONFIG.receptionCalendar;
    const cer = VENUE_CONFIG.ceremonyCalendar;
    const nowUtc = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Deepak & Vikashini Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Deepak & Vikashini Wedding Celebrations',
      'X-WR-TIMEZONE:Asia/Kolkata',

      // EVENT 1: GRAND RECEPTION
      'BEGIN:VEVENT',
      `UID:reception-20261121-${Date.now()}@deepakvikashini.wedding`,
      `DTSTAMP:${nowUtc}`,
      `DTSTART:${rec.startUtc}`,
      `DTEND:${rec.endUtc}`,
      `SUMMARY:${rec.title}`,
      `DESCRIPTION:${rec.description}`,
      `LOCATION:${rec.location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Deepak & Vikashini Grand Reception tomorrow',
      'END:VALARM',
      'END:VEVENT',

      // EVENT 2: AUSPICIOUS MUHURTHAM
      'BEGIN:VEVENT',
      `UID:muhurtham-20261122-${Date.now()}@deepakvikashini.wedding`,
      `DTSTAMP:${nowUtc}`,
      `DTSTART:${cer.startUtc}`,
      `DTEND:${cer.endUtc}`,
      `SUMMARY:${cer.title}`,
      `DESCRIPTION:${cer.description}`,
      `LOCATION:${cer.location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT12H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Deepak & Vikashini Auspicious Muhurtham Ceremony tomorrow morning',
      'END:VALARM',
      'END:VEVENT',

      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', 'Deepak-Vikashini-Wedding-Events.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  /**
   * Opens Google Calendar event creation web page in a new tab.
   * @param {'reception'|'ceremony'} type
   */
  function openGoogleCalendar(type) {
    const cal = (type === 'ceremony') ? VENUE_CONFIG.ceremonyCalendar : VENUE_CONFIG.receptionCalendar;
    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.set('action', 'TEMPLATE');
    googleUrl.searchParams.set('text', cal.title);
    googleUrl.searchParams.set('dates', `${cal.startUtc}/${cal.endUtc}`);
    googleUrl.searchParams.set('details', cal.description);
    googleUrl.searchParams.set('location', cal.location);

    window.open(googleUrl.toString(), '_blank', 'noopener,noreferrer');
  }

  /**
   * Cinematic transition from Screen 3 (Reception) to Screen 4 (Venue & Directions).
   * Concept 2: Frosted Glassmorphism Disc & Pulsing Radar Pin (Apple / Tesla Modern Tech-Luxury).
   */
  function transitionToScreen4() {
    if (isTransitioning || !screen4El) return;
    isTransitioning = true;

    if (!screen3El) screen3El = document.getElementById('invitation-screen-3');
    const radarBridgeEl = document.getElementById('venue-radar-bridge');
    const glassDiscEl = document.getElementById('radar-glass-disc');
    const sheenEl = radarBridgeEl ? radarBridgeEl.querySelector('.radar-glass-specular-sheen') : null;
    const pinEl = radarBridgeEl ? radarBridgeEl.querySelector('.radar-pin-assembly') : null;
    const rings = radarBridgeEl ? radarBridgeEl.querySelectorAll('.radar-ripple-ring') : null;
    const telemetryEl = radarBridgeEl ? radarBridgeEl.querySelector('.radar-telemetry-badge') : null;

    // Scroll to top of Screen 4 before entrance
    screen4El.scrollTop = 0;

    if (typeof gsap !== 'undefined' && radarBridgeEl && glassDiscEl) {
      if (screen3El) gsap.killTweensOf(screen3El);
      gsap.killTweensOf([screen4El, radarBridgeEl, glassDiscEl]);
      if (sheenEl) gsap.killTweensOf(sheenEl);
      if (pinEl) gsap.killTweensOf(pinEl);
      if (telemetryEl) gsap.killTweensOf(telemetryEl);
      if (rings && rings.length > 0) gsap.killTweensOf(rings);

      const headerEl = screen4El.querySelector('.venue-header-section');
      const cardsEl = screen4El.querySelectorAll('.venue-card');
      const calBtnEl = screen4El.querySelector('.venue-calendar-action-section');
      const backBtnEl = screen4El.querySelector('.btn-venue-back');

      // 1. Activate transition bridge overlay & set initial 3D transforms
      radarBridgeEl.classList.add('active');
      radarBridgeEl.style.display = 'flex';
      gsap.set(radarBridgeEl, { opacity: 1 });

      gsap.set(glassDiscEl, {
        opacity: 0,
        scale: 0.72,
        rotateX: 18,
        rotateY: -14,
        rotateZ: 0,
        transformPerspective: 900
      });

      if (sheenEl) gsap.set(sheenEl, { xPercent: -120, opacity: 0 });
      if (pinEl) gsap.set(pinEl, { scale: 0, opacity: 0 });
      if (telemetryEl) gsap.set(telemetryEl, { opacity: 0, y: 10 });
      if (rings && rings.length > 0) {
        gsap.set(rings, { scale: 0.25, opacity: 0 });
      }

      // Prepare Screen 4 initial states
      if (headerEl) gsap.set(headerEl, { opacity: 0, y: -16 });
      if (cardsEl) gsap.set(cardsEl, { opacity: 0, y: 24, scale: 0.95 });
      if (calBtnEl) gsap.set(calBtnEl, { opacity: 0, y: 16, scale: 0.92 });
      if (backBtnEl) gsap.set(backBtnEl, { opacity: 0, x: -12 });

      const tl = gsap.timeline({
        onComplete: () => {
          radarBridgeEl.classList.remove('active');
          radarBridgeEl.style.display = 'none';
          gsap.set(radarBridgeEl, { clearProps: 'all' });
          gsap.set(glassDiscEl, { clearProps: 'all' });
          gsap.set(screen4El, { clearProps: 'transform' });
          isTransitioning = false;
        }
      });

      // Step 1: Screen 3 dissolves away smoothly
      if (screen3El) {
        tl.to(screen3El, {
          opacity: 0,
          scale: 0.94,
          duration: 0.22,
          ease: 'power2.inOut'
        }, 0);
      }

      // CRITICAL FIX: The instant the radar bridge is fully covering the card (0.20s),
      // remove Screen 3 from display and make Screen 4 active right behind the bridge!
      tl.add(() => {
        if (screen3El) {
          screen3El.classList.remove('screen-active');
          screen3El.classList.add('screen-hidden');
          screen3El.style.display = 'none';
          screen3El.style.opacity = '0';
        }
        screen4El.classList.remove('screen-hidden');
        screen4El.classList.add('screen-active');
        screen4El.style.display = 'flex';
        screen4El.style.opacity = '1';
        screen4El.scrollTop = 0;
      }, 0.20);

      // Step 2: 3D Frosted Acrylic Glass Disc emerges with spring tilt
      tl.to(glassDiscEl, {
        opacity: 1,
        scale: 1.0,
        rotateX: 6,
        rotateY: -4,
        duration: 0.40,
        ease: 'back.out(1.5)'
      }, 0.15);

      // Level out 3D tilt
      tl.to(glassDiscEl, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.30,
        ease: 'power2.out'
      }, 0.48);

      // Specular light sheen sweeps across glass disc
      if (sheenEl) {
        tl.to(sheenEl, {
          opacity: 0.95,
          xPercent: 140,
          duration: 0.60,
          ease: 'power2.inOut'
        }, 0.22);
      }

      // Step 3: Liquid Gold Location Pin pops up at center with bounce
      if (pinEl) {
        tl.to(pinEl, {
          opacity: 1,
          scale: 1.0,
          duration: 0.40,
          ease: 'back.out(2.0)'
        }, 0.38);
      }

      // Telemetry badge fades in
      if (telemetryEl) {
        tl.to(telemetryEl, {
          opacity: 1,
          y: 0,
          duration: 0.30,
          ease: 'power2.out'
        }, 0.48);
      }

      // Step 4: 3 Sonar radar ripple rings pulse outwards from pin tip
      if (rings && rings.length > 0) {
        rings.forEach((ring, index) => {
          const startAt = 0.50 + (index * 0.12);
          tl.fromTo(ring,
            { scale: 0.25, opacity: 0.95 },
            { scale: 2.2 + (index * 0.2), opacity: 0, duration: 0.65, ease: 'power2.out' },
            startAt
          );
        });
      }

      // Step 5: Glass Disc expands smoothly (aperture zoom effect) seamlessly revealing Screen 4
      tl.to(glassDiscEl, {
        scale: 2.8,
        opacity: 0,
        duration: 0.45,
        ease: 'expo.in'
      }, 0.95);

      tl.to(radarBridgeEl, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut'
      }, 1.05);

      // Staggered reveal of Screen 4 components directly as aperture opens
      if (backBtnEl) {
        tl.to(backBtnEl, { opacity: 1, x: 0, duration: 0.30, ease: 'power2.out' }, 1.10);
      }
      if (headerEl) {
        tl.to(headerEl, { opacity: 1, y: 0, duration: 0.40, ease: 'back.out(1.2)' }, 1.15);
      }
      if (cardsEl && cardsEl.length > 0) {
        tl.to(cardsEl, {
          opacity: 1,
          y: 0,
          scale: 1.0,
          stagger: 0.12,
          duration: 0.45,
          ease: 'back.out(1.3)',
          clearProps: 'transform'
        }, 1.20);
      }
      if (calBtnEl) {
        tl.to(calBtnEl, {
          opacity: 1,
          y: 0,
          scale: 1.0,
          duration: 0.40,
          ease: 'back.out(1.5)',
          clearProps: 'transform'
        }, 1.38);
      }

    } else {
      // Fallback without GSAP
      if (screen3El) {
        screen3El.classList.remove('screen-active');
        screen3El.classList.add('screen-hidden');
        screen3El.style.display = 'none';
        screen3El.style.opacity = '0';
      }
      screen4El.classList.remove('screen-hidden');
      screen4El.classList.add('screen-active');
      screen4El.style.display = 'flex';
      screen4El.style.opacity = '1';
      isTransitioning = false;
    }
  }

  /**
   * Smooth return from Screen 4 (Venue & Directions) back to Screen 3 (Reception).
   */
  function transitionBackToScreen3() {
    if (isTransitioning || !screen3El || !screen4El) return;
    isTransitioning = true;

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf([screen3El, screen4El]);

      gsap.set(screen3El, {
        display: 'flex',
        opacity: 0,
        scale: 0.96
      });

      const tl = gsap.timeline({
        onComplete: () => {
          screen4El.classList.remove('screen-active');
          screen4El.classList.add('screen-hidden');
          screen4El.style.display = 'none';

          screen3El.classList.remove('screen-hidden');
          screen3El.classList.add('screen-active');
          gsap.set(screen3El, { clearProps: 'all' });
          isTransitioning = false;
        }
      });

      // 1. Screen 4 gently recedes
      tl.to(screen4El, {
        opacity: 0,
        scale: 0.96,
        duration: 0.40,
        ease: 'power2.inOut'
      }, 0);

      // 2. Screen 3 emerges back smoothly
      tl.to(screen3El, {
        opacity: 1,
        scale: 1.0,
        duration: 0.50,
        ease: 'power2.out'
      }, 0.18);

    } else {
      screen4El.classList.remove('screen-active');
      screen4El.classList.add('screen-hidden');
      screen4El.style.display = 'none';
      screen4El.style.opacity = '0';

      screen3El.classList.remove('screen-hidden');
      screen3El.classList.add('screen-active');
      screen3El.style.display = 'flex';
      screen3El.style.opacity = '1';
      isTransitioning = false;
    }
  }

  /**
   * Resets Screen 4 and radar bridge state on replay.
   */
  function reset() {
    isTransitioning = false;
    closeCalendarModal();

    const radarBridgeEl = document.getElementById('venue-radar-bridge');
    if (radarBridgeEl) {
      if (typeof gsap !== 'undefined') gsap.killTweensOf(radarBridgeEl);
      radarBridgeEl.classList.remove('active');
      radarBridgeEl.style.removeProperty('display');
      radarBridgeEl.style.removeProperty('opacity');
      radarBridgeEl.style.removeProperty('transform');
      radarBridgeEl.style.display = 'none';
      radarBridgeEl.style.opacity = '0';
    }

    if (screen4El) {
      screen4El.classList.remove('screen-active');
      screen4El.classList.add('screen-hidden');
      if (typeof gsap !== 'undefined') gsap.set(screen4El, { clearProps: 'all' });
      screen4El.style.removeProperty('display');
      screen4El.style.removeProperty('opacity');
      screen4El.style.removeProperty('transform');
      screen4El.style.display = 'none';
      screen4El.style.opacity = '0';
      screen4El.scrollTop = 0;
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export module to global scope
  window.WeddingVenueDirections = {
    init: init,
    transitionToScreen4: transitionToScreen4,
    transitionBackToScreen3: transitionBackToScreen3,
    openMapUrl: openMapUrl,
    downloadIcsFile: downloadIcsFile,
    openGoogleCalendar: openGoogleCalendar,
    reset: reset,
    config: VENUE_CONFIG
  };

})(window);
