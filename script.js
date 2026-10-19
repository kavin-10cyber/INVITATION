/**
 * Wedding Invitation - Root JavaScript Entrypoint
 * Couple: Deepak & Vikashini (D & V)
 * 
 * Modular Architecture located in assets/js/:
 * - audio.js            : Background music, autoplay guard, equalizer
 * - stage.js            : GSAP entrance timeline & stage artwork
 * - particles.js        : Pushpavrishti flower petals & gold dust canvas
 * - envelope.js         : 3D envelope fold, 360 flip, docked fullscreen scrolling
 * - scratch-card.js     : Interactive gold glitter scratch card reveal
 * - theme-switcher.js   : Live envelope color theme selector
 * - scroll-transition.js: Smooth scroll transitions & guards
 * - main.js             : Application bootstrap coordinator on DOMContentLoaded
 */

(function () {
  'use strict';

  // If already loaded via index.html modular scripts, nothing to do
  if (window.WeddingAudio && window.WeddingStage && window.WeddingEnvelope) {
    return;
  }

  const scripts = [
    'assets/js/audio.js',
    'assets/js/stage.js',
    'assets/js/particles.js',
    'assets/js/scratch-card.js',
    'assets/js/envelope.js',
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
