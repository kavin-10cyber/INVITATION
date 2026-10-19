/**
 * Wedding Invitation - Interactive Theme Switcher Module
 * File: assets/js/theme-switcher.js
 * Purpose: Handles live color palette switching between Royal Navy, Imperial Emerald,
 *          and Champagne Ivory options on the 3D envelope and inner arch card.
 */

(function (window) {
  'use strict';

  const THEMES = ['theme-navy', 'theme-emerald', 'theme-ivory'];

  function setTheme(themeName) {
    const envelope = document.getElementById('envelope');
    const themeBtns = document.querySelectorAll('.theme-btn');

    if (!envelope || !THEMES.includes(themeName)) return;

    // Remove existing themes
    THEMES.forEach((t) => envelope.classList.remove(t));

    // Add selected theme
    envelope.classList.add(themeName);

    // Update active button state
    themeBtns.forEach((btn) => {
      if (btn.getAttribute('data-theme') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function init() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    if (!themeBtns || themeBtns.length === 0) return;

    themeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = btn.getAttribute('data-theme');
        if (theme) {
          setTheme(theme);
        }
      });
    });
  }

  window.WeddingTheme = {
    init: init,
    setTheme: setTheme
  };
})(window);
