/**
 * Wedding Invitation - Stage Artwork Entrance Timeline Module
 * File: assets/js/stage.js
 * Purpose: Hardware-accelerated GSAP sequence animating palace arch, lotus blooms,
 *          peacocks, couple on swing, rings, and header smoothly into position.
 */

(function (window) {
  'use strict';

  function playEntranceTimeline() {
    if (typeof gsap === 'undefined') return;

    const stageBg = document.getElementById('stage-bg');
    const lotusLeft = document.getElementById('stage-lotus-left');
    const lotusRight = document.getElementById('stage-lotus-right');
    const rings = document.getElementById('stage-rings');
    const peacockUpper = document.getElementById('stage-peacock-upper');
    const peacockLower = document.getElementById('stage-peacock-lower');
    const couple = document.getElementById('stage-couple');
    const envelopeSec = document.querySelector('.envelope-section');
    const header = document.querySelector('.header-container');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (stageBg) {
      tl.fromTo(stageBg,
        { opacity: 0, scale: 1.08, filter: 'blur(6px) brightness(1.2)' },
        { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)', duration: 1.4 },
        0
      );
    }

    if (lotusLeft) {
      tl.fromTo(lotusLeft,
        { opacity: 0, x: -70, y: -90, rotation: -16, scale: 0.8 },
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1.4, ease: 'back.out(1.2)' },
        0.2
      );
    }

    if (lotusRight) {
      tl.fromTo(lotusRight,
        { opacity: 0, x: 70, y: -90, rotation: 16, scale: 0.8 },
        { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1.4, ease: 'back.out(1.2)' },
        0.3
      );
    }

    if (peacockUpper) {
      tl.fromTo(peacockUpper,
        { opacity: 0, x: 90, y: -20, scale: 0.9 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.4 },
        0.45
      );
    }

    if (peacockLower) {
      tl.fromTo(peacockLower,
        { opacity: 0, x: 100, y: 50, scale: 0.9 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.5 },
        0.55
      );
    }

    if (couple) {
      tl.fromTo(couple,
        {
          opacity: 0,
          x: -110,
          y: 15,
          rotation: -3.5,
          scale: 0.96
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 1.6,
          ease: 'power2.out'
        },
        0.5
      );
    }

    if (rings) {
      tl.fromTo(rings,
        { opacity: 0 },
        { opacity: 1, duration: 1.0, ease: 'power2.out' },
        0.65
      );
    }

    if (header) {
      tl.fromTo(header,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1.1 },
        0.75
      );
    }

    if (envelopeSec) {
      tl.fromTo(envelopeSec,
        { opacity: 0, y: 45, scale: 0.82 },
        { opacity: 1, y: 0, scale: 1, duration: 2.25, ease: 'power2.out' },
        1.35
      );
    }

    return tl;
  }

  window.WeddingStage = {
    playEntranceTimeline: playEntranceTimeline
  };
})(window);
