/**
 * Wedding Invitation - 3D Envelope Interaction & Choreography Module
 * File: assets/js/envelope.js
 * Purpose: 3D letter-fold physics, wax seal breaking/resealing, acrylic card pop-out,
 *          replay reset, and tap/click/keyboard interaction handlers.
 */

(function (window) {
  'use strict';

  let envelope = null;
  let envelopeScene = null;
  let envelopeFlap = null;
  let envelopePocket = null;
  let envelopeCardSlot = null;
  let invitationCard = null;
  let cardScroll = null;
  let royalFrameCard = null;
  let waxSeal = null;
  let waxSealWrapper = null;
  let ctaContainer = null;
  let btnReplay = null;
  let coverScreen = null;

  let isOpening = false;
  let isClosing = false;
  let isEnvelopeOpened = false;

  function init() {
    envelope = document.getElementById('envelope');
    envelopeScene = document.getElementById('envelope-scene');
    envelopeFlap = document.getElementById('envelope-flap');
    envelopePocket = document.getElementById('envelope-pocket');
    envelopeCardSlot = document.getElementById('envelope-card-slot');
    invitationCard = document.getElementById('invitation-card');
    cardScroll = document.querySelector('.invitation-card-scroll');
    royalFrameCard = document.querySelector('.royal-frame-card');
    waxSeal = document.getElementById('wax-seal');
    waxSealWrapper = document.getElementById('wax-seal-wrapper');
    ctaContainer = document.getElementById('cta-container');
    btnReplay = document.getElementById('btn-replay');
    coverScreen = document.getElementById('cover-screen');

    // Initialize tucked inside envelope pocket: natural full height, strict bottom chamber clip
    if (typeof gsap !== 'undefined') {
      if (envelopeCardSlot) {
        gsap.set(envelopeCardSlot, {
          clipPath: 'inset(-2000px 0px 0px 0px)',
          zIndex: 5
        });
      }
      if (cardScroll) {
        gsap.set(cardScroll, {
          height: '100%',
          maxHeight: '100%',
          overflowY: 'hidden'
        });
      }
      if (invitationCard) {
        invitationCard.classList.remove('card-unfolded', 'is-animating');
        const baseW = invitationCard.offsetWidth || 280;
        const baseH = Math.round(baseW * (1200 / 896));
        invitationCard.dataset.baseWidth = baseW;
        invitationCard.dataset.baseHeight = baseH;
        gsap.set(invitationCard, {
          x: 0,
          y: 15,
          z: 2,
          scale: 0.98,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          transformOrigin: '50% 50%',
          opacity: 1,
          visibility: 'visible',
          pointerEvents: 'none',
          zIndex: 5
        });
      }
      resetCardContent();
    }

    // Universal Opening Handler: On home screen, clicking or tapping anywhere on the envelope opens it immediately
    function handleEnvelopeClick(e) {
      if (e && e.cancelable && e.type === 'touchend') {
        e.preventDefault();
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      if (!isEnvelopeOpened && !isOpening && !isClosing) {
        openEnvelope();
      }
    }

    // Bind interaction events across all envelope targets
    const envelopeSection = document.querySelector('.envelope-section');
    const calligraphy = document.querySelector('.invitation-calligraphy-wrapper');
    const stageRings = document.getElementById('stage-rings');
    const btnTapOpen = document.getElementById('btn-tap-open');

    const openTargets = [
      envelope,
      envelopeScene,
      envelopeFlap,
      envelopePocket,
      envelopeCardSlot,
      waxSealWrapper,
      waxSeal,
      ctaContainer,
      envelopeSection,
      calligraphy,
      stageRings,
      btnTapOpen
    ].filter(Boolean);

    openTargets.forEach((target) => {
      target.addEventListener('click', handleEnvelopeClick);
      target.addEventListener('touchend', handleEnvelopeClick, { passive: false });
    });

    if (envelope) {
      envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isEnvelopeOpened) {
            openEnvelope();
          } else {
            toggleEnvelope(e);
          }
        }
      });
    }

    if (invitationCard) {
      // When inside envelope (home screen), clicking the card opens envelope.
      // When unfolded full-screen, clicks inside the card do not close it.
      invitationCard.addEventListener('click', (e) => {
        if (isEnvelopeOpened) {
          e.stopPropagation();
        } else if (!isOpening && !isClosing) {
          e.stopPropagation();
          openEnvelope();
        }
      });
      invitationCard.addEventListener('touchend', (e) => {
        if (isEnvelopeOpened) {
          e.stopPropagation();
        } else if (!isOpening && !isClosing) {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
          openEnvelope();
        }
      }, { passive: false });
    }

    if (btnReplay) {
      btnReplay.addEventListener('click', replayEnvelope);
    }

    const btnFold = document.getElementById('btn-fold-envelope');
    if (btnFold) {
      const handleFold = (e) => {
        if (e) {
          e.stopPropagation();
        }
        if (isEnvelopeOpened && !isClosing && !isOpening) {
          closeEnvelope();
        }
      };
      btnFold.addEventListener('click', handleFold);
      btnFold.addEventListener('touchend', handleFold, { passive: true });
    }

    const btnReplayFab = document.getElementById('btn-replay-fab');
    if (btnReplayFab) {
      btnReplayFab.addEventListener('click', (e) => {
        e.stopPropagation();
        btnReplayFab.classList.add('is-spinning');
        setTimeout(() => btnReplayFab.classList.remove('is-spinning'), 650);

        // If scrolled down to Screen 2, smoothly return to Screen 1 first
        if (window.WeddingScroll && !window.WeddingScroll.isCoverInView()) {
          window.WeddingScroll.scrollToScreen1();
          setTimeout(() => {
            if (isEnvelopeOpened && !isClosing && !isOpening) {
              closeEnvelope();
            }
          }, 450);
          return;
        }

        if (isEnvelopeOpened && !isClosing && !isOpening) {
          closeEnvelope();
        } else if (!isEnvelopeOpened && !isOpening && !isClosing) {
          openEnvelope();
        }
      });
    }

    if (coverScreen) {
      coverScreen.addEventListener('click', (e) => {
        if (isEnvelopeOpened && !isClosing && !isOpening) {
          if (invitationCard && !invitationCard.contains(e.target)) {
            closeEnvelope();
          }
        }
      });
    }
  }

  // ==========================================================================
  // STABLE POSITION PROGRESSIVE REVEAL & ANTIQUE-GOLD SHEEN
  // Reveals the invitation details ONLY after the card settles into stable position.
  // ==========================================================================
  function revealCardContent() {
    if (window.WeddingReveal) {
      window.WeddingReveal.startSequence();
    }
    triggerCardSheen();
  }

  function resetCardContent() {
    if (invitationCard) {
      const allSections = invitationCard.querySelectorAll('.card-section, .screen2-section, .scratch-card-wrapper');
      if (allSections && allSections.length && typeof gsap !== 'undefined') {
        gsap.set(allSections, { clearProps: 'opacity,visibility' });
      }
      if (allSections) {
        allSections.forEach(s => {
          s.style.removeProperty('opacity');
          s.style.removeProperty('visibility');
        });
      }
    }
    const btnFold = document.getElementById('btn-fold-envelope');
    if (btnFold) {
      if (typeof gsap !== 'undefined') {
        gsap.set(btnFold, { clearProps: 'opacity,visibility' });
      }
      btnFold.style.removeProperty('opacity');
      btnFold.style.removeProperty('visibility');
    }
    const s1 = document.getElementById('invitation-screen-1');
    if (s1) {
      s1.classList.remove('screen-hidden', 'card-in-transition');
      s1.classList.add('screen-active');
      if (typeof gsap !== 'undefined') gsap.set(s1, { clearProps: 'all' });
      s1.style.removeProperty('display');
      s1.style.removeProperty('opacity');
      s1.style.removeProperty('transform');
    }
    const s2 = document.getElementById('invitation-screen-2');
    if (s2) {
      s2.classList.remove('screen-active');
      s2.classList.add('screen-hidden');
      if (typeof gsap !== 'undefined') gsap.set(s2, { clearProps: 'all' });
      s2.style.removeProperty('display');
      s2.style.removeProperty('opacity');
      s2.style.removeProperty('transform');
      s2.style.display = 'none';
      s2.style.opacity = '0';
    }
    const s3 = document.getElementById('invitation-screen-3');
    if (s3) {
      s3.classList.remove('screen-active');
      s3.classList.add('screen-hidden');
      if (typeof gsap !== 'undefined') gsap.set(s3, { clearProps: 'all' });
      s3.style.removeProperty('display');
      s3.style.removeProperty('opacity');
      s3.style.removeProperty('transform');
      s3.style.display = 'none';
      s3.style.opacity = '0';
    }
    if (window.WeddingReveal) {
      window.WeddingReveal.resetAll();
    }
    if (window.WeddingScratchCard) {
      window.WeddingScratchCard.reset();
    }
    resetCardSheen();
  }

  function triggerCardSheen() {
    const sheen = document.querySelector('.card-sheen-sweep');
    if (!sheen) return;
    sheen.classList.remove('active');
    void sheen.offsetWidth; // trigger reflow for clean re-trigger
    sheen.classList.add('active');
  }

  function resetCardSheen() {
    const sheen = document.querySelector('.card-sheen-sweep');
    if (sheen) {
      sheen.classList.remove('active');
    }
  }

  // ==========================================================================
  // ELEVATED 3D ENVELOPE OPENING CHOREOGRAPHY (Master GSAP 3D Physics)
  // ==========================================================================
  function openEnvelope() {
    if (isOpening || isClosing || isEnvelopeOpened) return;
    isOpening = true;

    // Start background music on user touch if audio module is available
    if (window.WeddingAudio) {
      window.WeddingAudio.play();
    }

    if (envelopeScene) {
      envelopeScene.classList.add('opening-paused');
    }

    const envelopeSec = document.querySelector('.envelope-section');
    if (envelopeSec) envelopeSec.classList.add('opened');

    // Smoothly float calligraphy ("You're Invited") and rings away as envelope opens
    const calligraphy = document.querySelector('.invitation-calligraphy-wrapper');
    if (calligraphy && typeof gsap !== 'undefined') {
      gsap.to(calligraphy, { opacity: 0, y: -10, duration: 0.35, ease: 'power2.in' });
    } else if (calligraphy) {
      calligraphy.style.opacity = '0';
    }

    const ringsEl = document.getElementById('stage-rings');
    if (ringsEl && typeof gsap !== 'undefined') {
      gsap.to(ringsEl, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          ringsEl.style.visibility = 'hidden';
          ringsEl.style.pointerEvents = 'none';
        }
      });
    }

    const tapActionWrap = document.getElementById('envelope-tap-action-wrap');
    if (tapActionWrap && typeof gsap !== 'undefined') {
      gsap.to(tapActionWrap, {
        opacity: 0,
        y: 10,
        scale: 0.92,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          tapActionWrap.style.visibility = 'hidden';
          tapActionWrap.style.pointerEvents = 'none';
        }
      });
    } else if (tapActionWrap) {
      tapActionWrap.style.opacity = '0';
      tapActionWrap.style.visibility = 'hidden';
      tapActionWrap.style.pointerEvents = 'none';
    }

    if (typeof gsap !== 'undefined' && envelopeFlap) {
      gsap.killTweensOf([envelopeFlap, waxSealWrapper, invitationCard]);

      envelope.classList.remove('closing', 'is-closing', 'flap-closing', 'seal-stamped');
      envelope.classList.add('opened');

      const tl = gsap.timeline({
        onComplete: () => {
          isEnvelopeOpened = true;
          isOpening = false;
          if (window.WeddingScratchCard) {
            window.WeddingScratchCard.refresh();
          }
        }
      });

      // Phase 1: Wax seal sparkle burst on initial release (Crisp 0.08s)
      if (waxSealWrapper) {
        const sealRect = waxSealWrapper.getBoundingClientRect();
        tl.to(waxSealWrapper, {
          scale: 0.94,
          duration: 0.06,
          ease: 'power2.in',
          onComplete: () => {
            if (window.WeddingParticles) {
              window.WeddingParticles.spawnSealBurst(
                sealRect.left + sealRect.width / 2,
                sealRect.top + sealRect.height / 2
              );
            }
          }
        })
        .to(waxSealWrapper, {
          scale: 1,
          duration: 0.04,
          ease: 'power2.out'
        });
      }

      // Phase 2: Flap rotates 180deg upward in 3D (Clean 0.35s)
      tl.to(envelopeFlap, {
        rotateX: 180,
        z: -10,
        duration: 0.35,
        ease: 'power2.out'
      }, '-=0.02');

      if (waxSealWrapper) {
        tl.to(waxSealWrapper, {
          opacity: 0,
          scale: 0.95,
          duration: 0.25,
          ease: 'power2.out'
        }, '<');
      }

      // ======================================================================
      // MASTER 9-STAGE SEAMLESS INVITATION CARD TIMELINE (Continuous Motion)
      // Total elapsed time: ~2.15s with zero dead pauses, zero forced reflows.
      // Card rotates in elevated foreground (Z: 220px+) with envelope receded,
      // guaranteeing ZERO overlap, clipping, or breaking against envelope layers!
      // ======================================================================
      if (invitationCard) {
        if (envelopeScene) envelopeScene.classList.add('opening-paused');
        const appShell = document.getElementById('app-container') || document.body;
        const shellRect = appShell.getBoundingClientRect();
        const envelopeRect = (envelope || envelopeScene).getBoundingClientRect();
        const cardBaseWidth = Number(invitationCard.dataset.baseWidth) || invitationCard.offsetWidth || 280;
        const cardBaseHeight = Number(invitationCard.dataset.baseHeight) || Math.round(cardBaseWidth * (1200 / 896));
        invitationCard.dataset.baseWidth = cardBaseWidth;
        invitationCard.dataset.baseHeight = cardBaseHeight;

        // 1. Natural width & height expansion to 100% of mobile viewport for final full-screen takeover
        const targetWidth = Math.round(shellRect.width);
        const targetHeight = Math.round(shellRect.height);

        // 2. Exact 3.5 cm emergence calculation:
        // Physical 3.5 cm on mobile screens is ~135px upward translation.
        // Starting at y: 15 (inside pocket), emerging 135px brings the card to y: -120px.
        const cardHeight = cardBaseHeight;
        const envelopeOffsetFromShellTop = envelopeRect.top - shellRect.top;
        const targetY = -Math.round(envelopeOffsetFromShellTop + 15);
        const emergeRise = 135; // 3.5 cm physical rise
        const emergeY = 15 - emergeRise; // -120px (elevated 3.5 cm above pocket)

        invitationCard.classList.remove('card-unfolded', 'card-docked-fullscreen');
        invitationCard.classList.add('is-animating');
        resetCardContent();

        if (envelopeCardSlot) {
          gsap.set(envelopeCardSlot, {
            clipPath: 'inset(-2000px 0px 0px 0px)',
            zIndex: 5
          });
        }
        if (cardScroll) {
          gsap.killTweensOf(cardScroll);
          gsap.set(cardScroll, { height: '100%', maxHeight: '100%', overflowY: 'hidden' });
        }

        // Initial Pose: nestled inside envelope pocket, strictly upright
        gsap.set(invitationCard, {
          visibility: 'visible',
          opacity: 1,
          pointerEvents: 'none',
          zIndex: 5,
          x: 0,
          y: 15,
          z: 10,
          scale: 0.98,
          width: cardBaseWidth,
          height: cardHeight,
          marginLeft: -Math.round(cardBaseWidth / 2),
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          transformOrigin: '50% 50%'
        });

        // ====================================================================
        // PHASE ONE — Card rises smoothly out of pocket by 3.5 cm (480ms)
        // ====================================================================
        tl.to(invitationCard, {
          y: emergeY,
          z: 120,
          scale: 1.0,
          duration: 0.48,
          ease: 'power2.out'
        }, '-=0.04');

        // Card is now physically clear of the pocket; release slot clip & elevate zIndex for rotation
        tl.add(() => {
          if (envelopeCardSlot) {
            gsap.set(envelopeCardSlot, { clipPath: 'none', zIndex: 120 });
          }
          gsap.set(invitationCard, { zIndex: 120 });
        });

        // ====================================================================
        // PHASE TWO — Dynamic 360deg Rotation at the 3.5 cm emerged elevation (720ms)
        // Card executes a single continuous 360deg flip cleanly out of the pocket
        // ====================================================================
        tl.to(invitationCard, {
          x: 0,
          y: emergeY,
          z: 220,
          scale: 1.0,
          width: cardBaseWidth,
          height: cardHeight,
          marginLeft: -Math.round(cardBaseWidth / 2),
          rotateY: 360,
          rotateX: 0,
          rotateZ: 0,
          duration: 0.72,
          ease: 'power2.inOut'
        });

        // ====================================================================
        // PHASE THREE — Seamless Direct Zoom-In into Full Screen (500ms)
        // Directly after 360deg rotation in center, smoothly zoom in & expand
        // card to the exact full screen dimensions (ZERO over-zoom, ZERO zoom-out snap!)
        // ====================================================================
        tl.to(invitationCard, {
          width: targetWidth,
          height: targetHeight,
          marginLeft: -Math.round(targetWidth / 2),
          y: targetY,
          z: 0,
          scale: 1.0,
          duration: 0.50,
          ease: 'power2.inOut'
        });

        // Dissolve envelope pocket, flap, and back as card zooms into full screen
        const envPocket = envelopePocket || (envelope ? envelope.querySelector('.envelope-pocket') : null);
        const envBack = envelope ? envelope.querySelector('.envelope-back') : null;
        const envFlap = envelopeFlap || (envelope ? envelope.querySelector('.envelope-flap') : null);
        const envDecor = [envPocket, envBack, envFlap].filter(Boolean);
        if (envDecor.length) {
          tl.to(envDecor, {
            opacity: 0,
            duration: 0.38,
            ease: 'power2.out'
          }, '-=0.42');
        }

        // ====================================================================
        // PHASE FOUR — Seamless Stationery Full-Screen State
        // Mount card to appShell to guarantee 100% full screen coverage without
        // being trapped by 3D perspective ancestors!
        // ====================================================================
        tl.add(() => {
          // Mount directly to appShell so it covers the entire viewport effortlessly
          if (appShell && invitationCard.parentNode !== appShell) {
            appShell.appendChild(invitationCard);
          }

          // Lock outer scrolling on appContainer & body
          if (appShell) appShell.classList.add('card-fullscreen-active');
          document.body.classList.add('card-fullscreen-active');

          // Full-screen card takeover: seamlessly blend background behind the card
          if (coverScreen) coverScreen.classList.add('envelope-opened');
          const envelopeSec = document.querySelector('.envelope-section');
          if (envelopeSec) envelopeSec.classList.add('opened');

          invitationCard.classList.remove('is-animating');
          invitationCard.classList.add('card-unfolded', 'card-docked-fullscreen');
          gsap.set(invitationCard, {
            pointerEvents: 'auto',
            clearProps: 'transform,width,height,marginLeft,x,y,z,scale,rotateX,rotateY,rotateZ'
          });

          // Ensure all card sections and controls have their opacity cleared and visible
          const sections = invitationCard.querySelectorAll('.card-section');
          if (sections && sections.length) {
            gsap.set(sections, { clearProps: 'opacity,visibility' });
            sections.forEach(s => {
              s.style.removeProperty('opacity');
              s.style.removeProperty('visibility');
            });
          }
          const btnFold = document.getElementById('btn-fold-envelope');
          if (btnFold) {
            gsap.set(btnFold, { clearProps: 'opacity,visibility' });
            btnFold.style.removeProperty('opacity');
            btnFold.style.removeProperty('visibility');
          }

          const s1 = document.getElementById('invitation-screen-1');
          if (s1) {
            s1.classList.remove('screen-hidden', 'card-in-transition');
            s1.classList.add('screen-active');
            if (typeof gsap !== 'undefined') gsap.set(s1, { clearProps: 'all' });
            s1.style.removeProperty('display');
            s1.style.removeProperty('opacity');
            s1.style.removeProperty('transform');
          }
          const s2 = document.getElementById('invitation-screen-2');
          if (s2) {
            s2.classList.remove('screen-active');
            s2.classList.add('screen-hidden');
            if (typeof gsap !== 'undefined') gsap.set(s2, { clearProps: 'all' });
            s2.style.removeProperty('display');
            s2.style.removeProperty('opacity');
            s2.style.removeProperty('transform');
            s2.style.display = 'none';
            s2.style.opacity = '0';
          }

          if (cardScroll) {
            gsap.set(cardScroll, {
              height: '100%',
              maxHeight: '100%',
              overflowY: 'hidden',
              overflowX: 'hidden'
            });
            cardScroll.scrollTop = 0;
          }

          revealCardContent();
          if (window.WeddingScratchCard && typeof window.WeddingScratchCard.refresh === 'function') {
            window.WeddingScratchCard.refresh();
          }
          if (window.WeddingParticles) {
            window.WeddingParticles.burstPetals();
          }
        });
      }

    } else {
      // Fallback
      if (waxSeal) {
        const sealRect = waxSeal.getBoundingClientRect();
        if (window.WeddingParticles) {
          window.WeddingParticles.spawnSealBurst(
            sealRect.left + sealRect.width / 2,
            sealRect.top + sealRect.height / 2
          );
        }
      }
      envelope.classList.remove('closing', 'is-closing', 'flap-closing', 'seal-stamped');
      envelope.classList.add('opened');
      if (invitationCard) {
        invitationCard.style.visibility = 'visible';
        invitationCard.style.opacity = '1';
        invitationCard.style.transform = 'translate3d(0, 20px, 180px) scale(1.35)';
      }
      setTimeout(() => {
        if (window.WeddingParticles) {
          window.WeddingParticles.burstPetals();
        }
        if (window.WeddingScratchCard) {
          window.WeddingScratchCard.refresh();
        }
        revealCardContent();
        isEnvelopeOpened = true;
        isOpening = false;
      }, 700);
    }
  }

  // ==========================================================================
  // ELEVATED 3D ENVELOPE CLOSING CHOREOGRAPHY
  // ==========================================================================
  function closeEnvelope() {
    if (isOpening || isClosing || !isEnvelopeOpened) return;
    isClosing = true;

    const appShell = document.getElementById('app-container') || document.body;
    const cardBaseWidth = Number(invitationCard ? invitationCard.dataset.baseWidth : 280) || 280;
    const cardBaseHeight = Number(invitationCard ? invitationCard.dataset.baseHeight : 0) || Math.round(cardBaseWidth * (1200 / 896));
    const shellRect = appShell.getBoundingClientRect();
    const envelopeRect = (envelope || envelopeScene) ? (envelope || envelopeScene).getBoundingClientRect() : shellRect;
    const cardHeight = cardBaseHeight;
    const envelopeOffsetFromShellTop = envelopeRect.top - shellRect.top;
    const targetWidth = Math.round(shellRect.width);
    const targetHeight = Math.round(shellRect.height);
    const targetY = -Math.round(envelopeOffsetFromShellTop + 15);
    const emergeRise = 135; // 3.5 cm physical rise
    const emergeY = 15 - emergeRise; // -120px

    // Ensure card slot does not clip airborne card
    if (envelopeCardSlot) {
      gsap.set(envelopeCardSlot, { clipPath: 'none', zIndex: 120 });
    }

    // Set starting full-screen coordinates BEFORE returning to slot to eliminate any layout snap
    if (invitationCard) {
      invitationCard.classList.remove('card-unfolded', 'card-docked-fullscreen');
      invitationCard.classList.add('is-animating');

      gsap.set(invitationCard, {
        pointerEvents: 'none',
        position: 'absolute',
        top: 15,
        left: '50%',
        width: targetWidth,
        height: targetHeight,
        marginLeft: -Math.round(targetWidth / 2),
        x: 0,
        y: targetY,
        z: 0,
        scale: 1.0,
        rotateY: 360,
        rotateX: 0,
        rotateZ: 0,
        zIndex: 120
      });
    }

    // Return invitationCard into envelopeCardSlot safely
    if (envelopeCardSlot && invitationCard && invitationCard.parentNode !== envelopeCardSlot) {
      envelopeCardSlot.appendChild(invitationCard);
    }

    if (appShell) appShell.classList.remove('card-fullscreen-active');
    document.body.classList.remove('card-fullscreen-active');

    if (typeof gsap !== 'undefined' && envelopeFlap) {
      gsap.killTweensOf([envelopeFlap, waxSealWrapper, invitationCard]);

      const tl = gsap.timeline({
        onComplete: () => {
          envelope.classList.remove('is-closing', 'flap-closing', 'seal-stamped', 'opened', 'closing');
          const envelopeSec = document.querySelector('.envelope-section');
          if (envelopeSec) envelopeSec.classList.remove('opened');
          if (coverScreen) coverScreen.classList.remove('envelope-opened');
          if (envelopeScene) envelopeScene.classList.remove('opening-paused');
          isEnvelopeOpened = false;
          isClosing = false;
        }
      });

      // Smoothly reverse how the card came out of the envelope
      if (invitationCard) {
        if (cardScroll) {
          cardScroll.scrollTop = 0;
          gsap.set(cardScroll, { overflowY: 'hidden', height: '100%', maxHeight: '100%' });
        }

        // Stop any active countdown timer immediately
        if (window.WeddingScratchCard && typeof window.WeddingScratchCard.stopCountdown === 'function') {
          window.WeddingScratchCard.stopCountdown();
        }

        // Fade out ONLY inner dynamic content (text, sections, countdown, scratch box, fold button)
        // THE CARD ITSELF (the card stationery body, blush roses, gold border, and 3D flipper) REMAINS 100% VISIBLE!
        const btnFold = document.getElementById('btn-fold-envelope');
        if (btnFold) {
          tl.to(btnFold, { opacity: 0, duration: 0.18, ease: 'power2.out' }, 0);
        }

        const contentSectionsToFade = invitationCard.querySelectorAll('.card-section, .screen2-section, .scratch-card-wrapper, .card-sheen-sweep');
        const transitionOverlay = document.getElementById('page-transition-overlay');
        const elementsToFade = Array.from(contentSectionsToFade);
        if (transitionOverlay) elementsToFade.push(transitionOverlay);

        if (elementsToFade.length) {
          tl.to(elementsToFade, {
            opacity: 0,
            duration: 0.18,
            ease: 'power2.out',
            onComplete: () => {
              // Once inner text content has dissolved away cleanly:
              // 1. Hide Screen 2
              const s2 = document.getElementById('invitation-screen-2');
              if (s2) {
                s2.classList.remove('screen-active');
                s2.classList.add('screen-hidden');
                s2.style.display = 'none';
                s2.style.opacity = '0';
              }
              // 2. Keep Screen 1 active with its pristine floral stationery & gold border FULLY VISIBLE
              const s1 = document.getElementById('invitation-screen-1');
              if (s1) {
                s1.classList.remove('screen-hidden', 'card-in-transition');
                s1.classList.add('screen-active');
                s1.style.display = 'flex';
                s1.style.opacity = '1'; // THE CARD BODY REMAINS VISIBLE!
              }
              // 3. Reset typewriter characters, scratch card, and state machine
              if (window.WeddingReveal && typeof window.WeddingReveal.resetAll === 'function') {
                window.WeddingReveal.resetAll();
              }
              if (s1) {
                s1.style.opacity = '1'; // Ensure card surface stays visible
              }
            }
          }, 0);
        }

        // ====================================================================
        // REVERSE STAGE 1 — Glide smoothly back from full screen to 3.5 cm elevation
        // ====================================================================
        tl.to(invitationCard, {
          width: cardBaseWidth,
          height: cardHeight,
          marginLeft: -Math.round(cardBaseWidth / 2),
          y: emergeY,
          z: 220,
          scale: 1.0,
          duration: 0.50,
          ease: 'power2.inOut'
        }, 0);

        // Restore envelope decorative parts (pocket, back, flap) as card glides back
        const envPocket = envelopePocket || (envelope ? envelope.querySelector('.envelope-pocket') : null);
        const envBack = envelope ? envelope.querySelector('.envelope-back') : null;
        const envFlap = envelopeFlap || (envelope ? envelope.querySelector('.envelope-flap') : null);
        const envDecor = [envPocket, envBack, envFlap].filter(Boolean);
        if (envDecor.length) {
          tl.to(envDecor, {
            opacity: 1,
            duration: 0.40,
            ease: 'power2.inOut'
          }, 0.05);
        }

        // ====================================================================
        // REVERSE STAGE 2 — Reverse 360deg spin at the 3.5 cm elevation (360 -> 0)
        // ====================================================================
        tl.to(invitationCard, {
          x: 0,
          y: emergeY,
          z: 140,
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          duration: 0.56,
          ease: 'power2.inOut'
        });

        // ====================================================================
        // REVERSE STAGE 3 — Slide smoothly down into the envelope pocket
        // ====================================================================
        tl.add(() => {
          if (envelopeCardSlot) {
            gsap.set(envelopeCardSlot, {
              clipPath: 'inset(-2000px 0px 0px 0px)',
              zIndex: 5
            });
          }
          gsap.set(invitationCard, { zIndex: 5, rotateY: 0 });
        });

        tl.to(invitationCard, {
          x: 0,
          y: 15,
          z: 2,
          scale: 0.98,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            invitationCard.classList.remove('is-animating');
            gsap.set(invitationCard, { clearProps: 'width,height,marginLeft' });
            resetCardContent();
          }
        });
      }

      // 5. Scalloped flap sweeps back down over the pocket (0.28s)
      tl.to(envelopeFlap, {
        rotateX: 0,
        z: 4,
        duration: 0.28,
        ease: 'power2.inOut'
      }, '-=0.12');

      // 6. Wax Seal rides flap back down with tactile snap & sparkle
      if (waxSealWrapper) {
        tl.to(waxSealWrapper, {
          rotateX: 0,
          z: 6,
          scale: 1,
          opacity: 1,
          duration: 0.28,
          ease: 'power2.inOut',
          onComplete: () => {
            const sealRect = waxSealWrapper.getBoundingClientRect();
            if (window.WeddingParticles) {
              window.WeddingParticles.spawnSealCloseSparkle(
                sealRect.left + sealRect.width / 2,
                sealRect.top + sealRect.height / 2
              );
            }
          }
        }, '<');
      }

      // 7. Float calligraphy and rings back into view ONLY AFTER the envelope is sealed!
      const calligraphy = document.querySelector('.invitation-calligraphy-wrapper');
      if (calligraphy) {
        tl.fromTo(calligraphy,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          '+=0.06'
        );
      }

      const ringsEl = document.getElementById('stage-rings');
      if (ringsEl) {
        tl.fromTo(ringsEl,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.38,
            ease: 'power2.out',
            onStart: () => {
              ringsEl.style.visibility = 'visible';
              ringsEl.style.pointerEvents = 'auto';
            }
          },
          '<+=0.04'
        );
      }

      const tapActionWrap = document.getElementById('envelope-tap-action-wrap');
      if (tapActionWrap) {
        tl.fromTo(tapActionWrap,
          { opacity: 0, y: 10, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            ease: 'back.out(1.4)',
            onStart: () => {
              tapActionWrap.style.visibility = 'visible';
              tapActionWrap.style.pointerEvents = 'auto';
            }
          },
          '<+=0.04'
        );
      }

    } else {
      // Standard Fallback
      envelope.classList.remove('flap-closing', 'seal-stamped');
      envelope.classList.add('is-closing');
      setTimeout(() => {
        if (!isClosing) return;
        envelope.classList.add('flap-closing');
      }, 280);
      setTimeout(() => {
        if (!isClosing) return;
        envelope.classList.add('seal-stamped');
        if (waxSeal) {
          const sealRect = waxSeal.getBoundingClientRect();
          if (window.WeddingParticles) {
            window.WeddingParticles.spawnSealCloseSparkle(
              sealRect.left + sealRect.width / 2,
              sealRect.top + sealRect.height / 2
            );
          }
        }
      }, 760);
      setTimeout(() => {
        envelope.classList.remove('is-closing', 'flap-closing', 'seal-stamped', 'opened', 'closing');
        const envelopeSec = document.querySelector('.envelope-section');
        if (envelopeSec) envelopeSec.classList.remove('opened');
        if (coverScreen) coverScreen.classList.remove('envelope-opened');
        if (envelopeScene) envelopeScene.classList.remove('opening-paused');
        isEnvelopeOpened = false;
        isClosing = false;
      }, 1080);
    }
  }

  function toggleEnvelope(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isOpening || isClosing) return;
    if (isEnvelopeOpened) {
      closeEnvelope();
    } else {
      openEnvelope();
    }
  }

  function replayEnvelope() {
    if (isEnvelopeOpened && !isClosing && !isOpening) {
      closeEnvelope();
      return;
    }

    if (window.WeddingScroll) {
      window.WeddingScroll.scrollToScreen1();
    }

    setTimeout(() => {
      isEnvelopeOpened = false;
      isOpening = false;
      isClosing = false;

      if (coverScreen) {
        coverScreen.classList.remove('is-scrolling', 'paused-bounce');
        coverScreen.classList.add('screen-bounce');
      }

      if (envelope) {
        envelope.classList.remove('opened', 'closing', 'is-closing', 'flap-closing', 'seal-stamped');
        if (typeof gsap !== 'undefined') {
          gsap.killTweensOf(envelope);
          gsap.set(envelope, { z: 0, scale: 1, opacity: 1 });
        }
      }
      if (typeof gsap !== 'undefined') {
        if (envelopeFlap) {
          gsap.killTweensOf(envelopeFlap);
          gsap.set(envelopeFlap, { rotateX: 0, z: 30 });
        }
        if (waxSealWrapper) {
          gsap.killTweensOf(waxSealWrapper);
          gsap.set(waxSealWrapper, { rotateX: 0, z: 32, scale: 1, opacity: 1 });
        }
      }
      if (envelopeScene) {
        envelopeScene.classList.remove('opening-paused');
      }

      if (ctaContainer) {
        ctaContainer.style.opacity = '1';
        ctaContainer.style.pointerEvents = 'auto';
      }
      const calligraphy = document.querySelector('.invitation-calligraphy-wrapper');
      if (calligraphy) {
        calligraphy.style.opacity = '1';
      }
      const ringsEl = document.getElementById('stage-rings');
      if (ringsEl) {
        ringsEl.style.opacity = '1';
      }
      const tapActionWrap = document.getElementById('envelope-tap-action-wrap');
      if (tapActionWrap) {
        tapActionWrap.style.opacity = '1';
        tapActionWrap.style.visibility = 'visible';
        tapActionWrap.style.pointerEvents = 'auto';
        tapActionWrap.style.removeProperty('transform');
      }

      if (envelopeCardSlot && typeof gsap !== 'undefined') {
        gsap.set(envelopeCardSlot, {
          clipPath: 'inset(-2000px 0px 0px 0px)',
          zIndex: 5
        });
      }

      if (cardScroll && typeof gsap !== 'undefined') {
        gsap.killTweensOf(cardScroll);
        gsap.set(cardScroll, {
          height: 'auto',
          maxHeight: '82vh',
          overflowY: 'hidden'
        });
      }

      if (invitationCard && typeof gsap !== 'undefined') {
        invitationCard.classList.remove('card-unfolded', 'is-animating');
        if (envelopeCardSlot && invitationCard.parentNode !== envelopeCardSlot) {
          envelopeCardSlot.appendChild(invitationCard);
        }
        gsap.killTweensOf(invitationCard);
        gsap.set(invitationCard, {
          clearProps: 'width,height,marginLeft',
          visibility: 'visible',
          opacity: 1,
          zIndex: 5,
          x: 0,
          y: 15,
          z: 10,
          scale: 0.98,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          pointerEvents: 'none'
        });
      }

      resetCardContent();

      if (window.WeddingStage) {
        window.WeddingStage.playEntranceTimeline();
      }
    }, 350);
  }

  window.WeddingEnvelope = {
    init: init,
    open: openEnvelope,
    close: closeEnvelope,
    toggle: toggleEnvelope,
    replay: replayEnvelope,
    isOpen: () => isEnvelopeOpened
  };
})(window);
