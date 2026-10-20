# 🌸 Royal Interactive Wedding Invitation | Deepak & Vikashini

An ultra-luxury, mobile-first interactive digital wedding invitation crafted with modern CSS 3D physics, hardware-accelerated GSAP timelines, Pushpavrishti flower petal and gold dust particle simulations, an interactive metallic scratch card, live Google Maps directions, multi-event calendar integration, and sacred South Indian aesthetics.

---

## 🏛️ Comprehensive 5-Screen Architecture

| Screen | Title & Experience | Key Interactions & Aesthetics |
| :---: | :--- | :--- |
| **01** | **Sacred Mandap & 3D Envelope** | • Traditional palace backdrop with peacocks, lotuses, swing, and glinting rings<br>• 3D letter-fold envelope with embossed lotus gold wax seal<br>• Interactive "TAP TO OPEN" pill button with specular glass sheen sweep<br>• 360° card flip and smooth docked fullscreen elevation |
| **02** | **Auspicious Wedding Ceremony** | • Editorial couple centerpiece portrait with botanical rose flourishes<br>• Interactive 24K gold foil scratch card revealing the auspicious Muhurtham<br>• Pushpavrishti petal cascade and sparkling gold particle burst<br>• Animated "VIEW RECEPTION" pill button with gentle hop micro-interaction |
| **03** | **Grand Reception Gala** | • Celestial Day-to-Night Golden Lotus Bridge transition (2.0s)<br>• Starlit night palace balcony with couple portrait<br>• Optical focus snapping and starlight sparkles on calligraphy typography<br>• Two-way vertical swipe & scroll navigation |
| **04** | **Venue & Google Maps Directions** | • Modern tech-luxury Frosted Glassmorphism Disc & Sonar Radar transition<br>• Dual venue cards (Grand Reception & Sacred Muhurtham) with live map links<br>• One-click multi-event calendar synchronization (RFC-5545 `.ics` & Google Calendar) |
| **05** | **Sacred Thank You & Blessings** | • Cinematic Hollywood anamorphic rose-gold lens flare & film light leak transition<br>• Serene lakeside marble pavilion backdrop with floating pink lotus petals<br>• Circular monogram crest (`D & V`) with heartfelt gratitude message<br>• Full bottom-left floating replay FAB integration |

---

## 📁 Clean & Modular Project Structure

