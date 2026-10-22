// ===================================================================
// DIWALI 3D FIREWORKS & FESTIVAL PARTICLE SIMULATION
// High-performance Three.js particle systems for Phuljhadi sparkler,
// Golden Anar fountain, Chakri spinner, Sky Rockets, Kandils & Diyas.
// ===================================================================

class DiwaliFireworks3D {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.activeFountains = [];
    this.activeSpinners = [];
    this.activeRockets = [];
    this.activeLanterns = [];
    this.placedDiyas = [];
    this.isReducedMotion = false;

    // Spatial translation
    this.scale = 0.1;
    this.centerX = 890;
    this.centerZ = 610;

    // Shared Spark Texture
    this.sparkTex = this.createSparkTexture();

    // Reusable Permanent FX PointLight (Permanent in scene graph to prevent WebGL shader recompiles)
    this.fxLight = new THREE.PointLight(0xffb703, 0, 48);
    this.fxLight.position.set(0, -50, 0);
    this.fxLightAge = 0;
    this.fxLightDuration = 0;
    this.fxLightMaxIntensity = 0;
    this.scene.add(this.fxLight);

    // Schedule ambient celebratory fireworks over the eastern temple sky
    this.scheduleAmbientCelebratoryFireworks();
  }

  // Trigger reusable flash without altering scene light count
  triggerFxFlash(x, y, z, hexColor = 0xffb703, intensity = 4.5, duration = 1.0) {
    if (!this.fxLight) return;
    this.fxLight.position.set(x, y, z);
    this.fxLight.color.setHex(hexColor);
    this.fxLight.intensity = intensity;
    this.fxLight.distance = 48;
    this.fxLightAge = 0;
    this.fxLightDuration = duration;
    this.fxLightMaxIntensity = intensity;
  }

  playSafeAudio(methodName, ...args) {
    try {
      if (window.festiveAudio && typeof window.festiveAudio[methodName] === 'function') {
        window.festiveAudio[methodName](...args);
      }
    } catch (err) {
      console.warn(`[DiwaliFireworks3D] Audio error in ${methodName}:`, err);
    }
  }

  createSparkTexture() {
    if (typeof document === 'undefined') {
      return new THREE.Texture();
    }
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 200, 50, 0.9)');
    grad.addColorStop(0.7, 'rgba(245, 120, 10, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  to3D(x2d, y2d, elevation = 0) {
    return {
      x: (x2d - this.centerX) * this.scale,
      y: elevation,
      z: (y2d - this.centerZ) * this.scale
    };
  }

  setReducedMotion(enabled) {
    this.isReducedMotion = enabled;
  }

  // -------------------------------------------------------------
  // 1. ANAR (GOLDEN FOUNTAIN CRACKER)
  // -------------------------------------------------------------
  placeAnar(x, z, isLocal = true) {
    let px, pz;
    // Auto-detect coordinate space (2D vs 3D)
    if (Math.abs(x) > 150 || Math.abs(z) > 150) {
      const p3d = this.to3D(x, z);
      px = p3d.x;
      pz = p3d.z;
    } else {
      px = x;
      pz = z;
    }

    const group = new THREE.Group();
    group.position.set(px, 0, pz);

    // Terracotta Cone Body
    const coneGeo = new THREE.ConeGeometry(0.35, 0.6, 8);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.y = 0.3;
    cone.receiveShadow = true;
    group.add(cone);

    // Glowing Burning Nozzle Tip
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xf59e0b,
      emissiveIntensity: 4.5
    });
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.14, 8), tipMat);
    tip.position.y = 0.62;
    group.add(tip);

    // Dynamic Fountain Glow PointLight
    const anarLight = new THREE.PointLight(0xf59e0b, 3.5, 14.0);
    anarLight.position.set(0, 0.8, 0);
    group.add(anarLight);

    // Shared FX Flash
    this.triggerFxFlash(px, 0.8, pz, 0xffaa00, 3.5, 5.5);

    // Fountain Particle System
    const particleCount = this.isReducedMotion ? 120 : 220;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0.6;
      positions[i * 3 + 2] = 0;

      // Vertical eruption cone
      const speed = 4.2 + Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() * 0.38);

      velocities.push({
        vx: Math.cos(angle) * spread * speed,
        vy: speed,
        vz: Math.sin(angle) * spread * speed,
        life: Math.random() * 0.9 + 0.3,
        maxLife: 1.2
      });

      const colorRoll = Math.random();
      if (colorRoll > 0.7) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.6; // White-hot sparkling tip
      } else if (colorRoll > 0.3) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.75;
        colors[i * 3 + 2] = 0.1; // Radiant golden spark
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 0.05; // Deep saffron amber
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.48,
      map: this.sparkTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pMesh = new THREE.Points(geo, pMat);
    group.add(pMesh);
    this.scene.add(group);

    const fountain = {
      group,
      light: anarLight,
      tipMat,
      geo,
      velocities,
      positions,
      pMat,
      duration: 5.5,
      age: 0
    };

    this.activeFountains.push(fountain);
    this.playSafeAudio('playAnarFountain', 5500);

    // Subtle ground framing for local player's fountain
    if (isLocal !== false && window.diwaliPlayer3D && window.diwaliPlayer3D.cameraController) {
      window.diwaliPlayer3D.cameraController.triggerAnarCinematic(fountain);
    }

    // Multiplayer sync
    if (isLocal && window.diwaliMultiplayer && typeof window.diwaliMultiplayer.broadcastFirework === 'function') {
      window.diwaliMultiplayer.broadcastFirework('anar', px, pz);
    }
  }

  // Compatibility alias for NPC / external caller invocations
  launchAnarFountain(x2d, y2d, color = null, isLocal = false) {
    return this.placeAnar(x2d, y2d, isLocal);
  }

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 2. CHAKRI (GROUND SPINNER)
  // -------------------------------------------------------------
  createChakriTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Rich maroon / green festive background
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(64, 64, 64, 0, Math.PI * 2);
    ctx.fill();

    // Concentric rings
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, Math.PI * 2);
    ctx.stroke();

    // Spiral arms
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    for (let a = 0; a < 4; a++) {
      ctx.beginPath();
      const startAngle = a * (Math.PI / 2);
      for (let r = 8; r < 54; r += 2) {
        const theta = startAngle + r * 0.12;
        const x = 64 + Math.cos(theta) * r;
        const y = 64 + Math.sin(theta) * r;
        if (r === 8) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Golden center hub
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(64, 64, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(64, 64, 6, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  placeChakri(x, z, isLocal = true) {
    let px, pz;
    // Auto-detect coordinate space (2D vs 3D)
    if (Math.abs(x) > 150 || Math.abs(z) > 150) {
      const p3d = this.to3D(x, z);
      px = p3d.x;
      pz = p3d.z;
    } else {
      px = x;
      pz = z;
    }

    const group = new THREE.Group();
    group.position.set(px, 0.04, pz);

    // Terracotta and decorated foil spinning disc
    if (!this.cachedChakriTex) {
      this.cachedChakriTex = this.createChakriTexture();
    }

    const discGeo = new THREE.CylinderGeometry(0.36, 0.38, 0.06, 16);
    const discMatSide = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 });
    const discMatTop = new THREE.MeshStandardMaterial({
      map: this.cachedChakriTex,
      roughness: 0.35,
      metalness: 0.2
    });
    const disc = new THREE.Mesh(discGeo, [discMatSide, discMatTop, discMatSide]);
    disc.receiveShadow = true;
    group.add(disc);

    // Burning glowing center core
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xf59e0b,
      emissiveIntensity: 3.5
    });
    const core = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 8), coreMat);
    core.position.y = 0.06;
    group.add(core);

    // Dynamic ground illumination point light
    const chakriLight = new THREE.PointLight(0xf59e0b, 2.5, 8.0);
    chakriLight.position.set(0, 0.25, 0);
    group.add(chakriLight);

    this.triggerFxFlash(px, 0.3, pz, 0xff7700, 2.8, 4.8);

    // 4-armed Pinwheel Spiral Sparks
    const count = this.isReducedMotion ? 90 : 180;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0.06;
      positions[i * 3 + 2] = 0;

      const arm = i % 4;
      const baseAngle = arm * (Math.PI / 2) + (Math.random() - 0.5) * 0.25;

      velocities.push({
        baseAngle,
        speed: 3.5 + Math.random() * 4.5,
        life: Math.random() * 0.45 + 0.15,
        maxLife: 0.5,
        dist: 0
      });

      // Warm golden to fiery orange sparks
      const colorRoll = Math.random();
      if (colorRoll > 0.75) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.98;
        colors[i * 3 + 2] = 0.65; // Sparkle white-gold
      } else if (colorRoll > 0.35) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.65;
        colors[i * 3 + 2] = 0.1; // Golden amber
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.35;
        colors[i * 3 + 2] = 0.05; // Fiery saffron red
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.42,
      map: this.sparkTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pMesh = new THREE.Points(geo, pMat);
    group.add(pMesh);
    this.scene.add(group);

    this.activeSpinners.push({
      group,
      light: chakriLight,
      disc,
      core,
      coreMat,
      geo,
      pMat,
      velocities,
      positions,
      spinSpeed: 24.0,
      maxSpinSpeed: 42.0,
      duration: 4.8,
      age: 0
    });

    this.playSafeAudio('playChakriSpin', 4800);

    // Multiplayer broadcast
    if (isLocal && window.diwaliMultiplayer && typeof window.diwaliMultiplayer.broadcastFirework === 'function') {
      window.diwaliMultiplayer.broadcastFirework('chakri', px, pz);
    }
  }

  // -------------------------------------------------------------
  // 3. SKY ROCKET (HIGH-ALTITUDE BURSTING PEONY)
  // -------------------------------------------------------------
  launchRocket(x2d, y2d, targetAltitude = null, presetColor = null, isLocal = true) {
    const pos = this.to3D(x2d, y2d);
    const group = new THREE.Group();
    group.position.set(pos.x, 0.2, pos.z);

    // Whistling Rocket Body
    const rGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 6);
    const rMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const rMesh = new THREE.Mesh(rGeo, rMat);
    group.add(rMesh);

    this.scene.add(group);

    const burstHeight = targetAltitude || (22 + Math.random() * 12);
    const rocket = {
      group,
      vy: 18.0 + Math.random() * 4.0,
      burstHeight,
      burstColor: presetColor || this.getRandomFestiveColor(),
      age: 0,
      isLocal: isLocal !== false
    };

    this.activeRockets.push(rocket);
    this.playSafeAudio('playRocketLaunch');

    // Automatically transition to cinematic rocket tracking for local launches
    if (rocket.isLocal && window.diwaliPlayer3D && window.diwaliPlayer3D.cameraController) {
      window.diwaliPlayer3D.cameraController.triggerRocketCinematic(rocket);
    }
  }

  getRandomFestiveColor() {
    const colors = [
      new THREE.Color(0xff0044), // Crimson Peony
      new THREE.Color(0xf59e0b), // Saffron Gold
      new THREE.Color(0x10b981), // Emerald Green
      new THREE.Color(0x38bdf8), // Royal Sapphire
      new THREE.Color(0xc084fc), // Amethyst Violet
      new THREE.Color(0xfffbeb)  // Pure White Pearl
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  explodeRocketBurst(x, y, z, baseColor, rocket = null) {
    const count = this.isReducedMotion ? 100 : 180;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Spherical uniform distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 7.0 + Math.random() * 8.0;

      velocities.push({
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.sin(phi) * Math.sin(theta) * speed,
        vz: Math.cos(phi) * speed,
        drag: 0.94,
        gravity: -4.5,
        life: 1.0,
        decay: 0.45 + Math.random() * 0.3
      });

      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.75,
      map: this.sparkTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pMesh = new THREE.Points(geo, pMat);
    this.scene.add(pMesh);

    // Illuminating Sky Flash Light via Reusable Pool (Zero Shader Recompiles)
    this.triggerFxFlash(x, y, z, baseColor.getHex(), 5.5, 1.2);

    const burst = {
      pMesh,
      geo,
      pMat,
      velocities,
      positions,
      age: 0
    };

    this.particles.push(burst);
    this.playSafeAudio('playExplosion', 'large');

    // Notify cinematic camera to hold on the aerial burst
    if (window.diwaliPlayer3D && window.diwaliPlayer3D.cameraController) {
      window.diwaliPlayer3D.cameraController.onRocketExploded(rocket, x, y, z, baseColor);
    }

    // Notify living colony NPCs to react to fireworks burst
    if (window.diwaliNPCManager3D && typeof window.diwaliNPCManager3D.onFireworksBurst === 'function') {
      window.diwaliNPCManager3D.onFireworksBurst(x, y, z);
    }
  }

  // -------------------------------------------------------------
  // 4. AKASH KANDIL (FLOATING PAPER SKY LANTERN)
  // -------------------------------------------------------------
  launchLantern(x2d, y2d, isLocal = true) {
    const pos = this.to3D(x2d, y2d);
    const group = new THREE.Group();
    group.position.set(pos.x, 0.4, pos.z);

    const scale = 1.35;
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xffa040,
      emissive: 0xff6600,
      emissiveIntensity: 1.8,
      roughness: 0.35,
      side: THREE.DoubleSide
    });

    // Dome crown
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.72 * scale, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.2),
      paperMat
    );
    dome.position.y = 0.52 * scale;
    group.add(dome);

    // Tapered cylinder body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72 * scale, 0.50 * scale, 1.25 * scale, 18, 1, true),
      paperMat
    );
    body.position.y = -0.06 * scale;
    group.add(body);

    // Bamboo rim
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.51 * scale, 0.035 * scale, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -0.68 * scale;
    group.add(rim);

    // Flame core
    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.14 * scale, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xfffbeb })
    );
    flame.scale.set(0.7, 1.8, 0.7);
    flame.position.y = -0.52 * scale;
    group.add(flame);

    this.scene.add(group);

    const lantern = {
      group,
      vy: 1.8 + Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4,
      sway: Math.random() * 10,
      age: 0,
      maxAge: 35
    };

    this.activeLanterns.push(lantern);
    this.playSafeAudio('playDiyaChime');

    // Gentle upward float camera for local player
    if (isLocal !== false && window.diwaliPlayer3D && window.diwaliPlayer3D.cameraController) {
      window.diwaliPlayer3D.cameraController.triggerLanternCinematic(lantern);
    }
  }

  // -------------------------------------------------------------
  // AMBIENT CELEBRATORY FIREWORKS (OVER TEMPLE SKY)
  // -------------------------------------------------------------
  scheduleAmbientCelebratoryFireworks() {
    const launchOne = () => {
      // Coordinates over Shree Mandir eastern sky (2D: 1550..1700, 250..450)
      const x2d = 1600 + (Math.random() - 0.5) * 180;
      const y2d = 350 + (Math.random() - 0.5) * 160;
      this.launchRocket(x2d, y2d, null, null, false);

      const nextDelay = 7500 + Math.random() * 7500;
      this.ambientTimer = setTimeout(launchOne, nextDelay);
    };
    this.ambientTimer = setTimeout(launchOne, 3500);
  }

  // -------------------------------------------------------------
  // 5. CLAY DIYA PLACEMENT
  // -------------------------------------------------------------
  placeDiya(x2d, y2d) {
    // Cap placed diyas pool at 40 to prevent unbounded mesh and material accumulation
    if (this.placedDiyas.length >= 40) {
      const oldest = this.placedDiyas.shift();
      if (oldest && oldest.group) {
        this.scene.remove(oldest.group);
        oldest.group.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        });
      }
    }

    const pos = this.to3D(x2d, y2d);
    const group = new THREE.Group();
    group.position.set(pos.x, 0.05, pos.z);

    const bowl = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.14, 8),
      new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 })
    );
    bowl.rotation.x = Math.PI;
    group.add(bowl);

    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xfff0c2 })
    );
    flame.scale.set(0.6, 1.6, 0.6);
    flame.position.y = 0.15;
    group.add(flame);

    this.scene.add(group);
    this.placedDiyas.push({ group, flame, age: 0 });
    this.playSafeAudio('playDiyaChime');
  }

  // -------------------------------------------------------------
  // 6. GRAND CHOREOGRAPHED SKY FIREWORKS SHOW
  // -------------------------------------------------------------
  startSkyFireworksShow(durationMs = 20000) {
    if (window.diwaliPlayer3D && window.diwaliPlayer3D.cameraController) {
      window.diwaliPlayer3D.cameraController.triggerShowcaseCinematic(durationMs);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - startTime > durationMs) {
        clearInterval(interval);
        return;
      }
      // Launch across random points in the colony (ambient: isLocal = false)
      const rx = 300 + Math.random() * 1180;
      const ry = 250 + Math.random() * 700;
      this.launchRocket(rx, ry, null, null, false);
    }, 450);
  }

  // -------------------------------------------------------------
  // SIMULATION UPDATE LOOP
  // -------------------------------------------------------------
  update(delta = 0.016) {
    // 1. Update Anar Fountains
    for (let i = this.activeFountains.length - 1; i >= 0; i--) {
      const f = this.activeFountains[i];
      f.age += delta;

      if (f.age >= f.duration) {
        this.scene.remove(f.group);
        f.geo.dispose();
        f.pMat.dispose();
        this.activeFountains.splice(i, 1);
        continue;
      }

      if (f.light) {
        f.light.intensity = 2.8 + Math.random() * 2.2;
      }
      if (f.tipMat) {
        f.tipMat.emissiveIntensity = 3.5 + Math.random() * 2.5;
      }

      const posAttr = f.geo.attributes.position;
      const count = f.velocities.length;

      for (let j = 0; j < count; j++) {
        const v = f.velocities[j];
        v.life -= delta;

        if (v.life <= 0) {
          // Re-spawn spark from nozzle
          posAttr.array[j * 3] = 0;
          posAttr.array[j * 3 + 1] = 0.6;
          posAttr.array[j * 3 + 2] = 0;

          const speed = 4.0 + Math.random() * 5.5;
          const angle = Math.random() * Math.PI * 2;
          const spread = Math.random() * 0.35;
          v.vx = Math.cos(angle) * spread * speed;
          v.vy = speed;
          v.vz = Math.sin(angle) * spread * speed;
          v.life = Math.random() * 0.9 + 0.3;
        } else {
          posAttr.array[j * 3] += v.vx * delta;
          posAttr.array[j * 3 + 1] += v.vy * delta;
          posAttr.array[j * 3 + 2] += v.vz * delta;
          v.vy -= 9.8 * delta; // Gravity
        }
      }

      posAttr.needsUpdate = true;
    }

    // 2. Update Chakri Spinners
    for (let i = this.activeSpinners.length - 1; i >= 0; i--) {
      const c = this.activeSpinners[i];
      c.age += delta;

      if (c.age >= c.duration) {
        this.scene.remove(c.group);
        c.geo.dispose();
        if (c.pMat) c.pMat.dispose();
        this.activeSpinners.splice(i, 1);
        continue;
      }

      // Smooth spin acceleration and deceleration
      const progress = c.age / c.duration;
      const speedMult = 1.0 + Math.sin(progress * Math.PI) * 0.8;
      const currentSpeed = (c.spinSpeed || 24.0) * speedMult;
      c.group.rotation.y += currentSpeed * delta;

      // Realistic subtle ground jitter
      c.group.position.x += (Math.random() - 0.5) * 0.006;
      c.group.position.z += (Math.random() - 0.5) * 0.006;

      // Dynamic light and core flicker
      if (c.light) {
        c.light.intensity = 2.2 + Math.random() * 1.6;
      }
      if (c.coreMat) {
        c.coreMat.emissiveIntensity = 3.0 + Math.random() * 2.5;
      }

      const posAttr = c.geo.attributes.position;
      const count = c.velocities.length;

      for (let j = 0; j < count; j++) {
        const v = c.velocities[j];
        v.life -= delta;

        if (v.life <= 0) {
          posAttr.array[j * 3] = 0;
          posAttr.array[j * 3 + 1] = 0.06;
          posAttr.array[j * 3 + 2] = 0;
          v.life = Math.random() * 0.45 + 0.15;
          v.dist = 0;
        } else {
          v.dist += v.speed * delta;
          const baseA = v.baseAngle !== undefined ? v.baseAngle : (v.angle || 0);
          // Archimedean expanding spiral formula
          const a = baseA + c.group.rotation.y - v.dist * 0.75;
          posAttr.array[j * 3] = Math.cos(a) * v.dist;
          posAttr.array[j * 3 + 1] = 0.06 + Math.sin(v.dist * 3.5) * 0.08 + Math.random() * 0.04;
          posAttr.array[j * 3 + 2] = Math.sin(a) * v.dist;
        }
      }

      posAttr.needsUpdate = true;
    }

    // 3. Update Sky Rockets
    for (let i = this.activeRockets.length - 1; i >= 0; i--) {
      const r = this.activeRockets[i];
      r.age = (r.age || 0) + delta;
      r.group.position.y += r.vy * delta;

      if (r.group.position.y >= r.burstHeight || r.age > 4.5) {
        this.scene.remove(r.group);
        r.group.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        });
        this.activeRockets.splice(i, 1);
        try {
          this.explodeRocketBurst(
            r.group.position.x,
            r.group.position.y,
            r.group.position.z,
            r.burstColor,
            r
          );
        } catch (burstErr) {
          console.warn('[DiwaliFireworks3D] Error in explodeRocketBurst:', burstErr);
        }
      }
    }

    // 4. Update Peony Bursts
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const b = this.particles[i];
      b.age += delta;

      const posAttr = b.geo.attributes.position;
      const count = b.velocities.length;
      let allDead = true;

      for (let j = 0; j < count; j++) {
        const v = b.velocities[j];
        if (v.life > 0) {
          allDead = false;
          v.life -= v.decay * delta;

          v.vx *= v.drag;
          v.vy *= v.drag;
          v.vz *= v.drag;
          v.vy += v.gravity * delta;

          posAttr.array[j * 3] += v.vx * delta;
          posAttr.array[j * 3 + 1] += v.vy * delta;
          posAttr.array[j * 3 + 2] += v.vz * delta;
        }
      }

      posAttr.needsUpdate = true;
      b.pMat.opacity = Math.max(0, 1.0 - b.age * 0.85);

      if (allDead || b.age > 2.2) {
        this.scene.remove(b.pMesh);
        b.geo.dispose();
        b.pMat.dispose();
        this.particles.splice(i, 1);
      }
    }

    // Smoothly decay Reusable Static FX Light
    if (this.fxLightDuration > 0) {
      this.fxLightAge += delta;
      if (this.fxLightAge >= this.fxLightDuration) {
        this.fxLight.intensity = 0;
        this.fxLightDuration = 0;
      } else {
        const factor = 1.0 - (this.fxLightAge / this.fxLightDuration);
        this.fxLight.intensity = this.fxLightMaxIntensity * factor;
      }
    }

    // 5. Update Floating Paper Lanterns
    for (let i = this.activeLanterns.length - 1; i >= 0; i--) {
      const lan = this.activeLanterns[i];
      lan.age += delta;
      lan.sway += delta * 1.5;

      lan.group.position.y += lan.vy * delta;
      lan.group.position.x += Math.sin(lan.sway) * 0.15;
      lan.group.position.z += Math.cos(lan.sway) * 0.15;

      if (lan.age >= lan.maxAge) {
        this.scene.remove(lan.group);
        this.activeLanterns.splice(i, 1);
      }
    }

    // 6. Update Placed Diyas Flame Dancing
    for (let d of this.placedDiyas) {
      if (d.light) d.light.intensity = 1.2 + Math.random() * 0.4;
      if (d.flame) d.flame.scale.y = 1.4 + Math.random() * 0.4;
    }
  }
}

window.DiwaliFireworks3D = DiwaliFireworks3D;
