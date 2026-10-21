// ========================================================
// DIWALI VIRTUAL WORLD - MAIN 2.5D CANVAS GAME ENGINE
// High DPI support, responsive camera zoom, boundary clamping,
// atmospheric night pass, ornate minimap, and 60 FPS render loop
// ========================================================

class DiwaliEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = null; // Do not lock canvas to 2D context at load time
    this.miniCanvas = document.getElementById('miniMapCanvas');
    this.miniCtx = null;

    this.isRunning = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = 1;

    // Smooth Camera with responsive zoom
    this.camera = {
      x: 650,
      y: 680,
      zoom: 1.0,
      targetX: 650,
      targetY: 680,
      lerp: 0.12
    };

    // Keyboard & Joystick Inputs
    this.keys = {};
    this.joystickVector = { x: 0, y: 0 };

    // Nearest interactive target
    this.currentInteractive = null;

    // Performance & FPS tracking
    this.lastTime = performance.now();
    this.fps = 60;
    this.showFps = false;

    // Atmospheric Starfield & Night Nebulae
    this.stars = [];
    this.initStars();
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 110; i++) {
      this.stars.push({
        x: Math.random() * 2400 - 300,
        y: Math.random() * 1800 - 300,
        size: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        hue: Math.random() > 0.4 ? 48 : 220 // Golden starlight or soft sapphire
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.miniCtx = this.miniCanvas ? this.miniCanvas.getContext('2d') : null;
    this.setupResize();
    this.setupInputs();

    // Center camera on player or world center
    if (window.diwaliPlayer && window.diwaliWorld) {
      const viewW = this.width / this.camera.zoom;
      this.camera.x = viewW >= window.diwaliWorld.width ? window.diwaliWorld.width / 2 : window.diwaliPlayer.x;
      this.camera.y = window.diwaliPlayer.y;
      this.camera.targetX = this.camera.x;
      this.camera.targetY = this.camera.y;
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  setupResize() {
    const handleResize = () => {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      if (this.canvas) {
        // Internal rendering buffer dimensions
        this.canvas.width = Math.round(this.width * this.dpr);
        this.canvas.height = Math.round(this.height * this.dpr);
        // CSS display dimensions
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
      }

      const worldW = window.diwaliWorld ? window.diwaliWorld.width : 1780;

      // Responsive Camera Zoom:
      // Priority 1 Requirement 3: Make the playable world occupy approximately 85–95%
      // of the available game viewport width on desktop, while preserving aspect ratio.
      if (this.width >= 1200) {
        // Large desktop (1920, 1440, etc): world width occupies exactly 90% of viewport width
        this.camera.zoom = (this.width * 0.90) / worldW;
      } else if (this.width >= 768) {
        // Laptop & Tablet (768 to 1199): occupies 85-92% of viewport width with 0.70 readability floor
        this.camera.zoom = Math.max(0.70, (this.width * 0.90) / worldW);
      } else {
        // Mobile (< 768): intimate character scale, use camera follow to explore
        this.camera.zoom = 1.25;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
  }

  setupInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      this.keys[e.key] = true;

      // [E] or Space for Interaction
      if (e.code === 'KeyE' || e.code === 'Space') {
        if (!e.repeat) this.handleInteraction();
      }

      // [F] or Enter for using equipped item
      if (e.code === 'KeyF' || e.code === 'Enter') {
        if (!e.repeat) this.handleUseItem();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.keys[e.key] = false;
    });

    // Mobile Virtual Joystick Setup
    const zone = document.getElementById('joystickZone');
    const stick = document.getElementById('joystickStick');
    let touchId = null;
    let startX = 0;
    let startY = 0;
    const maxRadius = 42;

    if (zone && stick) {
      zone.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches[0];
        touchId = touch.identifier;
        const rect = zone.getBoundingClientRect();
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      }, { passive: false });

      zone.addEventListener('touchmove', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === touchId) {
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;
            const dist = Math.hypot(dx, dy);
            const clampedDist = Math.min(dist, maxRadius);
            const angle = Math.atan2(dy, dx);

            const sx = Math.cos(angle) * clampedDist;
            const sy = Math.sin(angle) * clampedDist;
            stick.style.transform = `translate(${sx}px, ${sy}px)`;

            this.joystickVector.x = sx / maxRadius;
            this.joystickVector.y = sy / maxRadius;
          }
        }
      }, { passive: false });

      const resetStick = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            touchId = null;
            stick.style.transform = 'translate(0px, 0px)';
            this.joystickVector.x = 0;
            this.joystickVector.y = 0;
          }
        }
      };

      zone.addEventListener('touchend', resetStick);
      zone.addEventListener('touchcancel', resetStick);
    }

    // Mobile Action Buttons
    const mobileInteractBtn = document.getElementById('mobileInteractBtn');
    if (mobileInteractBtn) {
      mobileInteractBtn.addEventListener('click', () => this.handleInteraction());
    }

    const mobileUseItemBtn = document.getElementById('mobileUseItemBtn');
    if (mobileUseItemBtn) {
      mobileUseItemBtn.addEventListener('click', () => this.handleUseItem());
    }

    const mobileSprintBtn = document.getElementById('mobileSprintBtn');
    if (mobileSprintBtn) {
      mobileSprintBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        window.mobileSprintActive = true;
        mobileSprintBtn.style.background = '#ea580c';
      });
      mobileSprintBtn.addEventListener('touchend', () => {
        window.mobileSprintActive = false;
        mobileSprintBtn.style.background = '';
      });
    }
  }

  handleInteraction() {
    if (!this.currentInteractive) return;
    const target = this.currentInteractive;

    if (target.type === 'house') {
      if (window.colonyDecoration) {
        window.colonyDecoration.openDecoratorModal(target.data);
      }
    } else if (target.type === 'shop') {
      if (window.diwaliShop) {
        window.diwaliShop.openShopModal();
      }
    } else if (target.type === 'temple') {
      if (window.diwaliMiniGames) {
        window.diwaliMiniGames.openGamesModal();
        window.diwaliMiniGames.launchTriviaQuiz();
      }
    } else if (target.type === 'minigame_rangoli') {
      if (window.diwaliMiniGames) {
        window.diwaliMiniGames.openGamesModal();
        window.diwaliMiniGames.launchRangoliArtisan();
      }
    } else if (target.type === 'chowk_switch') {
      // Check if all mandatory mission objectives are satisfied first
      if (window.diwaliMission && !window.diwaliMission.canTriggerMahaDeepotsav()) {
        window.diwaliMission.showMissionIncompleteNotice();
        return;
      }
      if (window.colonyDecoration) {
        window.colonyDecoration.triggerMahaDeepotsav('You');
      }
    }
  }

  handleUseItem() {
    if (window.diwaliShop && window.diwaliPlayer) {
      window.diwaliShop.useCurrentItem(window.diwaliPlayer.x, window.diwaliPlayer.y);
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    this.fps = Math.round(1 / Math.max(0.001, delta));

    this.update();
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    // 1. Update Player
    if (window.diwaliPlayer && window.diwaliWorld) {
      window.diwaliPlayer.update(
        this.keys,
        this.joystickVector,
        window.diwaliWorld.colliders,
        window.diwaliWorld
      );

      // Camera follow with responsive boundary clamping
      this.camera.targetX = window.diwaliPlayer.x;
      this.camera.targetY = window.diwaliPlayer.y;

      const viewW = this.width / this.camera.zoom;
      const viewH = this.height / this.camera.zoom;
      const halfViewW = viewW / 2;
      const halfViewH = viewH / 2;

      const worldW = window.diwaliWorld.width;
      const worldH = window.diwaliWorld.height;

      // Clamp camera so the viewport never shows empty void outside mohalla boundaries
      // Horizontal clamping: when viewW >= worldW (desktop 90% fill), center world horizontally (5% left, 5% right)
      if (viewW >= worldW) {
        this.camera.targetX = worldW / 2;
      } else {
        this.camera.targetX = Math.max(halfViewW, Math.min(worldW - halfViewW, this.camera.targetX));
      }

      // Vertical clamping: if view fits height, center it; otherwise follow player clamped to walls
      if (viewH >= worldH) {
        this.camera.targetY = worldH / 2;
      } else {
        this.camera.targetY = Math.max(halfViewH, Math.min(worldH - halfViewH, this.camera.targetY));
      }

      this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.lerp;
      this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.lerp;

      // Track mission exploration and coin pickups
      if (window.diwaliMission) {
        window.diwaliMission.checkExploration(window.diwaliPlayer.x, window.diwaliPlayer.y);
        window.diwaliMission.checkCoinPickups(window.diwaliPlayer.x, window.diwaliPlayer.y, window.diwaliPlayer.radius);
      }

      // Broadcast position to multiplayer peers
      if (window.diwaliMultiplayer) {
        window.diwaliMultiplayer.sendMove(
          window.diwaliPlayer.x,
          window.diwaliPlayer.y,
          window.diwaliPlayer.facing,
          window.diwaliPlayer.isMoving,
          window.diwaliPlayer.sparklerActive
        );
      }

      // Check nearby interactive targets
      this.currentInteractive = window.diwaliWorld.getInteractiveTarget(
        window.diwaliPlayer.x,
        window.diwaliPlayer.y
      );
      this.updateInteractionPrompt();
    }

    // 2. Update Fireworks simulation
    if (window.diwaliFireworks) {
      window.diwaliFireworks.update();
    }

    // 3. Update Multiplayer remote players
    if (window.diwaliMultiplayer) {
      window.diwaliMultiplayer.update();
    }
  }

  updateInteractionPrompt() {
    const prompt = document.getElementById('interactionPrompt');
    const msg = document.getElementById('promptMessage');
    const keyBadge = document.getElementById('promptKeyBadge');

    if (this.currentInteractive) {
      if (msg) msg.textContent = this.currentInteractive.prompt;
      if (keyBadge) keyBadge.textContent = 'E';
      if (prompt) prompt.classList.remove('hidden');
    } else {
      if (prompt) prompt.classList.add('hidden');
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply High-DPI & Camera Transform
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    const halfW = this.width / 2;
    const halfH = this.height / 2;
    ctx.translate(halfW, halfH);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Render World Ground, Roads, Piazza & Boundary Wall
    if (window.diwaliWorld) {
      window.diwaliWorld.renderGroundAndRoads(ctx, this.camera);
    }

    // 2. Render World Buildings, Havelis, Temple, Bazaar Stalls & Trees
    if (window.diwaliWorld) {
      window.diwaliWorld.renderStructures(ctx);
    }

    // 2b. Render Mission Coin Collectibles in the world
    if (window.diwaliMission) {
      window.diwaliMission.renderCoinCollectibles(ctx);
    }

    // 3. Render Remote Multiplayer Friends
    if (window.diwaliMultiplayer) {
      window.diwaliMultiplayer.render(ctx);
    }

    // 4. Render Local Player Character
    if (window.diwaliPlayer) {
      window.diwaliPlayer.render(ctx);
    }

    // 5. Render Fireworks & Particle Effects
    if (window.diwaliFireworks) {
      window.diwaliFireworks.render(ctx);
    }

    // 6. Ambient Night Lighting Composite Pass
    this.renderNightAtmosphere(ctx);

    ctx.restore();

    // 7. Render Top-Right Minimap
    this.renderMinimap();

    // 8. FPS Counter
    if (this.showFps) {
      ctx.save();
      ctx.scale(this.dpr, this.dpr);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`FPS: ${this.fps}`, 16, this.height - 20);
      ctx.restore();
    }
  }

  renderNightAtmosphere(ctx) {
    ctx.save();
    const time = Date.now() * 0.0015;

    // Twinkling multi-color starlight across the sky
    for (let s of this.stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 90%, 75%, ${s.alpha + Math.sin(time * 2 + s.x) * 0.25})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `hsla(${s.hue}, 90%, 65%, 0.8)`;
      ctx.fill();
    }

    // Radiant Golden Full Moon (Sharad Purnima / Kartik Amavasya glow)
    ctx.save();
    const moonX = 1520;
    const moonY = 90;
    const moonRadius = 36;

    // Deep volumetric moon aura
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 160);
    moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    moonGlow.addColorStop(0.4, 'rgba(245, 158, 11, 0.15)');
    moonGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 160, 0, Math.PI * 2);
    ctx.fill();

    // Moon disc
    ctx.shadowBlur = 35;
    ctx.shadowColor = '#fef08a';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fffbeb';
    ctx.fill();

    // Subtle moon crater texture
    ctx.fillStyle = 'rgba(226, 232, 240, 0.25)';
    ctx.beginPath();
    ctx.arc(moonX - 8, moonY - 6, 8, 0, Math.PI * 2);
    ctx.arc(moonX + 10, moonY + 8, 10, 0, Math.PI * 2);
    ctx.arc(moonX - 4, moonY + 12, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  renderMinimap() {
    if (!this.miniCtx || !window.diwaliWorld || !window.diwaliPlayer) return;
    const mCtx = this.miniCtx;
    const mW = this.miniCanvas.width;
    const mH = this.miniCanvas.height;
    const scaleX = mW / window.diwaliWorld.width;
    const scaleY = mH / window.diwaliWorld.height;

    // Circular Clip for nautical / celestial compass look
    mCtx.save();
    mCtx.clearRect(0, 0, mW, mH);
    mCtx.beginPath();
    mCtx.arc(mW / 2, mH / 2, mW / 2 - 2, 0, Math.PI * 2);
    mCtx.clip();

    // Night ground
    mCtx.fillStyle = '#0b0a1a';
    mCtx.fillRect(0, 0, mW, mH);

    // Roads
    mCtx.fillStyle = '#221c38';
    mCtx.fillRect(0, 390 * scaleY, mW, 120 * scaleY);
    mCtx.fillRect(0, 680 * scaleY, mW, 120 * scaleY);
    mCtx.fillRect(650 * scaleX, 0, 90 * scaleX, mH);

    // Houses
    mCtx.fillStyle = '#f59e0b';
    window.diwaliWorld.houses.forEach(h => {
      mCtx.fillRect(h.x * scaleX, h.y * scaleY, h.width * scaleX, h.height * scaleY);
    });

    // Temple
    mCtx.fillStyle = '#e11d48';
    const tm = window.diwaliWorld.temple;
    mCtx.fillRect(tm.x * scaleX, tm.y * scaleY, tm.width * scaleX, tm.height * scaleY);

    // Stalls
    mCtx.fillStyle = '#10b981';
    window.diwaliWorld.stalls.forEach(s => {
      mCtx.fillRect(s.x * scaleX, s.y * scaleY, s.width * scaleX, s.height * scaleY);
    });

    // Remote Players
    if (window.diwaliMultiplayer) {
      mCtx.fillStyle = '#38bdf8';
      window.diwaliMultiplayer.remotePlayers.forEach(p => {
        mCtx.beginPath();
        mCtx.arc(p.currentX * scaleX, p.currentY * scaleY, 3, 0, Math.PI * 2);
        mCtx.fill();
      });
    }

    // Local Player (Blinking Gold Dot with direction cone)
    mCtx.fillStyle = '#ffffff';
    mCtx.shadowBlur = 8;
    mCtx.shadowColor = '#fbbf24';
    mCtx.beginPath();
    mCtx.arc(window.diwaliPlayer.x * scaleX, window.diwaliPlayer.y * scaleY, 4.5, 0, Math.PI * 2);
    mCtx.fill();

    mCtx.strokeStyle = '#f59e0b';
    mCtx.lineWidth = 1.5;
    mCtx.stroke();

    mCtx.restore();
  }
}

// Global Engine instance
window.diwaliEngine = new DiwaliEngine();
