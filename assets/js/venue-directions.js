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
   */
  function transitionToScreen4() {
    if (isTransitioning || !screen4El) return;
    isTransitioning = true;

    if (!screen3El) screen3El = document.getElementById('invitation-screen-3');

    // Scroll to top of Screen 4 before entrance
    screen4El.scrollTop = 0;

    if (typeof gsap !== 'undefined') {
      if (screen3El) gsap.killTweensOf(screen3El);
      gsap.killTweensOf(screen4El);

      const headerEl = screen4El.querySelector('.venue-header-section');
      const cardsEl = screen4El.querySelectorAll('.venue-card');
      const calBtnEl = screen4El.querySelector('.venue-calendar-action-section');
      const backBtnEl = screen4El.querySelector('.btn-venue-back');

      // Prepare Screen 4 initial states
      gsap.set(screen4El, {
        display: 'flex',
        opacity: 0,
        scale: 0.96
      });

      if (headerEl) gsap.set(headerEl, { opacity: 0, y: -16 });
      if (cardsEl) gsap.set(cardsEl, { opacity: 0, y: 24, scale: 0.95 });
      if (calBtnEl) gsap.set(calBtnEl, { opacity: 0, y: 16, scale: 0.92 });
      if (backBtnEl) gsap.set(backBtnEl, { opacity: 0, x: -12 });

      const tl = gsap.timeline({
        onComplete: () => {
          if (screen3El) {
            screen3El.classList.remove('screen-active');
            screen3El.classList.add('screen-hidden');
            screen3El.style.display = 'none';
          }
          screen4El.classList.remove('screen-hidden');
          screen4El.classList.add('screen-active');
          gsap.set(screen4El, { clearProps: 'transform' });
          isTransitioning = false;
        }
      });

      // 1. Screen 3 dissolves away smoothly
      if (screen3El) {
        tl.to(screen3El, {
          opacity: 0,
          scale: 0.96,
          duration: 0.45,
          ease: 'power2.inOut'
        }, 0);
      }

      // 2. Screen 4 emerges into view with golden depth
      tl.to(screen4El, {
        opacity: 1,
        scale: 1.0,
        duration: 0.60,
        ease: 'power2.out'
      }, 0.20);

      // 3. Staggered reveal of header, cards, and button
      if (backBtnEl) {
        tl.to(backBtnEl, { opacity: 1, x: 0, duration: 0.40, ease: 'power2.out' }, 0.35);
      }
      if (headerEl) {
        tl.to(headerEl, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.2)' }, 0.40);
      }
      if (cardsEl && cardsEl.length > 0) {
        tl.to(cardsEl, {
          opacity: 1,
          y: 0,
          scale: 1.0,
          stagger: 0.16,
          duration: 0.60,
          ease: 'back.out(1.3)',
          clearProps: 'transform'
        }, 0.55);
      }
      if (calBtnEl) {
        tl.to(calBtnEl, {
          opacity: 1,
          y: 0,
          scale: 1.0,
          duration: 0.50,
          ease: 'back.out(1.5)',
          clearProps: 'transform'
        }, 0.85);
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
   * Resets Screen 4 state on replay.
   */
  function reset() {
    isTransitioning = false;
    closeCalendarModal();

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
