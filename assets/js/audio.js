/**
 * Wedding Invitation - Background Audio Controller Module
 * File: assets/js/audio.js
 * Purpose: Handles traditional background music autoplay, gesture unlock fallback,
 *          volume levels, floating FAB toggle, and soundwave animation sync.
 */

(function (window) {
  'use strict';

  let bgAudio = null;
  let btnMusicToggle = null;
  let soundWave = null;
  let isAudioPlaying = false;

  function init() {
    bgAudio = document.getElementById('bg-audio');
    btnMusicToggle = document.getElementById('btn-music-toggle');
    soundWave = document.getElementById('sound-wave');

    if (bgAudio) {
      bgAudio.volume = 0.75;
    }

    if (btnMusicToggle) {
      btnMusicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle();
      });
    }

    // 1. Attempt immediate autoplay on page load
    play();

    // 2. Fallback for strict browser Autoplay Policies (Chrome, Safari, Edge, Android):
    // Automatically start audio on the user's very first gesture anywhere on the screen
    const unlockAudioAutoplay = () => {
      if (!isAudioPlaying) {
        play();
      }
      // Remove listeners once playback is initiated
      const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'scroll', 'wheel'];
      events.forEach((evt) => {
        window.removeEventListener(evt, unlockAudioAutoplay, true);
        document.removeEventListener(evt, unlockAudioAutoplay, true);
      });
    };

    const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown', 'scroll', 'wheel'];
    events.forEach((evt) => {
      window.addEventListener(evt, unlockAudioAutoplay, { capture: true, passive: true });
      document.addEventListener(evt, unlockAudioAutoplay, { capture: true, passive: true });
    });
  }

  function play() {
    if (!bgAudio) return;
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      if (btnMusicToggle) btnMusicToggle.classList.add('playing');
      if (soundWave) soundWave.classList.add('playing');
    }).catch((err) => {
      console.log('Autoplay deferred until user interaction:', err.message);
      isAudioPlaying = false;
      if (btnMusicToggle) btnMusicToggle.classList.remove('playing');
      if (soundWave) soundWave.classList.remove('playing');
    });
  }

  function pause() {
    if (!bgAudio) return;
    bgAudio.pause();
    isAudioPlaying = false;
    if (btnMusicToggle) btnMusicToggle.classList.remove('playing');
    if (soundWave) soundWave.classList.remove('playing');
  }

  function toggle() {
    if (isAudioPlaying) {
      pause();
    } else {
      play();
    }
  }

  window.WeddingAudio = {
    init: init,
    play: play,
    pause: pause,
    toggle: toggle,
    isPlaying: () => isAudioPlaying
  };
})(window);
