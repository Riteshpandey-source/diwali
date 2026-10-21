// ===================================================================
// DIWALI 3D ENGINE - MASTER THREE.JS / WEBGL RENDERING SYSTEM
// Perspective camera, ACESFilmic tone mapping, shadow maps, night depth,
// responsive full-viewport rendering, input handling, and 60 FPS game loop.
// ===================================================================

class DiwaliEngine3D {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.miniCanvas = document.getElementById('miniMapCanvas');
    this.miniCtx = this.miniCanvas ? this.miniCanvas.getContext('2d') : null;

    this.isRunning = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.25); // Clamped DPR for high fillrate performance
    this.minimapBgCanvas = null;
    this.minimapLastRender = 0;

    // Three.js Core Systems
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Inputs
    this.keys = {};
    this.joystickVector = { x: 0, y: 0 };
    this.currentInteractive = null;

    // Timing & FPS
    this.clock = new THREE.Clock();
    this.fps = 60;
    this.showFps = false;

    // Subsystems
    this.world3D = null;
    this.player3D = null;
    this.fireworks3D = null;
    this.multiplayer3D = null;

    // 3D Mission Coins in the world
    this.missionCoinMeshes = [];
  }

  init() {
    if (!this.canvas || typeof THREE === 'undefined') {
      console.error('[Engine3D] Canvas or Three.js library not found!');
      return;
    }

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111c2e); // Rich midnight navy starlight sky
    this.scene.fog = new THREE.FogExp2(0x111c2e, 0.0025); // Subtle atmospheric night depth

    // 2. Perspective Camera (55 deg FOV for cinematic third-person view)
    const aspect = (this.width && this.height) ? (this.width / this.height) : (16 / 9);
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.5, 1000);

    // 3. WebGL Renderer with clean context acquisition & error recovery
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
      });
    } catch (e) {
      console.warn('[Engine3D] Canvas WebGL context failed. Replacing canvas element with fresh clone...', e);
      const oldCanvas = this.canvas;
      const newCanvas = oldCanvas.cloneNode(false);
      if (oldCanvas.parentNode) {
        oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
      }
      this.canvas = newCanvas;
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
      });
    }

    this.renderer.setSize(this.width, this.height, false);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.setClearColor(0x111c2e, 1.0);

    // Ensure canvas CSS fills viewport completely
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';

    // 4. Night Atmosphere, Moon & Celestial Sky
    this.setupAtmosphere();

    // 5. Build 3D Colony World
    const worldData = window.diwaliWorld || new DiwaliWorld();
    this.world3D = new DiwaliWorld3D(this.scene);
    this.world3D.buildColony(worldData);
    window.diwaliWorld3D = this.world3D;

    // 6. Build 3D Player Character
    let startX = window.diwaliPlayer ? window.diwaliPlayer.x : 650;
    let startY = window.diwaliPlayer ? window.diwaliPlayer.y : 680;
    let initialYaw = 0;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const spawn = urlParams.get('spawn');
      if (spawn === 'bazaar') {
        startX = 1410;
        startY = 822; // In front of Shree Ganesh Diwali Bazaar counter facing North
        initialYaw = 0;
      } else if (spawn === 'rangoli') {
        startX = 1405;
        startY = 1085; // In front of Rangoli & Utsav Kendra stall facing North
        initialYaw = 0;
      } else if (spawn === 'temple') {
        startX = 650;
        startY = 240;
        initialYaw = 0;
      }
    } catch (e) {}

    this.player3D = new DiwaliPlayer3D(this.scene, this.camera, startX, startY);
    if (initialYaw !== 0) this.player3D.cameraYaw = initialYaw;
    window.diwaliPlayer3D = this.player3D;

    // 7. Build 3D Fireworks Simulation
    this.fireworks3D = new DiwaliFireworks3D(this.scene);
    window.diwaliFireworks3D = this.fireworks3D;

    // 8. Build 3D Multiplayer Sync
    this.multiplayer3D = new DiwaliMultiplayer3D(this.scene);
    window.diwaliMultiplayer3D = this.multiplayer3D;

    // 9. Build 3D Living Colony NPC Population
    if (typeof DiwaliNPCManager3D !== 'undefined') {
      this.npcManager3D = new DiwaliNPCManager3D(this.scene, this.world3D, this.fireworks3D);
      window.diwaliNPCManager3D = this.npcManager3D;
    }

    // 10. Build 3D Mission Coin Pickups
    this.setupMissionCoins();

    // 10. Wire compatibility shims
    this.setupCompatibilityShims();

    // 11. Setup Resize & Inputs
    this.setupResize();
    this.setupInputs();

    console.log('🌟 [Engine3D] Three.js WebGL 3D Diwali Engine successfully initialized!');
    console.log('🎮 [Engine3D] Scene Children Count:', this.scene.children.length);
    console.log('🎮 [Engine3D] Camera Initial Pos:', this.camera.position.x, this.camera.position.y, this.camera.position.z);
    console.log('🎮 [Engine3D] Canvas Buffer Dimensions:', this.canvas.width, 'x', this.canvas.height);
  }

  setupAtmosphere() {
    // 1. Ambient Moonlit Light (Soft cool moonlit ambient fill)
    const ambientLight = new THREE.AmbientLight(0x64748b, 1.35);
    this.scene.add(ambientLight);

    // 2. Directional Moonlight with Soft Shadows
    const moonDir = new THREE.DirectionalLight(0xfffaed, 1.85);
    moonDir.position.set(65, 85, -55);
    moonDir.castShadow = true;
    moonDir.shadow.mapSize.width = 1024; // Optimized 1024x1024 for smooth framerate
    moonDir.shadow.mapSize.height = 1024;
    moonDir.shadow.camera.near = 10;
    moonDir.shadow.camera.far = 240;
    const d = 110;
    moonDir.shadow.camera.left = -d;
    moonDir.shadow.camera.right = d;
    moonDir.shadow.camera.top = d;
    moonDir.shadow.camera.bottom = -d;
    moonDir.shadow.bias = -0.0004;
    this.scene.add(moonDir);

    // 3. Radiant Full Moon Mesh & Volumetric Aura
    const moonGroup = new THREE.Group();
    moonGroup.position.set(90, 80, -95);

    // Moon Disc
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(6.5, 24, 24), moonMat);
    moonGroup.add(moonMesh);

    // Moon Glow Halo
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = 128;
    haloCanvas.height = 128;
    const hctx = haloCanvas.getContext('2d');
    const hgrad = hctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    hgrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
    hgrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.35)');
    hgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    hctx.fillStyle = hgrad;
    hctx.fillRect(0, 0, 128, 128);

    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const haloSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      blending: THREE.AdditiveBlending
    }));
    haloSprite.scale.set(38, 38, 1);
    moonGroup.add(haloSprite);

    this.scene.add(moonGroup);

    // 4. Starfield Dome (Twinkling Starlight)
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 260;

      // Restrict stars to upper hemisphere
      const py = Math.abs(r * Math.cos(phi)) + 15;
      const px = r * Math.sin(phi) * Math.sin(theta);
      const pz = r * Math.sin(phi) * Math.cos(theta);

      starPositions[i * 3] = px;
      starPositions[i * 3 + 1] = py;
      starPositions[i * 3 + 2] = pz;

      // Starlight palette: warm golden, pearl white, or sapphire
      const isGold = Math.random() > 0.4;
      starColors[i * 3] = 1.0;
      starColors[i * 3 + 1] = isGold ? 0.9 : 0.95;
      starColors[i * 3 + 2] = isGold ? 0.6 : 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.starsMesh = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starsMesh);

    // 5. Soft Atmospheric Night Clouds
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 256;
    cloudCanvas.height = 256;
    const cctx = cloudCanvas.getContext('2d');
    const cgrad = cctx.createRadialGradient(128, 128, 20, 128, 128, 128);
    cgrad.addColorStop(0, 'rgba(45, 62, 95, 0.45)');
    cgrad.addColorStop(0.5, 'rgba(28, 42, 70, 0.28)');
    cgrad.addColorStop(0.8, 'rgba(15, 23, 42, 0.12)');
    cgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    cctx.fillStyle = cgrad;
    cctx.fillRect(0, 0, 256, 256);

    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    const cloudMat = new THREE.SpriteMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const cloudGroup = new THREE.Group();
    const cloudCoords = [
      { x: 30, y: 55, z: -75, sx: 60, sy: 22 },
      { x: 80, y: 64, z: -85, sx: 70, sy: 26 },
      { x: 110, y: 72, z: -98, sx: 50, sy: 20 },
      { x: 50, y: 68, z: -105, sx: 75, sy: 28 },
      { x: -5, y: 50, z: -65, sx: 65, sy: 24 },
      { x: 92, y: 54, z: -60, sx: 55, sy: 20 }
    ];

    cloudCoords.forEach(c => {
      const sprite = new THREE.Sprite(cloudMat);
      sprite.position.set(c.x, c.y, c.z);
      sprite.scale.set(c.sx, c.sy, 1);
      cloudGroup.add(sprite);
    });
    this.scene.add(cloudGroup);
  }

  setupMissionCoins() {
    if (!window.diwaliMission || !window.diwaliMission.coinPickups) return;

    const coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    coinGeo.rotateZ(Math.PI / 2);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.65,
      metalness: 0.85,
      roughness: 0.2
    });

    window.diwaliMission.coinPickups.forEach(cp => {
      const pos = this.world3D.to3D(cp.x, cp.y, 1.2);
      const group = new THREE.Group();
      group.position.set(pos.x, pos.y, pos.z);

      const coinMesh = new THREE.Mesh(coinGeo, coinMat);
      group.add(coinMesh);

      this.scene.add(group);
      this.missionCoinMeshes.push({ id: cp.id, group, mesh: coinMesh });
    });
  }

  setupCompatibilityShims() {
    // 1. Shim window.diwaliPlayer properties so existing 2D-based systems read 3D player coords
    if (this.player3D) {
      Object.defineProperty(window.diwaliPlayer, 'x', {
        get: () => this.player3D.x2d,
        set: (v) => { this.player3D.set2DPosition(v, this.player3D.y2d); }
      });
      Object.defineProperty(window.diwaliPlayer, 'y', {
        get: () => this.player3D.y2d,
        set: (v) => { this.player3D.set2DPosition(this.player3D.x2d, v); }
      });
      Object.defineProperty(window.diwaliPlayer, 'facing', {
        get: () => {
          const r = this.player3D.rotation;
          if (r > -Math.PI / 4 && r <= Math.PI / 4) return 'down';
          if (r > Math.PI / 4 && r <= 3 * Math.PI / 4) return 'right';
          if (r < -Math.PI / 4 && r >= -3 * Math.PI / 4) return 'left';
          return 'up';
        }
      });
      Object.defineProperty(window.diwaliPlayer, 'isMoving', {
        get: () => this.player3D.isMoving
      });
      Object.defineProperty(window.diwaliPlayer, 'sparklerActive', {
        get: () => this.player3D.sparklerActive,
        set: (v) => { this.player3D.sparklerActive = !!v; }
      });

      // Character customization shim
      window.diwaliPlayer.updateOutfit = (kColor, tColor) => {
        const kHex = parseInt(kColor.replace('#', '0x'));
        const tHex = parseInt(tColor.replace('#', '0x'));
        this.player3D.updateOutfit(kHex, tHex);
      };

      // Emote shim
      window.diwaliPlayer.showEmote = (text, emoji) => {
        this.player3D.showEmote(text, emoji);
      };
    }

    // 2. Shim window.diwaliFireworks to invoke 3D fireworks simulation
    if (this.fireworks3D && window.diwaliFireworks) {
      window.diwaliFireworks.placeAnar = (x, y, isLocal = true) => this.fireworks3D.placeAnar(x, y, isLocal);
      window.diwaliFireworks.launchAnarFountain = (x, y, color = null, isLocal = true) => this.fireworks3D.launchAnarFountain(x, y, color, isLocal);
      window.diwaliFireworks.placeChakri = (x, y, isLocal = true) => this.fireworks3D.placeChakri(x, y, isLocal);
      window.diwaliFireworks.launchRocket = (x, y, alt, _, color, isLocal = true) => this.fireworks3D.launchRocket(x, y, alt, color, isLocal);
      window.diwaliFireworks.launchLantern = (x, y, isLocal = true) => this.fireworks3D.launchLantern(x, y, isLocal);
      window.diwaliFireworks.placeDiya = (x, y, isLocal = true) => this.fireworks3D.placeDiya(x, y, isLocal);
      window.diwaliFireworks.startSkyFireworksShow = (d) => this.fireworks3D.startSkyFireworksShow(d);
      window.diwaliFireworks.setReducedMotion = (rm) => {
        this.fireworks3D.setReducedMotion(rm);
        if (this.player3D) this.player3D.setReducedMotion(rm);
      };
    }

    // 3. Shim Multiplayer client message handling for 3D avatars
    if (window.diwaliMultiplayer && this.multiplayer3D) {
      const origHandleMsg = window.diwaliMultiplayer.handleServerMessage.bind(window.diwaliMultiplayer);
      window.diwaliMultiplayer.handleServerMessage = (msg) => {
        origHandleMsg(msg);
        switch (msg.type) {
          case 'welcome':
            (msg.players || []).forEach(p => this.multiplayer3D.addPlayer(p));
            break;
          case 'player_join':
            this.multiplayer3D.addPlayer(msg.player);
            break;
          case 'player_move':
            this.multiplayer3D.updatePlayerPosition(msg.id, msg.x, msg.y, msg.facing, msg.isMoving, msg.sparklerActive);
            break;
          case 'player_leave':
            this.multiplayer3D.removePlayer(msg.id);
            break;
          case 'player_emote':
            if (msg.id !== window.diwaliMultiplayer.myId) {
              this.multiplayer3D.showEmote(msg.id, msg.emoteText, msg.emoji);
            }
            break;
        }
      };
    }

    // 4. Shim House Decorator lighting updates
    if (window.colonyDecoration && this.world3D) {
      const origSave = window.colonyDecoration.saveDecorations.bind(window.colonyDecoration);
      window.colonyDecoration.saveDecorations = () => {
        origSave();
        if (window.diwaliWorld) {
          window.diwaliWorld.houses.forEach(h => {
            this.world3D.updateHouseLighting(h.id, h.lights.on, h.lights.style);
          });
        }
      };
    }
  }

  setupResize() {
    const handleResize = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      this.minimapBgCanvas = null; // Rebuild cached minimap on window resize

      if (this.camera && this.renderer) {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height, false);
        this.renderer.setPixelRatio(this.dpr);
      }
    };

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
      if (e.key) {
        this.keys[e.key.toLowerCase()] = false;
        this.keys[e.key.toUpperCase()] = false;
      }
    });

    window.addEventListener('blur', () => {
      this.keys = {};
      if (this.joystickVector) {
        this.joystickVector.x = 0;
        this.joystickVector.y = 0;
      }
    });

    // Touch Joystick Hook
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

    // Mobile action buttons
    const mobileInteractBtn = document.getElementById('mobileInteractBtn');
    if (mobileInteractBtn) {
      mobileInteractBtn.addEventListener('click', () => this.handleInteraction());
    }

    const mobileUseItemBtn = document.getElementById('mobileUseItemBtn');
    if (mobileUseItemBtn) {
      mobileUseItemBtn.addEventListener('click', () => this.handleUseItem());
    }

    // Mouse drag camera orbit controls
    let isDraggingCamera = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    this.canvas.addEventListener('mousedown', (e) => {
      isDraggingCamera = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDraggingCamera && this.player3D) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        this.player3D.cameraYaw -= deltaX * 0.005;
        this.player3D.cameraPitch = Math.max(0.12, Math.min(1.25, this.player3D.cameraPitch + deltaY * 0.004));
      }
    });

    window.addEventListener('mouseup', () => {
      isDraggingCamera = false;
    });

    // Mouse wheel camera zoom
    this.canvas.addEventListener('wheel', (e) => {
      if (this.player3D) {
        this.player3D.cameraDistance = Math.max(7.0, Math.min(32.0, this.player3D.cameraDistance + e.deltaY * 0.015));
      }
    }, { passive: true });

    // Touch swipe camera orbit (on main canvas)
    let cameraTouchId = null;
    let lastTouchX = 0;
    let lastTouchY = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (cameraTouchId === null) {
          cameraTouchId = t.identifier;
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === cameraTouchId && this.player3D) {
          const deltaX = t.clientX - lastTouchX;
          const deltaY = t.clientY - lastTouchY;
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;

          this.player3D.cameraYaw -= deltaX * 0.006;
          this.player3D.cameraPitch = Math.max(0.12, Math.min(1.25, this.player3D.cameraPitch + deltaY * 0.005));
        }
      }
    }, { passive: true });

    const resetCameraTouch = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === cameraTouchId) {
          cameraTouchId = null;
        }
      }
    };
    this.canvas.addEventListener('touchend', resetCameraTouch, { passive: true });
    this.canvas.addEventListener('touchcancel', resetCameraTouch, { passive: true });
  }

  handleInteraction() {
    if (!this.currentInteractive) return;
    const target = this.currentInteractive;

    if (target.type === 'house') {
      if (window.colonyDecoration) {
        window.colonyDecoration.openDecoratorModal(target.data);
      }
    } else if (target.type === 'diwali_education') {
      if (this.npcManager3D) {
        this.npcManager3D.openEducationModal();
      }
    } else if (target.type === 'shop') {
      if (window.diwaliShop) {
        window.diwaliShop.openShopModal();
      }
    } else if (target.type === 'temple') {
      if (this.npcManager3D) {
        this.npcManager3D.triggerTempleAarti();
      }
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
    if (window.diwaliShop && this.player3D) {
      window.diwaliShop.useCurrentItem(this.player3D.x2d, this.player3D.y2d);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.init();
    this.clock.start();
    requestAnimationFrame((t) => this.loop(t));
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();
    this.fps = Math.round(1 / Math.max(0.001, delta));

    this.update(delta, elapsedTime);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(delta, elapsedTime) {
    // 1. Update 3D Player Character & Camera Follow
    if (this.player3D && this.world3D) {
      this.player3D.update(this.keys, this.joystickVector, this.world3D, delta);

      const px = this.player3D.x2d;
      const py = this.player3D.y2d;

      // Check Mission Exploration Zones
      if (window.diwaliMission) {
        window.diwaliMission.checkExploration(px, py);
        window.diwaliMission.checkCoinPickups(px, py, 25);
      }

      // Check Nearby Interactive Target
      this.currentInteractive = this.world3D.getInteractiveTarget(px, py);
      this.updateInteractionPrompt();

      // Broadcast Movement to Multiplayer Room
      if (window.diwaliMultiplayer && window.diwaliMultiplayer.isConnected) {
        window.diwaliMultiplayer.sendMove(
          px,
          py,
          this.player3D.rotation,
          this.player3D.isMoving,
          this.player3D.sparklerActive
        );
      }
    }

    // 2. Update 3D World (Diya flickers, lantern sways)
    if (this.world3D) {
      this.world3D.update(elapsedTime);
    }

    // 3. Update 3D Fireworks Simulation
    if (this.fireworks3D) {
      this.fireworks3D.update(delta);
    }

    // 4. Update 3D Multiplayer Remote Friends
    if (this.multiplayer3D) {
      this.multiplayer3D.update(delta);
    }

    // 5. Update Mission Coins (Spinning & Floating animation)
    for (let c of this.missionCoinMeshes) {
      c.mesh.rotation.y += 2.4 * delta;
      c.group.position.y = 1.2 + Math.sin(elapsedTime * 3.5 + c.mesh.id) * 0.2;

      // Hide coin if already collected in mission
      if (window.diwaliMission && window.diwaliMission.state.coinsCollected.includes(c.id)) {
        c.group.visible = false;
      } else {
        c.group.visible = true;
      }
    }

    // 6. Update 3D Living Colony NPCs
    if (this.npcManager3D) {
      this.npcManager3D.update(delta, elapsedTime, this.player3D);
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
    if (!this.renderer || !this.scene || !this.camera) return;

    // Render 3D Scene
    this.renderer.render(this.scene, this.camera);

    // Render Ornate Minimap on 2D Overlay Canvas
    this.renderMinimap();
  }

  // Trigger overhead dialogue speech bubble for NPCs
  triggerNpcSpeech(npc, text, duration = 4.0) {
    const bubblesLayer = document.getElementById('emoteBubblesLayer');
    if (!bubblesLayer || !this.camera) return;

    const headPos = new THREE.Vector3(npc.x, 2.7 * (npc.charScale || 1.0), npc.z);
    headPos.project(this.camera);

    if (headPos.z > 1.0) return; // Behind camera

    const screenX = (headPos.x * 0.5 + 0.5) * window.innerWidth;
    const screenY = (-(headPos.y * 0.5) + 0.5) * window.innerHeight;

    const bubble = document.createElement('div');
    bubble.className = 'player-emote-bubble';
    bubble.style.position = 'absolute';
    bubble.style.left = `${screenX}px`;
    bubble.style.top = `${screenY}px`;
    bubble.style.background = 'rgba(15, 23, 42, 0.92)';
    bubble.style.border = '1.5px solid #f59e0b';
    bubble.style.borderRadius = '20px';
    bubble.style.padding = '6px 14px';
    bubble.style.color = '#fef08a';
    bubble.style.fontSize = '13px';
    bubble.style.fontWeight = '700';
    bubble.style.zIndex = '40';
    bubble.style.boxShadow = '0 6px 20px rgba(0,0,0,0.7), 0 0 15px rgba(245,158,11,0.35)';
    bubble.innerHTML = text;

    bubblesLayer.appendChild(bubble);

    setTimeout(() => {
      if (bubble.parentNode) bubble.parentNode.removeChild(bubble);
    }, duration * 1000);
  }

  showToastNotice(msg) {
    const toast = document.getElementById('audioNotice');
    if (toast) {
      toast.innerHTML = `<span>${msg}</span>`;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 4500);
    }
  }

  buildMinimapBackground(mW, mH) {
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = mW;
    bgCanvas.height = mH;
    const bgCtx = bgCanvas.getContext('2d');

    const scaleX = mW / 1780;
    const scaleY = mH / 1220;

    // Circular clip
    bgCtx.beginPath();
    bgCtx.arc(mW / 2, mH / 2, mW / 2 - 2, 0, Math.PI * 2);
    bgCtx.clip();

    // Night terrain
    bgCtx.fillStyle = '#0b0a1a';
    bgCtx.fillRect(0, 0, mW, mH);

    // Roads
    bgCtx.fillStyle = '#221c38';
    bgCtx.fillRect(0, 390 * scaleY, mW, 110 * scaleY);
    bgCtx.fillRect(0, 690 * scaleY, mW, 110 * scaleY);
    bgCtx.fillRect(600 * scaleX, 0, 100 * scaleX, mH);
    bgCtx.fillRect(1190 * scaleX, 0, 90 * scaleX, mH);

    // Central Chowk
    bgCtx.fillStyle = '#d97706';
    bgCtx.beginPath();
    bgCtx.arc(650 * scaleX, 580 * scaleY, 15, 0, Math.PI * 2);
    bgCtx.fill();

    // Houses, Temple, Stalls
    if (window.diwaliWorld) {
      bgCtx.fillStyle = '#f59e0b';
      window.diwaliWorld.houses.forEach(h => {
        bgCtx.fillRect(h.x * scaleX, h.y * scaleY, h.width * scaleX, h.height * scaleY);
      });

      bgCtx.fillStyle = '#e11d48';
      const tm = window.diwaliWorld.temple;
      bgCtx.fillRect(tm.x * scaleX, tm.y * scaleY, tm.width * scaleX, tm.height * scaleY);

      bgCtx.fillStyle = '#10b981';
      window.diwaliWorld.stalls.forEach(s => {
        bgCtx.fillRect(s.x * scaleX, s.y * scaleY, s.width * scaleX, s.height * scaleY);
      });
    }

    return bgCanvas;
  }

  renderMinimap() {
    if (!this.miniCtx || !this.player3D) return;

    // Throttle minimap redraw to ~12 FPS (every 80ms) to save CPU
    const now = (typeof performance !== 'undefined') ? performance.now() : Date.now();
    if (now - this.minimapLastRender < 80) return;
    this.minimapLastRender = now;

    const mCtx = this.miniCtx;
    const mW = this.miniCanvas.width;
    const mH = this.miniCanvas.height;

    const scaleX = mW / 1780;
    const scaleY = mH / 1220;

    // Build or reuse cached static background
    if (!this.minimapBgCanvas || this.minimapBgCanvas.width !== mW) {
      this.minimapBgCanvas = this.buildMinimapBackground(mW, mH);
    }

    mCtx.save();
    mCtx.clearRect(0, 0, mW, mH);

    // Blit pre-rendered static colony map in 1 blit operation
    mCtx.drawImage(this.minimapBgCanvas, 0, 0);

    // Circular clip for active blips
    mCtx.beginPath();
    mCtx.arc(mW / 2, mH / 2, mW / 2 - 2, 0, Math.PI * 2);
    mCtx.clip();

    // Remote Players
    if (this.multiplayer3D) {
      mCtx.fillStyle = '#38bdf8';
      this.multiplayer3D.avatars.forEach(p => {
        const p2dx = (p.currentX / this.world3D.scale) + this.world3D.centerX;
        const p2dy = (p.currentZ / this.world3D.scale) + this.world3D.centerZ;
        mCtx.beginPath();
        mCtx.arc(p2dx * scaleX, p2dy * scaleY, 3, 0, Math.PI * 2);
        mCtx.fill();
      });
    }

    // Local Player (Blinking Gold Dot)
    const px = this.player3D.x2d;
    const py = this.player3D.y2d;
    mCtx.fillStyle = '#ffffff';
    mCtx.beginPath();
    mCtx.arc(px * scaleX, py * scaleY, 4.5, 0, Math.PI * 2);
    mCtx.fill();

    mCtx.strokeStyle = '#f59e0b';
    mCtx.lineWidth = 1.5;
    mCtx.stroke();

    mCtx.restore();
  }
}

// Global 3D Engine Instance
window.diwaliEngine3D = new DiwaliEngine3D();
window.diwaliEngine = window.diwaliEngine3D; // Seamless swap for greeting and button controllers
