/**
 * Wedding Invitation - Legacy Aggregator Entrypoint
 * File: assets/js/script.js
 * Purpose: Ensures backward compatibility by loading all modular components if not already loaded.
 */

(function () {
  'use strict';

  // If already loaded via modular tags, do nothing
  if (window.WeddingAudio && window.WeddingStage && window.WeddingParticles && window.WeddingEnvelope) {
    return;
  }

  const scripts = [
    'assets/js/audio.js',
    'assets/js/stage.js',
    'assets/js/particles.js',
    'assets/js/envelope.js',
    'assets/js/scroll-transition.js',
    'assets/js/theme-switcher.js',
    'assets/js/main.js'
  ];

  function loadNext(index) {
    if (index >= scripts.length) return;
    const s = document.createElement('script');
    s.src = scripts[index];
    s.onload = () => loadNext(index + 1);
    document.body.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadNext(0));
  } else {
    loadNext(0);
  }
})();