```text
INVITATION/
├── index.html                   # Master semantic HTML5 entrypoint (preloads & accessibility)
├── package.json                 # Project configuration, metadata & scripts
├── README.md                    # Comprehensive documentation & architectural overview
├── AGENTS.md                    # Multi-agent collaboration contracts & invariants
├── .gitignore                   # Production version control ignore rules
├── style.css                    # Root stylesheet entrypoint (delegates to assets/css/style.css)
├── script.js                    # Root script aggregator fallback
│
└── assets/                      # Production Static Resources
    │
    ├── audio/                   # Traditional Audio Engine
    │   ├── bg-music.mp3         # High-fidelity traditional wedding instrumental
    │   └── audio.mp3            # Dual-channel audio fallback
    │
    ├── css/                     # Modular Scalable Design System
    │   ├── variables.css        # Design tokens: 24K molten gold, midnight navy, fluid clamp() scales
    │   ├── base.css             # Viewport reset, mobile shell frame, ambient particle canvas
    │   ├── stage.css            # Mandap palace backdrop, peacocks, lotuses, swing, rings
    │   ├── envelope.css         # 3D envelope fold, flap texture, wax seal, tap action button
    │   ├── acrylic-card.css     # Transparent acrylic Mughal arch card physics
    │   ├── invitation-card.css  # Editorial portrait frame, scratch card reveal, docked fullscreen, Screen 3
    │   ├── venue-directions.css # Venue cards, live Google Maps embeds, calendar modals, radar bridge
    │   ├── thank-you.css        # Screen 5 Thank You layout, monogram crest, anamorphic lens flare
    │   ├── audio.css            # Floating gold music FAB, animated equalizer, replay FAB
    │   ├── themes.css           # Live color themes (Royal Navy, Imperial Emerald, Champagne Ivory)
    │   ├── animations.css       # Micro-animations, keyframe physics, gold shimmers
    │   └── style.css            # Master stylesheet bundle coordinator
    │
    ├── js/                      # Decoupled Functional Modules
    │   ├── main.js              # Application coordinator & initialization on DOM ready
    │   ├── audio.js             # WeddingAudio: autoplay unlock guard, volume, equalizer sync
    │   ├── stage.js             # WeddingStage: GSAP hardware-accelerated entrance choreography
    │   ├── particles.js         # WeddingParticles: Pushpavrishti falling petals & gold dust engine
    │   ├── envelope.js          # WeddingEnvelope: 3D envelope physics, wax seal breaking/resealing
    │   ├── scratch-card.js      # WeddingScratch: 24K gold foil scratch canvas with particle bursts
    │   ├── scroll-transition.js # WeddingScroll: Smooth scroll transitions & touch guards
    │   ├── text-reveal.js       # WeddingTextReveal: Two-screen & reception reveals, swipe engine
    │   ├── venue-directions.js  # WeddingVenue: Radar transition, Google Maps, .ics calendar export
    │   ├── thank-you.js         # WeddingThankYou: Cinematic rose-gold lens flare & Screen 5 choreography
    │   └── theme-switcher.js    # WeddingTheme: Live envelope color theme switcher
    │
    └── images/                  # Optimized Production Assets & Textures
        ├── bg_stage_clean.jpg                # Mandap palace arch stage backdrop
        ├── card_blush_roses.jpg              # Card stationery background: antique gold & blush roses
        ├── couple3.jpeg                      # Centerpiece couple portrait (Screen 2)
        ├── reception_card_bg_clean.jpg       # Balcony couple under starry night (Screen 3)
        ├── reception_lotus_bridge.jpg        # Day-to-night golden lotus transition bridge
        ├── venue_screen_bg.jpg               # Midnight navy canvas with golden stardust beams (Screen 4)
        ├── thank_you_screen_bg.jpg           # Marble pavilion & reflective lake water (Screen 5)
        ├── thank_you_monogram_frame.png      # Gold floral monogram frame (Screen 5)
        ├── reception_map_preview.png         # Sengundhar Mandabam live map thumbnail
        ├── ceremony_map_preview.png          # Thirumurugan Temple live map thumbnail
        ├── scratch_plaque_rose_cartouche.png # 24K gold foil scratch surface
        ├── scratch_plaque_rose_cartouche_base.png # Base revealed date background
        ├── reference_seal_extracted.png      # Embossed lotus gold wax seal medallion
        ├── stage_couple_swing.png            # Royal garden couple on swing cutout
        ├── stage_rings.png                   # Interlocking wedding rings motif
        ├── stage_lotus_left.png              # Stage lotus bloom (left)
        ├── stage_lotus_right.png             # Stage lotus bloom (right)
        ├── stage_peacock_upper.png           # Stage peacock cutout (upper)
        ├── stage_peacock_lower.png           # Stage peacock cutout (lower)
        ├── botanical_rose_corner_tl.png      # Watercolor botanical climbing rose (top-left)
        ├── botanical_rose_corner_tr.png      # Watercolor botanical climbing rose (top-right)
        ├── s2_ceremony_title.png             # "Wedding Ceremony" gold script title
        ├── s2_date_plaque.png                # Date plaque container
        ├── s2_filigree_divider.png           # Royal gold filigree line dividers
        ├── s2_clock_badge.svg                # Muhurtham clock badge vector
        ├── s2_pin_badge.svg                  # Venue map pin vector
        ├── s2_temple_gopuram.png             # Sacred temple gopuram illustration
        ├── s3_reception_title.png            # "Reception" calligraphy title
        ├── envelope_cover_navy.jpg           # Royal Navy envelope cardstock texture
        ├── envelope_cover_emerald.jpg        # Imperial Emerald envelope cardstock texture
        ├── envelope_cover_ivory.jpg          # Champagne Ivory envelope cardstock texture
        └── archive/                          # Raw design files, intermediate crops & backups
```

---

## 🚀 Running Locally

### Option 1: Live Server (Recommended)
```bash
npm run dev
```

### Option 2: Python Local Server
```bash
python -m http.server 3000
```
Open **`http://localhost:3000`** in any mobile or desktop browser.

---

## 🌐 Production Deployment (Vercel / Netlify / GitHub Pages)

This project is a 100% static client-side web application requiring **zero build steps** or server runtimes.

* **Vercel**: Push to GitHub and import the repository. Vercel automatically detects `index.html` and serves it on global Edge CDN.
* **GitHub Pages**: Go to **Settings -> Pages -> Branch: main -> / (root) -> Save**.
* **Netlify**: Drag and drop the project folder or connect the Git repository with publish directory set to `.`.

---

## 🎨 Design System & Technologies

* **Core**: Pure HTML5 (Semantic & Accessible) + Modern ES6+ JavaScript.
* **Styling**: Vanilla CSS3 (Custom Properties, 3D Transforms, `backdrop-filter`, Glassmorphism, Fluid `clamp()` typography).
* **Animations**: GSAP (GreenSock Animation Platform 3.12) for 60/120fps hardware-accelerated physics.
* **Particle Systems**: HTML5 2D Canvas rendering authentic Pushpavrishti flower petals (roses, lotus, marigold) and drifting stardust.
* **Calendar Engine**: RFC-5545 compliant `.ics` generator + Google Calendar deep-linking for both Reception and Muhurtham events.
