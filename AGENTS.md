# Universal Agent Collaboration & Synchronization Contract
# Workspace: INVITATION (Traditional Luxury Interactive Wedding Invitation)

> **CRITICAL MANDATE FOR ALL AI AGENTS & PARALLEL CONVERSATIONS:**
> Multiple conversations and subagents operate concurrently on this codebase. 
> To guarantee that **NO CONVERSATION OVERWRITES ANOTHER**, **ALL WORK IS INTER-LINKED**, and **EVERY AGENT IS FULLY AWARE OF WORK DONE ACROSS ALL CHATS**, you MUST strictly follow this contract on EVERY turn.

---

## 1. MANDATORY PRE-FLIGHT PROTOCOL (Before Making Any Changes)

Before proposing, modifying, or deleting ANY line of code in this project:
1. **Read Project Truth First**:
   - Check [PROJECT_CONTEXT.md](file:///c:/Users/kavin/Desktop/Projects/INVITATION/.agents/PROJECT_CONTEXT.md) for the latest architectural state, recent milestones, and active decisions.
   - Check `git status` or recently modified files to see what changes were made in parallel or by the user.
2. **Respect Component Boundaries**:
   - Do NOT edit files outside the scope of your specific user request without cross-verifying dependencies.
3. **Never Revert or Blindly Reset**:
   - If a feature, style, or animation looks different from an older version, consult the **Changelog & Milestone Ledger** in [PROJECT_CONTEXT.md](file:///c:/Users/kavin/Desktop/Projects/INVITATION/.agents/PROJECT_CONTEXT.md) before altering it.

---

## 2. MODULAR COMPONENT BOUNDARIES & CONTRACTS

Each module in this repository has strict single-responsibility boundaries. Never cross-contaminate logic:

| Module / System | Core Files | Responsibility & Immutable Rules |
| :--- | :--- | :--- |
| **Envelope & 3D Fold** | `assets/js/envelope.js`<br>`assets/css/envelope.css` | 3D envelope physics, wax seal breaking/resealing, acrylic card glide, 360° spin.<br>**IMMUTABLE RULE**: During card fold/replay, **NEVER set `#invitation-screen-1` opacity to 0**. The card stationery/frame must remain 100% visible while only dynamic text/content fades out. |
| **Scratch Card Engine** | `assets/js/scratch-card.js`<br>`assets/images/scratch_plaque_exact.png` | Gold foil scratch canvas, Muhurtham reveal, drag threshold (75%) and release threshold (55%).<br>**IMMUTABLE RULE**: Canvas must target `#scratch-canvas` inside `#scratch-card-container` (`.scratch-plaque-wrapper`). Must never remember previous scratch across page reloads/replays. |
| **Two-Screen Architecture** | `assets/js/text-reveal.js`<br>`assets/css/invitation-card.css` | Screen 1 (Royal Frame, Couple, Scratch Plaque) & Screen 2 (Wedding Program, Muhurtham, Groom/Bride details).<br>**IMMUTABLE RULE**: Transitions use `.screen-active` class and GSAP cross-fades. Do not add `!important` to opacity on `.screen-1` or `.screen-2`. |
| **Petal & Particle Engine** | `assets/js/particles.js`<br>`assets/css/base.css` | Canvas Pushpavrishti falling flower petals (roses, lotus, yellow rose, marigold) and gold sparkles.<br>**IMMUTABLE RULE**: Petals must remain vibrant and rich with high opacities (Foreground: 0.94–1.0, Midground: 0.88–0.98, Background: 0.80–0.92). Never reduce opacities to washed-out values. |
| **Audio Engine** | `assets/js/audio.js`<br>`assets/css/audio.css` | Background traditional wedding music (`#bg-audio`), user gesture unlock, and floating bottom-right music FAB (`#btn-music-toggle`). |
| **Global Shell & Layout** | `index.html`<br>`assets/css/style.css`<br>`assets/css/variables.css` | Mobile-first viewport container (`.app-container`), SVG defs, floating replay FAB (`#btn-replay-fab`). |

---

## 3. IMMUTABLE DOM CONTRACTS (DO NOT RENAME OR DELETE)

The following DOM elements are tied to multi-module event listeners and GSAP timelines. **DO NOT change their IDs or remove them from `index.html`**:

* `#invitation-card` / `#card-flipper` — 3D card flipping and scaling engine.
* `#invitation-screen-1` — Screen 1 royal frame card surface.
* `#invitation-screen-2` — Screen 2 wedding program & details surface.
* `#scratch-card-container` / `#scratch-canvas` — Interactive scratch foil reveal.
* `#scratch-reveal-content` — Revealed Muhurtham & ceremony date text.
* `#btn-replay-fab` — Bottom-left floating replay FAB.
* `#btn-music-toggle` — Bottom-right floating music toggle FAB.
* `#ambient-canvas` — Background particle canvas.
* `#wax-seal-wrapper` / `#envelope-pocket` / `#envelope-flap` — 3D envelope structure.

---

## 4. MANDATORY POST-FLIGHT PROTOCOL (After Completing Changes)

Whenever you make any architectural, structural, CSS, or JS modification:
1. **Update Project Ledger**:
   - Add an entry to the **Active Conversation Synchronization Log** in [PROJECT_CONTEXT.md](file:///c:/Users/kavin/Desktop/Projects/INVITATION/.agents/PROJECT_CONTEXT.md) describing what you changed, which files were touched, and the rationale.
2. **Bump Cache-Buster**:
   - If JS or CSS was updated, bump the script/stylesheet version query string in `index.html` (e.g. `?v=3.1`) so browsers and other sessions immediately load the fresh code without aggressive cache trapping.
3. **Keep Code Clean**:
   - Do NOT leave temporary debugging test scripts in the root directory. Clean up after testing.
4. **Mandatory Immediate Git Push (CRITICAL)**:
   - **EVERY conversation and agent turn that makes ANY changes MUST immediately stage, commit, and push to GitHub (`git push origin main`)**.
   - Run `git add <files>`, write a descriptive semantic commit message (`git commit -m "..."`), and immediately execute `git push origin main`.
   - **NEVER leave unpushed commits or dirty working trees** at the end of a turn. This guarantees that all parallel conversations, subagents, and GitHub remotes are continuously synchronized with zero merge drift.
