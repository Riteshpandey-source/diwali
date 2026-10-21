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

    // Schedule ambient celebratory fireworks over the eastern temple sky
    this.scheduleAmbientCelebratoryFireworks();
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
  placeAnar(x2d, y2d, isLocal = true) {
    const pos = this.to3D(x2d, y2d);
    const group = new THREE.Group();
    group.position.set(pos.x, 0, pos.z);

    // Terracotta Cone Body
    const coneGeo = new THREE.ConeGeometry(0.35, 0.6, 8);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.y = 0.3;
    group.add(cone);

    // Dynamic Golden Light from Fountain
    const light = new THREE.PointLight(0xffa200, 3.5, 14);
    light.position.y = 0.8;
    group.add(light);

    // Fountain Particle System
    const particleCount = this.isReducedMotion ? 120 : 350;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0.6;
      positions[i * 3 + 2] = 0;

      // Vertical eruption cone
      const speed = 4.0 + Math.random() * 5.5;
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() * 0.35);

      velocities.push({
        vx: Math.cos(angle) * spread * speed,
        vy: speed,
        vz: Math.sin(angle) * spread * speed,
        life: Math.random() * 0.9 + 0.3,
        maxLife: 1.2
      });

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = Math.random() > 0.3 ? 0.85 : 0.4;
      colors[i * 3 + 2] = 0.1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.45,
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
      light,
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
  }

  // -------------------------------------------------------------
  // 2. CHAKRI (GROUND SPINNER)
  // -------------------------------------------------------------
  placeChakri(x2d, y2d) {
    const pos = this.to3D(x2d, y2d);
    const group = new THREE.Group();
    group.position.set(pos.x, 0.05, pos.z);

    // Terracotta spinning disc
    const discGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 12);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x9a3412 });
    const disc = new THREE.Mesh(discGeo, discMat);
    group.add(disc);

    const light = new THREE.PointLight(0xff6600, 2.5, 10);
    light.position.y = 0.3;
    group.add(light);

    const count = this.isReducedMotion ? 90 : 240;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0.1;
      positions[i * 3 + 2] = 0;

      velocities.push({
        angle: (i / count) * Math.PI * 4,
        speed: 2.5 + Math.random() * 3.5,
        life: Math.random() * 0.6 + 0.2,
        dist: 0
      });

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = Math.random() * 0.7 + 0.3;
      colors[i * 3 + 2] = 0.1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.35,
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
      light,
      geo,
      velocities,
      positions,
      spinSpeed: 18.0,
      duration: 4.5,
      age: 0
    });

    this.playSafeAudio('playChakriSpin', 4500);
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

    const rocketLight = new THREE.PointLight(0xffaa00, 2.0, 8);
    group.add(rocketLight);

    this.scene.add(group);

    const burstHeight = targetAltitude || (22 + Math.random() * 12);
    const rocket = {
      group,
      light: rocketLight,
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
    const count = this.isReducedMotion ? 180 : 500;
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

    // Illuminating Sky Flash Light
    const flashLight = new THREE.PointLight(baseColor.getHex(), 6.0, 60);
    flashLight.position.set(x, y, z);
    this.scene.add(flashLight);

    const burst = {
      pMesh,
      geo,
      pMat,
      flashLight,
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

    const light = new THREE.PointLight(0xff9e1b, 2.5, 16);
    light.position.y = -0.42 * scale;
    group.add(light);

    this.scene.add(group);

    const lantern = {
      group,
      light,
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

    const light = new THREE.PointLight(0xffa200, 1.5, 6);
    light.position.y = 0.25;
    group.add(light);

    this.scene.add(group);
    this.placedDiyas.push({ group, light, flame, age: 0 });
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
      f.light.intensity = 2.5 + Math.random() * 1.5;
    }

    // 2. Update Chakri Spinners
    for (let i = this.activeSpinners.length - 1; i >= 0; i--) {
      const c = this.activeSpinners[i];
      c.age += delta;

      if (c.age >= c.duration) {
        this.scene.remove(c.group);
        c.geo.dispose();
        this.activeSpinners.splice(i, 1);
        continue;
      }

      c.group.rotation.y += c.spinSpeed * delta;
      const posAttr = c.geo.attributes.position;
      const count = c.velocities.length;

      for (let j = 0; j < count; j++) {
        const v = c.velocities[j];
        v.life -= delta;

        if (v.life <= 0) {
          posAttr.array[j * 3] = 0;
          posAttr.array[j * 3 + 1] = 0.1;
          posAttr.array[j * 3 + 2] = 0;
          v.life = Math.random() * 0.6 + 0.2;
          v.dist = 0;
        } else {
          v.dist += v.speed * delta;
          const a = v.angle + c.group.rotation.y;
          posAttr.array[j * 3] = Math.cos(a) * v.dist;
          posAttr.array[j * 3 + 1] = 0.1 + Math.sin(v.dist * 3) * 0.15;
          posAttr.array[j * 3 + 2] = Math.sin(a) * v.dist;
        }
      }

      posAttr.needsUpdate = true;
      c.light.intensity = 2.0 + Math.random() * 1.2;
    }

    // 3. Update Sky Rockets
    for (let i = this.activeRockets.length - 1; i >= 0; i--) {
      const r = this.activeRockets[i];
      r.group.position.y += r.vy * delta;
      r.light.intensity = 1.5 + Math.random() * 1.0;

      if (r.group.position.y >= r.burstHeight) {
        this.scene.remove(r.group);
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

      if (b.flashLight) {
        b.flashLight.intensity = Math.max(0, 6.0 - b.age * 12.0);
      }

      if (allDead || b.age > 2.2) {
        this.scene.remove(b.pMesh);
        if (b.flashLight) this.scene.remove(b.flashLight);
        b.geo.dispose();
        b.pMat.dispose();
        this.particles.splice(i, 1);
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
      d.light.intensity = 1.2 + Math.random() * 0.4;
      d.flame.scale.y = 1.4 + Math.random() * 0.4;
    }
  }
}

window.DiwaliFireworks3D = DiwaliFireworks3D;
