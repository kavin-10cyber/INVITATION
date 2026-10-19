# Universal Project Memory & Conversation Synchronization

> **ATTENTION ALL ASSISTANTS & CONVERSATIONS IN THIS WORKSPACE:**
> This project has multiple concurrent conversations and tasks. To prevent conflicts, overwriting work, or desynchronization, follow these guidelines:

---

## 1. Golden Rules for All Conversations
1. **Always Check Project State First**:
   - Before suggesting changes to CSS, JS, HTML, or asset paths, consult `.agents/PROJECT_CONTEXT.md` to see the latest architectural decisions.
2. **Modular CSS & JS are Now Strictly Enforced**:
   - `style.css` and `assets/css/style.css` are **modular CSS entrypoints**.
   - `script.js` and `assets/js/script.js` are **modular JS backward-compatible loaders**.
   - Do **NOT** paste monolithic 2000-line blocks back into `style.css` or `script.js`.
   - **CSS Modules (`assets/css/`)**:
     * `variables.css`: tokens, colors, typography, sizing clamp()
     * `base.css`: resets, container shell, ambient canvas
     * `audio.css`: floating music FAB & soundwave equalizer
     * `stage.css`: mandap backdrop, lotuses, peacocks, swing, top rings, header, calligraphy
     * `envelope.css`: 3D envelope structure, pocket, scalloped flap, wax seal
     * `acrylic-card.css`: translucent Mughal arch card, reflections, couple text
     * `announcement.css`: screen 2 royal frame, groom/bride cards, muhurtham banner
     * `themes.css`: royal navy, imperial emerald, champagne ivory palettes & selector bar
     * `animations.css`: screen gentle bounce and shared keyframes
   - **JavaScript Modules (`assets/js/`)**:
     * `audio.js`: `window.WeddingAudio` - background music autoplay, unlock, toggle
     * `stage.js`: `window.WeddingStage` - GSAP hardware-accelerated entrance timeline
     * `particles.js`: `window.WeddingParticles` - Pushpavrishti canvas petals & gold sparkles
     * `envelope.js`: `window.WeddingEnvelope` - 3D envelope open/close/replay choreography
     * `scroll-transition.js`: `window.WeddingScroll` - 60/120fps depth dissolve & scroll guard
     * `theme-switcher.js`: `window.WeddingTheme` - live envelope theme preview switcher
     * `main.js`: DOM ready coordinator & bootstrap runner
3. **Log Significant Milestones**:
   - When you complete a major feature, refactor, or asset addition, add a brief bullet to the **Changelog & Recent Milestones** section in `.agents/PROJECT_CONTEXT.md`.

