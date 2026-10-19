# Multi-Conversation Interlink & Concurrency Protocol
# File: .agents/rules/concurrent_collaboration.md

> **UNIVERSAL RULE FOR ALL AGENTS RUNNING IN THIS WORKSPACE:**
> This repository is actively developed across multiple parallel agent conversations. 
> To guarantee that each conversation works in harmony with others without destructive regressions or overwrites, follow this protocol:

---

## 1. Zero-Collision Principle
No conversation is working in a vacuum. Assume other conversations have made recent improvements.
1. **Never Revert without Context**:
   - If a function, styling rule, or animation logic looks different from what you remember, **do not revert it to a previous version**.
   - Read `.agents/PROJECT_CONTEXT.md` to understand why the change was introduced.
2. **Atomic Non-Destructive Modifications**:
   - Use surgical edits (`replace_file_content` / `multi_replace_file_content`) instead of overwriting whole files (`write_to_file`) on shared files like `index.html`, `envelope.js`, or `invitation-card.css`.
   - Never remove classes or IDs that other modules might listen to.

---

## 2. Shared Module & Global State Registry
All conversations must adhere to the single source of truth for global objects:
- `window.WeddingAudio`: Music playback, volume, and toggle logic.
- `window.WeddingStage`: GSAP entrance animation for background artwork.
- `window.WeddingParticles`: Pushpavrishti petal engine (`ambient-canvas`).
- `window.WeddingEnvelope`: 3D envelope opening, extraction, and 360° spin.
- `window.WeddingScratchCard`: Canvas scratch interaction on the gold plaque.
- `window.WeddingReveal`: Screen 1 to Screen 2 transitions and typewriter text reveal.

---

## 3. Communication via Living Documentation
Every conversation communicates with future and concurrent conversations by keeping `.agents/PROJECT_CONTEXT.md` continuously up to date:
- **Before editing**: Read `.agents/PROJECT_CONTEXT.md` to see what changes were made recently.
- **After editing**: Append your change with date, file paths, and rationale to the **Active Conversation Synchronization Log** in `.agents/PROJECT_CONTEXT.md`.
